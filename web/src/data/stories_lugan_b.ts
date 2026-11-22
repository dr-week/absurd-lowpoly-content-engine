import type { TopicOption } from '../types';

export const LUGAN_STORIES_B: readonly TopicOption[] = [
  {
    id: 'lugan_driving_alone_vs_bro',
    title: 'DRIVING ALONE VS WITH BRO—ONE TINY SPEED BREAKER',
    angle: 'over-engineer',
    brand: 'Lugan 3D Contrast',
    trendHook: 'Lugan3d Alone vs With Bro Format + Rocket Launch 3D Physics',
    visualStyle: 'lugan-3d-skit',
    pitch:
      'Driving alone, he slows down politely to 5 km/h for a speed breaker—the second Bro sits shotgun, one tiny yellow bump turns into an orbital space launch with Bro calmly rating the airtime.',
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Calm 3D interior', action: 'Bold title "ALONE": Straight-man driver taps the brake gently, gliding over a yellow speed breaker at 5 km/h.', caption: 'ALONE: Smooth 5 km/h!' },
      { frame: 2, position: 'Top Center', framing: 'Smash-cut two-shot', action: 'Bold title "WITH BRO": Hype-Bro in a backward cap grins from the passenger seat slapping the dashboard.', caption: 'WITH BRO: Don’t Slow Down!' },
      { frame: 3, position: 'Top Right', framing: 'Pedal close-up', action: 'Driver tries to brake, but Bro reaches over with a broomstick and pushes the gas pedal straight to the metal.', caption: 'Broomstick On Gas Pedal!' },
      { frame: 4, position: 'Bottom Left', framing: 'Wide 3D launch', action: 'The tiny hatchback hits the yellow speed breaker at 110 km/h and rockets straight past a passing commercial airplane.', caption: 'Passing A Commercial Jet!' },
      { frame: 5, position: 'Bottom Center', framing: 'Zero-G cabin shot', action: 'Both buddies float upside down inside the cabin while snacks drift slowly past the rearview mirror.', caption: 'Zero Gravity Cabin!' },
      { frame: 6, position: 'Bottom Right', framing: 'Deadpan landing', action: 'The car drops onto the supermarket parking spot perfectly between the white lines as Bro gives a 9.5/10.', caption: 'Cleanest Parking Ever Bro!' },
    ],
    shots: [
      {
        shot: 1, visual: 'Title card "ALONE": Stylized 3D driver smoothly slows to a crawl over a tiny yellow speed breaker.', sfx: 'Gentle suspension dip', hindi: 'अकेले चलाओ तो गाड़ी की इज़्ज़त रहती है।',
        turns: [{ speaker: 'PROTAGONIST: DRIVER', role: 'protagonist', voice: 'calm relaxed murmur', delivery: 'on-screen lip-sync, nodding politely', hindi: 'आराम से, सस्पेंशन बचाना है।' }],
      },
      {
        shot: 2, visual: 'Smash cut title card "WITH BRO": Hype-Bro in a backward cap leans over slapping the dashboard grinning.', sfx: 'Bass boom and slap', hindi: 'ब्रेक मत मार भाई, सीधा उड़ा दे!',
        turns: [
          { speaker: 'NPC-1: HYPE BRO', role: 'npc1', voice: 'hyped reckless grin', delivery: 'on-screen lip-sync, frame-right, pointing ahead', hindi: 'ब्रेक मत मार भाई, सीधा उड़ा दे!' },
          { speaker: 'PROTAGONIST: DRIVER', role: 'protagonist', voice: 'nervous protesting voice', delivery: 'on-screen lip-sync, frame-left, gripping wheel', hindi: 'अरे आगे बड़ा स्पीड ब्रेकर है!' },
        ],
      },
      {
        shot: 3, visual: 'Hype-Bro jams a wooden umbrella onto the accelerator pedal as the speedometer spins like a ceiling fan.', sfx: 'Screaming engine rev', hindi: 'फुल थ्रॉटल ब्रो, डर के आगे जीत है!',
        turns: [{ speaker: 'NPC-1: HYPE BRO', role: 'npc1', voice: 'chaotic cheerful yell', delivery: 'on-screen lip-sync, pressing umbrella', hindi: 'फुल थ्रॉटल ब्रो, डर के आगे जीत है!' }],
      },
      {
        shot: 4, visual: 'Wide exterior 3D shot: hatchback hits the bump and launches past an astonished airline pilot waving from a jet.', sfx: 'Jet whoosh and horn', hindi: 'हम बादलों के ऊपर आ गए हैं भाई!',
        turns: [{ speaker: 'NPC-2: JET PILOT', role: 'npc2', voice: 'confused intercom crackle', delivery: 'cockpit radio voice', hindi: 'कंट्रोल टावर, एक हैचबैक ओवरटेक कर गई!' }],
      },
      {
        shot: 5, visual: 'Inside the floating zero-G cabin, chips drift past their faces while Bro casually eats one mid-air.', sfx: 'Weightless hum', hindi: 'देखा, ट्रैफिक बिल्कुल नहीं है ऊपर।',
        turns: [{ speaker: 'NPC-1: HYPE BRO', role: 'npc1', voice: 'chill unbothered munching', delivery: 'on-screen lip-sync, floating sideways', hindi: 'देखा, ऊपर ट्रैफिक बिल्कुल नहीं है।' }],
      },
      {
        shot: 6, visual: 'The car drops cleanly into a tight parking slot; Bro steps out patting the roof proudly.', sfx: 'Thud and lock beep, instant hard cut to black', hindi: 'दस में से नौ, एकदम सीधी पार्किंग!',
        turns: [{ speaker: 'NPC-1: HYPE BRO', role: 'npc1', voice: 'deadpan Olympic judge', delivery: 'on-screen lip-sync, tossing keys', hindi: 'दस में से नौ, एकदम सीधी पार्किंग!' }],
      },
    ],
  },
  {
    id: 'lugan_pov_bro_first_car',
    title: 'POV: BRO PICKS YOU UP AFTER A BREAKUP IN HIS "CUSTOM" FIRST CAR',
    angle: 'fake-origin',
    brand: 'Lugan POV Skit',
    trendHook: 'Lugan3d POV Bro Pickup + Ridiculous Duct-Tape First Car Reveal',
    visualStyle: 'lugan-3d-skit',
    pitch:
      'First-person POV waiting outside after a breakup—Bro rolls up hyped in his "custom" first car that has a plastic lawn chair for a seat, no passenger door, and a jet turbine strapped to the trunk.',
    frames: [
      { frame: 1, position: 'Top Left', framing: 'First-person POV curb', action: 'Bold title "POV: BRO PICKS YOU UP": A rattling mismatched hatchback skids up with sparks and loud bass.', caption: 'Hop In Bro, Forget Her!' },
      { frame: 2, position: 'Top Center', framing: 'POV open doorway', action: 'There is no passenger door at all—just a white plastic garden chair zip-tied to the rusted car floor.', caption: 'Custom Lightweight Seat!' },
      { frame: 3, position: 'Top Right', framing: 'POV dashboard close-up', action: 'Instead of a steering wheel, Bro is steering with a pair of locking plumber pliers and a huge proud smile.', caption: 'Pliers Steering Wheel!' },
      { frame: 4, position: 'Bottom Left', framing: 'POV rear mirror', action: 'Looking back, a massive chrome jet turbine is strapped to the trunk with bright neon duct tape.', caption: 'Turbo Upgrade In Back!' },
      { frame: 5, position: 'Bottom Center', framing: 'POV hyper-speed blur', action: 'Bro taps a red toaster switch; the street stretches into warp-speed neon streaks as your plastic chair slides back.', caption: 'Warp Speed Engaged!' },
      { frame: 6, position: 'Bottom Right', framing: 'POV calm stop', action: 'Two seconds later you arrive at a calm sunset chai stall; Bro hands you a cup asking "See? Better already."', caption: 'Breakup Cured In 2 Seconds!' },
    ],
    shots: [
      {
        shot: 1, visual: 'First-person POV: a mismatched rattling car skids up to the curb missing its passenger door completely.', sfx: 'Squeaky brake and bass thump', hindi: 'बैठ भाई, आज तेरा मूड ठीक करता हूं।',
        turns: [{ speaker: 'NPC-1: HYPE BRO', role: 'npc1', voice: 'loyal hyped-up bro tone', delivery: 'on-screen lip-sync, leaning across empty doorway', hindi: 'बैठ भाई, आज तेरा मूड ठीक करता हूं।' }],
      },
      {
        shot: 2, visual: 'POV looks down at a white plastic lawn chair zip-tied where the passenger seat should be.', sfx: 'Plastic creak', hindi: 'भाई ये प्लास्टिक की कुर्सी क्यों लगी है?',
        turns: [
          { speaker: 'PROTAGONIST: POV YOU', role: 'protagonist', voice: 'skeptical trembling voice', delivery: 'off-screen POV speaker', hindi: 'भाई ये प्लास्टिक की कुर्सी क्यों लगी है?' },
          { speaker: 'NPC-1: HYPE BRO', role: 'npc1', voice: 'proud engineer tone', delivery: 'on-screen lip-sync, patting chair', hindi: 'रेसिंग वेट-रिडक्शन है ब्रो, बैठ तो सही!' },
        ],
      },
      {
        shot: 3, visual: 'POV looks at Bro steering confidently using a rusted wrench clamped to the steering column.', sfx: 'Metal click', hindi: 'और स्टियरिंग व्हील कहां गया?!',
        turns: [{ speaker: 'NPC-1: HYPE BRO', role: 'npc1', voice: 'casual deadpan shrug', delivery: 'on-screen lip-sync, turning wrench', hindi: 'चोर ले न जाए, इसलिए घर पर रखा है।' }],
      },
      {
        shot: 4, visual: 'Bro flips a shiny red switch taped to the glovebox; a jet engine roars to life in the trunk.', sfx: 'Turbine spool-up whine', hindi: 'कुर्सी कस के पकड़ ले भाई!',
        turns: [{ speaker: 'NPC-1: HYPE BRO', role: 'npc1', voice: 'gleeful shout over turbine', delivery: 'on-screen lip-sync, eyes wide', hindi: 'कुर्सी कस के पकड़ ले, टर्बो चालू है!' }],
      },
      {
        shot: 5, visual: 'POV blasts forward at comic warp speed while street signs whip past like laser lines.', sfx: 'Sonic boom whoosh', hindi: 'भाई मुझे अब ब्रेकअप याद भी नहीं!',
        turns: [{ speaker: 'PROTAGONIST: POV YOU', role: 'protagonist', voice: 'wind-blown ecstatic scream', delivery: 'off-screen POV speaker', hindi: 'भाई मुझे अब ब्रेकअप याद भी नहीं!' }],
      },
      {
        shot: 6, visual: 'Instant calm cut to a peaceful roadside tea stall; Bro hands POV a hot cup with a deadpan nod.', sfx: 'Soft cup clink, instant hard cut to black', hindi: 'चाय और टर्बो से सब ठीक।',
        turns: [{ speaker: 'NPC-1: HYPE BRO', role: 'npc1', voice: 'warm deadpan bro wisdom', delivery: 'on-screen lip-sync, handing cup', hindi: 'चाय और टर्बो से सब ठीक।' }],
      },
    ],
  },
];
