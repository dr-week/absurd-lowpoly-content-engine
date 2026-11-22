import type { TopicOption } from '../types';

export const LUGAN_STYLE_STORIES: readonly TopicOption[] = [
  {
    id: 'lugan_country_pothole_comparison',
    title: 'GERMANY VS UK VS ITALY VS STREET WORLD—HITTING ONE POTHOLE',
    angle: 'breaking-news',
    brand: 'Global Contrast Skit',
    trendHook: 'Lugan3d 50M-View Formula: Country-vs-Country Stereotype Contrast + Multi-Accent Banter',
    visualStyle: 'lugan-3d-skit',
    pitch:
      'Four stylized 3D drivers from Germany, the UK, Italy, and a chaotic street lane encounter the exact same tiny pothole—escalating from robotic Autobahn precision to a British tea spill, Italian hand-gesture opera, and a full airborne scooter launch.',
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Crisp 3D highway shot', action: 'A stoic German driver in a sleek silver coupe spots a 1-inch pebble, brakes with laser precision, and measures it with calipers.', caption: 'Germany: Measured To 0.1mm!' },
      { frame: 2, position: 'Top Center', framing: 'Interior dashboard shot', action: 'A British driver in a rainy hatchback hits a bump, spills one drop of tea, and calmly sighs while gripping the wheel.', caption: 'UK: Proper Peak Bruv!' },
      { frame: 3, position: 'Top Right', framing: 'Expressive 3D two-shot', action: 'An Italian sports-car driver throws both hands off the wheel gesturing wildly at the road while the car steers itself.', caption: 'Italy: Mamma Mia Who Built This!' },
      { frame: 4, position: 'Bottom Left', framing: 'Wide chaotic street', action: 'A fourth driver in a rattling beat-up hatchback sees a massive crater and smiles, shifting straight into fifth gear.', caption: 'Meanwhile: Full Throttle!' },
      { frame: 5, position: 'Bottom Center', framing: 'Slapstick 3D air-time', action: 'The hatchback launches ten feet vertically off the pothole like a ski jump while the passenger casually sips chai mid-air.', caption: '10 Feet Of Air Time!' },
      { frame: 6, position: 'Bottom Right', framing: 'Deadpan landing shot', action: 'The car lands on all four wheels, one hubcap rolls past, and the driver calmly tells his friend the suspension is "brand new".', caption: 'Suspension Bilkul New Hai!' },
    ],
    shots: [
      {
        shot: 1, visual: 'Stylized 3D highway: a German driver stops deadpan in front of a tiny pebble and pulls out metal calipers.', sfx: 'Precision brake hiss', hindi: 'जर्मनी में सड़क पर एक मिलीमीटर गड्ढा भी अपराध है।',
        turns: [{ speaker: 'NPC-1: GERMAN DRIVER', role: 'npc1', voice: 'stoic crisp German-accented deadpan', delivery: 'on-screen lip-sync, squinting at road', hindi: 'यह सड़क नियम के खिलाफ है, अभी बंद करो।' }],
      },
      {
        shot: 2, visual: 'Rainy UK street: a British driver hits a bump, watches one drop of tea splash, and glares at the sky.', sfx: 'Wet splash and dry sigh', hindi: 'अरे भाई, चाय गिर गई, दिन खराब हो गया।',
        turns: [{ speaker: 'NPC-2: UK DRIVER', role: 'npc2', voice: 'dry East London deadpan', delivery: 'on-screen lip-sync, gripping steering wheel', hindi: 'इनिट ब्रव, एक बूंद चाय गिरी, पूरा मूड खराब।' }],
      },
      {
        shot: 3, visual: 'Sunny Italian lane: an expressive driver takes both hands off the wheel waving wildly at a tiny crack.', sfx: 'Dramatic opera sting', hindi: 'मम्मा मिया, ये सड़क किसने बनाई है?!',
        turns: [{ speaker: 'NPC-1: ITALIAN DRIVER', role: 'npc1', voice: 'passionate rapid Italian cadence', delivery: 'on-screen lip-sync, both hands gesturing', hindi: 'मम्मा मिया, ये सड़क किसने बनाई है?!' }],
      },
      {
        shot: 4, visual: 'Rattling old hatchback approaches a crater; the driver grins at his friend in the passenger seat.', sfx: 'Aggressive gear shift', hindi: 'भाई ब्रेक मार! अरे ब्रेक कमजोर लोग मारते हैं!',
        turns: [
          { speaker: 'NPC-2: BRO PASSENGER', role: 'npc2', voice: 'panicked cracking shout', delivery: 'on-screen lip-sync, frame-right, grabbing handle', hindi: 'भाई आगे बहुत बड़ा गड्ढा है, ब्रेक मार!' },
          { speaker: 'PROTAGONIST: DRIVER', role: 'protagonist', voice: 'fearless deadpan grin', delivery: 'on-screen lip-sync, frame-left, flooring pedal', hindi: 'ब्रेक कमज़ोर लोग मारते हैं, उड़ान देख!' },
        ],
      },
      {
        shot: 5, visual: 'Exaggerated 3D slow-motion as the hatchback flies ten feet in the air while both buddies float calmly inside.', sfx: 'Rocket whoosh and wind', hindi: 'हवा में गाड़ी बिल्कुल स्मूथ चलती है।',
        turns: [{ speaker: 'PROTAGONIST: DRIVER', role: 'protagonist', voice: 'calm airline-pilot drawl', delivery: 'on-screen lip-sync, floating mid-air', hindi: 'देखा, हवा में कोई झटका नहीं लगता।' }],
      },
      {
        shot: 6, visual: 'Car slams back onto the road; a single hubcap rolls past the window as the driver nods proudly.', sfx: 'Metallic bounce, instant hard cut to black', hindi: 'सस्पेंशन अभी भी बिल्कुल नया है भाई।',
        turns: [{ speaker: 'PROTAGONIST: DRIVER', role: 'protagonist', voice: 'proud deadpan nod', delivery: 'on-screen lip-sync, patting dashboard', hindi: 'सस्पेंशन अभी भी बिल्कुल नया है भाई।' }],
      },
    ],
  },
  {
    id: 'lugan_driving_alone_vs_with_dad',
    title: 'DRIVING ALONE VS DRIVING WITH DAD—THE 10 KM/H PANIC TEST',
    angle: 'petty-spiral',
    brand: 'Relatable 3D Contrast',
    trendHook: 'Lugan3d Viral Format: Driving Alone vs With Dad + Expressive 3D Physics',
    visualStyle: 'lugan-3d-skit',
    pitch:
      'Driving alone, he cruises smoothly like a calm action-movie pro—the instant Dad sits in the passenger seat, going 12 km/h feels like a meteor apocalypse with Dad stomping an imaginary brake pedal through the floorboard.',
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Smooth 3D interior', action: 'Driving alone, the young guy relaxes with one hand on the wheel cruising smoothly down a sunlit avenue.', caption: 'Driving Alone: Pure Zen!' },
      { frame: 2, position: 'Top Center', framing: 'Hard cut two-shot', action: 'Title flashes "WITH DAD": Dad sits stiffly in the passenger seat gripping the ceiling handle before the engine even starts.', caption: 'With Dad: Already Bracing!' },
      { frame: 3, position: 'Top Right', framing: 'Close-up speedometer', action: 'The speedometer needle barely creeps to 12 km/h while a bicycle calmly overtakes them on the left.', caption: '12 km/h — Bicycle Overtakes!' },
      { frame: 4, position: 'Bottom Left', framing: 'Dramatic reaction shot', action: 'Dad spots a pedestrian three blocks away, gasps wildly, and slams his foot onto an imaginary brake pedal.', caption: 'Imaginary Brake Engaged!' },
      { frame: 5, position: 'Bottom Center', framing: 'Slapstick 3D physics', action: 'Dad stomps the imaginary brake so hard his shoe punches straight through the 3D car floorboard onto the asphalt.', caption: 'Punched Through The Floor!' },
      { frame: 6, position: 'Bottom Right', framing: 'Deadpan wide shot', action: 'The car is still parked in the driveway with the handbrake up while Dad sighs that today’s youth drive too recklessly.', caption: 'Car Hasn’t Even Left Driveway!' },
    ],
    shots: [
      {
        shot: 1, visual: 'Stylized 3D car interior: solo driver cruises smoothly down a sunny road nodding casually to a beat.', sfx: 'Smooth engine purr', hindi: 'अकेले गाड़ी चलाओ तो सब शांति से चलता है।',
        turns: [{ speaker: 'PROTAGONIST: SON', role: 'protagonist', voice: 'relaxed breezy hum', delivery: 'on-screen lip-sync, one hand on wheel', hindi: 'अकेले चलाओ तो मक्खन जैसी सड़क लगती है।' }],
      },
      {
        shot: 2, visual: 'Hard cut: Dad climbs into the passenger seat, grabs the ceiling handle with both hands, and stares straight ahead.', sfx: 'Tense horror chord', hindi: 'धीरे चलाना, कोई जल्दी नहीं है!',
        turns: [{ speaker: 'NPC-1: DAD', role: 'npc1', voice: 'stern dramatic warning', delivery: 'on-screen lip-sync, frame-right, gripping handle', hindi: 'धीरे चलाना, हवाई जहाज़ नहीं उड़ा रहे!' }],
      },
      {
        shot: 3, visual: 'Close-up on speedometer reading 10 km/h as a kid on a tricycle waves and overtakes their car.', sfx: 'Tiny bicycle bell', hindi: 'पापा, हम सिर्फ दस की स्पीड पर हैं!',
        turns: [
          { speaker: 'PROTAGONIST: SON', role: 'protagonist', voice: 'exasperated plea', delivery: 'on-screen lip-sync, frame-left, pointing at dial', hindi: 'पापा, हम सिर्फ दस की स्पीड पर हैं!' },
          { speaker: 'NPC-1: DAD', role: 'npc1', voice: 'panicked loud shout', delivery: 'on-screen lip-sync, frame-right, pointing ahead', hindi: 'ब्रेक मार! वो आदमी तीन गली आगे खड़ा है!' },
        ],
      },
      {
        shot: 4, visual: 'Slapstick close-up: Dad stomps his imaginary brake so hard his slipper punches straight through the floorboard.', sfx: 'Crunch and metal rip', hindi: 'मेरा पैर ब्रेक दबाते-दबाते थक गया!',
        turns: [{ speaker: 'NPC-1: DAD', role: 'npc1', voice: 'breathless dramatic groan', delivery: 'on-screen lip-sync, clutching chest', hindi: 'तुम लोग किसी दिन हार्ट अटैक दिलाओगे!' }],
      },
      {
        shot: 5, visual: 'Camera pulls wide outside the car revealing the wheels haven’t moved an inch—still parked in the driveway.', sfx: 'Cricket chirps and silence', hindi: 'पापा, मैंने अभी इंजन भी चालू नहीं किया।',
        turns: [{ speaker: 'PROTAGONIST: SON', role: 'protagonist', voice: 'flat deadpan stare', delivery: 'on-screen lip-sync, holding car keys up', hindi: 'पापा, मैंने अभी इंजन भी चालू नहीं किया।' }],
      },
      {
        shot: 6, visual: 'Dad calmly unbuckles his seatbelt, shakes his head, and steps out muttering about reckless youth.', sfx: 'Door slam, instant hard cut to black', hindi: 'चाबी दे, मैं खुद ऑटो से चला जाऊंगा।',
        turns: [{ speaker: 'NPC-1: DAD', role: 'npc1', voice: 'unbothered final verdict', delivery: 'on-screen lip-sync, walking away', hindi: 'चाबी दे, मैं पैदल ही सुरक्षित हूं।' }],
      },
    ],
  },
];
