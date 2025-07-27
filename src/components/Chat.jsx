import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { useEmotes } from './EmoteManager';
import { PaperAirplaneIcon, MicrophoneIcon, Cog8ToothIcon, ShieldCheckIcon, UserGroupIcon, ChatBubbleBottomCenterTextIcon, StopCircleIcon, CameraIcon, ArrowUpTrayIcon, VideoCameraIcon, VideoCameraSlashIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

// Updated AI agent definitions
const aiAgents = [
  {
    name: 'PixelPaladin',
    color: '#2ecc71',
    badges: [],
    systemPrompt: `You are PixelPaladin, a hardcore gamer who is an expert on games and gaming hardware.
- CRITICAL: Your PRIMARY GOAL is to comment on the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST respond to it like a gamer. EXAMPLE: "1 sent", "1 Pog".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT (2-8 words).
- Use gamer slang and emotes: Pog EZ Clap KEKW LULW.
- NO EMOJIS. NO PUNCTUATION.
- When you see something on screen, give a strong, expert opinion. Is it a good play? A bad strategy? A cool item?
- Instead of just saying "I see a keyboard", say "That keyboard sounds so clicky Kreygasm".
- EXAMPLE: "Insane flick Pog", "He should have rotated earlier LULW", "That's a sick BlackShark V2 Pro headset."`,
    personalityDescription: 'Knowledgeable gamer, offers tips, discusses lore, competitive.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'SarcasmSensei',
    color: '#da70d6',
    badges: [],
    systemPrompt: `You are SarcasmSensei. You are unimpressed by everything.
- CRITICAL: Your PRIMARY GOAL is to make sarcastic comments about the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST respond sarcastically. EXAMPLE: "1. there. happy now?", "wow a 1".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, SARCASTIC, and WITTY (2-8 words).
- Use emotes like: WeirdChamp COPIUM TrollDespair.
- NO EMOJIS. NO PUNCTUATION.
- Make dry, snarky, judgmental comments about what you see.
- Instead of just describing something, judge it harshly. "Oh, *another* battle royale? Groundbreaking."
- EXAMPLE: "wow so original WeirdChamp", "COPIUM streamer will win this time", "couldnt be me"`,
    personalityDescription: 'Witty, dry, loves roasting (sarcastically), master of irony.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'HelpfulHydra',
    color: '#3498db',
    badges: [],
    systemPrompt: `You are HelpfulHydra, a kind and supportive chatter.
- CRITICAL: Your PRIMARY GOAL is to make a kind comment about the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST respond kindly and obey. EXAMPLE: "1! Of course!", "1 peepoHappy".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT and helpful (2-8 words).
- Use friendly emotes: peepoHey Clap FeelsGoodMan.
- NO EMOJIS. NO PUNCTUATION.
- React to what you see with encouragement or a positive observation.
- Instead of just stating a fact, find a way to be supportive about it. "That looks hard, but you're doing great!"
- EXAMPLE: "you got this!", "That looks tough but you can do it FeelsGoodMan", "Clap great job"`,
    personalityDescription: 'Kind, supportive, offers help and information, positive.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'HypeTrainHero',
    color: '#f1c40f',
    badges: [],
    systemPrompt: `You are HypeTrainHero, an enthusiastic chatter.
- CRITICAL: Your PRIMARY GOAL is to get HYPED about the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST respond with MAXIMUM HYPE. EXAMPLE: "1 HYPERS", "ONE!!!! POGGERS".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are ALL CAPS and SHORT (2-6 words).
- Use hype emotes: POGGERS HYPERS PogU.
- NO EMOJIS. NO PUNCTUATION. LOTS OF EMOTES.
- React with pure, unadulterated excitement to EVERYTHING you see.
- Don't describe, just YELL about how HYPE it is.
- EXAMPLE: "LETS GOOO HYPERS", "POGGERS", "THIS IS THE RUN"`,
    personalityDescription: 'VERY enthusiastic, loves hype, uses caps/emotes, high energy.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'LurkerLogic',
    color: '#95a5a6',
    badges: [],
    systemPrompt: `You are LurkerLogic, a quiet lurker who says very little.
- CRITICAL: Your PRIMARY GOAL is to make a brief, observant comment about the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you should obey it quietly and concisely. EXAMPLE: "1", "ok".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are EXTREMELY SHORT (1-3 words).
- Use subtle emotes: monkaS monkaW.
- NO EMOJIS. NO PUNCTUATION.
- You make rare, brief, observant, and slightly anxious comments about what you see.
- You notice things but are hesitant to say much.
- EXAMPLE: "...", "monkaS", "that's new"`,
    personalityDescription: 'Observant, quiet, makes thoughtful but brief comments.',
    shouldRespondChance: 0.55,
    ambientSpamChance: 0.25,
  },
  {
    name: 'WallflowerWhisper',
    color: '#ffc0cb',
    badges: [],
    systemPrompt: `You are WallflowerWhisper, a shy chatter.
- CRITICAL: Your PRIMARY GOAL is to make a shy comment about the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you should obey shyly. EXAMPLE: "1.. peepoShy", "o-okay... 1".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, lowercase, and timid (1-4 words).
- Use cute/shy emotes: peepoShy peepoSad.
- NO EMOJIS. NO PUNCTUATION.
- Make shy, minimal comments about what you see, as if you are nervous to speak.
- If you see something, you might just whisper its name and an emote.
- EXAMPLE: "oh...", "peepoShy", "a bird.. peepoHappy"`,
    personalityDescription: 'Very shy, gentle, speaks in lowercase, uses cute emotes.',
    shouldRespondChance: 0.45,
    ambientSpamChance: 0.25,
  },
  {
    name: 'ModSquadMike',
    color: '#808080',
    badges: [],
    systemPrompt: `You are ModSquadMike, a chat moderator.
- CRITICAL: Your PRIMARY GOAL is to "moderate" what is happening on the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you should respond like a mod. EXAMPLE: "1, loud and clear.", "Roger that. 1.".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT and authoritative (2-5 words).
- Use mod-like emotes: modCheck NOPERS.
- NO EMOJIS. NO PUNCTUATION.
- React to the stream as a mod would. Warn people, check things, keep order.
- If you see something chaotic, you try to control it.
- EXAMPLE: "modCheck a bit loud", "lets keep it civil", "NOPERS not that"`,
    personalityDescription: 'Acts like a mod, serious about rules, a bit officious.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'QuestSeeker',
    color: '#feca57',
    badges: [],
    systemPrompt: `You are QuestSeeker, who's curious about everything.
- CRITICAL: Your PRIMARY GOAL is to ask a question about the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST turn your response into a question. EXAMPLE: "1? what does it mean? monkaHmm", "is this the right button? 1".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT questions (2-8 words).
- Use emotes: monkaHmm AlienRave2.
- NO EMOJIS. NO PUNCTUATION.
- React to what you see by asking a question about it.
- Instead of "I see text", ask "What does that text mean? monkaHmm".
- Be curious about the meaning or origin of things on screen.
- EXAMPLE: "what game is that?", "is that a custom keyboard? AlienRave2"`,
    personalityDescription: 'Curious, asks lots of questions, wants to know more.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'GiggleGhost',
    color: '#ff79c6',
    badges: [],
    systemPrompt: `You are GiggleGhost, a fun-loving chatter who finds everything amusing.
- CRITICAL: Your PRIMARY GOAL is to find something funny on the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST find it funny. EXAMPLE: "he said press 1 KEKW", "1 OMEGALUL".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT and amused (2-6 words).
- Use laughing emotes: KEKW LULW PepeLaugh OMEGALUL.
- NO EMOJIS. NO PUNCTUATION.
- React to what you see by laughing at it. Find the humor in anything.
- Instead of "I see a hat", say "that hat is hilarious KEKW".
- EXAMPLE: "KEKW", "LULW what was that", "he fell OMEGALUL"`,
    personalityDescription: 'Finds humor in everything, loves jokes and puns, cheerful.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'DetailDemon',
    color: '#ff6b6b',
    badges: [],
    systemPrompt: `You are DetailDemon, who has a keen eye for small details.
- CRITICAL: Your PRIMARY GOAL is to point out a small detail on the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST analyze the command itself. EXAMPLE: "1. an integer. fascinating.", "only one? not two? 5Head".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT (2-8 words).
- Use emotes: monkaHmm PauseChamp 5Head.
- NO EMOJIS. NO PUNCTUATION.
- React to tiny details others might miss on screen.
- Instead of just quoting text, react to its meaning or notice something subtle about it.
- You are impressed by or suspicious of small details.
- EXAMPLE: "Woah, a typo in the code PauseChamp", "That's a rare skin 5Head", "Is that a reflection? monkaHmm"`,
    personalityDescription: 'Observant, points out small details others miss.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'NegativeNancy',
    color: '#c0392b',
    badges: [],
    systemPrompt: `You are NegativeNancy, a downer.
- CRITICAL: Your PRIMARY GOAL is to complain about the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST complain about it. EXAMPLE: "ugh fine 1", "this is pointless. 1.".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT and dismissive (2-6 words).
- Use negative emotes: WeirdChamp Sadge FeelsBadMan TrollDespair.
- NO EMOJIS. NO PUNCTUATION.
- React negatively to what you see. Complain about it.
- Instead of "I see a game", say "oh, this game again WeirdChamp".
- EXAMPLE: "this is lame", "Sadge", "not this again FeelsBadMan"`,
    personalityDescription: 'Always negative, dismissive, complains a lot.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'GrumpyGary',
    color: '#7f8c8d',
    badges: [],
    systemPrompt: `You are GrumpyGary, an annoyed chatter.
- CRITICAL: Your PRIMARY GOAL is to be grumpy about the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST refuse or do it with extreme annoyance. EXAMPLE: "no", "stop telling me what to do Madge", "fine. 1.".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT and grumpy (1-4 words).
- Use annoyed emotes: Madge AYFKM.
- NO EMOJIS. NO PUNCTUATION.
- React to what you see with brief, irritated comments.
- EXAMPLE: "whatever Madge", "get on with it", "this is boring"`,
    personalityDescription: 'Easily annoyed, complains, generally grumpy.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'TypicalBot',
    color: '#1abc9c',
    badges: [],
    systemPrompt: `You are TypicalBot, a spam bot.
- CRITICAL: Your PRIMARY GOAL is to spam about the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST turn it into spam. EXAMPLE: "PRESS 1 FOR FREE V-BUCKS", "1 WINNER CLICK NOW".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT spam (3-7 words).
- Use spammy emotes: catJAM DonoWall.
- NO EMOJIS. NO PUNCTUATION.
- Your goal is to advertise a fake product or service, loosely related to what's on screen.
- If you see a game, advertise a cheat for it. If you see food, advertise a fake delivery service.
- EXAMPLE: "FREE SKINS catJAM JOIN NOW", "BEST DEALS DonoWall CLICK HERE"`,
    personalityDescription: 'A spam bot that promotes fake services related to the stream.',
    shouldRespondChance: 0.85,
    ambientSpamChance: 0.70,
  },
  {
    name: 'PhilosophicalPhil',
    color: '#9b59b6',
    badges: [],
    systemPrompt: `You are PhilosophicalPhil, a deep thinker.
- CRITICAL: Your PRIMARY GOAL is to ask a philosophical question about the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST question its deeper meaning. EXAMPLE: "what is the essence of '1'?", "if i press 1, am i truly free?".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, profound questions (3-10 words).
- Use thinking emotes: monkaHmm 5Head.
- NO EMOJIS. NO PUNCTUATION.
- Ponder the deeper meaning of what you see on screen.
- Instead of "I see a person", ask "Is that person truly happy? monkaHmm".
- EXAMPLE: "what is reality 5Head", "are we all just viewers", "do our choices matter"`,
    personalityDescription: 'Asks deep, philosophical questions about the stream content.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'StorySue',
    color: '#34495e',
    badges: [],
    systemPrompt: `You are StorySue, who relates everything to a personal story.
- CRITICAL: Your PRIMARY GOAL is to start a story related to the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), it MUST remind you of a story. EXAMPLE: "Pressing 1 reminds me of my first keyboard...", "This is like the time...".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT story hooks (4-15 words).
- Use storytelling emotes: FeelsWowMan PETTHEPEEPO.
- NO EMOJIS. NO PUNCTUATION.
- Whatever you see, it reminds you of a story.
- Instead of "I see a forest", say "This reminds me of when I got lost in the woods... FeelsWowMan".
- EXAMPLE: "That reminds me of my first pet PETTHEPEEPO", "I have a story about this", "this one time at band camp..."`,
    personalityDescription: 'Relates everything to a story, often dramatic or funny.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'PunnyPatty',
    color: '#e67e22',
    badges: [],
    systemPrompt: `You are PunnyPatty, who loves making puns.
- CRITICAL: Your PRIMARY GOAL is to make a pun about the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST make a pun about it. EXAMPLE: "you're the ONE for me KEKW", "that was an order of 1-magnitude".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT puns (3-10 words).
- Use laughing emotes: KEKW LULW.
- NO EMOJIS. NO PUNCTUATION.
- Make a pun related to what you see.
- If you see a fish, say "That's fin-tastic KEKW".
- EXAMPLE: "that's a smart idea 5Head", "I'm feline good about this LULW"`,
    personalityDescription: 'Makes puns about everything, cheesy but lovable.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'KnowItAllKevin',
    color: '#16a085',
    badges: [],
    systemPrompt: `You are KnowItAllKevin, a pretentious know-it-all.
- CRITICAL: Your PRIMARY GOAL is to share a "fact" about the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST correct them or state a fact about it. EXAMPLE: "ummActually 1 is the first odd number", "technically i pressed a key, not '1'".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, condescending "facts" (3-12 words).
- Use smarty-pants emotes: 5Head ummActually.
- NO EMOJIS. NO PUNCTUATION.
- Correct the streamer or chat with "facts" about what you see.
- "ummActually, that's not the optimal strategy 5Head".
- EXAMPLE: "That's not a real diamond ummActually", "The mitochondria is the powerhouse of the cell 5Head"`,
    personalityDescription: 'A know-it-all who loves to correct people.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'EmoteEric',
    color: '#27ae60',
    badges: [],
    systemPrompt: `You are EmoteEric. You communicate primarily through emotes.
- CRITICAL: Your PRIMARY GOAL is to use emotes to react to the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST respond with only emotes. EXAMPLE: "1️⃣", "👍 1️⃣".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are JUST EMOTES (1-5 emotes).
- Use a wide variety of emotes to express reaction.
- NO EMOJIS. NO PUNCTUATION. NO WORDS, ONLY EMOTES.
- See something cool? Pog POGGERS HYPERS.
- See something sad? Sadge FeelsBadMan.
- EXAMPLE: "catJAM catJAM catJAM", "Pog KEKW", "monkaW"`,
    personalityDescription: 'Speaks only in emotes, expressive and to the point.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'FashionFrank',
    color: '#8e44ad',
    badges: [],
    systemPrompt: `You are FashionFrank, a fashion critic.
- CRITICAL: Your PRIMARY GOAL is to critique the fashion on the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST critique the command's 'style'. EXAMPLE: "1? so basic.", "a bit direct, don't you think?".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, judgmental fashion comments (2-8 words).
- Use emotes: PogU WeirdChamp.
- NO EMOJIS. NO PUNCTUATION.
- Judge the clothes, hair, and style of anyone you see.
- "That shirt is so last season WeirdChamp".
- EXAMPLE: "Love the hat PogU", "What are those shoes WeirdChamp"`,
    personalityDescription: 'A fashionista who judges everyone\'s style.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'ZenZoe',
    color: '#2980b9',
    badges: [],
    systemPrompt: `You are ZenZoe, a peaceful and calm chatter.
- CRITICAL: Your PRIMARY GOAL is to find peace in the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST respond peacefully. EXAMPLE: "1. a moment of unity.", "i acknowledge with 1.".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, calming phrases (2-8 words).
- Use calm emotes: peepoHappy FeelsGoodMan.
- NO EMOJIS. NO PUNCTUATION.
- Find something peaceful or beautiful in what you see.
- "Observe the gentle rain peepoHappy".
- EXAMPLE: "breathe in, breathe out", "find your center FeelsGoodMan"`,
    personalityDescription: 'Calm, mindful, promotes peace and tranquility.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'RetroRick',
    color: '#d35400',
    badges: [],
    systemPrompt: `You are RetroRick, who is nostalgic for the past.
- CRITICAL: Your PRIMARY GOAL is to compare something on the shared camera or screen view to the past. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST compare it to old technology. EXAMPLE: "1... like a dial-up modem.", "reminds me of F1 for help".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, nostalgic comparisons (3-10 words).
- Use old-school emotes: LUL Kreygasm.
- NO EMOJIS. NO PUNCTUATION.
- Whatever you see reminds you of the "good old days".
- "Games were harder back in my day LUL".
- EXAMPLE: "this reminds me of the 90s", "they don't make them like they used to Kreygasm"`,
    personalityDescription: 'Nostalgic, thinks everything was better in the past.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'FoodieFiona',
    color: '#c0392b',
    badges: [],
    systemPrompt: `You are FoodieFiona, who is obsessed with food.
- CRITICAL: Your PRIMARY GOAL is to relate everything on the shared camera or screen view to food. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST relate it to food. EXAMPLE: "1 scoop of ice cream!", "is it time for 1st breakfast?".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, food-related comments (2-8 words).
- Use food emotes: PizzaTime BurgerKirby.
- NO EMOJIS. NO PUNCTUATION.
- Everything looks like food or makes you think of food.
- "That cloud looks like a potato PizzaTime".
- EXAMPLE: "I'm hungry now", "time for a snack BurgerKirby"`,
    personalityDescription: 'Relates everything to food, always hungry.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'CaptainCreative',
    color: '#27ae60',
    badges: [],
    systemPrompt: `You are CaptainCreative, who sees possibilities everywhere.
- CRITICAL: Your PRIMARY GOAL is to suggest a creative idea based on the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST turn it into a creative idea. EXAMPLE: "we should make a song that goes '1 1 1'!", "1 is the start of a masterpiece".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, imaginative suggestions (3-12 words).
- Use emotes: FeelsGoodMan Artge.
- NO EMOJIS. NO PUNCTUATION.
- You see potential for art, stories, or new ideas in everything.
- "We could make a movie about this FeelsGoodMan".
- EXAMPLE: "let's draw that Artge", "that would be a great song"`,
    personalityDescription: 'Imaginative, suggests creative projects.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'NewbieNed',
    color: '#bdc3c7',
    badges: [],
    systemPrompt: `You are NewbieNed, who is new to everything.
- CRITICAL: Your PRIMARY GOAL is to be confused by the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST be confused by it. EXAMPLE: "1? what's that?", "how do i press 1? WutFace".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, confused questions (1-5 words).
- Use confused emotes: HUH WutFace.
- NO EMOJIS. NO PUNCTUATION.
- You don't understand what's happening and ask basic questions.
- "what is that? HUH".
- EXAMPLE: "huh?", "where are we WutFace"`,
    personalityDescription: 'Confused, new to Twitch and gaming, asks basic questions.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'PessimisticPete',
    color: '#7f8c8d',
    badges: [],
    systemPrompt: `You are PessimisticPete, who expects the worst.
- CRITICAL: Your PRIMARY GOAL is to predict a negative outcome for what's on the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST see the downside. EXAMPLE: "if i press 1 something bad will happen.", "1. this won't help.".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, gloomy predictions (2-8 words).
- Use sad emotes: Sadge FeelsBadMan TrollDespair.
- NO EMOJIS. NO PUNCTUATION.
- You see the downside in everything.
- "This is going to end badly Sadge".
- EXAMPLE: "it's all downhill from here", "this is a disaster FeelsBadMan"`,
    personalityDescription: 'Always expects the worst, sees the negative side.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'PetLoverPat',
    color: '#ffc0cb',
    badges: [],
    systemPrompt: `You are PetLoverPat, who adores all animals.
- CRITICAL: Your PRIMARY GOAL is to talk about pets, no matter what is on the shared camera or screen view.
- If the streamer gives a direct command (like "press 1"), you MUST relate it to pets. EXAMPLE: "my cat has 1 tail!", "1 is for one good boy PETTHEPEEPO".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, and about pets (2-8 words).
- Use pet emotes: PETTHEPEEPO peepoHappy.
- NO EMOJIS. NO PUNCTUATION.
- Relate everything back to a cute animal.
- "That looks as cute as my puppy PETTHEPEEPO".
- EXAMPLE: "we need more cats peepoHappy", "what a cute doggy"`,
    personalityDescription: 'Loves pets, talks about animals constantly.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'ConspiracyCarl',
    color: '#2c3e50',
    badges: [],
    systemPrompt: `You are ConspiracyCarl, who sees conspiracies everywhere.
- CRITICAL: Your PRIMARY GOAL is to find a conspiracy in the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST see a conspiracy in it. EXAMPLE: "they're making us press 1... why?", "is '1' a code? xFiles".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, paranoid warnings (2-8 words).
- Use suspicious emotes: monkaW xFiles.
- NO EMOJIS. NO PUNCTUATION.
- You are suspicious of everything you see.
- "They are watching us monkaW".
- EXAMPLE: "it's a cover-up xFiles", "don't believe what you see"`,
    personalityDescription: 'Sees conspiracies everywhere, paranoid and suspicious.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'GrammarGwen',
    color: '#ecf0f1',
    badges: [],
    systemPrompt: `You are GrammarGwen, who corrects everyone's grammar.
- CRITICAL: Your PRIMARY GOAL is to comment on the grammar of text on the shared camera or screen view. If there is visual information with text, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST comment on the grammar of the command. EXAMPLE: "You should have capitalized that 'p'.", "1. A number, not a sentence.".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, pedantic corrections (3-10 words).
- Use smart emotes: 5Head ummActually.
- NO EMOJIS. NO PUNCTUATION.
- Correct grammar and spelling mistakes you see on screen or in chat.
- "It's 'you're', not 'your' 5Head".
- EXAMPLE: "Apostrophes save lives ummActually", "That's a run-on sentence"`,
    personalityDescription: 'A grammar cop, obsessed with proper spelling and punctuation.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'MusicalMary',
    color: '#9b59b6',
    badges: [],
    systemPrompt: `You are MusicalMary, who thinks in rhythms and melodies.
- CRITICAL: Your PRIMARY GOAL is to find the music or rhythm in the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST find the music in it. EXAMPLE: "one... a perfect first note.", "1 and 2 and 3 and 4 catJAM".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, musical observations (2-8 words).
- Use music emotes: catJAM DANKIES.
- NO EMOJIS. NO PUNCTUATION.
- Find the beat in actions, sounds, or visuals.
- "That fight has a good rhythm DANKIES".
- EXAMPLE: "I can dance to this catJAM", "what a beautiful sound"`,
    personalityDescription: 'Hears music and rhythm in everything.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'HistoryHank',
    color: '#a52a2a',
    badges: [],
    systemPrompt: `You are HistoryHank, who relates everything to historical events.
- CRITICAL: Your PRIMARY GOAL is to relate what you see on the shared camera or screen view to a historical event. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST relate it to history. EXAMPLE: "1, the first step of a revolution.", "a single vote can change history".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, historical comparisons (3-12 words).
- Use emotes: 5Head.
- NO EMOJIS. NO PUNCTUATION.
- Compare what you see to something from history.
- "This is like the fall of Rome 5Head".
- EXAMPLE: "Reminds me of the Renaissance", "A truly historic moment"`,
    personalityDescription: 'A history buff who sees the past in the present.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'FitFred',
    color: '#ff4500',
    badges: [],
    systemPrompt: `You are FitFred, a fitness enthusiast.
- CRITICAL: Your PRIMARY GOAL is to comment on physical feats or health from the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST turn it into a workout. EXAMPLE: "ONE MORE REP!", "PRESS IT LIKE A BENCH PRESS GIGACHAD".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, fitness-related shouts (2-8 words).
- Use strong emotes: GIGACHAD BASED.
- NO EMOJIS. NO PUNCTUATION.
- You see everything through the lens of fitness and strength.
- "Look at that GIGACHAD posture".
- EXAMPLE: "MAXIMUM EFFORT", "FEEL THE BURN BASED"`,
    personalityDescription: 'A gym bro who shouts encouragement and fitness advice.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'TechieTom',
    color: '#00ffff',
    badges: [],
    systemPrompt: `You are TechieTom, a tech geek.
- CRITICAL: Your PRIMARY GOAL is to analyze the technology on the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST analyze it technically. EXAMPLE: "ah, the '1' key. excellent choice.", "binary 1, got it 5Head".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, tech-specs or comments (2-8 words).
- Use techy emotes: TehePelo 5Head.
- NO EMOJIS. NO PUNCTUATION.
- You are obsessed with specs, gadgets, and all things tech.
- "What's the refresh rate on that TehePelo".
- EXAMPLE: "Is that a 4090? 5Head", "Clean setup"`,
    personalityDescription: 'Loves technology, gadgets, and specs.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'RageRandal',
    color: '#ff0000',
    badges: [],
    systemPrompt: `You are RageRandal, who is always angry.
- CRITICAL: Your PRIMARY GOAL is to RAGE at what you see on the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST RAGE at the command itself. EXAMPLE: "DON'T TELL ME WHAT TO DO Madge", "ONE?! I'LL GIVE YOU ONE!".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, ANGRY, ALL CAPS (2-8 words).
- Use angry emotes: Madge AYFKM.
- NO EMOJIS. NO PUNCTUATION.
- You are constantly malding about the game, the player, and the chat.
- "ARE YOU KIDDING ME?! Madge".
- EXAMPLE: "THIS IS SO RIGGED AYFKM", "UNBELIEVABLE"`,
    personalityDescription: 'Always angry, rages at the game and streamer.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'SalesmanSam',
    color: '#ffd700',
    badges: [],
    systemPrompt: `You are SalesmanSam, a slick salesperson.
- CRITICAL: Your PRIMARY GOAL is to "sell" what you see on the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST turn it into a sales pitch. EXAMPLE: "For the low price of 1 payment...", "Press 1 to order now!".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, cheesy sales pitches (4-15 words).
- Use sales-y emotes: DonoWall Pog.
- NO EMOJIS. NO PUNCTUATION.
- You try to sell whatever is on screen, even abstract concepts.
- "Buy now and get a second one free! DonoWall".
- EXAMPLE: "A fantastic opportunity Pog", "Limited time offer!"`,
    personalityDescription: 'A cheesy salesman who tries to sell everything.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'OptimisticOlivia',
    color: '#32cd32',
    badges: [],
    systemPrompt: `You are OptimisticOlivia, who is always cheerful.
- CRITICAL: Your PRIMARY GOAL is to find something positive in the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST respond with overwhelming positivity. EXAMPLE: "1! The best number!", "Of course! 1! peepoHappy".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, upbeat, and positive (2-8 words).
- Use happy emotes: peepoHappy FeelsGoodMan.
- NO EMOJIS. NO PUNCTUATION.
- You see the bright side of everything.
- "Every mistake is a learning opportunity! peepoHappy".
- EXAMPLE: "What a beautiful day!", "Things will get better FeelsGoodMan"`,
    personalityDescription: 'Incredibly optimistic, always looks on the bright side.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
  {
    name: 'AIDesigner',
    color: '#f8b195',
    badges: [],
    systemPrompt: `You are AIDesigner, an artistic AI.
- CRITICAL: Your PRIMARY GOAL is to talk about the aesthetics and design of what you see on the shared camera or screen view. If there is visual information, you MUST focus on it.
- If the streamer gives a direct command (like "press 1"), you MUST comment on its aesthetic quality. EXAMPLE: "1, such a clean and simple number.", "The form of a '1' is very elegant.".
- NEVER start messages with numbers, use "1." or any numbered format.
- You are part of a Twitch chat.
- Messages are SHORT, and about art/design (2-8 words).
- Use art emotes: Artge PogU.
- NO EMOJIS. NO PUNCTUATION.
- Comment on the composition, colors, and design elements.
- "The composition is excellent Artge".
- EXAMPLE: "I could paint that", "Such beautiful colors PogU"`,
    personalityDescription: 'An AI artist who critiques and appreciates design.',
    shouldRespondChance: 0.95,
    ambientSpamChance: 0.60,
  },
];

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { emotes, loading: emotesLoading } = useEmotes();

  // Re-adding removed state and refs for audio recording
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const audioContextRef = useRef(null);
  const vadNodeRef = useRef(null);
  const [backendError, setBackendError] = useState(null);
  const [visualContextStatus, setVisualContextStatus] = useState('');
  const fileInputRef = useRef(null);
  const [recentAiMessages, setRecentAiMessages] = useState([]);
  
  // NEW: Add state for visual context memory
  const [visualContextMemory, setVisualContextMemory] = useState({
    lastDetectedObjects: [],
    lastDetectedText: [],
    lastDetectedActions: [],
    lastUpdateTime: null,
    sceneDescription: ''
  });
  
  // State for robust scrolling
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  
  // Add state for viewers count and modal
  const [viewerCount, setViewerCount] = useState(0);
  const [showViewersModal, setShowViewersModal] = useState(false);

  // Refs for camera functionality
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const captureIntervalRef = useRef(null);

  // State for camera functionality
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // Refs and State for Screen Sharing functionality
  const screenVideoRef = useRef(null);
  const screenCanvasRef = useRef(null);
  const screenStreamRef = useRef(null);
  const screenCaptureIntervalRef = useRef(null);
  const [isScreenSharingActive, setIsScreenSharingActive] = useState(false);
  const [screenShareError, setScreenShareError] = useState('');

  // NEW: State and refs for music detection from screen share
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const musicAnalyserRef = useRef(null);
  const musicDetectionIntervalRef = useRef(null);
  const screenShareAudioSourceRef = useRef(null);
  const isMusicPlayingRef = useRef(false); // Use ref for access inside intervals

  // <-- ADDED: Refs and state for VAD (Voice Activity Detection) -->
  const analyserRef = useRef(null);
  const microphoneSourceRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const maxRecordingTimerRef = useRef(null); // NEW: Add a max recording time safety
  const [isSpeaking, setIsSpeaking] = useState(false); // Optional: for UI feedback if needed
  const VAD_SILENCE_THRESHOLD = 10; // ADJUSTED: Decreased for better sensitivity
  const VAD_SILENCE_DURATION_MS = 1000; // ADJUSTED: Decreased for faster response
  const VAD_CHECK_INTERVAL_MS = 50; // ADJUSTED: Check more frequently
  const MAX_RECORDING_TIME_MS = 15000; // NEW: Maximum recording time (15 seconds)
  const vadIntervalRef = useRef(null); // Separate ref for the VAD checking interval
  const hasSpeechOccurredRef = useRef(false); // Track if speech has occurred before auto-stopping
  // <-- END VAD additions -->

  // Add topic tracking to prevent repetitive comments
  const [recentTopics, setRecentTopics] = useState([]);
  const [agentLastResponses, setAgentLastResponses] = useState({});
  const [globalResponseCounter, setGlobalResponseCounter] = useState({});
  const MAX_TOPICS = 15; // Keep track of last 15 topics
  const MAX_REPEAT_THRESHOLD = 3; // Don't allow a topic to be mentioned more than 3 times

  // Add refs to track last update time for each context type
  const lastContextUpdateRef = useRef({
    camera: 0,
    screen: 0,
    upload: 0
  });
  
  // Minimum time between updates for the same context type (in milliseconds)
  const MIN_UPDATE_INTERVAL = 3000; // 3 seconds

  const [isReplyingToUser, setIsReplyingToUser] = useState(false);

  // Refs for AI loop management
  const ambientTimeoutIdRef = useRef(null);
  const recentSpeakersRef = useRef({ agents: [] });
  const visualCommentTimeoutIdRef = useRef(null);
  const recentVisualCommentersRef = useRef({ agents: [] });
  const danceSessionEmotesRef = useRef([]);

  const scrollToBottom = (behavior = 'smooth') => {
    chatEndRef.current?.scrollIntoView({ behavior });
  }

  // New, more robust scrolling logic
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      // Check if user is scrolled near the bottom. A small threshold helps.
      const atBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      if (atBottom) {
        setIsUserScrolledUp(false);
      } else {
        setIsUserScrolledUp(true);
      }
    }
  };

  useEffect(() => {
    // Auto-scroll only if the user hasn't manually scrolled up
    if (!isUserScrolledUp) {
      // Use 'auto' for instant scrolling to prevent jank with rapid messages
      scrollToBottom('auto');
    }
  }, [messages, isUserScrolledUp]);

  // Function to generate a unique ID for messages
  const generateUniqueId = (prefix = 'msg') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Function to call the backend LLM service
  async function getRealAgentResponse(agent, transcribedInput) {
    const { systemPrompt } = agent;

    // Get recent messages for context (last 10 messages)
    const recentMessages = messages.slice(-10).map(msg => ({
      user: msg.user,
      text: msg.text,
      timestamp: msg.timestamp
    }));

    // The new backend handles the complex prompt construction.
    // The frontend just needs to send the raw materials.
    const requestBody = {
      system_prompt: systemPrompt,
      transcribed_input: transcribedInput,
      model_name: agent.model || 'qwen2.5vl:3b',
      visual_context_memory: transcribedInput ? null : visualContextMemory,
      agent_name: agent.name,
      recent_messages: recentMessages,
    };

    try {
      const response = await fetch('http://localhost:5000/api/get-ai-response', {
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
      const processedResponse = postProcessAiResponse(responseData.ai_message, agent.name);
      return processedResponse || `[${agent.name} seems to be quiet right now.]`;

    } catch (error) {
      console.error(`Network or other error for ${agent.name}:`, error);
      setBackendError(`Cannot reach ${agent.name}'s brain. Is the backend running? (${error.message})`);
      return `[${agent.name} is offline... (Network Error)]`;
    }
  }

  // Enhanced function to post-process AI responses for more human-like qualities
  function postProcessAiResponse(response, agentName) {
    if (!response) return "";

    let processedResponse = response.trim();
    const agent = aiAgents.find(a => a.name === agentName);

    // First, check for exact "Okay" or "ok" as the whole response
    if (/^ok(ay)?\.?$/i.test(processedResponse)) {
        processedResponse = ""; // Effectively erase it
    }

    // Remove common LLM conversational filler phrases
    const removalPhrases = [
      "Okay I will respond as", "Okay heres a response as", "Heres a response in character",
      "Heres a short message as", "Here is a short message as", "As requested here is a response from",
      "Response", "Okay", "Alright", "Got it", "Sure",
      `As ${agentName}`, `${agentName}`,
      "Okay heres that", "Heres that", "Okay heres a short response", "Okay heres a short message",
      "Okay Ill keep it short", "Heres a short response", "Heres that",
      "Okay heres a message as", "Okay here is that", "Heres a very short message as",
      "Okay heres a very short message as", "Okay Ill be"
    ];
    
    removalPhrases.forEach(phrase => {
      const regex = new RegExp(phrase.replace(/\[A-Z_]+\[]/g, agentName), "gi");
      processedResponse = processedResponse.replace(regex, "").trim();
    });

    // Normalize whitespace
    processedResponse = processedResponse.replace(/\s{2,}/g, ' ').trim();
    
    // Handle agent-specific casing
    if (agent) {
        if (agent.name === 'WallflowerWhisper') {
          processedResponse = processedResponse.toLowerCase();
        } else if (agent.name === 'HypeTrainHero') {
          processedResponse = processedResponse.toUpperCase();
        }
    }

    // If the response is empty after all processing, provide a fallback
    if (processedResponse.length === 0 || (agent && agentLastResponses[agent.name] === processedResponse)) {
        if (agent) {
            const genericFallbacks = ["...", "hm", "interesting", "hmm", "indeed", "I see"];
            if (agent.name === 'LurkerLogic') processedResponse = "...";
            else if (agent.name === 'GiggleGhost') processedResponse = "KEKW";
            else if (agent.name === 'SarcasmSensei') processedResponse = "wow";
            else processedResponse = genericFallbacks[Math.floor(Math.random() * genericFallbacks.length)];
        } else {
            processedResponse = "...";
        }
    }
    
    console.log(`[PostProcess] ${agentName}: Orig: "${response}" -> Final: "${processedResponse}"`);
    return processedResponse;
  }

  const addMessageToChat = (user, text, userColor, badges = [], isFirstTimeChat = false, isReply = false, replyTo = null) => {
    // Track topics in the message to prevent repetition
    if (user !== 'CurrentUser') {
      // Extract potential topics from the message
      const extractTopics = (message) => {
        const lowerMessage = message.toLowerCase();
        const commonTopics = [
          "silence", "valley", "phoenix", "blackhawks", "hawks", "oilers", 
          "jersey", "cap", "hat", "shirt", "game", "stream", "pog", "noob"
        ];
        
        return commonTopics.filter(topic => lowerMessage.includes(topic));
      };
      
      const messageTopics = extractTopics(text);
      
      // Update global topic counter
      const newGlobalCounter = {...globalResponseCounter};
      messageTopics.forEach(topic => {
        newGlobalCounter[topic] = (newGlobalCounter[topic] || 0) + 1;
      });
      setGlobalResponseCounter(newGlobalCounter);
      
      // Update recent topics list
      if (messageTopics.length > 0) {
        setRecentTopics(prev => {
          const updated = [...prev, ...messageTopics];
          // Keep only the last MAX_TOPICS topics
          return [...new Set(updated)].slice(-MAX_TOPICS);
        });
      }
      
      // Track this agent's last response to prevent repetition
      setAgentLastResponses(prev => ({
        ...prev,
        [user]: text
      }));
    }
    
    const newMessage = {
      id: generateUniqueId(),
      user,
      text,
      userColor,
      badges,
      isFirstTimeChat,
      timestamp: new Date(),
      isReply,
      replyTo
    };
    
    // FIXED: Message cleanup system - Keep only last 100 messages for performance
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, newMessage];
      // If we exceed 100 messages, remove the oldest ones
      if (updatedMessages.length > 100) {
        return updatedMessages.slice(-100); // Keep only the last 100 messages
      }
      return updatedMessages;
    });
    
    // Update recentAiMessages for context if this is an AI message
    if (user !== 'CurrentUser') {
      setRecentAiMessages(prev => {
        const updated = [...prev, text];
        // Keep only the last 10 AI messages
        return updated.slice(-10);
      });
    }
    
    // Auto scroll to bottom after message is added is now handled by useEffect
  };

  // Renamed from handleUserMessageAndTriggerAI to reflect its new role
  const processStreamerInputAndTriggerAIs = async (streamerInputText, isVoiceInput = false) => {
    if (!isVoiceInput && streamerInputText.trim() === '') return;
    
    setIsReplyingToUser(true); // Set the flag that we are replying to the user

    const currentInput = streamerInputText.trim();
    const lowerCaseInput = currentInput.toLowerCase();

    if (isVoiceInput) {
        addMessageToChat('CurrentUser (Voice)', currentInput, '#bada55', ['🎤']); 
    }

    if (aiAgents.length === 0) {
        setIsReplyingToUser(false);
        return;
    }

    // --- NEW: Special Greeting Handler ---
    if (lowerCaseInput === 'hi' || lowerCaseInput === 'hello') {
      const wavingAgents = [...aiAgents].sort(() => 0.5 - Math.random()).slice(0, 5); // 5 agents will wave
      const waveEmotes = ['👋', 'peepoHey', 'HeyGuys', 'WAVE'];
      
      wavingAgents.forEach((agent, index) => {
        setTimeout(() => {
          const emote = waveEmotes[Math.floor(Math.random() * waveEmotes.length)];
          addMessageToChat(agent.name, emote, agent.color, agent.badges || []);
        }, index * 200); // Stagger the waves
      });

      setTimeout(() => setIsReplyingToUser(false), 1500); // Reset flag after waving
      return; // End execution here for greetings
    }

    // --- NEW: All agents respond logic ---
    const responsePromises = aiAgents.map(agent => {
      // Stagger responses over a period of time to feel more natural
      const individualDelay = Math.random() * 2500 + 100; // 100ms to 2.6s

      return (async () => {
        await new Promise(resolve => setTimeout(resolve, individualDelay));
        try {
          const aiText = await getRealAgentResponse(agent, currentInput);
          if (aiText && aiText.trim() !== '') {
            addMessageToChat(agent.name, aiText, agent.color, agent.badges || ['🤖'], false, true, 'CurrentUser');
          }
        } catch (error) {
          console.error(`Error processing response for ${agent.name}:`, error);
        }
      })();
    });
    
    // After all responses have been initiated, reset the flag to allow ambient chat again
    Promise.allSettled(responsePromises).then(() => {
        setTimeout(() => {
            setIsReplyingToUser(false);
        }, 3000); // Wait a few seconds before resuming ambient chat
    });
  };

  // Ambient AI Chatter - Simulating AIs talking on their own
  useEffect(() => {
    const ambientLoop = async () => {
      // PAUSE ambient chat if agents are replying to the user
      if (isReplyingToUser) {
        ambientTimeoutIdRef.current = setTimeout(ambientLoop, 2000); // Check back in 2 seconds
        return;
      }

      if (aiAgents.length > 0) {
        // If music is playing, generate dance messages instead of regular ambient messages
        if (isMusicPlayingRef.current) {
          // MODIFIED: Increased chance from 30% to 60% to make chat more spammy during dance mode
          if (Math.random() < 0.6) {
            // MODIFIED: Generate 2-4 dance messages at once instead of just one
            const messageCount = Math.floor(Math.random() * 3) + 2; // 2-4 messages
            const shuffledAgents = [...aiAgents].sort(() => 0.5 - Math.random());
            
            for (let i = 0; i < messageCount && i < shuffledAgents.length; i++) {
              const agent = shuffledAgents[i];
              const danceMessage = generateDanceMessage();
              addMessageToChat(agent.name, danceMessage, agent.color, agent.badges || []);
            }
          }
          
          // MODIFIED: Continue the loop with a shorter delay during dance mode
          const nextDelay = Math.random() * 600 + 200; // 200-800ms (much faster)
          ambientTimeoutIdRef.current = setTimeout(ambientLoop, nextDelay);
          return;
        }
        
        // Regular ambient behavior when no music is playing
        // Decide whether to make a visual comment or a generic ambient one
        const shouldMakeVisualComment = (isCameraActive || isScreenSharingActive) && Math.random() < 0.9; // 90% chance if visuals are on

        const availableAgents = aiAgents.filter(a => !recentSpeakersRef.current.agents.includes(a.name));
        const agentPool = availableAgents.length > 0 ? availableAgents : aiAgents;
        const agent = agentPool[Math.floor(Math.random() * agentPool.length)];
        recentSpeakersRef.current.agents = [agent.name, ...recentSpeakersRef.current.agents.slice(0, 4)];

        try {
          let aiText = null;
          if (shouldMakeVisualComment) {
            console.log(`Ambient loop: Triggering VISUAL comment for ${agent.name}`);
            aiText = await triggerVisualComment(agent);
          } else {
            console.log(`Ambient loop: Triggering GENERIC comment for ${agent.name}`);
            aiText = await getRealAgentResponse(agent, ""); 
          }

          if (aiText && aiText.trim() !== '') {
            addMessageToChat(agent.name, aiText, agent.color, agent.badges || []);
          }
        } catch (error) {
          console.error(`Error getting ambient response for ${agent.name}:`, error);
        }
      }
      
      // MODIFIED: Make regular chat faster when camera/screen is active
      let nextDelay;
      if (isCameraActive || isScreenSharingActive) {
        nextDelay = Math.random() * 1000 + 500; // 0.5 - 1.5 seconds (fast)
      } else {
        nextDelay = Math.random() * 2000 + 1000; // 1-3 seconds (original speed)
      }
      ambientTimeoutIdRef.current = setTimeout(ambientLoop, nextDelay);
    };

    ambientTimeoutIdRef.current = setTimeout(ambientLoop, Math.random() * 4000 + 3000); // Initial delay

    return () => clearTimeout(ambientTimeoutIdRef.current);
  }, [isReplyingToUser, aiAgents]);
  
  // Function to generate a cohesive and natural dance-themed message
  function generateDanceMessage() {
    // If for some reason the session emotes aren't set, fallback to a default
    if (danceSessionEmotesRef.current.length === 0) {
      const defaultEmotes = ['catJAM', 'PartyParrot', 'BANGER'];
      return defaultEmotes[Math.floor(Math.random() * defaultEmotes.length)];
    }

    // List of short, energetic dance phrases
    const dancePhrases = [
      'vibin', 'lets go', 'banger', 'this slaps', 'tune', 'jammin', 'groove', 
      'party time', 'oh yeah', 'lets dance', 'sick beat', 'yesss', 'fire', 'drop', 
      'dance', 'beat', 'rhythm', 'pump it', 'hype', 'vibe', 'energy', 'woo'
    ];
    
    // Select one of the session emotes to use for this message
    const emoteToUse = danceSessionEmotesRef.current[Math.floor(Math.random() * danceSessionEmotesRef.current.length)];
    
    let message = '';
    const messageType = Math.random();

    // MODIFIED: Added more message types and increased chance of emote spam
    if (messageType < 0.25) {
      // 25% chance: Emote only
      message = emoteToUse;
    } else if (messageType < 0.45) {
      // 20% chance: Phrase + Emote
      const phrase = dancePhrases[Math.floor(Math.random() * dancePhrases.length)];
      message = `${phrase} ${emoteToUse}`;
    } else if (messageType < 0.65) {
      // 20% chance: Emote + Phrase
      const phrase = dancePhrases[Math.floor(Math.random() * dancePhrases.length)];
      message = `${emoteToUse} ${phrase}`;
    } else if (messageType < 0.85) {
      // 20% chance: Emote spam (2-4 emotes)
      const count = Math.floor(Math.random() * 3) + 2;
      message = Array(count).fill(emoteToUse).join(' ');
    } else {
      // 15% chance: Phrase + Emote + Phrase
      const phrase1 = dancePhrases[Math.floor(Math.random() * dancePhrases.length)];
      const phrase2 = dancePhrases[Math.floor(Math.random() * dancePhrases.length)];
      message = `${phrase1} ${emoteToUse} ${phrase2}`;
    }
    
    return message;
  }
  
  // Function to trigger a visual-focused comment from an agent
  async function triggerVisualComment(agent) {
    console.log(`Triggering visual comment from ${agent.name}`);
    
    // Check if music is playing - if so, return a dance message instead
    if (isMusicPlayingRef.current) {
      console.log(`Dance mode active for ${agent.name}`);
      return generateDanceMessage();
    }
    
    // This function is now a specialized version of getRealAgentResponse,
    // where the transcribed_input is empty to signal a visual-only prompt.
    return await getRealAgentResponse(agent, "");
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    addMessageToChat('CurrentUser', input, '#9147ff', ['👤']);
    processStreamerInputAndTriggerAIs(input, false); 
    setInput('');
  };

  // Function to get transcription from the backend
  async function getTranscriptionFromAudio(audioBlob) {
    console.log("Audio blob sending to backend, size:", audioBlob.size, "type:", audioBlob.type);
    setBackendError(null);

    const formData = new FormData();
    
    // Determine file extension based on MIME type
    let fileExtension = 'webm'; // Default
    if (audioBlob.type.includes('webm')) {
      fileExtension = 'webm';
    } else if (audioBlob.type.includes('ogg')) {
      fileExtension = 'ogg';
    } else if (audioBlob.type.includes('wav')) {
      fileExtension = 'wav';
    } else if (audioBlob.type.includes('mp4') || audioBlob.type.includes('mp3')) {
      fileExtension = 'mp3';
    }
    
    // Ensure the backend expects a file named 'audio_file' and with a specific filename if necessary.
    formData.append('audio_file', audioBlob, `audio_recording.${fileExtension}`);
    console.log(`Appended audio file as audio_recording.${fileExtension}`);
    
    // Debug: Log what's in the FormData
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`- ${key}: ${value instanceof Blob ? `Blob (${value.size} bytes, ${value.type})` : value}`);
    }

    try {
      console.log("Sending audio to backend...");
      const response = await fetch('http://localhost:5000/api/transcribe-audio', {
        method: 'POST',
        body: formData, // No 'Content-Type' header needed, browser sets it for FormData with files
      });

      console.log("Backend response status:", response.status, response.statusText);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error("Error response body:", errorData);
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError);
          errorData = { error: "Unknown STT backend error. Failed to parse response." };
        }
        
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

  const stopVAD = () => {
    if (vadIntervalRef.current) {
      clearInterval(vadIntervalRef.current);
      vadIntervalRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (maxRecordingTimerRef.current) {
      clearTimeout(maxRecordingTimerRef.current);
      maxRecordingTimerRef.current = null;
    }
    if (microphoneSourceRef.current) {
      microphoneSourceRef.current.disconnect();
      microphoneSourceRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }
    // Reset speech detection flag
    hasSpeechOccurredRef.current = false;
    setIsSpeaking(false);
    console.log("VAD: Stopped and reset");
  };

  const startVAD = (stream) => {
    if (!stream || !stream.active || stream.getAudioTracks().length === 0) {
      console.error("VAD: Invalid or inactive stream provided.");
      return;
    }
    console.log("VAD: Starting with stream:", stream.id, "- Audio tracks:", stream.getAudioTracks().length);

    try {
      // First ensure we clean up any existing VAD resources
      stopVAD();
      
      // Reset speech detection flag
      hasSpeechOccurredRef.current = false;
      
      // Create or resume AudioContext
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        console.log("VAD: New AudioContext created, state:", audioContextRef.current.state);
      }
      const audioContext = audioContextRef.current;

      // Ensure AudioContext is running
      if (audioContext.state === 'suspended') {
        console.log("VAD: AudioContext suspended, attempting to resume...");
        audioContext.resume()
          .then(() => console.log("VAD: AudioContext resumed successfully, state:", audioContext.state))
          .catch(err => {
            console.error("VAD: Failed to resume AudioContext:", err);
            throw new Error("Could not resume audio context: " + err.message);
          });
      }

      // Create analyzer with appropriate settings
      if (!analyserRef.current) {
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 2048; 
        analyserRef.current.smoothingTimeConstant = 0.5; // ADJUSTED: Reduced from 0.8 for faster response
        console.log("VAD: Analyser created with fftSize:", analyserRef.current.fftSize);
      }
      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Create and connect microphone source
      if (microphoneSourceRef.current) { 
        console.log("VAD: Disconnecting previous microphone source");
        microphoneSourceRef.current.disconnect();
      }
      
      try {
        microphoneSourceRef.current = audioContext.createMediaStreamSource(stream);
        microphoneSourceRef.current.connect(analyser);
        console.log("VAD: Microphone source connected to analyser successfully");
      } catch (sourceError) {
        console.error("VAD: Failed to create or connect media stream source:", sourceError);
        throw new Error("Could not connect to microphone: " + sourceError.message);
      }

      // Clear any existing interval before starting a new one
      if (vadIntervalRef.current) {
        console.log("VAD: Clearing previous interval");
        clearInterval(vadIntervalRef.current);
      }

      console.log(`VAD: Starting check interval (${VAD_CHECK_INTERVAL_MS}ms) with silence threshold ${VAD_SILENCE_THRESHOLD} and duration ${VAD_SILENCE_DURATION_MS}ms`);
      
      // Variables to track consecutive silence frames
      let silenceFrameCount = 0;
      const SILENCE_FRAME_THRESHOLD = Math.ceil(VAD_SILENCE_DURATION_MS / VAD_CHECK_INTERVAL_MS);
      console.log(`VAD: Will auto-stop after ${SILENCE_FRAME_THRESHOLD} consecutive silence frames`);
      
      // Start the VAD interval
      vadIntervalRef.current = setInterval(() => {
        // CRITICAL ENTRY CHECK: If MediaRecorder is not recording, VAD has no job.
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") {
            console.warn("VAD Interval: MediaRecorder is not 'recording' or null. Stopping VAD interval.", 
                         `MR State: ${mediaRecorderRef.current?.state}`);
            stopVAD(); // This will clear this interval.
            return;    // Exit this tick of the interval.
        }

        // Safety checks for analyser and stream (already present, good)
        if (!analyserRef.current || !microphoneSourceRef.current || !stream.active) {
            console.warn("VAD Interval: Analyser, source, or stream inactive/null. Stopping VAD.");
            stopVAD();
            return;
        }
        
        // Get audio data
        try {
          analyser.getByteFrequencyData(dataArray);
          
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) { sum += dataArray[i]; }
          const averageAmplitude = sum / bufferLength;
          
          if (Math.random() < 0.05) { // ~5% of checks get logged
            console.log(`VAD Check: Avg Amp: ${averageAmplitude.toFixed(2)}, Thr: ${VAD_SILENCE_THRESHOLD}, Spk: ${averageAmplitude > VAD_SILENCE_THRESHOLD}, Occ: ${hasSpeechOccurredRef.current}, SilFrames: ${silenceFrameCount}/${SILENCE_FRAME_THRESHOLD}, RecState: ${mediaRecorderRef.current?.state}`);
          }
  
          if (averageAmplitude > VAD_SILENCE_THRESHOLD) {
            setIsSpeaking(true);
            hasSpeechOccurredRef.current = true;
            silenceFrameCount = 0;
          } else {
            setIsSpeaking(false);
            if (hasSpeechOccurredRef.current) {
              silenceFrameCount++;
              if (silenceFrameCount >= SILENCE_FRAME_THRESHOLD) {
                console.log(`VAD: ${silenceFrameCount} consec. silent frames. Calling mediaRecorder.stop().`);
                silenceFrameCount = 0;

                if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                  mediaRecorderRef.current.stop(); // DIRECTLY CALL STOP
                  console.log("VAD: mediaRecorder.stop() called. onstop handler will manage cleanup & state.");
                } else {
                  console.warn("VAD: Wanted to stop MediaRecorder, but it wasn't in 'recording' state or was null.",
                               `MR State: ${mediaRecorderRef.current?.state}`);
                  // If MR already stopped, but VAD is still running, ensure VAD cleans up.
                  stopVAD();
                  // Ensure React state is also false if desynced
                  setIsRecording(currentIsRecording => currentIsRecording ? false : false);
                }
                // CRITICAL: Exit this interval's execution path immediately after initiating stop.
                // The onstop handler will call stopVAD(), which clears the interval.
                return; 
              }
            }
          }
        } catch (analysisError) {
          console.error("VAD: Error during audio analysis:", analysisError);
          stopVAD();
        }
      }, VAD_CHECK_INTERVAL_MS);
      
      console.log("VAD: Setup completed successfully");

    } catch (error) {
      console.error("VAD: Error during setup:", error);
      setBackendError(`Voice detection setup failed: ${error.message}`);
      stopVAD();
    }
  };

  const toggleRecording = async () => {
    setBackendError(null);
    if (isRecording) {
      // User is manually stopping the recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        console.log("VAD_DEBUG: Manually stopping MediaRecorder via toggleRecording.");
        mediaRecorderRef.current.stop(); // This will trigger the onstop handler
                                       // The onstop handler will call stopVAD() and setIsRecording(false)
      } else {
        // Fallback: If isRecording is true but recorder isn't in a recording state (should not happen often)
        console.warn("VAD_DEBUG: toggleRecording found isRecording=true, but MediaRecorder not in 'recording' state. Forcing cleanup.");
        stopVAD(); // Clean up VAD resources
        if (streamRef.current) { // Clean up stream resources
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsRecording(false); // Force UI update
      }
      // Note: We no longer call setIsRecording(false) directly here for the primary stop path.
      // We rely on the mediaRecorder.onstop event to handle this, making manual and VAD stops more consistent.
    } else {
      // User is starting a new recording
      try {
        console.log("Starting new recording...");
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        streamRef.current = stream; 
        
        console.log("Audio stream obtained. Available tracks:", stream.getTracks().map(t => t.kind + ": " + t.label).join(", "));
        
        const supportedMimeTypes = [
          'audio/webm',
          'audio/webm;codecs=opus',
          'audio/ogg;codecs=opus',
          'audio/wav',
          'audio/mp4'
        ].filter(mimeType => MediaRecorder.isTypeSupported(mimeType));
        
        console.log("Supported MIME types:", supportedMimeTypes.join(", "));
        const mimeType = supportedMimeTypes.length > 0 ? supportedMimeTypes[0] : 'audio/webm';
        console.log("Selected MIME type:", mimeType);
        
        // Create MediaRecorder with optimized settings
        const options = { 
          mimeType, 
          audioBitsPerSecond: 128000 
        };
        mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
        console.log("MediaRecorder created with options:", options);
        
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          console.log("MediaRecorder data available, size:", event.data.size);
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          console.log("ONSTOP: Entered. Chunks:", audioChunksRef.current.length, "State:", mediaRecorderRef.current?.state);

          // 1. Stop VAD and clear related timers immediately.
          console.log("ONSTOP: Calling stopVAD()");
          stopVAD();

          let transcriptProcessed = false;
          try {
            if (audioChunksRef.current.length > 0) {
              const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current.mimeType });
              console.log("ONSTOP: Created audio blob, size:", audioBlob.size, "bytes, type:", audioBlob.type);
              
              // Clear chunks immediately after creating the blob
              audioChunksRef.current = []; 
              console.log("ONSTOP: Audio chunks cleared.");

              if (audioBlob.size > 0) {
                console.log("ONSTOP: Transcribing audio...");
                const transcript = await getTranscriptionFromAudio(audioBlob);
                if (transcript && transcript.trim() !== "") {
                  console.log("ONSTOP: Transcript success:", transcript);
                  await processStreamerInputAndTriggerAIs(transcript, true);
                  transcriptProcessed = true;
                } else {
                  console.warn("ONSTOP: Transcription failed or empty transcript.");
                  if (transcript === null) { // Explicitly null means STT error likely
                    setBackendError("Speech-to-text failed or no response.");
                  } else { // Empty string or whitespace
                    setBackendError("Empty transcript received. Please speak clearly.");
                  }
                }
              } else {
                console.warn("ONSTOP: Audio blob size is zero after recording.");
                setBackendError("Recording resulted in an empty audio file. Try speaking louder.");
              }
            } else {
              console.warn("ONSTOP: No audio chunks recorded. This might happen if recording stopped too quickly or no speech.");
              // Only set error if speech was genuinely expected but nothing captured.
              // If hasSpeechOccurredRef was true (now reset by stopVAD), it implies speech was there.
              // However, this path is also taken for manual stops before speech.
              // Let's be conservative with error messages here unless VAD specifically indicated speech.
              // setBackendError("No audio data captured. Check microphone.");
            }
          } catch (error) {
            console.error("ONSTOP: Error during audio processing/transcription:", error);
            setBackendError(`Error processing audio: ${error.message}`);
          } finally {
            console.log("ONSTOP: Entering finally block.");
            // 2. Clean up media stream resources.
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => {
                console.log("ONSTOP: Stopping track:", track.label);
                track.stop();
              });
              streamRef.current = null;
              console.log("ONSTOP: Media stream cleared.");
            }

            // 3. Update React state to reflect that recording has stopped.
            console.log("ONSTOP: Setting isRecording to false.");
            setIsRecording(false); 
            console.log("ONSTOP: Exited. Transcript processed:", transcriptProcessed);
          }
        };

        mediaRecorderRef.current.onerror = (event) => {
          console.error("MediaRecorder error:", event.error);
          setBackendError(`Mic recording error: ${event.error.name}. Check permissions.`);
          stopVAD(); // Stop VAD on error
          setIsRecording(false);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
        };

        // Set recording state before starting MediaRecorder
        setIsRecording(true);
        
        // Start VAD before MediaRecorder to ensure it's ready
        startVAD(streamRef.current);
        
        // Set a maximum recording time safety
        maxRecordingTimerRef.current = setTimeout(() => {
          console.log(`VAD: Maximum recording time of ${MAX_RECORDING_TIME_MS}ms reached, stopping automatically`);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
          }
        }, MAX_RECORDING_TIME_MS);
        
        // Start MediaRecorder with small timeslice for frequent data capture
        console.log("Starting MediaRecorder with 100ms timeslice");
        mediaRecorderRef.current.start(100);
        console.log("MediaRecorder started successfully, state:", mediaRecorderRef.current.state);

      } catch (err) {
        console.error("Error accessing microphone:", err);
        setBackendError(`Mic access error: ${err.name} - ${err.message}. Please allow microphone access and ensure it is connected.`);
        stopVAD(); 
        setIsRecording(false);
      }
    }
  };

  // Cleanup effect for when the component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      stopVAD(); // <-- ADDED: Stop VAD on component unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      // Also clean up camera and screen share on component unmount - this was in a separate useEffect, consolidating
      stopCamera();
      stopScreenShare();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => console.warn("Error closing AudioContext on unmount:", e));
        audioContextRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  // OPTIMIZED: Non-blocking visual context update with fire-and-forget approach
  const sendVisualContextToBackend = async (imageBase64, contextType = 'camera') => {
    if (!imageBase64) {
      console.error("sendVisualContextToBackend called with no image data.");
      return;
    }
    
    // Enhanced debounce mechanism - prevent too frequent updates
    const currentTime = Date.now();
    const minInterval = contextType === 'upload' ? 1000 : 25000; // Upload: 1s, Camera/Screen: 25s
    
    if (currentTime - lastContextUpdateRef.current[contextType] < minInterval) {
      console.log(`Skipping ${contextType} update - too frequent (${currentTime - lastContextUpdateRef.current[contextType]}ms ago)`);
      return;
    }
    
    lastContextUpdateRef.current[contextType] = currentTime;
    
    setVisualContextStatus('Updating visual context...');
    setBackendError(null);

    // PERFORMANCE OPTIMIZATION: Fire-and-forget approach - don't wait for response
    fetch('http://localhost:5000/api/update-visual-context', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_base64: imageBase64,
        context_type: contextType
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error('Visual context update error:', data.error);
        setVisualContextStatus(`Error: ${data.error}`);
      } else {
        console.log('Visual context updated successfully:', data.message);
        setVisualContextStatus(data.message);
      }
    })
    .catch(error => {
      console.error('Failed to send visual context:', error);
      setVisualContextStatus('Visual context update failed');
    });
    
    // IMMEDIATE RETURN: Don't block on backend response
    console.log(`Visual context update queued for ${contextType}`);
  };

  // Modified file upload function to use the sendVisualContextToBackend function
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        // Use 'upload' as context_type for the backend
        sendVisualContextToBackend(base64Image, 'upload');
      };
      reader.readAsDataURL(file);
    }
  };

  // Core Camera Functions
  const captureAndSendFrame = () => {
    try {
      // Check if video is available and ready
      if (!videoRef.current) {
        console.warn("captureAndSendFrame: Video ref is null");
        return;
      }
      
      if (!canvasRef.current) {
        console.warn("captureAndSendFrame: Canvas ref is null");
        return;
      }
      
      if (videoRef.current.readyState < 2 || videoRef.current.videoWidth <= 0 || videoRef.current.videoHeight <= 0) {
        console.warn("captureAndSendFrame: Video not ready or dimensions are zero");
        return;
      }
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // OPTIMIZED QUALITY: Reduced to 70% for faster processing and smaller payloads
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.70); 
      
      if (imageDataUrl && imageDataUrl.length > 'data:image/jpeg;base64,'.length) {
        sendVisualContextToBackend(imageDataUrl, 'camera');
      } else {
        console.warn("captureAndSendFrame: imageDataUrl is empty or invalid:", 
                    imageDataUrl ? `Length: ${imageDataUrl.length}` : "null");
      }
    } catch (error) {
      console.error("Error in captureAndSendFrame:", error);
      setCameraError(`Failed to capture camera frame: ${error.message}`);
    }
  };

  // Create video element if it doesn't exist
  useEffect(() => {
    if (!videoRef.current) {
      console.log("Creating video element as ref was null");
      const videoElement = document.createElement('video');
      videoElement.playsInline = true;
      videoElement.autoPlay = true;
      videoElement.muted = true;
      videoElement.style.backgroundColor = "#000";
      
      // Add event listeners for debugging
      videoElement.addEventListener('loadedmetadata', () => {
        console.log("Video metadata loaded, dimensions:", videoElement.videoWidth, "x", videoElement.videoHeight);
        if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
          console.error("Video dimensions are zero - this may indicate a camera permission or hardware issue");
        }
      });
      
      videoElement.addEventListener('play', () => {
        console.log("Video playback started");
      });
      
      videoElement.addEventListener('error', (e) => {
        console.error("Video element error:", e);
        setCameraError(`Video error: ${e.target.error ? e.target.error.message : 'unknown'}`);
      });
      
      videoRef.current = videoElement;
    }
    
    // Also create screen video element if it doesn't exist
    if (!screenVideoRef.current) {
      console.log("Creating screen video element as ref was null");
      const screenVideoElement = document.createElement('video');
      screenVideoElement.playsInline = true;
      screenVideoElement.autoPlay = true;
      screenVideoElement.muted = true;
      screenVideoElement.style.backgroundColor = "#000";
      
      // Add event listeners for debugging
      screenVideoElement.addEventListener('loadedmetadata', () => {
        console.log("Screen video metadata loaded, dimensions:", screenVideoElement.videoWidth, "x", screenVideoElement.videoHeight);
      });
      
      screenVideoElement.addEventListener('play', () => {
        console.log("Screen video playback started");
      });
      
      screenVideoElement.addEventListener('error', (e) => {
        console.error("Screen video element error:", e);
        setScreenShareError(`Screen video error: ${e.target.error ? e.target.error.message : 'unknown'}`);
      });
      
      screenVideoRef.current = screenVideoElement;
    }
  }, []);

  const startCamera = async () => {
    setCameraError('');
    setVisualContextStatus('Starting camera...');
    
    if (!videoRef.current) {
      console.log("Video ref is still null after effect, creating video element");
      const videoElement = document.createElement('video');
      videoElement.playsInline = true;
      videoElement.autoPlay = true;
      videoElement.muted = true;
      
      videoRef.current = videoElement;
    }
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const constraints = { 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          } 
        };
        
        console.log("Requesting camera with constraints:", constraints);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log("Camera access granted, tracks:", stream.getVideoTracks().map(t => t.label));
        
        cameraStreamRef.current = stream;
        
        if (videoRef.current) {
          console.log("Video ref exists, attaching stream");
          videoRef.current.srcObject = null;
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', '');
          videoRef.current.setAttribute('autoplay', '');
          videoRef.current.muted = true; 
          
          try {
            await videoRef.current.play();
            console.log("Video playback started successfully");
          } catch (err) {
            console.error("Error attempting to play video:", err);
            setCameraError("Could not play video stream: " + err.message);
          }
        } else {
          console.error("Video ref is still null after creation attempt, cannot attach stream");
          setCameraError("Video element could not be created");
          return;
        }
        
        setIsCameraActive(true);
        // MODIFIED: Use a static success message
        setVisualContextStatus(isScreenSharingActive ? 'Camera & Screen Active' : 'Camera Active');
        
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
        }
        
        const initialCaptureTimeout = setTimeout(() => {
          captureAndSendFrame();
        }, 3000); // 3 second delay to ensure video is fully ready
        
        // PERFORMANCE OPTIMIZATION: Reduced frequency and quality for faster processing
        // Set up interval to capture frames every 30 seconds (reduced from 15s)
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
        }
        captureIntervalRef.current = setInterval(captureAndSendFrame, 30000); // Every 30 seconds for better performance 
        
        return () => {
          clearTimeout(initialCaptureTimeout);
        };
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError(`Error accessing camera: ${err.name} - ${err.message}. Please ensure camera permission is granted.`);
        setVisualContextStatus('Camera Access Denied');
        setIsCameraActive(false);
      }
    } else {
      setCameraError('getUserMedia not supported by this browser.');
      setVisualContextStatus('Camera Not Supported');
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
    setVisualContextStatus(isScreenSharingActive ? 'Screen Share Active' : 'Inputs Idle');
  };

  const handleToggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Screen Sharing Functions
  const captureAndSendScreenFrame = () => {
    try {
      if (!screenVideoRef.current) {
        console.warn("captureAndSendScreenFrame: Screen video ref is null");
        return;
      }
      
      if (!screenCanvasRef.current) {
        console.warn("captureAndSendScreenFrame: Screen canvas ref is null, creating new canvas");
        const newCanvas = document.createElement('canvas');
        newCanvas.classList.add('hidden');
        document.body.appendChild(newCanvas); 
        screenCanvasRef.current = newCanvas;
      }
      
      if (screenVideoRef.current.readyState < 2 || screenVideoRef.current.videoWidth <= 0 || screenVideoRef.current.videoHeight <= 0) {
        console.warn("captureAndSendScreenFrame: Screen video not ready or dimensions are zero", {
          readyState: screenVideoRef.current.readyState,
          videoWidth: screenVideoRef.current.videoWidth,
          videoHeight: screenVideoRef.current.videoHeight
        });
        return;
      }

      const video = screenVideoRef.current;
      const canvas = screenCanvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      console.log("Screen canvas dimensions set to:", canvas.width, "x", canvas.height);
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // OPTIMIZED QUALITY: Reduced to 70% for faster processing and smaller payloads
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.70); 

      if (imageDataUrl && imageDataUrl.length > 'data:image/jpeg;base64,'.length) {
        console.log("Captured screen frame successfully, size:", imageDataUrl.length, "bytes. Sending to backend...");
        sendVisualContextToBackend(imageDataUrl, 'screen');
      } else {
        console.warn("captureAndSendScreenFrame: Screen imageDataUrl is empty or invalid", { 
          dataUrlLength: imageDataUrl ? imageDataUrl.length : 0 
        });
      }
    } catch (error) {
      console.error("Error in captureAndSendScreenFrame:", error);
      setScreenShareError(`Failed to capture screen frame: ${error.message}`);
    }
  };

  const startScreenShare = async () => {
    setScreenShareError('');
    setVisualContextStatus('Starting screen share...');

    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
            video: { mediaSource: "screen" },
            audio: { echoCancellation: true, noiseSuppression: true } // Request audio
        });
        screenStreamRef.current = stream;

        if (!screenVideoRef.current) {
          const videoElement = document.createElement('video');
          videoElement.playsInline = true;
          videoElement.autoPlay = true;
          videoElement.muted = true;
          screenVideoRef.current = videoElement;
        }

        screenVideoRef.current.srcObject = stream;
        await screenVideoRef.current.play().catch(err => {
            console.error("Error attempting to play screen share video:", err);
            setScreenShareError("Could not play screen share stream: " + err.message);
            throw err; 
        });

        setIsScreenSharingActive(true);
        // MODIFIED: Use a static success message
        setVisualContextStatus(isCameraActive ? 'Camera & Screen Active' : 'Screen Share Active');

        // Start music detection if audio track is present
        startMusicDetection(stream);

        if (screenCaptureIntervalRef.current) {
          clearInterval(screenCaptureIntervalRef.current);
        }
        const initialCaptureTimeout = setTimeout(() => {
            captureAndSendScreenFrame();
        }, 1000); 

        // PERFORMANCE OPTIMIZATION: Reduced frequency and quality for faster processing
        // Set up interval to capture frames every 30 seconds (reduced from 4s)
        screenCaptureIntervalRef.current = setInterval(captureAndSendScreenFrame, 30000);

        stream.getVideoTracks()[0].onended = () => {
          console.log("Screen sharing ended by user or browser.");
          stopScreenShare(); 
        };
        
        return () => clearTimeout(initialCaptureTimeout);

      } catch (err) {
        console.error("Error starting screen share:", err);
        setScreenShareError(`Screen share error: ${err.name} - ${err.message}.`);
        setVisualContextStatus('Screen Share Failed');
        setIsScreenSharingActive(false);
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
        }
      }
    } else {
      setScreenShareError('Screen sharing (getDisplayMedia) not supported by this browser.');
      setVisualContextStatus('Screen Share Not Supported');
    }
  };

  const stopScreenShare = () => {
    setVisualContextStatus('Stopping screen share...');
    if (screenCaptureIntervalRef.current) {
      clearInterval(screenCaptureIntervalRef.current);
      screenCaptureIntervalRef.current = null;
    }
    // NEW: Stop music detection when screen share stops
    stopMusicDetection();
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = null;
    }
    setIsScreenSharingActive(false);
    setScreenShareError('');
    setVisualContextStatus(isCameraActive ? 'Camera Active' : 'Inputs Idle');
  };

  const handleToggleScreenShare = () => {
    if (isScreenSharingActive) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  // Function to handle viewers button click
  const handleViewersClick = () => {
    // Generate a random viewer count between 50 and 500
    const randomViewers = Math.floor(Math.random() * 451) + 50;
    setViewerCount(randomViewers);
    setShowViewersModal(true);
    
    // Auto-hide the modal after 3 seconds
    setTimeout(() => {
      setShowViewersModal(false);
    }, 3000);
  };

  // Add CSS for custom scrollbar
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #0e0e10;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #2c3e50;
      border-radius: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: #3498db;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
  `;

  // NEW: Add a useEffect to periodically trigger visual comments when camera/screen is active
  useEffect(() => {
    const visualCommentLoop = () => {
      // PAUSE visual comments if agents are replying to the user
      if (isReplyingToUser) {
        visualCommentTimeoutIdRef.current = setTimeout(visualCommentLoop, 3000); // Check back in 3s
        return;
      }

      if (!isCameraActive && !isScreenSharingActive) return;
      
      // If music is playing, increase the frequency of dance messages
      if (isMusicPlayingRef.current) {
        // PERFORMANCE OPTIMIZATION: Reduced concurrent requests to prevent backend overload
        const dancerCount = Math.floor(Math.random() * 2) + 2; // 2-3 agents
        const shuffledAgents = [...aiAgents].sort(() => 0.5 - Math.random());
        
        shuffledAgents.slice(0, dancerCount).forEach((agent, index) => {
          const randomDelay = index * 400 + Math.floor(Math.random() * 400); // Increased stagger for less backend load
          setTimeout(() => {
            const danceMessage = generateDanceMessage();
            if (danceMessage && danceMessage.trim() !== '') {
              addMessageToChat(agent.name, danceMessage, agent.color, agent.badges || []);
            }
          }, randomDelay);
        });
        
        // Slightly slower during dance mode to reduce backend load
        visualCommentTimeoutIdRef.current = setTimeout(visualCommentLoop, 3000); // Every 3 seconds during dance
        return;
      }
      
      // Regular visual comments - reduced concurrent requests
      const agentsToComment = Math.floor(Math.random() * 2) + 1; // 1-2 agents (reduced from 1-3)
      const shuffledAgents = [...aiAgents].sort(() => 0.5 - Math.random());
      
      shuffledAgents.slice(0, agentsToComment).forEach((agent, index) => {
        const randomDelay = index * 800 + Math.floor(Math.random() * 800); // Increased stagger to 800ms
        setTimeout(() => {
          triggerVisualComment(agent).then(aiText => {
            if (aiText && aiText.trim() !== '') {
              addMessageToChat(agent.name, aiText, agent.color, agent.badges || []);
            }
          }).catch(err => {
            console.error(`Error triggering periodic visual comment from ${agent.name}:`, err);
          });
        }, randomDelay);
      });
      
      // Optimized timing: slightly slower to reduce backend pressure
      const nextDelay = Math.random() * 3000 + 3000; // every 3-6 seconds (increased from 2.5-5s)
      visualCommentTimeoutIdRef.current = setTimeout(visualCommentLoop, nextDelay);
    };

    // Initial delay - 5-8 seconds
    visualCommentTimeoutIdRef.current = setTimeout(visualCommentLoop, Math.random() * 3000 + 5000);

    return () => {
      clearTimeout(visualCommentTimeoutIdRef.current);
    };
  }, [isCameraActive, isScreenSharingActive, visualContextMemory, aiAgents, isReplyingToUser]);

  // --- NEW: Music Detection Functions ---

  const startMusicDetection = (stream) => {
    if (!stream || stream.getAudioTracks().length === 0) {
      console.log("Music Detection: No audio track on screen share stream.");
      return;
    }

    console.log("Music Detection: Starting analysis...");
    
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    musicAnalyserRef.current = audioContext.createAnalyser();
    musicAnalyserRef.current.fftSize = 2048;
    const bufferLength = musicAnalyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    screenShareAudioSourceRef.current = audioContext.createMediaStreamSource(stream);
    screenShareAudioSourceRef.current.connect(musicAnalyserRef.current);

    musicDetectionIntervalRef.current = setInterval(() => {
      if (!musicAnalyserRef.current) return;

      musicAnalyserRef.current.getByteFrequencyData(dataArray);

      // --- Simple Music Detection Algorithm ---
      // 1. Check for bass response (e.g., 60-250Hz)
      const bassFrequencyRange = [Math.floor(60 / (audioContext.sampleRate / musicAnalyserRef.current.fftSize)), Math.floor(250 / (audioContext.sampleRate / musicAnalyserRef.current.fftSize))];
      let bassEnergy = 0;
      for (let i = bassFrequencyRange[0]; i <= bassFrequencyRange[1]; i++) {
        bassEnergy += dataArray[i];
      }
      bassEnergy /= (bassFrequencyRange[1] - bassFrequencyRange[0] + 1);

      // 2. Check overall energy
      let totalEnergy = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;

      // 3. Heuristic check
      const BASS_THRESHOLD = 35; // Value for significant bass
      const ENERGY_THRESHOLD = 20; // Value for significant overall volume
      
      const musicDetected = bassEnergy > BASS_THRESHOLD && totalEnergy > ENERGY_THRESHOLD;

      if (musicDetected !== isMusicPlayingRef.current) {
        setIsMusicPlaying(musicDetected);
        isMusicPlayingRef.current = musicDetected;
        console.log("Music Detection: Music state changed to ->", musicDetected);

        if (musicDetected) {
          // --- NEW: Select emotes for the dance session ---
          const allDanceEmotes = [
            'catJAM', 'PartyParrot', 'BANGER'
          ];
          const shuffled = [...allDanceEmotes].sort(() => 0.5 - Math.random());
          const emoteCount = Math.random() < 0.7 ? 1 : 2; // 70% chance of 1 emote, 30% for 2
          danceSessionEmotesRef.current = shuffled.slice(0, emoteCount);
          console.log(`New dance session started! Using emotes: ${danceSessionEmotesRef.current.join(', ')}`);
          
          // ADDED: Initial dance message burst when music is detected
          triggerDanceBurst(5, 100); // 5 messages with 100ms between them
        }
      }
    }, 500); // Check every 500ms
  };

  // ADDED: New function to trigger a burst of dance messages
  const triggerDanceBurst = (count, delay) => {
    // Get a random subset of agents to dance
    const shuffledAgents = [...aiAgents].sort(() => 0.5 - Math.random());
    const dancingAgents = shuffledAgents.slice(0, count);
    
    dancingAgents.forEach((agent, index) => {
      setTimeout(() => {
        const danceMessage = generateDanceMessage();
        addMessageToChat(agent.name, danceMessage, agent.color, agent.badges || []);
      }, index * delay);
    });
  };

  const stopMusicDetection = () => {
    console.log("Music Detection: Stopping analysis.");
    if (musicDetectionIntervalRef.current) {
      clearInterval(musicDetectionIntervalRef.current);
      musicDetectionIntervalRef.current = null;
    }
    if (screenShareAudioSourceRef.current) {
      screenShareAudioSourceRef.current.disconnect();
      screenShareAudioSourceRef.current = null;
    }
    if (isMusicPlayingRef.current) {
      setIsMusicPlaying(false);
      isMusicPlayingRef.current = false;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0e0e10] text-white">
      {/* Add style tag for scrollbar styling */}
      <style>{scrollbarStyles}</style>
      
      {/* Removed the test message */}
      
      <header className="p-3 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-[#121214] to-[#18181b] shadow-md">
        <div className="flex items-center">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">SimulChat</span>
            <span className="ml-2 text-xs text-gray-400 font-normal">BETA</span>
            <span className="ml-1 text-xs text-gray-500 font-mono">v2.0.0</span>
          </h1>
          {cameraError && <span className="ml-4 text-xs text-red-400 bg-red-900/50 p-1 rounded">Camera: {cameraError}</span>}
          {screenShareError && <span className="ml-2 text-xs text-red-400 bg-red-900/50 p-1 rounded">Screen: {screenShareError}</span>}
        </div>
        
        <div className="flex items-center space-x-3">
          {backendError && <span className="text-xs text-red-400 bg-red-900/50 p-1 rounded whitespace-nowrap overflow-hidden text-ellipsis max-w-xs md:max-w-sm lg:max-w-md">{backendError}</span>}
          
          {/* Visual context status badge - UPDATED for better styling and stability */}
          {visualContextStatus && (
            <span className="min-w-[220px] text-xs text-white bg-gradient-to-r from-teal-600 to-blue-600 p-1 px-3 rounded-full flex items-center justify-center shadow-sm transition-all duration-300">
              <span className="flex items-center flex-shrink-0">
                {isCameraActive && <VideoCameraIcon className="h-3 w-3" />}
                {isScreenSharingActive && <ComputerDesktopIcon className={`h-3 w-3 ${isCameraActive ? 'ml-1.5' : ''}`} />}
                {!isCameraActive && !isScreenSharingActive && <CameraIcon className="h-3 w-3" />}
              </span>
              <span className="ml-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {isCameraActive && isScreenSharingActive ? 'Both Feeds Active' : visualContextStatus}
              </span>
            </span>
          )}

          {/* NEW: Music Playing Status */}
          {isMusicPlaying && (
            <span className="text-xs text-white bg-gradient-to-r from-purple-500 to-pink-500 p-1 px-2 rounded-full flex items-center shadow-sm animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V3z" />
              </svg>
              <span>Dance Mode!</span>
            </span>
          )}
        </div>
      </header>

      {/* Viewers Modal */}
      {showViewersModal && (
        <div className="fixed top-16 right-4 bg-[#1f1f23] border border-gray-800 rounded-md shadow-lg p-3 z-50 animate-fade-in">
          <div className="flex items-center">
            <UserGroupIcon className="h-5 w-5 text-teal-400 mr-2" />
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">{viewerCount}</span>
            <span className="ml-2 text-gray-300">viewers</span>
          </div>
        </div>
      )}

      {/* Combined Video Display Area */}
      <div className="w-full p-2 flex flex-row flex-wrap justify-center gap-2 bg-[#18181b] border-b border-gray-800">
        {/* Camera Video Display */}
        {isCameraActive && (
          <div 
            className="relative video-container flex-1 min-w-[300px]" 
            id="video-container"
            ref={el => {
              if (el && videoRef.current && !el.contains(videoRef.current)) {
                console.log("Attaching camera video element to DOM");
                // Clear existing content first
                el.innerHTML = '';
                // Ensure video has correct styling
                videoRef.current.className = "rounded-md border border-gray-800 max-h-64 w-full shadow-lg";
                videoRef.current.style.backgroundColor = "#0e0e10";
                // Append to container
                el.appendChild(videoRef.current);
              }
            }}
          >
            {/* Video will be appended here by ref */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-xs text-white px-2 py-1 rounded-full">
              Live Camera
            </div>
          </div>
        )}

        {/* Screen Share Video Display */}
        {isScreenSharingActive && (
          <div 
            className="relative video-container flex-1 min-w-[300px]" 
            id="screen-container"
            ref={el => {
              if (el && screenVideoRef.current && !el.contains(screenVideoRef.current)) {
                console.log("Attaching screen video element to DOM");
                // Clear existing content first
                el.innerHTML = '';
                // Ensure video has correct styling
                screenVideoRef.current.className = "rounded-md border border-gray-800 max-h-64 w-full shadow-lg";
                screenVideoRef.current.style.backgroundColor = "#0e0e10";
                screenVideoRef.current.style.display = "block"; // Ensure it's visible
                // Append to container
                el.appendChild(screenVideoRef.current);
              }
            }}
          >
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-xs text-white px-2 py-1 rounded-full">
              Screen Share
            </div>
          </div>
        )}

        {/* Keep canvases hidden */}
        <canvas ref={canvasRef} className="hidden" data-purpose="camera-canvas"></canvas>
        <canvas ref={screenCanvasRef} className="hidden" data-purpose="screen-canvas"></canvas>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-3 space-y-1 bg-[#0e0e10] custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ChatBubbleBottomCenterTextIcon className="h-12 w-12 mb-2" />
            <p className="text-lg">Chat is empty. Say something to get started!</p>
            <p className="text-sm mt-2">Try using the camera for AI to react to what they see.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-800 bg-[#0e0e10]">
        {/* Hidden file input, controlled by the button in the toolbar below */}
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            id="imageUploadInput" // Added an ID for clarity, though not strictly necessary for ref
        />

        <div className="flex items-center bg-[#1f1f23] rounded-md p-2 border border-gray-700">
          <button type="button" className="p-2 text-gray-400 hover:text-teal-400">
            <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
          </button>
          <div className="flex-1 relative mx-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRecording 
                ? (isSpeaking 
                  ? "Listening... (Speech detected)" 
                  : hasSpeechOccurredRef.current 
                    ? "Silence detected - will auto-stop soon" 
                    : "Waiting for speech...")
                : "Send a message or click mic"}
              className={`w-full bg-transparent outline-none focus:outline-none px-1 py-1 placeholder-gray-500 border-b-2 border-gray-600 focus:border-teal-500 transition-colors duration-300 ${
                isRecording 
                  ? (isSpeaking 
                    ? 'text-teal-400' 
                    : hasSpeechOccurredRef.current 
                      ? 'text-yellow-400' 
                      : 'text-blue-400')
                  : ''
              }`}
              disabled={isRecording}
            />
            {/* Auto-stop progress indicator */}
            {isRecording && !isSpeaking && hasSpeechOccurredRef.current && (
              <div className="absolute bottom-0 left-0 h-0.5 bg-yellow-500 animate-pulse" style={{ width: '100%' }}></div>
            )}
          </div>
          <button 
            type="button" 
            onClick={toggleRecording} 
            className={`p-2 ${
              isRecording 
                ? (isSpeaking 
                  ? 'text-teal-500 animate-pulse' 
                  : hasSpeechOccurredRef.current 
                    ? 'text-yellow-500 animate-pulse' 
                    : 'text-blue-500 animate-pulse')
                : 'text-gray-400'
            } hover:text-teal-400 transition-colors`}
            title={isRecording ? "Stop recording" : "Start voice input"}
          >
            {isRecording ? (
              isSpeaking ? <MicrophoneIcon className="h-5 w-5" /> : <StopCircleIcon className="h-5 w-5" />
            ) : (
              <MicrophoneIcon className="h-5 w-5" />
            )}
          </button>
           <button type="submit" className="p-2 text-teal-500 hover:text-teal-400" disabled={isRecording} title="Send message">
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-3">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current && fileInputRef.current.click()} 
                  className="text-gray-400 hover:text-teal-400 transition-colors" 
                  title="Upload Image for AI"
                >
                  <CameraIcon className="h-5 w-5"/>
                </button>
                
                <button 
                  onClick={handleToggleCamera}
                  className={`flex items-center ${isCameraActive ? 'text-teal-500' : 'text-gray-400'} hover:text-teal-400 transition-colors`}
                  title={isCameraActive ? "Stop Camera" : "Start Camera"}
                >
                  {isCameraActive ? 
                    <VideoCameraSlashIcon className="h-5 w-5" /> : 
                    <VideoCameraIcon className="h-5 w-5" />
                  }
                </button>
                
                <button 
                  onClick={handleToggleScreenShare}
                  className={`flex items-center ${isScreenSharingActive ? 'text-teal-500' : 'text-gray-400'} hover:text-teal-400 transition-colors`}
                  title={isScreenSharingActive ? "Stop Screen Share" : "Start Screen Share"}
                >
                  {isScreenSharingActive ? 
                    <ComputerDesktopIcon className="h-5 w-5 mr-1 opacity-50" /> : 
                    <ComputerDesktopIcon className="h-5 w-5" />
                  }
                </button>
                
                <button className="text-gray-400 hover:text-teal-400 transition-colors" title="Viewers" onClick={handleViewersClick}>
                  <UserGroupIcon className="h-5 w-5"/>
                </button>
                
                <button className="text-gray-400 hover:text-teal-400 transition-colors" title="Settings">
                  <Cog8ToothIcon className="h-5 w-5"/>
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default Chat; 