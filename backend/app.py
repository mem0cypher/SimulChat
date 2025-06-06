from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
import tempfile # For handling temporary audio files
# import whisper # OpenAI Whisper - not using this anymore
import shutil # For checking ffmpeg
import speech_recognition as sr  # Using SpeechRecognition instead
from pydub import AudioSegment  # For audio file conversion
import logging
import base64 # For handling image data
import re # Import re for regex operations
import time  # Add this at the top of the file if not already imported
from queue import Queue
from threading import Thread

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = app.logger

# --- Speech Recognition Setup ---
# Initialize recognizer here, after imports
recognizer = sr.Recognizer()
logger.info("SpeechRecognition initialized")

# --- Visual Context Storage ---
# Store camera and screen images separately
current_camera_image_base64 = None
current_screen_image_base64 = None
# For a one-time uploaded image that takes precedence
current_uploaded_image_base64 = None 

# Add timestamps to track when contexts were last updated
context_timestamps = {
    'camera': 0,
    'screen': 0,
    'upload': 0
}

# Context refresh interval in seconds - reduced to improve responsiveness
CONTEXT_REFRESH_INTERVAL = 5  # Keep context for 5 seconds before considering it "new"

# Check for ffmpeg (still needed for audio conversion)
def check_ffmpeg():
    """Checks if ffmpeg is installed and in PATH."""
    ffmpeg_available = shutil.which("ffmpeg") is not None
    if ffmpeg_available:
        logger.info("ffmpeg found in PATH.")
    else:
        logger.warning("ffmpeg not found in PATH. Audio conversion may fail.")
    return ffmpeg_available

# Check ffmpeg on startup
ffmpeg_available = check_ffmpeg()

# Configuration for Ollama
DEFAULT_OLLAMA_MODEL = "gemma3:4b"  # Ensure this model supports vision or use a known vision model like 'llava'
# OLLAMA_API_URL = "http://localhost:11434/api/generate" # Old endpoint
OLLAMA_API_CHAT_URL = "http://localhost:11434/api/chat" # New endpoint for multimodal

# Add a cache for recent analysis to avoid redundant processing
last_analysis_time = {
    'camera': 0,
    'screen': 0,
    'upload': 0
}
analysis_cache = {
    'camera': None,
    'screen': None,
    'upload': None
}
ANALYSIS_CACHE_TIMEOUT = 8  # seconds

# Add a simple queue system for visual context updates
visual_context_queue = Queue(maxsize=10)  # Limit queue size to prevent memory issues
is_processing_queue = False

def process_visual_context_queue():
    global is_processing_queue
    is_processing_queue = True
    
    while not visual_context_queue.empty():
        try:
            context_data = visual_context_queue.get(block=False)
            if context_data:
                img_b64 = context_data.get('image_base64')
                context_type = context_data.get('context_type')
                update_context_internal(img_b64, context_type)
            visual_context_queue.task_done()
        except Exception as e:
            logger.error(f"Error processing queued visual context: {e}")
    
    is_processing_queue = False

def update_context_internal(img_b64, context_type):
    """Internal function to update context without the HTTP request/response handling"""
    global current_camera_image_base64, current_screen_image_base64, current_uploaded_image_base64, context_timestamps
    
    if not img_b64 or not context_type:
        return
    
    current_time = time.time()
    is_new_context = False
    
    if context_type == 'camera':
        if current_time - context_timestamps['camera'] > CONTEXT_REFRESH_INTERVAL:
            is_new_context = True
            
        current_camera_image_base64 = img_b64
        context_timestamps['camera'] = current_time
        logger.info(f"Camera visual context updated (queued). Image data length: {len(img_b64)}. Is new context: {is_new_context}")
        
    elif context_type == 'screen':
        if current_time - context_timestamps['screen'] > CONTEXT_REFRESH_INTERVAL:
            is_new_context = True
            
        current_screen_image_base64 = img_b64
        context_timestamps['screen'] = current_time
        logger.info(f"Screen visual context updated (queued). Image data length: {len(img_b64)}. Is new context: {is_new_context}")
        
    elif context_type == 'upload':
        is_new_context = True
        current_uploaded_image_base64 = img_b64
        current_camera_image_base64 = None
        current_screen_image_base64 = None
        context_timestamps['upload'] = current_time
        logger.info(f"Uploaded visual context updated (queued). Image data length: {len(img_b64)}")

@app.route('/api/update-visual-context', methods=['POST'])
def update_visual_context():
    global is_processing_queue
    try:
        data = request.get_json()
        if not data or 'image_base64' not in data or 'context_type' not in data:
            logger.error("Missing image_base64 or context_type in request to /api/update-visual-context")
            return jsonify({"error": "Missing image_base64 or context_type"}), 400
        
        img_b64 = data['image_base64']
        context_type = data['context_type'] # 'camera', 'screen', or 'upload'
        
        logger.info(f"Received visual context update request. Type: {context_type}, data length: {len(img_b64) if img_b64 else 0} bytes")

        if not isinstance(img_b64, str) or not img_b64:
            logger.error("Invalid image_base64 format or empty.")
            return jsonify({"error": "Invalid image_base64 format"}), 400
        
        # Strip the data URI prefix if present, Ollama expects pure base64
        if img_b64.startswith("data:image/") and ";base64," in img_b64:
            img_b64 = img_b64.split(",", 1)[1]

        # Queue the context update instead of processing it immediately
        if not visual_context_queue.full():
            visual_context_queue.put({
                'image_base64': img_b64,
                'context_type': context_type,
                'timestamp': time.time()
            })
            
            # Start processing the queue if not already processing
            if not is_processing_queue:
                Thread(target=process_visual_context_queue).start()
                
            # For uploads or if detailed analysis is requested, process immediately
            if context_type == 'upload' or data.get('detailed_analysis', False):
                update_context_internal(img_b64, context_type)
                
            description = ""
            analysis_data = None
            
            # Only perform analysis if detailed_analysis is requested
            if data.get('detailed_analysis', False):
                try:
                    analysis_data = perform_visual_analysis(img_b64, context_type)
                    description = analysis_data.get('description', '')
                except Exception as analysis_error:
                    logger.error(f"Error during visual analysis: {analysis_error}", exc_info=True)
            
            return jsonify({
                "message": f"Visual context for {context_type} queued successfully",
                "description": description,
                "analysis": analysis_data
            }), 200
        else:
            logger.warning(f"Visual context queue is full, dropping {context_type} update")
            return jsonify({"message": f"Visual context queue is full, update skipped"}), 202
            
    except Exception as e:
        logger.error(f"Error updating visual context: {e}", exc_info=True)
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# NEW: Function to perform visual analysis using Ollama
def perform_visual_analysis(image_base64, context_type):
    """Analyze the visual content using Ollama vision capabilities."""
    global last_analysis_time, analysis_cache
    
    current_time = time.time()
    
    # Check if we have a recent analysis in cache
    if (current_time - last_analysis_time.get(context_type, 0) < ANALYSIS_CACHE_TIMEOUT and 
        analysis_cache.get(context_type) is not None):
        logger.info(f"Using cached analysis for {context_type}, age: {current_time - last_analysis_time.get(context_type):.2f}s")
        return analysis_cache[context_type]
    
    try:
        # Create a simple prompt for visual analysis
        analysis_prompt = (
            "Analyze this image and provide the following information as a structured response:\n"
            "1. A brief description of what you see (1-2 sentences)\n"
            "2. List any visible text (words, numbers, signs)\n"
            "3. List key objects or people visible\n"
            "4. List any notable actions or movements\n"
            "Format your response as a simple JSON with keys: 'description', 'text', 'objects', 'actions'"
        )
        
        # Create message payload with image
        message = {
            'role': 'user',
            'content': analysis_prompt,
            'images': [image_base64]
        }
        
        # Send to Ollama with reduced token generation for faster response
        payload = {
            "model": DEFAULT_OLLAMA_MODEL,
            "messages": [message],
            "stream": False,
            "options": {"temperature": 0.1, "num_predict": 80}  # Reduced from 100 to 80 for faster analysis
        }
        
        logger.info(f"Sending image analysis request to Ollama for {context_type}")
        response = requests.post(OLLAMA_API_CHAT_URL, json=payload)
        response.raise_for_status()
        
        # Process response
        response_data = response.json()
        response_text = response_data.get("message", {}).get("content", "").strip()
        
        # Try to extract JSON from the response
        analysis = {}
        try:
            # Look for JSON-like content in the response
            import re
            json_match = re.search(r'```json\s*([\s\S]*?)\s*```', response_text)
            if json_match:
                json_str = json_match.group(1)
                analysis = json.loads(json_str)
            else:
                # If no JSON block found, try to parse the whole response
                analysis = json.loads(response_text)
        except json.JSONDecodeError:
            # If JSON parsing fails, extract information using regex
            description_match = re.search(r'description["\']?\s*:?\s*["\']?(.*?)["\']?[,}]', response_text, re.IGNORECASE)
            text_match = re.search(r'text["\']?\s*:?\s*\[(.*?)\]', response_text, re.IGNORECASE | re.DOTALL)
            objects_match = re.search(r'objects["\']?\s*:?\s*\[(.*?)\]', response_text, re.IGNORECASE | re.DOTALL)
            actions_match = re.search(r'actions["\']?\s*:?\s*\[(.*?)\]', response_text, re.IGNORECASE | re.DOTALL)
            
            analysis = {
                "description": description_match.group(1).strip() if description_match else "",
                "text": [item.strip().strip('"\'') for item in text_match.group(1).split(',')] if text_match else [],
                "objects": [item.strip().strip('"\'') for item in objects_match.group(1).split(',')] if objects_match else [],
                "actions": [item.strip().strip('"\'') for item in actions_match.group(1).split(',')] if actions_match else []
            }
        
        # Ensure we have all expected keys
        if "description" not in analysis:
            analysis["description"] = ""
        if "text" not in analysis:
            analysis["text"] = []
        if "objects" not in analysis:
            analysis["objects"] = []
        if "actions" not in analysis:
            analysis["actions"] = []
            
        # Update cache
        last_analysis_time[context_type] = current_time
        analysis_cache[context_type] = analysis
            
        logger.info(f"Visual analysis complete for {context_type}. Found {len(analysis['text'])} text items, {len(analysis['objects'])} objects")
        return analysis
        
    except Exception as e:
        logger.error(f"Error in visual analysis: {e}", exc_info=True)
        return {
            "description": "",
            "text": [],
            "objects": [],
            "actions": []
        }

@app.route('/api/get-ai-response', methods=['POST'])
def get_ai_response():
    global current_camera_image_base64, current_screen_image_base64, current_uploaded_image_base64, context_timestamps
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        system_prompt = data.get('system_prompt', '')
        transcribed_input = data.get('transcribed_input', '')
        model_name = data.get('model_name', DEFAULT_OLLAMA_MODEL)
        visual_context_memory = data.get('visual_context_memory', {})

        # --- Visual Context Selection with Expiration ---
        STALE_CONTEXT_THRESHOLD_SECONDS = 60 # Reduced from 180 to 60 seconds
        image_to_use = None
        image_source = "none"
        current_time = time.time()

        # Prioritize contexts in this order: upload > screen > camera
        if current_uploaded_image_base64 and (current_time - context_timestamps.get('upload', 0)) < STALE_CONTEXT_THRESHOLD_SECONDS:
            image_to_use = current_uploaded_image_base64
            image_source = "uploaded image"
        elif current_screen_image_base64 and (current_time - context_timestamps.get('screen', 0)) < STALE_CONTEXT_THRESHOLD_SECONDS:
            image_to_use = current_screen_image_base64
            image_source = "screen"
        elif current_camera_image_base64 and (current_time - context_timestamps.get('camera', 0)) < STALE_CONTEXT_THRESHOLD_SECONDS:
            image_to_use = current_camera_image_base64
            image_source = "camera"

        # --- Prompt Construction ---
        # This is where we build the detailed prompt to guide the AI
        prompt_parts = [system_prompt]

        # Check for direct user input FIRST. This is the highest priority.
        if transcribed_input and transcribed_input.strip() and transcribed_input != "[no specific streamer input, just make a relevant ambient comment based on your personality]":
            prompt_parts.append(f"IMPORTANT: The user has directly sent a message. Your primary goal is to respond to it. The user's message is: \"{transcribed_input}\".")
            prompt_parts.append("Formulate a direct and relevant reply based on your personality. Your reply should come first, before any other comments.")
        
        # THEN, add visual analysis instructions if an image is present and there was NO direct input.
        elif image_to_use:
            prompt_parts.append(
                f"You are seeing a live image from the streamer's {image_source}. "
                "CRITICAL: Your primary task is to react to this image with meaningful context. "
                "First, internally analyze what you see: objects, text, people, actions. "
                "Then, formulate a natural-sounding chat message that SPECIFICALLY references what you see. "
                "If you see text on screen, READ IT and INCLUDE parts of it in your response. "
                "If you see a game, mention the game name or what's happening in it. "
                "If you see a website, mention which site it is or what content is visible. "
                "NEVER just say generic things like 'nice stream' or 'cool' without specific context."
            )
            if visual_context_memory.get('sceneDescription'):
                prompt_parts.append(f"The general scene was recently described as: '{visual_context_memory['sceneDescription']}'.")
            if visual_context_memory.get('lastDetectedObjects'):
                 prompt_parts.append(f"Previously detected objects: {', '.join(visual_context_memory['lastDetectedObjects'])}.")
            if visual_context_memory.get('lastDetectedText'):
                 prompt_parts.append(f"Previously detected text: {', '.join(visual_context_memory['lastDetectedText'])}. REFERENCE THIS TEXT IN YOUR RESPONSE.")
        
        # Fallback for ambient chatter if no user input and no visuals.
        else:
            prompt_parts.append("The streamer is currently silent and there is no visual feed. Make a general comment based on your personality.")

        # --- Final Prompt Assembly ---
        # Combine all parts into a single prompt string
        final_prompt = "\n\n".join(prompt_parts)
        
        # --- Ollama Payload ---
        message_for_ollama = {
            'role': 'user',
            'content': final_prompt
        }
        if image_to_use:
            message_for_ollama['images'] = [image_to_use]
            
        ollama_payload = {
            "model": model_name,
            "messages": [message_for_ollama],
            "stream": False,
            "options": {"temperature": 0.85, "num_predict": 35, "repeat_penalty": 1.15}
        }

        logger.info(f"Sending payload to Ollama for model {model_name}. Image attached: {'Yes' if image_to_use else 'No'}")
        
        response = requests.post(OLLAMA_API_CHAT_URL, json=ollama_payload)
        response.raise_for_status()

        response_data = response.json()
        ai_message = response_data.get("message", {}).get("content", "").strip()

        logger.info(f"Received from {model_name}: {ai_message}")
        return jsonify({"ai_message": ai_message})

    except requests.exceptions.RequestException as e:
        logger.error(f"Could not connect to Ollama: {e}", exc_info=True)
        return jsonify({"error": f"Could not connect to Ollama: {str(e)}"}), 503
    except Exception as e:
        logger.error(f"An unexpected error occurred in get_ai_response: {e}", exc_info=True)
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/api/transcribe-audio', methods=['POST'])
def transcribe_audio():
    logger.info(f"Received transcribe-audio request. Content-Type: {request.content_type}")
    logger.info(f"Request headers: {dict(request.headers)}")
    
    if not ffmpeg_available:
        logger.error("ffmpeg not found. Cannot process audio.")
        return jsonify({"error": "ffmpeg is not installed or not in PATH. Audio processing unavailable."}), 500

    # Log all form data and files
    logger.info(f"Form data: {dict(request.form)}")
    logger.info(f"Files: {list(request.files.keys())}")
    
    if 'audio_file' not in request.files:
        logger.error("No 'audio_file' in request.files. Keys found: " + str(list(request.files.keys())))
        return jsonify({"error": "No audio file part"}), 400
    
    file = request.files['audio_file']
    if file.filename == '':
        logger.error("File has no filename")
        return jsonify({"error": "No selected file"}), 400

    logger.info(f"Received audio file: {file.filename}, content type: {file.content_type}")
    
    # Determine format based on file extension or content type
    audio_format = None
    if file.filename.endswith('.webm'):
        audio_format = 'webm'
    elif file.filename.endswith('.ogg'):
        audio_format = 'ogg'
    elif file.filename.endswith('.wav'):
        audio_format = 'wav'
    elif file.filename.endswith('.mp3') or file.filename.endswith('.mp4'):
        audio_format = 'mp3'
    elif 'webm' in file.content_type:
        audio_format = 'webm'
    elif 'ogg' in file.content_type:
        audio_format = 'ogg'
    elif 'wav' in file.content_type:
        audio_format = 'wav'
    elif 'mp3' in file.content_type or 'mp4' in file.content_type:
        audio_format = 'mp3'
    else:
        # Default to webm if we can't determine the format
        audio_format = 'webm'
        
    logger.info(f"Detected audio format: {audio_format}")
    
    # Define input_file_path and wav_file_path at a higher scope
    input_file_path = None
    wav_file_path = None
    
    try:
        # Save the uploaded file to a temporary file with the appropriate extension
        with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{audio_format}') as tmp_audio_file:
            file.save(tmp_audio_file.name)
            input_file_path = tmp_audio_file.name
        
        logger.info(f"Audio file saved temporarily to: {input_file_path}")

        # Convert to WAV using pydub (which uses ffmpeg)
        # Create a temporary WAV file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_wav_file:
            wav_file_path = tmp_wav_file.name
        
        # Convert to WAV
        try:
            logger.info(f"Converting {audio_format.upper()} to WAV: {input_file_path} -> {wav_file_path}")
            audio = AudioSegment.from_file(input_file_path, format=audio_format)
            audio.export(wav_file_path, format="wav")
            logger.info(f"Conversion successful")
        except Exception as e:
            logger.error(f"Error converting audio: {e}", exc_info=True)
            # Clean up temp files created so far before returning
            if input_file_path and os.path.exists(input_file_path):
                os.remove(input_file_path)
            if wav_file_path and os.path.exists(wav_file_path):
                os.remove(wav_file_path)
            return jsonify({"error": f"Failed to convert audio: {str(e)}"}), 500

        # Recognize speech using Google Web API
        try:
            logger.info("Starting transcription with Google Web API")
            with sr.AudioFile(wav_file_path) as source:
                audio_data = recognizer.record(source)
                transcript_text = recognizer.recognize_google(audio_data)
                logger.info(f"Google transcription successful. Transcript: {transcript_text}")
                return jsonify({"transcript": transcript_text}), 200
        except sr.UnknownValueError:
            logger.warning("Google could not understand audio")
            return jsonify({"error": "Could not understand audio"}), 400
        except sr.RequestError as e:
            logger.error(f"Could not request results from Google Speech Recognition service: {e}", exc_info=True)
            return jsonify({"error": f"Speech recognition service error: {str(e)}"}), 500
    except Exception as e:
        logger.error(f"An unexpected error occurred in transcribe_audio: {e}", exc_info=True)
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    # Run the Flask app with threading enabled to handle concurrent requests
    app.run(host='0.0.0.0', port=5000, threaded=True)
 