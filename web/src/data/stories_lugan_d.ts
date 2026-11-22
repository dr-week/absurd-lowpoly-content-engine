import type { TopicOption } from '../types';

export const LUGAN_STORIES_D: readonly TopicOption[] = [
  {
    id: 'lugan_global_parking_contrast',
    title: 'PARKING IN TOKYO VS PARIS VS NEW YORK VS LOCAL MARKET',
    angle: 'breaking-news',
    brand: 'Global 3D Contrast',
    trendHook: 'Lugan3d Global Multi-Accent Contrast: 4 World Parking Cultures',
    visualStyle: 'lugan-3d-skit',
    pitch:
      'Four stylized 3D worlds try to parallel park in one tight space: Tokyo uses robotic millimeter precision, Paris gently bumps both cars, New York yells from the window, and the local market lifts the whole car sideways by hand.',
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Tokyo neon alley', action: 'Bold title "TOKYO": A compact cube car glides into a robotic elevator slot with 1mm laser alignment.', caption: 'TOKYO: 1mm Laser Sync!' },
      { frame: 2, position: 'Top Center', framing: 'Paris cobblestone', action: 'Bold title "PARIS": A chic driver shrugs "C’est la vie" and gently nudges both bumper neighbors to make room.', caption: 'PARIS: Bump & Shrug!' },
      { frame: 3, position: 'Top Right', framing: 'NYC avenue', action: 'Bold title "NEW YORK": Driver hangs out the window yelling "Deadass I was here first!" while double-parking.', caption: 'NYC: Deadass My Spot!' },
      { frame: 4, position: 'Bottom Left', framing: 'Local market lane', action: 'Bold title "LOCAL MARKET": Four strangers pause their tea, walk over, and grab all four fenders of a small hatchback.', caption: '4 Strangers Lift Car!' },
      { frame: 5, position: 'Bottom Center', framing: 'Slapstick 3D lift', action: 'With one synchronized heave, the four strangers pick up the entire hatchback and set it sideways into an impossible gap.', caption: 'Impossible Sideways Park!' },
      { frame: 6, position: 'Bottom Right', framing: 'Deadpan street exit', action: 'The driver thanks them, realizes he can’t open either door, and calmly climbs out through the sunroof.', caption: 'Sunroof Exit Unlocked!' },
    ],
    shots: [
      {
        shot: 1, visual: 'Title card "TOKYO": Stylized 3D micro-car rotates on a silent turntable with glowing green alignment lines.', sfx: 'Soft futuristic chime', hindi: 'टोक्यो में पार्किंग एकदम रोबोट जैसी है।',
        turns: [{ speaker: 'NPC-1: TOKYO DRIVER', role: 'npc1', voice: 'polite crisp Japanese cadence', delivery: 'on-screen lip-sync, bowing slightly', hindi: 'दाइजोबू, एकदम एक मिलीमीटर सटीक।' }],
      },
      {
        shot: 2, visual: 'Title card "PARIS": Chic French driver taps the front and rear bumpers casually with a tiny shrug.', sfx: 'Two soft bumper thuds', hindi: 'पेरिस में थोड़ा टच होना फैशन है।',
        turns: [{ speaker: 'NPC-2: PARIS DRIVER', role: 'npc2', voice: 'aloof Parisian deadpan', delivery: 'on-screen lip-sync, sipping espresso', hindi: 'से ला वी, बंपर इसी के लिए होता है।' }],
      },
      {
        shot: 3, visual: 'Title card "NEW YORK": Brooklyn driver leans out waving a bagel yelling at a honking taxi.', sfx: 'Aggressive city horn', hindi: 'अरे मैं पहले आया था, हट जा!',
        turns: [{ speaker: 'NPC-1: NYC DRIVER', role: 'npc1', voice: 'fast loud Brooklyn street cadence', delivery: 'on-screen lip-sync, waving bagel', hindi: 'डेडऐस यो, ये जगह मेरी थी!' }],
      },
      {
        shot: 4, visual: 'Title card "LOCAL MARKET": Four bystanders drop their cups and lift the entire hatchback sideways together.', sfx: 'Synchronized heave grunt', hindi: 'अरे उठाओ भाई, एक-दो-तीन!',
        turns: [{ speaker: 'NPC-2: STREET CHORUS', role: 'npc2', voice: 'cheerful synchronized team shout', delivery: 'on-screen lip-sync, lifting bumper', hindi: 'जोर लगाओ भाई, एक-दो-तीन, फिट हो गई!' }],
      },
      {
        shot: 5, visual: 'The car sits wedged flush between two pillars with zero centimeters to open either side door.', sfx: 'Door handle rattling stuck', hindi: 'भाई अब बाहर कैसे निकलूं?',
        turns: [{ speaker: 'PROTAGONIST: DRIVER', role: 'protagonist', voice: 'confused muffled shout', delivery: 'on-screen lip-sync, tapping glass', hindi: 'भाई पार्किंग बढ़िया है, पर बाहर कैसे निकलूं?' }],
      },
      {
        shot: 6, visual: 'Driver pops the sunroof, climbs gracefully onto the roof, and nods to the cheering tea stall.', sfx: 'Roof thump, instant hard cut to black', hindi: 'सनरूफ आज पहली बार काम आया।',
        turns: [{ speaker: 'PROTAGONIST: DRIVER', role: 'protagonist', voice: 'proud deadpan nod', delivery: 'on-screen lip-sync, standing on roof', hindi: 'सनरूफ आज पहली बार काम आया!' }],
      },
    ],
  },
  {
    id: 'lugan_gym_alone_vs_bro',
    title: 'GYM ALONE VS GYM WITH BRO—ADDING "JUST ONE MORE PLATE"',
    angle: 'over-engineer',
    brand: 'Lugan 3D Gym Skit',
    trendHook: 'Lugan3d Alone vs With Bro Slapstick Physics (Non-Car Edition)',
    visualStyle: 'lugan-3d-skit',
    pitch:
      'Working out alone, he lifts sensible 20 kg plates with clean form—the moment Bro walks in to spot him, Bro loads an entire vending machine onto the barbell shouting "All you bro, pure mental!"',
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Bright 3D gym', action: 'Bold title "ALONE": Straight-man calmly benches neat 20 kg plates with clean textbook form.', caption: 'ALONE: Clean 20 kg Reps!' },
      { frame: 2, position: 'Top Center', framing: 'Smash-cut arrival', action: 'Bold title "WITH BRO": Hype-Bro struts up slapping chalk everywhere and yelling "That’s warm-up weight!"', caption: 'WITH BRO: Warm-Up Weight!' },
      { frame: 3, position: 'Top Right', framing: 'Slapstick loading', action: 'Bro stacks twelve plates, a treadmill, and a gym water dispenser onto each side of the bending barbell.', caption: 'Water Dispenser Added!' },
      { frame: 4, position: 'Bottom Left', framing: 'Tight panic close-up', action: 'The barbell bends into a U-shape as Straight-man’s eyes pop wide while Bro yells "Light weight!"', caption: 'Barbell Bending Like Rubber!' },
      { frame: 5, position: 'Bottom Center', framing: 'Slapstick physics', action: 'The sheer weight pushes the entire gym bench six inches straight down into the concrete floor.', caption: 'Sunk Into Concrete!' },
      { frame: 6, position: 'Bottom Right', framing: 'Deadpan bro spot', action: 'Bro lightly touches the bar with one pinky finger and nods proudly: "See? All you bro, didn’t even help."', caption: 'All You Bro, Zero Help!' },
    ],
    shots: [
      {
        shot: 1, visual: 'Title card "ALONE": Stylized 3D guy smoothly presses clean 20 kg reps in a bright tidy gym.', sfx: 'Steady rhythmic breath', hindi: 'सही फॉर्म और कंट्रोल, बस यही चाहिए।',
        turns: [{ speaker: 'PROTAGONIST: LIFTER', role: 'protagonist', voice: 'calm focused mutter', delivery: 'on-screen lip-sync, steady bench press', hindi: 'सही फॉर्म और कंट्रोल, बस यही चाहिए।' }],
      },
      {
        shot: 2, visual: 'Smash cut title card "WITH BRO": Hype-Bro slides in clapping chalk clouds onto the bar.', sfx: 'Loud chalk slap', hindi: 'ये क्या खिलौना उठा रहा है, और वज़न डाल!',
        turns: [{ speaker: 'NPC-1: HYPE BRO', role: 'npc1', voice: 'booming gym-bro hype', delivery: 'on-screen lip-sync, stacking plates rapidly', hindi: 'ये क्या खिलौना उठा रहा है, और वज़न डाल!' }],
      },
      {
        shot: 3, visual: 'Bro casually balances a full gym water cooler onto the end of the bending metal barbell.', sfx: 'Water glug and metal groan', hindi: 'भाई वाटर कूलर क्यों चढ़ा दिया?!',
        turns: [
          { speaker: 'PROTAGONIST: LIFTER', role: 'protagonist', voice: 'high-pitched panic', delivery: 'on-screen lip-sync, lying under bar', hindi: 'भाई वाटर कूलर क्यों चढ़ा दिया?!' },
          { speaker: 'NPC-1: HYPE BRO', role: 'npc1', voice: 'intense motivational whisper', delivery: 'on-screen lip-sync, leaning over', hindi: 'सब दिमाग का खेल है, उठा दे!' },
        ],
      },
      {
        shot: 4, visual: 'The entire bench sinks six inches into the concrete gym floor cracking tiles outward in a neat circle.', sfx: 'Heavy concrete crunch', hindi: 'फर्श नीचे धंस गया भाई!',
        turns: [{ speaker: 'NPC-2: GYM TRAINER', role: 'npc2', voice: 'shocked deadpan whistle', delivery: 'on-screen lip-sync, staring at floor', hindi: 'मेम्बरशिप कैंसल, अभी बाहर निकलो।' }],
      },
      {
        shot: 5, visual: 'Hype-Bro lifts the entire 500 kg bar effortlessly with two fingers while yelling encouragement.', sfx: 'Comic upward slide whistle', hindi: 'बहुत बढ़िया! एकदम हल्का था!',
        turns: [{ speaker: 'NPC-1: HYPE BRO', role: 'npc1', voice: 'cheerful encouraging shout', delivery: 'on-screen lip-sync, holding bar effortlessly', hindi: 'शाबाश ब्रो, एकदम हल्का था!' }],
      },
      {
        shot: 6, visual: 'Bro wipes his forehead and fist-bumps his flattened friend: "Didn’t even touch it bro, all you."', sfx: 'Soft fist-bump, instant hard cut to black', hindi: 'मैंने छुआ भी नहीं, पूरा तूने उठाया।',
        turns: [{ speaker: 'NPC-1: HYPE BRO', role: 'npc1', voice: 'serious deadpan pride', delivery: 'on-screen lip-sync, nodding earnestly', hindi: 'मैंने छुआ भी नहीं, पूरा तूने उठाया।' }],
      },
    ],
  },
];
