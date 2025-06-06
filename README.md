# SimulChat: The AI-Powered Twitch Chat Simulator (v1.1.0)

SimulChat is an interactive desktop application that creates a lively, simulated Twitch chat experience powered by a diverse cast of AI personalities. These AI agents react in real-time not only to your typed messages and voice commands, but also to visual content from your camera or screen share.

A standout feature is the automatic "Dance Mode," where the AIs detect music from your screen's audio and erupt into a synchronized emote dance party. Built with React, Python/Flask, and powered by a local Ollama instance, SimulChat offers a dynamic and entertaining way to interact with AI.

## Features

- **Multiple AI Personalities**: Various chat personalities, each with distinct behaviors (see `agent_context.md` for full details).
- **Voice Input**: Speech-to-text functionality for streamer input via the browser.
- **Camera Integration**: Live camera feed for AI agents to comment on visual context.
- **Screen Sharing with Audio**: Ability to share your screen or application windows with audio for AI agents to see and react to.
- **Music Detection & Dance Mode**: When sharing screen with audio, the app detects music and triggers a "dance mode," causing AIs to spam dancing emotes.
- **Simultaneous Feeds**: Camera and Screen Share can be active at the same time, providing richer context.
- **Image Upload**: Support for uploading images to set visual context for AI responses.
- **Realistic Chat Simulation**: AI agents respond to specific streamer input and generate ambient chatter.
- **Twitch-like UI**: Authentic Twitch chat styling with a modern, polished interface.
- **Viewers Counter**: Displays a random number of viewers (50-500) when clicking the viewers button.
- **Frame Capture**: The system automatically captures frames from active live feeds (camera/screen) periodically.
- **Visual Status**: The UI header displays the current status of visual context (e.g., "Camera Active", "Screen Share Active", "Cam & Screen Active").

## Recent Improvements

- **Music Detection & Dance Mode (v1.1.0)**:
  - Implemented real-time music detection from screen share audio using the Web Audio API.
  - When music is detected, AI agents enter "dance mode," spamming dancing emotes to create a party atmosphere.
  - Added a "Dance Mode!" status indicator in the header.
- **Faster, More Responsive AI (v1.1.0)**:
  - Re-architected AI response logic to use a "fast group" that responds almost instantly to user input.
  - Significantly reduced response delays for a more interactive and lively chat.
- **UI Overhaul (v1.0.0)**:
  - Modernized the UI with a new teal/blue color scheme, maintaining a Twitch-like feel.
  - Updated header, chat messages, and input areas for a cleaner, more polished look.
  - Improved visual feedback on interactive elements.
- **More Natural AI Responses**: Updated AI agent system prompts to produce more authentic, human-like responses.
- **Enhanced Response Variety**: Increased randomness parameters and improved prompting to create more diverse responses.
- **Visual Context Integration**: Improved how agents respond to camera feeds and screen sharing.
- **Expanded Agent Roster**: Added 9 new AI personalities with unique characteristics.
- **Viewers Counter Feature**: Added functionality to display random viewer counts.
- **Improved Backend Prompting**: Enhanced backend prompts to request more natural responses.
- **Response Filtering**: Added filtering of formulaic AI phrases for more authentic chat experience.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Heroicons
- **Backend**: Python, Flask, Flask-CORS
- **AI**: Ollama LLM integration (e.g., `gemma3:4b`) with vision capabilities for visual context processing.
- **Speech-to-Text**: Google Web API via SpeechRecognition library
- **Visual Context**: Browser APIs (`getUserMedia` for camera, `getDisplayMedia` for screen share, Canvas for frame capture).

## Setup

### Prerequisites

- Node.js and npm (or yarn) for frontend.
- Python 3.x for backend.
- Ollama installed and running with a multimodal model like `gemma3:4b` (or your chosen model) pulled and accessible.
  - Ensure the model specified in `backend/app.py` (DEFAULT_OLLAMA_MODEL) and `src/components/Chat.jsx` (for each agent) is available in your Ollama instance.
- A camera and/or ability to screen share for visual context features.
- ffmpeg installed and available in PATH (required for audio processing).

### Frontend Setup

1.  Navigate to the project directory:
    ```bash
    cd ai-twitch-chat
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
    The application will typically be available at `http://localhost:3000`.

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd ai-twitch-chat/backend
    ```
2.  It is highly recommended to create and activate a Python virtual environment:
    ```bash
    python -m venv venv
    # On Windows: .\venv\Scripts\activate
    # On macOS/Linux: source venv/bin/activate
    ```
3.  Install required Python packages:
    ```bash
    pip install -r requirements.txt
    ```
    Key dependencies include:
    - Flask and Flask-CORS
    - SpeechRecognition
    - pydub (for audio processing)
    - requests (for API calls to Ollama)
    
4.  Start the Flask server (defaults to port 5000):
    ```bash
    python app.py
    ```

### Ollama Setup

- Ensure Ollama is running.
- Pull the model if you haven't already (e.g., `gemma3:4b`):
  ```bash
  ollama pull gemma3:4b
  ```
- The backend (`app.py`) will attempt to connect to Ollama at `http://localhost:11434` by default. This can be configured via environment variables if needed.

## Using the Application

1.  Ensure your Ollama instance is running with the required model.
2.  Start the Python Flask backend server.
3.  Start the React frontend development server.
4.  Access the application at `http://localhost:3000` in your browser.
5.  Type in the chat box or click the microphone icon to use voice input.
6.  Click the camera icon <img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/video-camera.svg" width="15" height="15"> to start your live camera feed.
7.  Click the screen share icon <img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/computer-desktop.svg" width="15" height="15"> to share your screen or an application window. **Ensure you share audio to enable the music detection feature.**
8.  Click the image upload icon <img src="https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/camera.svg" width="15" height="15"> (next to screen share) to upload a static image.
9.  The camera and screen share can be active simultaneously. **The AI will react to frames sent from these sources.**
10. Watch AI agents respond to your messages and visual content based on their unique personalities (see `agent_context.md`).
11. **Play music while screen sharing** to see the AIs enter "dance mode" and spam emotes.
12. AI agents will also generate ambient chat messages periodically.
13. **Click the viewers icon** to display a random number of viewers.

## Visual Context Features

- **Live Camera**: Click the camera icon to start your webcam. The AI receives periodic frames.
- **Screen Sharing**: Click the screen share icon to share your screen or an application. The AI receives periodic frames.
- **Simultaneous Feeds**: Both camera and screen share can be active at the same time. The backend currently processes the latest frame received from either source to update the AI's visual context.
- **Image Upload**: Upload static images using the dedicated upload button.
- **Frame Capture**: The system automatically captures frames from active live feeds (camera/screen) periodically (e.g., every 7-8 seconds).
- **Visual Status**: The UI header displays the current status of visual context (e.g., "Camera Active", "Screen Active", "Cam & Screen Active", or messages about updates).

## AI Agent Personalities

SimulChat includes 32 AI agents with unique personalities and system prompts that guide their behavior. These prompts instruct agents to consider visual input from either the camera feed or screen share content.

A new global behavior has been introduced: **Dance Mode**. When music is detected via screen share audio, all agents will temporarily pause their normal chatter and begin spamming dancing emotes.

For a detailed list of agents and their current system prompts, please refer to `agent_context.md`.

Key agents include:
- **SarcasticSamantha**: Witty, roasts based on visuals (room, appearance, or screen content like gameplay, app choices).
- **ChattyCharlie**: Enthusiastic about streamer actions and visual elements (camera or screen).
- **HelpfulHenry**: Provides informative answers based on verbal input or observed visuals (camera or screen).
- **NitpickyNick**: Critiques specifics from the camera feed or on-screen activity (gameplay, app usage).
- **MemeQueen**: Only speaks in current memes and internet culture references.
- **BackseatBetty**: Always telling the streamer what to do and how to play better.
- **StatisticsSam**: Obsessed with numbers, statistics, and probabilities about everything.
- **OverreactingOliver**: Extremely dramatic about everything, treating minor events like major catastrophes.
- ...and many more (see `agent_context.md`).

## Project Structure

- `/ai-twitch-chat`
  - `/public`: Static assets for the frontend.
  - `/src`: Frontend React application code.
    - `/components`: React components (e.g., `Chat.jsx`, `ChatMessage.jsx`).
    - `App.jsx`: Main React application component.
    - `index.js`: Entry point for React.
    - `index.css`: Tailwind CSS directives and custom styles.
  - `/backend`: Python Flask backend.
    - `app.py`: Main Flask application with API endpoints.
    - `requirements.txt`: Python dependencies.
    - `install_ffmpeg.ps1`: Helper script for installing ffmpeg on Windows.
  - `agent_context.md`: Detailed descriptions and system prompts for AI agents.
  - `package.json`: Frontend dependencies and scripts.
  - `README.md`: This file.
  - `tailwind.config.js`, `postcss.config.js`: Tailwind CSS configuration.

## Extending the Project

### Adding New AI Agents

1.  Define the new agent in the `aiAgents` array in `src/components/Chat.jsx`.
2.  Add the agent's full details (name, personality, color, badges, system prompt) to `agent_context.md`.

### Modifying Visual Context Processing

- **Frame Rate**: Adjust `setInterval` timing in `captureAndSendFrame` (for camera) and `captureAndSendScreenFrame` (for screen share) in `src/components/Chat.jsx`.
- **Backend Context Handling**: The `/api/update-visual-context` endpoint in `backend/app.py` currently stores the latest frame from any source. To enable true simultaneous processing, this backend endpoint and the subsequent calls to Ollama would need to be modified to handle multiple image inputs if your chosen LLM supports it.

### Speech-to-Text

The current STT implementation uses the SpeechRecognition library, which can leverage various engines (defaulting to Google Web API). The browser's `MediaRecorder` captures audio, which is then sent to the `/api/transcribe-audio` endpoint in `backend/app.py`. This backend endpoint processes the audio and returns the transcribed text.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 