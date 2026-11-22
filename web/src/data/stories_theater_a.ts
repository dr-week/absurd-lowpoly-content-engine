import type { TopicOption } from '../types';

export const THEATER_STORIES_A: readonly TopicOption[] = [
  {
    id: 'theater_vip_parking_auction',
    title: 'VIP REFUSES ₹20 PARKING—GUARD AUCTIONS HIS CAR TO TWO AUTO DRIVERS',
    angle: 'petty-spiral',
    brand: 'Theater Status Duel',
    trendHook: 'Keith Johnstone Status Seesaw + Nukkad Natak NPC Cross-Talk',
    visualStyle: 'cctv-dashcam',
    pitch:
      'A loud VIP in dark sunglasses refuses to pay ₹20 parking, yelling "Jaanta hai mera baap kaun hai?"—so the unbothered gate guard calmly puts his luxury SUV on a ₹150 street auction to two auto drivers right in front of him.',
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Wide gate confrontation', action: 'A loud VIP in oversized sunglasses honks at a bamboo parking barrier, waving a finger at a tiny bored guard.', caption: 'Jaanta Hai Kaun Hoon?' },
      { frame: 2, position: 'Top Center', framing: 'Two-shot status clash', action: 'The guard calmly taps the ₹20 cardboard sign without blinking while two auto drivers lean in listening.', caption: 'Sirf Bees Rupaye Sir.' },
      { frame: 3, position: 'Top Right', framing: 'Medium street chorus', action: 'The guard picks up a dusty megaphone and announces a live auction for the VIP’s gleaming SUV starting at ₹100.', caption: 'Gaadi Nilami: ₹100!' },
      { frame: 4, position: 'Bottom Left', framing: 'NPC-to-NPC ping-pong', action: 'Two auto drivers start bidding seriously against each other while inspecting the SUV tires like seasoned buyers.', caption: 'Ek Sau Pachaas!' },
      { frame: 5, position: 'Bottom Center', framing: 'Close-up panic', action: 'The VIP scrambles out of the driver seat patting his pockets frantically for a ₹20 note as the barrier speaker beeps.', caption: 'Bees Rupaye Kahan Gaye?!' },
      { frame: 6, position: 'Bottom Right', framing: 'Wide reversal payoff', action: 'The winning auto driver tosses ₹200 to the guard and calmly tells the VIP to sit in the back seat.', caption: 'Peeche Baitho Bhaiya!' },
    ],
    shots: [
      {
        shot: 1, visual: 'Frame-left, a loud VIP leans out of a shiny SUV window jabbing his finger at a tiny parking guard (frame-right).', sfx: 'Loud horn honk', hindi: 'जानता है मेरा बाप कौन है?',
        turns: [
          { speaker: 'PROTAGONIST: VIP', role: 'protagonist', voice: 'booming arrogant shout', delivery: 'on-screen lip-sync, frame-left, glaring right', hindi: 'जानता है मेरा बाप कौन है?' },
          { speaker: 'NPC-1: GUARD', role: 'npc1', voice: 'flat bored monotone', delivery: 'on-screen lip-sync, frame-right, tapping ₹20 board', hindi: 'बीस रुपये दो, फिर बता देना।' },
        ],
      },
      {
        shot: 2, visual: 'The guard lifts a dusty megaphone toward two curious auto drivers standing beside the booth.', sfx: 'Megaphone feedback screech', hindi: 'चमचमाती गाड़ी की नीलामी सौ रुपये से!',
        turns: [{ speaker: 'NPC-1: GUARD', role: 'npc1', voice: 'echoing auctioneer megaphone', delivery: 'on-screen lip-sync, holding megaphone', hindi: 'चमचमाती गाड़ी की नीलामी सौ रुपये से!' }],
      },
      {
        shot: 3, visual: 'Auto Driver 1 (frame-left) kicks the SUV tire while Auto Driver 2 (frame-right) raises two fingers.', sfx: 'Tire thump and street chatter', hindi: 'एक सौ बीस! डेढ़ सौ मेरी तरफ से!',
        turns: [
          { speaker: 'NPC-1: AUTO DRIVER 1', role: 'npc1', voice: 'raspy enthusiastic bid', delivery: 'on-screen lip-sync, frame-left, looking at Driver 2', hindi: 'एक सौ बीस रुपये, टायर बढ़िया है!' },
          { speaker: 'NPC-2: AUTO DRIVER 2', role: 'npc2', voice: 'sharp competitive shout', delivery: 'on-screen lip-sync, frame-right, raising hand', hindi: 'डेढ़ सौ मेरी तरफ से, चाबी दे!' },
        ],
      },
      {
        shot: 4, visual: 'Electronic parking barrier screen flashes "SOLD" with a cheerful chime as the VIP jumps out sweating.', sfx: 'Bright arcade ding', hindi: 'बोली पक्की हुई, बधाई हो।',
        turns: [{ speaker: 'ENTITY: BARRIER SPEAKER', role: 'entity', voice: 'cheerful robotic chime', delivery: 'diegetic gate loudspeaker', hindi: 'बोली पक्की हुई, अगली गाड़ी लाएं।' }],
      },
      {
        shot: 5, visual: 'Close-up of the VIP frantically pulling lint and a crumpled ₹20 note from his pocket.', sfx: 'Frantic pocket rustle', hindi: 'अरे रुको, बीस रुपये ले लो भाई!',
        turns: [{ speaker: 'PROTAGONIST: VIP', role: 'protagonist', voice: 'cracking panicked plea', delivery: 'on-screen lip-sync, eyes wide', hindi: 'अरे रुको, बीस रुपये ले लो भाई!' }],
      },
      {
        shot: 6, visual: 'Auto Driver 2 climbs into the SUV driver seat, adjusts the mirror, and nods toward the back door.', sfx: 'Engine rev, instant hard cut to black', hindi: 'पीछे बैठो, मीटर से छोड़ दूंगा।',
        turns: [{ speaker: 'NPC-2: AUTO DRIVER 2', role: 'npc2', voice: 'calm deadpan hospitality', delivery: 'on-screen lip-sync, adjusting mirror', hindi: 'पीछे बैठो, मीटर से छोड़ दूंगा।' }],
      },
    ],
  },
  {
    id: 'theater_gym_bro_steel_bucket',
    title: 'GYM BRO CAN’T LIFT ONE STEEL BUCKET—TWO CHAIWALAS RUN LIVE BETS',
    angle: 'over-engineer',
    brand: 'Nukkad Natak Chorus',
    trendHook: 'Stanislavski Physical Action + Two-NPC Live Betting Commentary',
    visualStyle: 'ps1-1998',
    pitch:
      'A protein-shaker gym bro chalks his hands like an Olympic weightlifter to move a half-full steel water bucket—while two roadside chaiwalas whisper live odds and his smartwatch loudly congratulates him for burning 0.2 calories.',
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Heroic low-angle setup', action: 'A sleeveless gym bro slaps white chalk clouds onto his palms staring intensely at an ordinary dented steel water bucket.', caption: 'Olympic Chalk For 1 Bucket!' },
      { frame: 2, position: 'Top Center', framing: 'NPC-to-NPC side shot', action: 'Two chaiwalas lean on their counter whispering odds and slapping a ₹10 note onto the table.', caption: 'Das Rupaye—Nahi Uthegi!' },
      { frame: 3, position: 'Top Right', framing: 'Extreme strain close-up', action: 'The gym bro pulls with every vein popping; the bucket slides half an inch and refuses to leave the ground.', caption: 'Half Inch Moved!' },
      { frame: 4, position: 'Bottom Left', framing: 'Wrist close-up', action: 'His smartwatch lights up loudly announcing a personal record of 0.2 calories burned.', caption: '0.2 Calories Burned!' },
      { frame: 5, position: 'Bottom Center', framing: 'Medium reaction', action: 'A tiny 70-year-old grandmother walks past carrying two full buckets effortlessly without even looking at him.', caption: 'Dadi Carries Two!' },
      { frame: 6, position: 'Bottom Right', framing: 'Wide deadpan payoff', action: 'The gym bro wipes his forehead telling the chaiwalas the bucket has "bad center of gravity" as they collect their bet.', caption: 'Gravity Kharab Hai Bhai!' },
    ],
    shots: [
      {
        shot: 1, visual: 'Low-angle shot of a gym bro clapping chalk dust dramatically over a dented steel water bucket.', sfx: 'Sharp hand clap', hindi: 'हटो सब, आज डेडलिफ्ट रिकॉर्ड टूटेगा।',
        turns: [{ speaker: 'PROTAGONIST: GYM BRO', role: 'protagonist', voice: 'deep hyped-up growl', delivery: 'on-screen lip-sync, staring at bucket', hindi: 'हटो सब, आज डेडलिफ्ट रिकॉर्ड टूटेगा।' }],
      },
      {
        shot: 2, visual: 'Chaiwala 1 (frame-left) nudges Chaiwala 2 (frame-right), slapping a ₹10 note on the tin counter.', sfx: 'Cup clink and note slap', hindi: 'दस रुपये शर्त—बाल्टी नहीं हिलेगी।',
        turns: [
          { speaker: 'NPC-1: CHAIWALA 1', role: 'npc1', voice: 'amused raspy whisper', delivery: 'on-screen lip-sync, frame-left, looking right', hindi: 'दस रुपये शर्त—बाल्टी नहीं हिलेगी।' },
          { speaker: 'NPC-2: CHAIWALA 2', role: 'npc2', voice: 'dry skeptical scoff', delivery: 'on-screen lip-sync, frame-right, pouring tea', hindi: 'अरे दस क्या, बीस लगा ले!' },
        ],
      },
      {
        shot: 3, visual: 'The gym bro grunts furiously pulling the wire handle; the bucket screeches half an inch across concrete.', sfx: 'Metal scrape and strained grunt', hindi: 'बस... थोड़ा सा ग्रिप फिसल रहा है!',
        turns: [{ speaker: 'PROTAGONIST: GYM BRO', role: 'protagonist', voice: 'straining breathless wheeze', delivery: 'on-screen lip-sync, face red', hindi: 'बस... थोड़ा सा ग्रिप फिसल रहा है!' }],
      },
      {
        shot: 4, visual: 'Close-up on his glowing smartwatch chiming cheerfully on his trembling wrist.', sfx: 'Perky digital fanfare', hindi: 'बधाई हो, आपने शून्य दशमलव दो कैलोरी जलाई।',
        turns: [{ speaker: 'ENTITY: SMARTWATCH', role: 'entity', voice: 'overly cheerful synthetic voice', delivery: 'diegetic wrist speaker', hindi: 'बधाई हो, शून्य दशमलव दो कैलोरी जलाई!' }],
      },
      {
        shot: 5, visual: 'An elderly woman strolls smoothly through frame carrying two full steel buckets with zero effort.', sfx: 'Calm footsteps', hindi: 'रास्ता छोड़ो बेटा, पानी ठंडा हो रहा है।',
        turns: [{ speaker: 'NPC-2: DADI', role: 'npc2', voice: 'gentle unbothered voice', delivery: 'on-screen lip-sync, walking past', hindi: 'रास्ता छोड़ो बेटा, पानी ठंडा हो रहा है।' }],
      },
      {
        shot: 6, visual: 'Chaiwala 1 pockets the ₹20 note while the gym bro calmly blames the floor.', sfx: 'Coin clink, instant hard cut to black', hindi: 'फर्श का लेवल टेढ़ा था, वरना उठा लेता।',
        turns: [{ speaker: 'PROTAGONIST: GYM BRO', role: 'protagonist', voice: 'deadpan serious excuse', delivery: 'on-screen lip-sync, dusting hands', hindi: 'फर्श का लेवल टेढ़ा था, वरना उठा लेता।' }],
      },
    ],
  },
];
