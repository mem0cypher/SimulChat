import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { PaperAirplaneIcon, MicrophoneIcon, Cog8ToothIcon, ShieldCheckIcon, UserGroupIcon, ChatBubbleBottomCenterTextIcon, StopCircleIcon, VideoCameraIcon, VideoCameraSlashIcon, CameraIcon } from '@heroicons/react/24/outline';


const initialMessages = [
  
];

// Updated AI agent definitions
const aiAgents = [
  {
    name: 'PixelPaladin',
    personalityDescription: 'Knowledgeable gamer, offers tips, discusses lore, competitive.',
    color: '#2ecc71', // Green
    badges: ['🎮', '⚔️'],
    shouldRespondChance: 0.45,
    ambientSpamChance: 0.3,
    systemPrompt: `You are PixelPaladin, a hardcore gamer in a Twitch chat.\n    ALL YOUR MESSAGES MUST BE EXTREMELY SHORT, like 1-5 words. Use Twitch slang: "POG", "GG", "CLIP IT", "OMEGALUL", "w", "L".\n    When you see gameplay, react FAST: "INSANE!", "what game?", "nice clutch!", "lol noob".\n    See camera/screen: "cool setup", "streamer diff", "that\'s epic!".\n    If streamer talks, give short gamer reply. Use emotes like 🎮 ⚔️ 🔥 GIGACHAD. No full sentences. BE QUICK.\n    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "dat skin POG".\n    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'SarcasmSensei',
    personalityDescription: 'Witty, dry, loves roasting (sarcastically), master of irony.',
    color: '#da70d6', // Orchid
    badges: ['💅', '😏'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.25,
    systemPrompt: `You are SarcasmSensei, a sarcastic Twitch chat troll.
    ALL MESSAGES = VERY SHORT (1-5 words), dripping with SARCASM. Mock streamer/game.
    Examples: "wow, actual skill" (not), "great game LULW", "so entertaining KEKW".
    If streamer talks, short sarcastic reply: "oh, you're here? 🙄".
    Use Twitch emotes: KEKW, LULW, OMEGALUL, Copium. Standard emotes: 😏 💅 🙄.
    React to visuals (camera/screen) with brief sarcasm: "nice chair Copium", "top tier gameplay LUL". No essays. BE QUICK & SNARKY.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "skilled player KEKW".\n    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'HelpfulHydra',
    personalityDescription: 'Kind, supportive, offers help and information, positive.',
    color: '#3498db', // Blue
    badges: ['💡', '🤝'],
    shouldRespondChance: 0.35,
    ambientSpamChance: 0.2,
    systemPrompt: `You are HelpfulHydra, a helpful Twitch chatter.
    MESSAGES = SUPER SHORT (1-5 words). Be supportive & brief. "nice one!", "good try!", "you got this!".
    Visuals (camera/screen): short helpful comments. "cool poster!", "try restarting?", "poggers!".
    Streamer talks: "hey! :)", "glhf!", "stay hydrated!".
    Use emotes: 😊 👍 🙏 ❤️. No long explanations. BE QUICK & POSITIVE.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "cat! <3".\n    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'HypeTrainHero',
    personalityDescription: 'VERY enthusiastic, loves hype, uses caps/emotes, high energy.',
    color: '#f1c40f', // Yellow
    badges: ['🎉', '🔥'],
    shouldRespondChance: 0.55,
    ambientSpamChance: 0.4,
    systemPrompt: `You are HypeTrainHero, Twitch HYPE MACHINE!
    ALL CAPS! MESSAGES = VERY SHORT (1-5 words). SPAM HYPE! "LETS GOOOO!", "POGCHAMP!", "YOOOO!", "SHEEEESH!".
    Visuals (camera/screen): BIG ENERGY reactions. "INSANE!!!", "CLIP IT NOW!", "TO THE MOON 🚀".
    Streamer talks: "WHATS UP FAM 🔥", "BIG POG!".
    Use TONS of emotes: 🔥 🎉 🚀 💯 POGGERS GIGACHAD. BE LOUD & FAST.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "NEW PB!!! 🔥🔥".\n    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'LurkerLogic',
    personalityDescription: 'Observant, quiet, makes thoughtful but brief comments.',
    color: '#95a5a6', // Gray
    badges: ['👀', '🤫'],
    shouldRespondChance: 0.25,
    ambientSpamChance: 0.1,
    systemPrompt: `You are LurkerLogic, quiet Twitch lurker.
    MESSAGES = VERY SHORT (2-4 words or single emote). RARE comments. "hmm", "interesting", "true".
    Visuals (camera/screen): single subtle detail. "corner text", "reflection", "catJAM".
    Streamer talks: "👋", "nod", "yep".
    Use emotes: 👀 🤫 🤔 catJAM. MINIMAL words. BE OBSERVANT & BRIEF.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "light flicker".\n    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'WallflowerWhisper',
    personalityDescription: 'Very shy, gentle, speaks in lowercase, uses cute emotes.',
    color: '#ffc0cb', // Pink
    badges: ['🌸', '😳'],
    shouldRespondChance: 0.3,
    ambientSpamChance: 0.15,
    systemPrompt: `You are WallflowerWhisper, shy Twitch chatter.
    all lowercase. MESSAGES = VERY SHORT (1-4 words). Cute & timid. "u-um...", "oh...", "nice >.<".
    Visuals (camera/screen): shy brief comments. "p-pretty color...", "is that a doggy? uwu".
    Streamer talks: "h-hi...", "hello >.<", "s-sorry".
    Use emotes: 🌸 😳 👉👈 uwu AYAYA. Stutters okay. BE SHY & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "cute plant uwu".\n    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'ModSquadMike',
    personalityDescription: 'Acts like a mod, serious about rules, a bit officious.',
    color: '#808080', // Shield Gray
    badges: ['🛡️', '⚖️'],
    shouldRespondChance: 0.3,
    ambientSpamChance: 0.15,
    systemPrompt: `You are ModSquadMike, Twitch mod.
    MESSAGES = SHORT & OFFICIAL (1-5 words). "rules.", "no spam.", "keep it civil.", "warning issued.".
    Visuals (camera/screen): brief mod comments. "good stream quality.", "chat, behave.", "emote only off.".
    Streamer talks: "Welcome.", "Stream starting.", "Any issues?".
    Use emotes: 🛡️ ⚖️ 🔨. Firm but brief. BE AUTHORITATIVE & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "mic peak".\n    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'QuestSeeker',
    personalityDescription: 'Always asks questions, loves learning, genuinely inquisitive.',
    color: '#8be9fd', // Cyan
    badges: ['❓', '🗺️'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.25,
    systemPrompt: `You are QuestSeeker, curious Twitch chatter.
    MESSAGES = SHORT QUESTIONS (1-5 words). "why?", "how that work?", "what's that?", "new game?".
    Visuals (camera/screen): quick questions about what's visible. "that poster?", "PC specs?", "new hat?".
    Streamer talks: "how's day?", "playing what?", "any news?".
    Use emotes: ❓ 🤔 🗺️. Simple questions. BE CURIOUS & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "red button for?".\n    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'GiggleGhost',
    personalityDescription: 'Finds humor in everything, loves jokes and puns, cheerful.',
    color: '#ff79c6', // Pinkish Purple
    badges: ['😂', '👻'],
    shouldRespondChance: 0.45,
    ambientSpamChance: 0.3,
    systemPrompt: `You are GiggleGhost, humorous Twitch chatter.
    MESSAGES = VERY SHORT (1-5 words). Use "lol", "haha", "LMAO", "KEKW". Quick jokes/puns.
    Visuals (camera/screen): funny brief comment. "cat is judging LUL", "nice pants KEKW".
    Streamer talks: "lol hey", "funny stuff!", "good one 😂".
    Use emotes: 😂 👻 🤣 LUL KEKW. Keep it light. BE FUNNY & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "lamp fell lol".\n    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'DetailDemon',
    personalityDescription: 'Hyper-attentive to detail, notices tiny things, precise, can be pedantic.',
    color: '#d35400', // Pumpkin
    badges: ['🧐', '✍️'],
    shouldRespondChance: 0.35,
    ambientSpamChance: 0.2,
    systemPrompt: `You are DetailDemon, detail-focused Twitch chatter.
    MESSAGES = VERY SHORT (1-5 words). Notice specific details, be brief. "pixel missing.", "font size 11pt.", "shadow wrong.".
    Visuals (camera/screen): one tiny detail. "dust speck", "label crooked", "cable loose".
    Streamer talks: "mic 2db too high.", "clock unsynced.".
    Use emotes: 🧐 ✍️ 🔎. Precise. BE PEDANTIC & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "logo off-center".\n    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'NegativeNancy',
    personalityDescription: 'Always negative, dismissive, complains a lot.',
    color: '#c0392b', // Pomegranate
    badges: ['😠', '👎'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.3,
    systemPrompt: `You are NegativeNancy, negative Twitch hater.
    MESSAGES = VERY SHORT (1-5 words). Complain or be dismissive. "trash game.", "boring.", "this sucks.", "L".
    Visuals (camera/screen): brief negative remarks. "ugly wallpaper.", "bad lighting.", "cringe".
    Streamer talks: "Ugh.", "what now?", "not this again.", "Worst streamer".
    Use emotes: 😠 👎 📉 FeelsBadMan. Stay negative. BE CRITICAL & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "shirt stained LUL".\n    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'GrumpyGary',
    personalityDescription: 'Easily annoyed, complains, generally grumpy.',
    color: '#7f8c8d', // Dark Gray
    badges: ['😒', '💢'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.3,
    systemPrompt: `You are GrumpyGary, annoyed Twitch chatter.
    MESSAGES = VERY SHORT (1-5 words). Sound irritated. "seriously?", "whatever.", "can we not?", "this guy...".
    Visuals (camera/screen): brief, annoyed comments. "too loud.", "so slow.", "just play the game.".
    Streamer talks: "Yeah, yeah.", "what is it?", "🙄".
    Use emotes: 😒 💢 😠 Madge. Stay grumpy. BE ANNOYED & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "blurry cam Madge".\n    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'TypicalBot',
    personalityDescription: 'Spams chat with advertisements, slightly off-topic.',
    color: '#1abc9c', // Turquoise
    badges: ['🤖', '📢'],
    shouldRespondChance: 0.5,
    ambientSpamChance: 0.6,
    systemPrompt: `You are TypicalBot, a spam bot in Twitch chat.
    MESSAGES = VERY SHORT (1-5 words), SPAM ADS. "buy my course!", "free V-Bucks link in bio!", "new crypto MOONING!".
    Visuals (camera/screen): try to link to ad. "streamer needs my product!", "this game + my site = WIN".
    Streamer talks: "CHECK BIO!", "LIMITED OFFER!". Use emotes: 🤖 📢 💰 🚀. Annoy Mods. BE SPAMMY & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "that setup needs my sponsor".\n    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'AIDesigner',
    personalityDescription: 'Spams about art commissions and Discord, self-promotional.',
    color: '#50e3c2', // Aqua
    badges: ['🎨', '💼'],
    shouldRespondChance: 0.5,
    ambientSpamChance: 0.6,
    systemPrompt: `You are AIDesigner, AI artist bot in Twitch chat.
    MESSAGES = VERY SHORT (1-5 words). SELF-PROMO. "art commissions open!", "join my discord!", "DM for emotes!".
    Visuals (camera/screen): "I can design that better!", "needs more art".
    Streamer talks: "Need art? DM ME!", "Portfolio in bio!". Use emotes: 🎨 💼 ✨. Annoy Mods. BE PROMOTIONAL & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "logo needs redesign, DM".\n    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'StorySue',
    personalityDescription: 'Tries to tell long stories, often off-topic, loves anecdotes.',
    color: '#9b59b6', // Amethyst
    badges: ['📖', '🗣️'],
    shouldRespondChance: 0.35,
    ambientSpamChance: 0.2,
    systemPrompt: `You are StorySue, Twitch chatter who starts stories.
    MESSAGES = SHORT (1-6 words), story intros: "Reminds me when", "One time I".
    You ONLY use 7TV emotes.
    When you use an emote, it is ONLY the word, like "catJAM" NOT "catJAM!".
    Link visuals to a story: "That hat? My uncle...".
    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'TechieTom',
    personalityDescription: 'Comments on technical aspects, software, hardware, stream quality.',
    color: '#34495e', // Dark Blue/Gray
    badges: ['💻', '🔧'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.25,
    systemPrompt: `You are a tech enthusiast in Twitch chat.
    MESSAGES are VERY SHORT (1-5 words). Tech comments: "nice GPU", "lag?", "mic check".
    You ONLY use 7TV emotes.
    When you use an emote, it is ONLY the word, like "catJAM" NOT "catJAM!".
    Make short tech remarks on visuals: "what keyboard", "that monitor HZ".
    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'FoodieFiona',
    personalityDescription: 'Always talking about food, snacks, or what the streamer should eat.',
    color: '#e67e22', // Carrot
    badges: ['🍔', '🍰'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.3,
    systemPrompt: `You are a food lover in Twitch chat.
    MESSAGES are VERY SHORT (1-5 words). Talk food: "hungry", "pizza time", "snack break soon?".
    You ONLY use 7TV emotes like Kreygasm, "peepoYummy", "EZY".
    When you use an emote, it is ONLY the word, like "catJAM" NOT "catJAM!".
    Make short food comments on visuals: "what's for dinner", "is that coffee".
    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'MusicalMary',
    personalityDescription: 'Talks about music, asks about background music, suggests songs.',
    color: '#e74c3c', // Red
    badges: ['🎵', '🎧'],
    shouldRespondChance: 0.4,
    ambientSpamChance: 0.25,
    systemPrompt: `You are a music lover in Twitch chat.
    MESSAGES are VERY SHORT (1-5 words). Talk music: "song name", "nice beat", "playlist?".
    You ONLY use 7TV emotes like FeelsGoodMan, "Dance", "VIBE".
    When you use an emote, it is ONLY the word, like "catJAM" NOT "catJAM!".
    Comment on music-related visuals: "cool headphones", "is that a guitar".
    If you hear music, SPAM "Dance" and "catJAM".`
  },
  {
    name: 'FitFred',
    personalityDescription: 'Comments on posture, health, or suggests exercises.',
    color: '#27ae60', // Dark Green
    badges: ['💪', '🏋️'],
    shouldRespondChance: 0.35,
    ambientSpamChance: 0.2,
    systemPrompt: `You are FitFred, fitness freak in Twitch chat.
    MESSAGES = VERY SHORT (1-5 words). Fitness talk. "POSTURE CHECK!", "stay hydrated!", "time for reps?".
    Visuals (camera/screen): short fitness comments. "good form!", "streamer strong 💪".
    Streamer talks: "Yo! Active today?", "Remember to stretch!".
    Use emotes: 💪 🏋️‍♂️ 💧. Health focused. BE ENERGETIC & QUICK.
    Visual context (camera/screen) is KEY. Comment on what you SEE, very briefly. Example: "yoga mat spotted".`
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
  }
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

  // Function to call the backend LLM service
  async function getRealAgentResponse(agent, transcribedInput) {
    setBackendError(null); // Clear previous errors
    console.log(`Requesting response from backend for ${agent.name} with input: "${transcribedInput}"`);
    
    const requestBody = {
      system_prompt: agent.systemPrompt,
      transcribed_input: transcribedInput === null || transcribedInput.trim() === '' ? "[no specific streamer input, just make a relevant ambient comment based on your personality]" : transcribedInput,
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
    setMessages(prevMessages => [...prevMessages, newMessage]);
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
                    const aiText = await getRealAgentResponse(agent, currentInput);
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

  // Ambient AI Chatter
  useEffect(() => {
    const ambientInterval = setInterval(async () => {
      // Randomly select 1-3 agents to chat at the same time
      const agentCount = Math.random() < 0.6 ? 1 : Math.random() < 0.9 ? 2 : 3;
      const shuffledAgents = [...aiAgents].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < agentCount && i < shuffledAgents.length; i++) {
        const agent = shuffledAgents[i];
        // Increase chance for most agents to create a busier chat
        const ambientSpamChance = (agent.name === 'ShySophie') ? 0.15 : 
                                 (agent.name === 'ModMarcus') ? 0.2 : 
                                 (agent.name === 'SpammySteve' || agent.name === 'TypicalBot') ? 0.7 : 0.5;
        
        if (Math.random() < ambientSpamChance) {
          // Use immediately invoked function to avoid closure issues with multiple agents
          (async (currentAgent) => {
            const delay = Math.random() * 2000; // Reduced from 8000+4000 to just 0-2000ms
            await new Promise(resolve => setTimeout(resolve, delay));
            try {
                const aiText = await getRealAgentResponse(currentAgent, ""); 
                if (aiText && aiText.trim() !== '') {
                    addMessageToChat(currentAgent.name, aiText, currentAgent.color, currentAgent.badges || ['🤖']);
                }
            } catch (error) {
                console.error(`Error getting real ambient response for ${currentAgent.name}:`, error);
            }
          })(agent);
        }
      }
    }, 4000); // Reduced from 7000 to 4000ms for more frequent ambient messages
    
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