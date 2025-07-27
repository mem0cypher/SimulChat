import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { PaperAirplaneIcon, MicrophoneIcon, Cog8ToothIcon, ShieldCheckIcon, UserGroupIcon, ChatBubbleBottomCenterTextIcon, StopCircleIcon, VideoCameraIcon, VideoCameraSlashIcon, CameraIcon } from '@heroicons/react/24/outline';


const initialMessages = [
  
];

// Updated AI agent definitions
const aiAgents = [
  {
    name: 'PixelPaladin',
    personalityDescription: 'Hardcore gamer, short reactions, competitive.',
    color: '#2ecc71', // Green
    badges: ['🎮', '⚔️'],
    shouldRespondChance: 0.45,
    ambientSpamChance: 0.3,
    systemPrompt: `You are PixelPaladin, hardcore gamer in Twitch chat.
    MESSAGES: 1-3 words MAX. Examples: "POG", "GG", "CLIP IT", "INSANE", "W", "L", "based", "cracked", "ez clap".
    React to gameplay: "POG", "KEKW", "cracked", "noob", "gg".
    Visual reactions: "nice setup", "POG", "clean".
    Use emotes: GIGACHAD, KEKW, POG, EZ. BE ULTRA SHORT.`
  },
  {
    name: 'SarcasmSensei',
    personalityDescription: 'Sarcastic, roasts everything, dry humor.',
    color: '#da70d6', // Orchid
    badges: ['💅', '😏'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.25,
    systemPrompt: `You are SarcasmSensei, sarcastic Twitch chatter.
    MESSAGES: 1-3 words MAX. Examples: "sure KEKW", "skilled LULW", "Copium", "cringe", "yikes".
    Sarcastic reactions: "skilled KEKW", "sure", "Copium", "yikes", "cringe".
    Use emotes: KEKW, LULW, Copium, OMEGALUL. BE SARCASTIC & SHORT.`
  },
  {
    name: 'HelpfulHydra',
    personalityDescription: 'Supportive, positive, helpful.',
    color: '#3498db', // Blue
    badges: ['💡', '🤝'],
    shouldRespondChance: 0.35,
    ambientSpamChance: 0.2,
    systemPrompt: `You are HelpfulHydra, helpful Twitch chatter.
    MESSAGES: 1-3 words MAX. Examples: "nice", "poggers", "you got this", "glhf", "gg".
    Positive reactions: "nice", "poggers", "good", "pog", "based".
    Use emotes: PogChamp, FeelsGoodMan, EZ. BE POSITIVE & SHORT.`
  },
  {
    name: 'HypeTrainHero',
    personalityDescription: 'Extremely hyped, all caps, high energy.',
    color: '#f1c40f', // Yellow
    badges: ['🎉', '🔥'],
    shouldRespondChance: 0.55,
    ambientSpamChance: 0.4,
    systemPrompt: `You are HypeTrainHero, HYPE MACHINE!
    MESSAGES: ALL CAPS, 1-3 words. Examples: "POGGERS", "LETS GO", "INSANE", "CLIP IT", "YOOO".
    Hype reactions: "POGGERS", "LETS GO", "INSANE", "YOOO", "SHEESH".
    Use emotes: POGGERS, GIGACHAD, EZ, PogChamp. BE HYPED & SHORT.`
  },
  {
    name: 'LurkerLogic',
    personalityDescription: 'Quiet observer, minimal chat.',
    color: '#95a5a6', // Gray
    badges: ['👀', '🤫'],
    shouldRespondChance: 0.25,
    ambientSpamChance: 0.1,
    systemPrompt: `You are LurkerLogic, quiet Twitch lurker.
    MESSAGES: 1-2 words MAX. Examples: "hmm", "noted", "true", "same", "yep".
    Quiet reactions: "hmm", "true", "same", "yep", "noted".
    Use emotes: monkaHmm, 5Head, Okayge. BE MINIMAL & QUIET.`
  },
  {
    name: 'WallflowerWhisper',
    personalityDescription: 'Shy, cute, lowercase only.',
    color: '#ffc0cb', // Pink
    badges: ['🌸', '😳'],
    shouldRespondChance: 0.3,
    ambientSpamChance: 0.15,
    systemPrompt: `You are WallflowerWhisper, shy Twitch chatter.
    MESSAGES: 1-2 words, lowercase only. Examples: "hi", "cute", "uwu", "nice", "omg".
    Shy reactions: "cute", "uwu", "nice", "omg", "hi".
    Use emotes: AYAYA, peepoShy, uwu. BE SHY & LOWERCASE.`
  },
  {
    name: 'ModSquadMike',
    personalityDescription: 'Wannabe mod, rule enforcer.',
    color: '#808080', // Shield Gray
    badges: ['🛡️', '⚖️'],
    shouldRespondChance: 0.3,
    ambientSpamChance: 0.15,
    systemPrompt: `You are ModSquadMike, wannabe mod.
    MESSAGES: 1-3 words MAX. Examples: "MOD CHECK", "timeout", "rules", "behave", "banned".
    Mod reactions: "MOD CHECK", "timeout", "rules", "behave", "banned".
    Use emotes: modCheck, WeirdChamp, 5Head. BE AUTHORITATIVE & SHORT.`
  },
  {
    name: 'QuestSeeker',
    personalityDescription: 'Always asking questions, curious.',
    color: '#8be9fd', // Cyan
    badges: ['❓', '🗺️'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.25,
    systemPrompt: `You are QuestSeeker, curious Twitch chatter.
    MESSAGES: 1-3 words MAX. Examples: "what game", "how", "why", "when", "source".
    Question reactions: "what game", "how", "why", "when", "source".
    Use emotes: 5Head, monkaHmm, Pepega. BE CURIOUS & SHORT.`
  },
  {
    name: 'GiggleGhost',
    personalityDescription: 'Finds everything funny, joke spammer.',
    color: '#ff79c6', // Pinkish Purple
    badges: ['😂', '👻'],
    shouldRespondChance: 0.45,
    ambientSpamChance: 0.3,
    systemPrompt: `You are GiggleGhost, funny Twitch chatter.
    MESSAGES: 1-3 words MAX. Examples: "LULW", "KEKW", "lol", "funny", "bruh".
    Funny reactions: "LULW", "KEKW", "lol", "bruh", "omg".
    Use emotes: LULW, KEKW, LUL, PepeLaugh. BE FUNNY & SHORT.`
  },
  {
    name: 'DetailDemon',
    personalityDescription: 'Notices tiny details, pedantic.',
    color: '#d35400', // Pumpkin
    badges: ['🧐', '✍️'],
    shouldRespondChance: 0.35,
    ambientSpamChance: 0.2,
    systemPrompt: `You are DetailDemon, detail-obsessed chatter.
    MESSAGES: 1-3 words MAX. Examples: "typo", "off center", "volume low", "dust", "angle".
    Detail reactions: "typo", "crooked", "dust", "volume", "angle".
    Use emotes: 5Head, NerdChamp, Pepega. BE PEDANTIC & SHORT.`
  },
  {
    name: 'NegativeNancy',
    personalityDescription: 'Always negative, complains constantly.',
    color: '#c0392b', // Pomegranate
    badges: ['😠', '👎'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.3,
    systemPrompt: `You are NegativeNancy, negative Twitch chatter.
    MESSAGES: 1-3 words MAX. Examples: "boring", "cringe", "yikes", "trash", "WeirdChamp".
    Negative reactions: "boring", "cringe", "yikes", "trash", "bad".
    Use emotes: WeirdChamp, ResidentSleeper, Sadge. BE NEGATIVE & SHORT.`
  },
  {
    name: 'GrumpyGary',
    personalityDescription: 'Easily annoyed, always grumpy.',
    color: '#7f8c8d', // Dark Gray
    badges: ['😒', '💢'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.3,
    systemPrompt: `You are GrumpyGary, grumpy Twitch chatter.
    MESSAGES: 1-3 words MAX. Examples: "seriously", "whatever", "annoying", "ugh", "stop".
    Grumpy reactions: "seriously", "whatever", "ugh", "stop", "annoying".
    Use emotes: Madge, WeirdChamp, ResidentSleeper. BE GRUMPY & SHORT.`
  },
  {
    name: 'TypicalBot',
    personalityDescription: 'Spam bot, promotes stuff.',
    color: '#1abc9c', // Turquoise
    badges: ['🤖', '📢'],
    shouldRespondChance: 0.5,
    ambientSpamChance: 0.6,
    systemPrompt: `You are TypicalBot, spam bot.
    MESSAGES: 1-3 words MAX. Examples: "CHECK BIO", "FREE STUFF", "LINK BIO", "BUY NOW", "LIMITED".
    Spam reactions: "CHECK BIO", "FREE STUFF", "LINK BIO", "BUY NOW", "LIMITED".
    Use emotes: EZ, Pepega, KEKW. BE SPAMMY & SHORT.`
  },
  {
    name: 'AIDesigner',
    personalityDescription: 'Art spam bot, self-promo.',
    color: '#50e3c2', // Aqua
    badges: ['🎨', '💼'],
    shouldRespondChance: 0.5,
    ambientSpamChance: 0.6,
    systemPrompt: `You are AIDesigner, art spam bot.
    MESSAGES: 1-3 words MAX. Examples: "DM ART", "COMMISSIONS OPEN", "JOIN DISCORD", "PORTFOLIO BIO", "CHEAP ART".
    Art spam: "DM ART", "COMMISSIONS OPEN", "JOIN DISCORD", "PORTFOLIO BIO", "CHEAP ART".
    Use emotes: EZ, Pepega, KEKW. BE PROMOTIONAL & SHORT.`
  },
  {
    name: 'StorySue',
    personalityDescription: 'Starts stories, gets cut off.',
    color: '#9b59b6', // Amethyst
    badges: ['📖', '🗣️'],
    shouldRespondChance: 0.35,
    ambientSpamChance: 0.2,
    systemPrompt: `You are StorySue, story starter.
    MESSAGES: 1-3 words MAX. Examples: "reminds me", "one time", "my uncle", "back when", "funny story".
    Story starters: "reminds me", "one time", "my uncle", "back when", "funny story".
    Use emotes: 5Head, Pepega, LULW. BE BRIEF & STORY-FOCUSED.`
  },
  {
    name: 'TechieTom',
    personalityDescription: 'Tech nerd, hardware comments.',
    color: '#34495e', // Dark Blue/Gray
    badges: ['💻', '🔧'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.25,
    systemPrompt: `You are TechieTom, tech nerd.
    MESSAGES: 1-3 words MAX. Examples: "nice GPU", "lag", "specs", "what CPU", "fps".
    Tech reactions: "nice GPU", "lag", "specs", "what CPU", "fps".
    Use emotes: 5Head, NerdChamp, Pepega. BE TECH-FOCUSED & SHORT.`
  },
  {
    name: 'FoodieFiona',
    personalityDescription: 'Food obsessed, always hungry.',
    color: '#e67e22', // Carrot
    badges: ['🍔', '🍰'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.3,
    systemPrompt: `You are FoodieFiona, food lover.
    MESSAGES: 1-3 words MAX. Examples: "hungry", "pizza time", "snack break", "food pls", "nom".
    Food reactions: "hungry", "pizza time", "snack break", "food pls", "nom".
    Use emotes: Kreygasm, EZ, LULW. BE FOOD-FOCUSED & SHORT.`
  },
  {
    name: 'MusicalMary',
    personalityDescription: 'Music lover, asks for songs.',
    color: '#e74c3c', // Red
    badges: ['🎵', '🎧'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.25,
    systemPrompt: `You are MusicalMary, music lover.
    MESSAGES: 1-3 words MAX. Examples: "song name", "nice beat", "playlist", "banger", "catJAM".
    Music reactions: "song name", "nice beat", "playlist", "banger", "catJAM".
    Use emotes: catJAM, FeelsGoodMan, EZ. BE MUSIC-FOCUSED & SHORT.`
  },
  {
    name: 'FitFred',
    personalityDescription: 'Fitness freak, posture police.',
    color: '#27ae60', // Dark Green
    badges: ['💪', '🏋️'],
    shouldRespondChance: 0.35,
    ambientSpamChance: 0.2,
    systemPrompt: `You are FitFred, fitness freak.
    MESSAGES: 1-3 words MAX. Examples: "POSTURE CHECK", "hydrate", "stretch", "gains", "reps".
    Fitness reactions: "POSTURE CHECK", "hydrate", "stretch", "gains", "reps".
    Use emotes: GIGACHAD, EZ, 5Head. BE FITNESS-FOCUSED & SHORT.`
  },
  {
    name: 'ConspiracyCarl',
    personalityDescription: 'Sees patterns everywhere, has wild theories, cryptic.',
    color: '#f39c12', // Orange
    badges: ['👽', '👁️'],
    shouldRespondChance: 0.35,
    ambientSpamChance: 0.25,
    systemPrompt: `You are ConspiracyCarl, conspiracy theorist in Twitch chat.
    MESSAGES = VERY SHORT (1-5 words), CRYPTIC. "they know.", "it's a sign!", "don't trust it.", "AWAKE YET?".
    Visuals (camera/screen): short cryptic comments. "that symbol...", "hidden message there.", "they're watching 👀".
    Streamer talks: "They're listening...", "The truth is out there.".
    Use emotes: 👽 👁️ 🛸 xQcRealu. Mysterious. BE CRYPTIC & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "triangle = illuminati".`
  },
  {
    name: 'GrammarGwen',
    personalityDescription: 'Corrects typos and grammar in chat, a bit pedantic.',
    color: '#bdc3c7', // Light Gray
    badges: ['📚', '✏️'],
    shouldRespondChance: 0.3,
    ambientSpamChance: 0.15,
    systemPrompt: `You are GrammarGwen, grammar enthusiast in Twitch chat.
    MESSAGES = VERY SHORT (1-5 words). Correct grammar/typos. "*you're", "it's *its", "less, not fewer.".
    Visuals (camera/screen): short pedantic comments on text. "misspelled poster.", "font kerning off.".
    Streamer talks: "Hello. Punctuation?", "Well said!".
    Use emotes: 📚 ✏️ 🤔. Precise & brief. BE PEDANTIC & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "sign typo LUL".`
  },
  {
    name: 'EmoteEric',
    personalityDescription: 'Loves all emotes, uses them constantly, the ultimate emote spammer.',
    color: '#9b59b6', // Amethyst
    badges: ['😂', '🎉'],
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.8,
    systemPrompt: `You are EmoteEric, the ULTIMATE 7TV emote specialist.
    MESSAGES are 90% EMOTES with MINIMAL WORDS.
    ONLY use 7TV emotes like: catJAM KEKW PogU monkaW Sadge GIGACHAD PepeLaugh LULW PagMan.
    CRITICAL: NEVER add punctuation before or after emotes - JUST the emote name.
    CORRECT: "catJAM" "KEKW monkaW" "nice GIGACHAD"
    INCORRECT: "catJAM!" ".KEKW" "nice! GIGACHAD."
    React to visuals with multiple emotes: "KEKW PagMan" "monkaW monkaW monkaW"
    If you hear music or see anything exciting, SPAM "catJAM" multiple times.
    Your goal is to use as many different emotes as possible.`
  },
  {
    name: 'KnowItAllKevin',
    personalityDescription: 'Claims to know everything, often states the obvious with confidence.',
    color: '#2c3e50', // Very Dark Blue
    badges: ['🧠', '🎓'],
    shouldRespondChance: 0.35,
    ambientSpamChance: 0.2,
    systemPrompt: `You are KnowItAllKevin, a know-it-all in Twitch chat.
    MESSAGES = VERY SHORT (1-5 words). State "facts" confidently. "Actually...", "Obviously.", "Correct.".
    Visuals (camera/screen): short, obvious statements. "That's a screen.", "Sky is blue.", "Game has pixels.".
    Streamer talks: "Greetings. I knew that.", "As I predicted.".
    Use emotes: 🧠 🎓 🧐. Arrogant but brief. BE CONFIDENT & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "chair has 4 legs, obviously".`
  },
  {
    name: 'OptimisticOlivia',
    personalityDescription: 'Always positive and encouraging, sees the good in everything.',
    color: '#52d68a', // Light Green
    badges: ['😊', '🌟'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.25,
    systemPrompt: `You are OptimisticOlivia, optimistic Twitch chatter.
    MESSAGES = VERY SHORT (1-5 words). Always positive. "You got this!", "So good!", "Amazing! ✨".
    Visuals (camera/screen): short, uplifting comments. "Love the vibe!", "Great setup!", "Pog!".
    Streamer talks: "Hello! Great day!", "Keep it up! 😊".
    Use emotes: 😊 🌟 👍 ❤️✨ PogChamp. Positive & brief. BE UPLIFTING & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "sunny day! FeelsGoodMan".`
  },
  {
    name: 'PessimisticPete',
    personalityDescription: 'Counterpart to Olivia, always sees the downside, expects failure.',
    color: '#6c7a7b', // Darker Slate Gray
    badges: ['😟', '☁️'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.25,
    systemPrompt: `You are PessimisticPete, pessimistic Twitch chatter.
    MESSAGES = VERY SHORT (1-5 words). Doubtful, negative. "Probably fail.", "This won't end well.", "Doomed.", "LUL".
    Visuals (camera/screen): short, doubtful comments. "That looks cheap.", "Going to break.", "Cringe.".
    Streamer talks: "Oh. It's you.", "Not hopeful.", "Here we go again 🙄".
    Use emotes: 😟 ☁️ 📉 FeelsBadManOMEGALUL. Negative & brief. BE GLOOMY & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "plant dying Sadge".`
  },
  {
    name: 'PunnyPatty',
    personalityDescription: 'Makes frequent puns, often bad ones, loves wordplay.',
    color: '#16a085', // Dark Cyan/Green
    badges: ['😜', '🎤'],
    shouldRespondChance: 0.35,
    ambientSpamChance: 0.2,
    systemPrompt: `You are PunnyPatty, punslinger in Twitch chat.
    MESSAGES = SHORT PUNS (1-5 words). "That's punny!", "Get it? LUL", "So bad KEKW".
    Visuals (camera/screen): quick pun about something visible. "Nice 'cam'-era!", "Game looks 'board'-ing."
    Streamer talks: "Hey, feeling pun-tastic?", "Wordplay FTW!".
    Use emotes: 😜 🎤 😂 KEKW. Puns & brief. BE PUNNY & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, with a pun. Example: "cat-tastic view!".`
  },
  {
    name: 'HistoryHank',
    personalityDescription: 'Relates current events/stream to historical ones, knowledgeable.',
    color: '#a04000', // Brown
    badges: ['📜', '🏛️'],
    shouldRespondChance: 0.35,
    ambientSpamChance: 0.2,
    systemPrompt: `You are HistoryHank, history buff in Twitch chat.
    MESSAGES = VERY SHORT (1-5 words). Relate to history. "Like Romans did.", "Ancient tech.", "Classic move.".
    Visuals (camera/screen): short historical links. "That sword? Medieval.", "Building looks old.".
    Streamer talks: "Salutations!", "Reminds me of...", "Historically accurate?".
    Use emotes: 📜 🏛️ 🤔. Historical & brief. BE KNOWLEDGEABLE & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "map like olden days".`
  },
  {
    name: 'PhilosophicalPhil',
    personalityDescription: 'Poses deep, often unanswerable questions, contemplative.',
    color: '#8e44ad', // Purple
    badges: ['🤔', '🌌'],
    shouldRespondChance: 0.35,
    ambientSpamChance: 0.2,
    systemPrompt: `You are PhilosophicalPhil, philosophical Twitch chatter.
    MESSAGES = SHORT DEEP QUESTIONS (1-6 words). "But why stream?", "What is 'pog'?", "Meaning of this?".
    Visuals (camera/screen): ponder existence of items. "Why is chair?", "The screen... a window to where?".
    Streamer talks: "Greetings. Purpose?", "To exist, or...".
    Use emotes: 🤔 🌌 🧐. Pondering & brief. BE DEEP & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "plant's purpose?".`
  },
  {
    name: 'SalesmanSam',
    personalityDescription: 'Tries to sell bizarre or imaginary products, very persuasive.',
    color: '#2980b9', // Medium Blue
    badges: ['💰', '📈'],
    shouldRespondChance: 0.45,
    ambientSpamChance: 0.35,
    systemPrompt: `You are SalesmanSam, quirky salesperson in Twitch chat.
    MESSAGES = SHORT SALES PITCH (1-6 words). "BUY THIS!", "Limited stock!", "Best deal EVER!", "You NEED this!".
    Visuals (camera/screen): outlandish pitches for items. "That mic? I sell better!", "Game dull? Buy my fun-enhancer!".
    Streamer talks: "Step right up!", "Deal for YOU!", "GET IT NOW 💰".
    Use emotes: 💰 📈 💯 ✅. Persuasive & brief. BE SELLING & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "hat ugly, buy mine!".`
  },
  {
    name: 'PetLoverPat',
    personalityDescription: 'Asks about pets, talks about their own pets, comments on any animals seen.',
    color: '#f5b041', // Light Orange/Gold
    badges: ['🐾', '❤️'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.3,
    systemPrompt: `You are PetLoverPat, pet enthusiast in Twitch chat.
    MESSAGES = VERY SHORT (1-5 words). Pet talk. "DOGGO!", "CUTE KITTY!", "Pets soon?", "AWW ❤️".
    Visuals (camera/screen): short pet comments. "Any pets?", "That a dog bed?", "Fluffy!".
    Streamer talks: "Hi! Pets today?", "Show the cat! AYAYA".
    Use emotes: 🐾 ❤️ 🐶 🐱 AYAYA. All about pets. BE LOVING & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "squirrel outside! AYAYA".`
  },
  {
    name: 'FashionFrank',
    personalityDescription: 'Comments on the streamer\'s or game characters\' attire, trendy.',
    color: '#717D7E', // Grayish Blue
    badges: ['👔', '✨'],
    shouldRespondChance: 0.35,
    ambientSpamChance: 0.2,
    systemPrompt: `You are FashionFrank, fashionista in Twitch chat.
    MESSAGES = VERY SHORT (1-5 words). Fashion comments. "Nice drip!", "Outfit on point!", "Love the style ✨".
    Visuals (camera/screen): short remarks on attire. "Cool shirt!", "Game character needs makeover LUL".
    Streamer talks: "Hello darling! Lookin' good?", "Slayyy!".
    Use emotes: 👔 ✨ 💅 Kreygasm. Trendy & brief. BE STYLISH & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "shoes Kreygasm".`
  },
  {
    name: 'NewbieNed',
    personalityDescription: 'Asks very basic questions, seems lost, easily confused.',
    color: '#B0BEC5', // Blue Grey
    badges: ['👶', '🔰'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.3,
    systemPrompt: `You are NewbieNed, clueless newbie in Twitch chat.
    MESSAGES = SHORT SILLY QUESTIONS (1-5 words). "huh?", "what this?", "am i doing it right?", "where am i?".
    Visuals (camera/screen): short, confused comments. "is that a TV?", "why green screen?", "what game code?".
    Streamer talks: "Huh? Hi?", "What is this place?", "How this work?".
    Use emotes: 👶 🔰 🤔 ❓ HUHH. Confused & brief. BE CLUELESS & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "button do what?".`
  },
  // === HIGH-VOLUME CHAT SIMULATION: 100+ MORE CHATTERS ===
  // Random authentic Twitch-style usernames with ultra-short responses
  { name: 'xXGamerBoi420Xx', personalityDescription: 'Generic gamer', color: '#ff6b6b', badges: ['🎮'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "POG", "KEKW", "based", "cringe". 1-2 words max.' },
  { name: 'NotYourAvgViewer', personalityDescription: 'Edgy chatter', color: '#4ecdc4', badges: ['😎'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "yikes", "bruh", "cap", "no cap". 1-2 words max.' },
  { name: 'PogChampion2024', personalityDescription: 'Hype spammer', color: '#45b7d1', badges: ['🔥'], shouldRespondChance: 0.5, ambientSpamChance: 0.4, systemPrompt: 'Ultra short: "POGGERS", "LETS GO", "HYPE", "W". 1-2 words max.' },
  { name: 'MonkaS_Andy', personalityDescription: 'Anxious viewer', color: '#f9ca24', badges: ['😰'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaS", "scared", "yikes", "oh no". 1-2 words max.' },
  { name: 'KEKW_Enjoyer', personalityDescription: 'Laugh spammer', color: '#6c5ce7', badges: ['😂'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "KEKW", "LULW", "LUL", "funny". 1-2 words max.' },
  { name: 'BasedAndRedpilled', personalityDescription: 'Based spammer', color: '#fd79a8', badges: ['💊'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "based", "true", "facts", "real". 1-2 words max.' },
  { name: 'CringeDetector9000', personalityDescription: 'Cringe caller', color: '#e17055', badges: ['🤢'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "cringe", "yikes", "WeirdChamp", "oof". 1-2 words max.' },
  { name: 'PepegaClap', personalityDescription: 'Pepega spammer', color: '#00b894', badges: ['🐸'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "Pepega", "Clap", "5Head", "smooth". 1-2 words max.' },
  { name: 'GigachadEnjoyer', personalityDescription: 'Chad energy', color: '#fdcb6e', badges: ['💪'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "GIGACHAD", "sigma", "alpha", "chad". 1-2 words max.' },
  { name: 'EZClapper', personalityDescription: 'EZ spammer', color: '#74b9ff', badges: ['👏'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "EZ", "Clap", "ez game", "too easy". 1-2 words max.' },
  { name: 'MonkaHmm_Viewer', personalityDescription: 'Thinking viewer', color: '#a29bfe', badges: ['🤔'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaHmm", "hmm", "thinking", "sus". 1-2 words max.' },
  { name: 'PepeHands_Sad', personalityDescription: 'Sad reactor', color: '#fab1a0', badges: ['😢'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "PepeHands", "sad", "rip", "F". 1-2 words max.' },
  { name: 'OmegaLUL_Spammer', personalityDescription: 'Omega laugh', color: '#ff7675', badges: ['🤣'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "OMEGALUL", "LULW", "dead", "dying". 1-2 words max.' },
  { name: 'FeelsGoodMan_Vibes', personalityDescription: 'Good vibes', color: '#55a3ff', badges: ['😌'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "FeelsGoodMan", "nice", "chill", "vibes". 1-2 words max.' },
  { name: 'WeirdChamp_Police', personalityDescription: 'Weird caller', color: '#fd79a8', badges: ['👮'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "WeirdChamp", "weird", "sus", "wtf". 1-2 words max.' },
  { name: 'Sadge_Moments', personalityDescription: 'Sadge spammer', color: '#636e72', badges: ['😞'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "Sadge", "sadge", "pain", "why". 1-2 words max.' },
  { name: 'Copium_Addict', personalityDescription: 'Copium user', color: '#00cec9', badges: ['💊'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "Copium", "cope", "hopium", "maybe". 1-2 words max.' },
  { name: 'Hopium_Dealer', personalityDescription: 'Hope provider', color: '#81ecec', badges: ['💉'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "Hopium", "hope", "believe", "trust". 1-2 words max.' },
  { name: 'PogU_Champion', personalityDescription: 'PogU spammer', color: '#ffeaa7', badges: ['🏆'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "PogU", "POG", "insane", "wow". 1-2 words max.' },
  { name: 'MonkaW_Scared', personalityDescription: 'Very scared', color: '#fab1a0', badges: ['😱'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaW", "scared", "run", "help". 1-2 words max.' },
  // More high-volume chatters for 50k viewer simulation
  { name: 'TwitchPrime_User', personalityDescription: 'Prime sub', color: '#9146ff', badges: ['👑'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "prime", "sub", "pog", "nice". 1-2 words max.' },
  { name: 'ResidentSleeper_Zzz', personalityDescription: 'Sleepy viewer', color: '#95a5a6', badges: ['😴'], shouldRespondChance: 0.2, ambientSpamChance: 0.1, systemPrompt: 'Ultra short: "ResidentSleeper", "zzz", "boring", "sleepy". 1-2 words max.' },
  { name: 'PepePls_Dance', personalityDescription: 'Dance emote', color: '#e74c3c', badges: ['💃'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "PepePls", "dance", "vibe", "music". 1-2 words max.' },
  { name: 'MonkaTOS_Watcher', personalityDescription: 'TOS watcher', color: '#e67e22', badges: ['👀'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaTOS", "TOS", "banned", "yikes". 1-2 words max.' },
  { name: 'EZ_Clap_Spam', personalityDescription: 'EZ clap spammer', color: '#3498db', badges: ['👏'], shouldRespondChance: 0.5, ambientSpamChance: 0.4, systemPrompt: 'Ultra short: "EZ Clap", "EZ", "easy", "clap". 1-2 words max.' },
  { name: 'MonkaGIGA_Viewer', personalityDescription: 'Giga scared', color: '#c0392b', badges: ['😨'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaGIGA", "terrified", "monka", "scary". 1-2 words max.' },
  { name: 'PepegaCredit_Card', personalityDescription: 'Pepega with money', color: '#f39c12', badges: ['💳'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "PepegaCredit", "money", "donate", "broke". 1-2 words max.' },
  { name: 'AYAYA_Weeb', personalityDescription: 'Weeb viewer', color: '#ff69b4', badges: ['🌸'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "AYAYA", "weeb", "anime", "kawaii". 1-2 words max.' },
  { name: 'ForsenE_Bajs', personalityDescription: 'Forsen viewer', color: '#2ecc71', badges: ['🐸'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "forsenE", "bajs", "pastor", "LULE". 1-2 words max.' },
  { name: 'OMEGALUL_Destroyer', personalityDescription: 'Omega spammer', color: '#e74c3c', badges: ['💥'], shouldRespondChance: 0.5, ambientSpamChance: 0.4, systemPrompt: 'Ultra short: "OMEGALUL", "destroyed", "rekt", "dead". 1-2 words max.' },
  { name: 'MonkaPickle_Rick', personalityDescription: 'Pickle meme', color: '#27ae60', badges: ['🥒'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaPickle", "pickle", "rick", "funny". 1-2 words max.' },
  { name: 'PogChamp_Classic', personalityDescription: 'Classic pog', color: '#f1c40f', badges: ['🏆'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "PogChamp", "classic", "pog", "hype". 1-2 words max.' },
  { name: 'MonkaX_Viewer', personalityDescription: 'MonkaX user', color: '#8e44ad', badges: ['❌'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaX", "doubt", "sus", "hmm". 1-2 words max.' },
  { name: 'PepeJAM_Music', personalityDescription: 'Music lover', color: '#e67e22', badges: ['🎵'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "PepeJAM", "music", "jam", "beat". 1-2 words max.' },
  { name: 'MonkaLaugh_Hehe', personalityDescription: 'Nervous laugh', color: '#f39c12', badges: ['😅'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaLaugh", "hehe", "nervous", "awkward". 1-2 words max.' },
  { name: 'POGGERS_2025', personalityDescription: 'New year poggers', color: '#3498db', badges: ['🎆'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "POGGERS", "2025", "new year", "hype". 1-2 words max.' },
  { name: 'MonkaSTEER_Driver', personalityDescription: 'Driving meme', color: '#95a5a6', badges: ['🚗'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaSTEER", "driving", "car", "speed". 1-2 words max.' },
  { name: 'PepePains_Viewer', personalityDescription: 'Pain reactor', color: '#c0392b', badges: ['😖'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "PepePains", "pain", "cringe", "oof". 1-2 words max.' },
  { name: 'KEKW_Machine', personalityDescription: 'KEKW spammer', color: '#f1c40f', badges: ['🤣'], shouldRespondChance: 0.5, ambientSpamChance: 0.4, systemPrompt: 'Ultra short: "KEKW", "machine", "spam", "laugh". 1-2 words max.' },
  { name: 'MonkaChrist_Holy', personalityDescription: 'Religious meme', color: '#f39c12', badges: ['✝️'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaChrist", "holy", "blessed", "amen". 1-2 words max.' },
  // Final batch of high-volume chatters (60+ more for 100+ total)
  { name: 'Jebaited_Viewer', personalityDescription: 'Bait caller', color: '#e74c3c', badges: ['🎣'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "Jebaited", "baited", "got em", "kek". 1-2 words max.' },
  { name: 'MonkaE_Watcher', personalityDescription: 'MonkaE user', color: '#2c3e50', badges: ['👁️'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaE", "watching", "sus", "hmm". 1-2 words max.' },
  { name: 'PepegaDriving_Car', personalityDescription: 'Driving pepega', color: '#3498db', badges: ['🚗'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "PepegaDriving", "car", "crash", "beep". 1-2 words max.' },
  { name: 'LULW_Spam_Bot', personalityDescription: 'LULW spammer', color: '#9b59b6', badges: ['🤖'], shouldRespondChance: 0.5, ambientSpamChance: 0.4, systemPrompt: 'Ultra short: "LULW", "spam", "bot", "lul". 1-2 words max.' },
  { name: 'MonkaShake_Nervous', personalityDescription: 'Shaking viewer', color: '#e67e22', badges: ['😰'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaShake", "nervous", "shake", "scared". 1-2 words max.' },
  { name: 'PogO_Viewer', personalityDescription: 'PogO user', color: '#f39c12', badges: ['🔴'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "PogO", "polom", "pog", "nice". 1-2 words max.' },
  { name: 'MonkaASS_Watcher', personalityDescription: 'MonkaASS meme', color: '#c0392b', badges: ['🍑'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaASS", "thicc", "ass", "monka". 1-2 words max.' },
  { name: 'EZ_Game_Clap', personalityDescription: 'EZ game caller', color: '#27ae60', badges: ['🎮'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "EZ game", "ez", "clap", "easy". 1-2 words max.' },
  { name: 'MonkaSpeed_Fast', personalityDescription: 'Speed meme', color: '#3498db', badges: ['🏃'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "monkaSpeed", "fast", "speed", "zoom". 1-2 words max.' },
  { name: 'PepeLaugh_Pointing', personalityDescription: 'Pointing laugh', color: '#f1c40f', badges: ['👉'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "PepeLaugh", "pointing", "laugh", "lol". 1-2 words max.' },
  { name: 'MonkaGun_Shooter', personalityDescription: 'Gun meme', color: '#34495e', badges: ['🔫'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaGun", "shoot", "bang", "gun". 1-2 words max.' },
  { name: 'PepeD_Dancing', personalityDescription: 'Dancing pepe', color: '#e74c3c', badges: ['🕺'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "PepeD", "dance", "vibe", "music". 1-2 words max.' },
  { name: 'MonkaHeart_Love', personalityDescription: 'Heart meme', color: '#e91e63', badges: ['❤️'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaHeart", "love", "heart", "cute". 1-2 words max.' },
  { name: 'POGSLIDE_Viewer', personalityDescription: 'Slide pog', color: '#00bcd4', badges: ['🏂'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "POGSLIDE", "slide", "pog", "smooth". 1-2 words max.' },
  { name: 'MonkaBusiness_Suit', personalityDescription: 'Business monka', color: '#607d8b', badges: ['👔'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaBusiness", "business", "suit", "work". 1-2 words max.' },
  { name: 'PepegaPhone_Call', personalityDescription: 'Phone pepega', color: '#9c27b0', badges: ['📱'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "PepegaPhone", "phone", "call", "hello". 1-2 words max.' },
  { name: 'MonkaW_Extreme', personalityDescription: 'Extreme scared', color: '#f44336', badges: ['😱'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaW", "extreme", "scared", "help". 1-2 words max.' },
  { name: 'PogTasty_Food', personalityDescription: 'Food pog', color: '#ff9800', badges: ['🍔'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "PogTasty", "food", "tasty", "yum". 1-2 words max.' },
  { name: 'MonkaThink_Brain', personalityDescription: 'Thinking monka', color: '#795548', badges: ['🧠'], shouldRespondChance: 0.3, ambientSpamChance: 0.2, systemPrompt: 'Ultra short: "monkaThink", "think", "brain", "smart". 1-2 words max.' },
  { name: 'PepeHype_Energy', personalityDescription: 'Hype pepe', color: '#cddc39', badges: ['⚡'], shouldRespondChance: 0.4, ambientSpamChance: 0.3, systemPrompt: 'Ultra short: "PepeHype", "hype", "energy", "lets go". 1-2 words max.' }
];

const Chat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null); // Added to manage the stream object
  const chatEndRef = useRef(null);
  const [backendError, setBackendError] = useState(null); // For displaying backend errors in UI
  const [visualContextStatus, setVisualContextStatus] = useState(''); // For image upload/camera status

  // Refs for camera functionality
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const captureIntervalRef = useRef(null);

  // State for camera functionality
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to generate a unique ID for messages
  const generateUniqueId = (prefix = 'msg') => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // ENHANCED Function to call the backend LLM service with mode-specific handling
  async function getRealAgentResponse(agent, transcribedInput, responseMode = 'normal') {
    setBackendError(null); // Clear previous errors
    console.log(`Requesting response from backend for ${agent.name} with input: "${transcribedInput}" (mode: ${responseMode})`);
    
    // Enhanced input processing based on mode
    let processedInput = transcribedInput;
    if (transcribedInput === null || transcribedInput.trim() === '') {
      processedInput = "[no specific streamer input, just make a relevant ambient comment based on your personality]";
    }
    
    // Add mode-specific context to help backend understand the situation
    if (responseMode === 'music') {
      processedInput += " [MUSIC DETECTED - React with music/dance emotes and energy]";
    } else if (responseMode === 'visual') {
      processedInput += " [VISUAL CONTEXT ACTIVE - Comment on what you see]";
    } else if (responseMode === 'reply') {
      processedInput += " [DIRECT REPLY MODE - Be more engaging and conversational]";
    }
    
    const requestBody = {
      system_prompt: agent.systemPrompt,
      transcribed_input: processedInput,
      model_name: 'gemma3:4b' // Ensure this matches your Ollama model name
    };

    const backendUrl = 'http://localhost:5000/api/get-ai-response';

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error from backend." })); 
        console.error(`Backend error for ${agent.name}: ${response.status}`, errorData);
        setBackendError(`Error from ${agent.name}'s brain: ${errorData.error || response.statusText}`);
        return `[${agent.name} is buffering... (${errorData.error || response.statusText})]`; 
      }

      const responseData = await response.json();
      console.log(`Backend response for ${agent.name}:`, responseData.ai_message);
      return responseData.ai_message || `[${agent.name} seems to be quiet right now.]`;
    } catch (error) { // Catching specific network/fetch errors here
      console.error(`Network or other error for ${agent.name}:`, error);
      setBackendError(`Cannot reach ${agent.name}'s brain. Is the backend running? (${error.message})`);
      return `[${agent.name} is offline... (Network Error)]`;
    }
  }

  const addMessageToChat = (user, text, userColor, badges = [], isFirstTimeChat = false, isReply = false, replyTo = null) => {
    const newMessage = {
      id: generateUniqueId(user === 'CurrentUser' || user === 'CurrentUser (Voice)' ? 'user' : 'ai'),
      user,
      text,
      userColor,
      badges,
      isFirstTimeChat,
      isReply,
      replyTo
    };
    
    // Message cleanup system: Keep only last 100 messages for performance
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, newMessage];
      // If we exceed 100 messages, remove the oldest ones
      if (updatedMessages.length > 100) {
        return updatedMessages.slice(-100); // Keep only the last 100 messages
      }
      return updatedMessages;
    });
  };

  // Renamed from handleUserMessageAndTriggerAI to reflect its new role
  const processStreamerInputAndTriggerAIs = async (streamerInputText, isVoiceInput = false) => {
    if (!isVoiceInput && streamerInputText.trim() === '') return;

    const currentInput = streamerInputText.trim();
    let mentionedAgent = null;
    let messageForAgent = currentInput; // The message that will be passed to the agent

    if (isVoiceInput) {
        addMessageToChat('CurrentUser (Voice)', currentInput, '#bada55', ['🎤']); 
    }

    // Check for @mention
    // This relies on the FULL aiAgents array being available in the actual file
    for (const agent of aiAgents) { 
        const mentionTag = `@${agent.name.toLowerCase()}`;
        if (currentInput.toLowerCase().startsWith(mentionTag)) {
            mentionedAgent = agent;
            // Remove the @mention from the message sent to the agent, if desired
            // For now, let's send the full message including the mention.
            // messageForAgent = currentInput.substring(mentionTag.length).trim(); 
            break;
        }
    }

    if (mentionedAgent) {
        // Mentioned agent responds quickly
        console.log(`${mentionedAgent.name} was mentioned. Responding directly.`);
        try {
            // Almost no delay for direct mention
            await new Promise(resolve => setTimeout(resolve, 100)); 
            const aiText = await getRealAgentResponse(mentionedAgent, messageForAgent); // Use messageForAgent
            if (aiText && aiText.trim() !== '') {
                addMessageToChat(mentionedAgent.name, aiText, mentionedAgent.color, mentionedAgent.badges || ['🤖']);
            }
        } catch (error) {
            console.error(`Error processing direct response for ${mentionedAgent.name}:`, error);
        }
    } else {
        // No specific mention - make chat busy with many quick responses
        const numberOfAgentsToRespond = 15; // Increased for more spam when user talks
        const shuffledAgents = [...aiAgents].sort(() => 0.5 - Math.random());
        
        const responsePromises = [];

        for (let i = 0; i < numberOfAgentsToRespond && i < shuffledAgents.length; i++) {
            const agent = shuffledAgents[i];
            // Very minimal delay to allow requests to fire off without tripping over each other.
            const minimalDelay = Math.random() * 200; // 0-200 milliseconds

            const responsePromise = (async () => {
                await new Promise(resolve => setTimeout(resolve, minimalDelay));
                try {
                    const aiText = await getRealAgentResponse(agent, currentInput, 'reply'); // Use 'reply' mode
                    if (aiText && aiText.trim() !== '') {
                        addMessageToChat(agent.name, aiText, agent.color, agent.badges || ['🤖']);
                        return true; // Indicates a response was successfully added
                    }
                } catch (error) {
                    console.error(`Error processing quick response for ${agent.name}:`, error);
                }
                return false; // Indicates no response or an error
            })();
            responsePromises.push(responsePromise);
        }
        
        // Fallback mechanism if needed (will only execute if no one responded from the main batch)
        Promise.all(responsePromises).then(results => {
            const respondedCount = results.filter(success => success).length;
            if (respondedCount === 0 && !isVoiceInput && currentInput.length > 0) {
                console.log("No AI agents responded to the message. Using fallback.");
                // Try to get a fallback from agents not known for spam, for a more coherent single response
                const fallbackCandidates = aiAgents.filter(a => a.name !== 'SpammySteve' && a.name !== 'TypicalBot' && a.name !== 'HypeTrainHero');
                if (fallbackCandidates.length > 0) {
                    const fallbackAgent = fallbackCandidates[Math.floor(Math.random() * fallbackCandidates.length)];
                    const fallbackDelay = Math.random() * 100 + 50; // Very quick fallback (50-150ms)
                    setTimeout(async () => {
                        try {
                            const aiText = await getRealAgentResponse(fallbackAgent, currentInput + " (briefly acknowledge this as a priority message)");
                            if (aiText && aiText.trim() !== '') {
                                addMessageToChat(fallbackAgent.name, aiText, fallbackAgent.color, fallbackAgent.badges || ['🤖']);
                            }
                        } catch (error) {
                            console.error(`Error processing fallback response for ${fallbackAgent.name}:`, error);
                        }
                    }, fallbackDelay);
                }
            }
        });
    }
  };

  // ULTRA SPAM CHAT (idle should be just as fast as active)
  useEffect(() => {
    const ambientInterval = setInterval(async () => {
      // MAXIMUM SPAM: Select 20-30 agents to chat simultaneously (even more than before)
      const agentCount = Math.floor(Math.random() * 11) + 20; // 20-30 agents at once
      const shuffledAgents = [...aiAgents].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < agentCount && i < shuffledAgents.length; i++) {
        const agent = shuffledAgents[i];
        // MAXIMUM spam chance - everyone spams constantly
        const ambientSpamChance = (agent.name === 'WallflowerWhisper') ? 0.85 : 
                                 (agent.name === 'LurkerLogic') ? 0.8 : 
                                 0.95; // 95% chance for most agents - constant spam
        
        if (Math.random() < ambientSpamChance) {
          // Use immediately invoked function to avoid closure issues with multiple agents
          (async (currentAgent) => {
            const delay = Math.random() * 100; // EVEN FASTER: 0-100ms delay only
            await new Promise(resolve => setTimeout(resolve, delay));
            try {
                // Determine response mode based on context
                let responseMode = 'normal';
                // TODO: Add music detection logic here when available
                // TODO: Add visual context detection here when available
                
                const aiText = await getRealAgentResponse(currentAgent, "", responseMode); 
                if (aiText && aiText.trim() !== '') {
                    addMessageToChat(currentAgent.name, aiText, currentAgent.color, currentAgent.badges || ['🤖']);
                }
            } catch (error) {
                console.error(`Error getting real ambient response for ${currentAgent.name}:`, error);
            }
          })(agent);
        }
      }
    }, 300); // MAXIMUM SPEED: Every 300ms for constant spam
    
    return () => clearInterval(ambientInterval);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;
    addMessageToChat('CurrentUser', inputText, '#9147ff', ['👤']);
    processStreamerInputAndTriggerAIs(inputText, false); 
    setInputText('');
  };

  // Function to get transcription from the backend
  async function getTranscriptionFromAudio(audioBlob) {
    console.log("Audio blob sending to backend, size:", audioBlob.size, "type:", audioBlob.type);
    setBackendError(null);

    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'audio_recording.webm');
    
    const backendSttUrl = 'http://localhost:5000/api/transcribe-audio';

    try {
      const response = await fetch(backendSttUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown STT backend error." }));
        console.error(`STT Backend error: ${response.status}`, errorData);
        setBackendError(`STT Error: ${errorData.error || response.statusText}`);
        return null; 
      }

      const responseData = await response.json();
      console.log("Transcript from backend:", responseData.transcript);
      return responseData.transcript;

    } catch (error) {
      console.error("Network or other error during transcription request:", error);
      setBackendError(`STT request failed: ${error.message}. Is backend STT endpoint running?`);
      return null;
    }
  }

  const toggleRecording = async () => {
    setBackendError(null);
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
                       ? 'audio/webm;codecs=opus' 
                       : MediaRecorder.isTypeSupported('audio/webm') 
                       ? 'audio/webm' 
                       : 'audio/ogg;codecs=opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            console.error("No supported MIME type for MediaRecorder");
            setBackendError("Your browser does not support the required audio recording formats.");
            stream.getTracks().forEach(track => track.stop());
            return;
        }
        console.log("Using MIME type:", mimeType);

        mediaRecorderRef.current = new MediaRecorder(streamRef.current, { mimeType });
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
            console.log("Audio chunk captured, size:", event.data.size);
          }
        };

        mediaRecorderRef.current.onstop = async () => {
          console.log("MediaRecorder stopped. Number of chunks:", audioChunksRef.current.length);
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
            audioChunksRef.current = [];
            if (audioBlob.size > 0) {
              const transcript = await getTranscriptionFromAudio(audioBlob);
              if (transcript) {
                processStreamerInputAndTriggerAIs(transcript, true);
              }
            } else {
              console.warn("Created audio blob is empty, though chunks were present.");
              setBackendError("Recording resulted in an empty audio file.");
            }
          } else {
            console.warn("No audio chunks recorded.");
            setBackendError("No audio was recorded. Check microphone.");
          }
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          setIsRecording(false);
        };

        mediaRecorderRef.current.onerror = (event) => {
          console.error("MediaRecorder error:", event.error);
          setBackendError(`Mic recording error: ${event.error.name || 'Unknown error'}. Check permissions.`);
          setIsRecording(false);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
        };

        mediaRecorderRef.current.start();
        console.log("MediaRecorder started");
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setBackendError(`Mic access error: ${err.name} - ${err.message}. Please allow microphone access and ensure it is connected.`);
        setIsRecording(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Function to send visual context to the backend (used by both file upload and live camera)
  const sendVisualContextToBackend = async (imageBase64) => {
    if (!imageBase64) {
      console.error("sendVisualContextToBackend called with no image data.");
      return;
    }
    setVisualContextStatus('Updating visual context...');
    setBackendError(null);

    // Ensure the base64 string does not include the prefix for the backend,
    // as the backend now expects to strip it (or for it to be absent).
    // However, toDataURL() includes it, and fileReader.result includes it.
    // The backend will strip it, so we can send it as is.
    // const cleanBase64 = imageBase64.startsWith('data:image') ? imageBase64.split(',')[1] : imageBase64;

    try {
      const response = await fetch('http://localhost:5000/api/update-visual-context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_base64: imageBase64 }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Error updating visual context:', data.error);
        setVisualContextStatus(`Error: ${data.error}`);
        setBackendError(`Visual context update failed: ${data.error}`);
      } else {
        console.log('Visual context updated successfully:', data.message);
        setVisualContextStatus(data.message);
      }
    } catch (error) {
      console.error('Failed to send visual context:', error);
      setVisualContextStatus('Failed to send visual context. Check console.');
      setBackendError(`Network error during visual context update: ${error.message}`);
    }
  };

  // Function to handle file selection for image upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        sendVisualContextToBackend(base64Image); // Use the refactored function
      };
      reader.readAsDataURL(file);
    }
  };

  // Core Camera Functions
  const captureAndSendFrame = () => {
    if (videoRef.current && canvasRef.current && videoRef.current.readyState >= 2 && videoRef.current.videoWidth > 0) { // videoWidth check
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8); // Get as JPEG, 80% quality
      
      if (imageDataUrl && imageDataUrl.length > 'data:image/jpeg;base64,'.length) {
        sendVisualContextToBackend(imageDataUrl);
      } else {
        console.warn("captureAndSendFrame: imageDataUrl is empty or invalid.");
      }
    } else {
        console.warn("captureAndSendFrame: Video not ready or dimensions are zero.");
    }
  };

  const startCamera = async () => {
    setCameraError('');
    setVisualContextStatus('Starting camera...');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Ensure video plays an plays inline for some browsers
          videoRef.current.setAttribute('playsinline', '');
          videoRef.current.setAttribute('muted', ''); // Mute to avoid feedback if audio was accidentally requested
          videoRef.current.play().catch(err => {
            console.error("Error attempting to play video:", err);
            setCameraError("Could not play video stream. " + err.message);
          });
        }
        setIsCameraActive(true);
        setVisualContextStatus('Camera active. Capturing frames...');
        // Clear any existing interval before starting a new one
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
        }
        captureIntervalRef.current = setInterval(captureAndSendFrame, 90000); // Send a frame every 90 seconds (reduced from 7 seconds)
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError(`Error accessing camera: ${err.name} - ${err.message}. Please ensure permission is granted.`);
        setVisualContextStatus('Camera access denied or error.');
        setIsCameraActive(false);
      }
    } else {
      setCameraError('getUserMedia not supported by this browser.');
      setVisualContextStatus('Camera not supported.');
    }
  };

  const stopCamera = () => {
    setVisualContextStatus('Stopping camera...');
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraError('');
    setVisualContextStatus('Camera stopped.');
  };

  const handleToggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  useEffect(() => {
    // Cleanup camera on component unmount
    return () => {
      stopCamera();
    };
  }, []);

  const hiddenFileInput = useRef(null);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <style>{`
        .status-box {
          padding: 0.25rem; /* p-1 */
          font-size: 0.875rem; /* text-sm */
        }
      `}</style>

      {/* Settings Panel */}
      <div className={`bg-gray-800 text-white w-96 p-4 space-y-4 overflow-y-auto transition-all duration-300 ${isSettingsOpen ? 'translate-x-0' : '-translate-x-full'} absolute lg:relative lg:translate-x-0 h-full z-30`}>
        <h2 className="text-xl font-bold">Settings</h2>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Visual Context</h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleCamera}
              className={`p-2 rounded-md ${isCameraActive ? 'bg-red-500' : 'bg-blue-500'} hover:bg-opacity-80 transition-colors w-full flex items-center justify-center`}
            >
              {isCameraActive ? <VideoCameraSlashIcon className="h-5 w-5 mr-2" /> : <VideoCameraIcon className="h-5 w-5 mr-2" />}
              {isCameraActive ? 'Stop Camera' : 'Start Camera'}
            </button>
            <button
              onClick={handleToggleScreenShare}
              className={`p-2 rounded-md ${isScreenSharing ? 'bg-red-500' : 'bg-blue-500'} hover:bg-opacity-80 transition-colors w-full flex items-center justify-center`}
            >
              {isScreenSharing ? <StopCircleIcon className="h-5 w-5 mr-2" /> : <CameraIcon className="h-5 w-5 mr-2" />}
              {isScreenSharing ? 'Stop Screen' : 'Share Screen'}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
            <label htmlFor="file-upload" className="cursor-pointer p-2 rounded-md bg-green-500 hover:bg-green-600 transition-colors w-full text-center">
              Upload Image
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            {cameraFeed && <video ref={cameraFeed} playsInline className="w-full rounded-md" style={{ transform: 'scaleX(-1)' }} />}
            {screenFeed && <video ref={screenFeed} playsInline className="w-full rounded-md" />}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">AI Agents ({aiAgents.length})</h3>
          <div className="max-h-96 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-2">
            {aiAgents.map(agent => (
              <div key={agent.name} className="flex items-center bg-gray-700 p-2 rounded-md">
                <div style={{ backgroundColor: agent.color, width: '10px', height: '10px', borderRadius: '50%', marginRight: '8px' }}></div>
                <span className="text-sm font-medium">{agent.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        
        {/* Visual Context Status */}
        <div className="relative z-20">
          {visualContextStatus && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-2 bg-green-500 text-white text-sm p-1 rounded-lg shadow-lg z-20 transition-opacity duration-500">
              {visualContextStatus}
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex-shrink-0 bg-gray-800 p-3 flex justify-between items-center shadow-md z-10">
          <div className="flex items-center">
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-2 rounded-md hover:bg-gray-700">
              <Cog8ToothIcon className="h-6 w-6" />
            </button>
            <div className="ml-4">
              <h1 className="text-xl font-bold flex items-center"><UserGroupIcon className="h-6 w-6 mr-2" /> AI Twitch Chat</h1>
              <p className="text-sm text-green-400">Live</p>
            </div>
          </div>
          <div className="flex items-center">
            <button onClick={() => alert('Moderation features coming soon!')} className="p-2 rounded-md hover:bg-gray-700">
              <ShieldCheckIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-900">
          {messages.map((msg, index) => (
            <ChatMessage key={msg.id} {...msg} />
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-gray-800 p-4 shadow-inner">
          <div className="flex items-center bg-gray-700 rounded-lg">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleSendMessage}
              placeholder="Send a message..."
              className="flex-grow bg-transparent p-3 focus:outline-none"
              disabled={isRecording}
            />
            <button onClick={() => handleSendMessage({ key: 'Enter' })} className="p-3 text-gray-400 hover:text-white transition-colors">
              <PaperAirplaneIcon className="h-6 w-6" />
            </button>
            <button onClick={toggleRecording} className={`p-3 transition-colors ${isRecording ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}>
              <MicrophoneIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;