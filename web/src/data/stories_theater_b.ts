import type { TopicOption } from '../types';

export const THEATER_STORIES_B: readonly TopicOption[] = [
  {
    id: 'theater_two_auto_drivers_duel',
    title: 'TWO AUTO DRIVERS FIGHT OVER ONE PASSENGER—PASSENGER WALKS HOME',
    angle: 'breaking-news',
    brand: 'Commedia Street Duel',
    trendHook: 'Pure NPC-to-NPC Escalation + Deadpan Protagonist Exit',
    visualStyle: 'gta6-vice',
    pitch:
      'Outside a busy station, two rival auto drivers get so invested arguing over who gets a ₹40 fare that they pull out laminated maps and debate traffic philosophy—while the passenger quietly walks all the way home.',
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Wide station curb', action: 'A tired commuter with a backpack raises one finger; two yellow autos screech to a halt inches apart.', caption: 'Station Se Seedha?' },
      { frame: 2, position: 'Top Center', framing: 'Two-shot argument', action: 'Driver 1 and Driver 2 immediately ignore the passenger and argue nose-to-nose about whose shortcut is faster.', caption: 'Mera Shortcut Fast Hai!' },
      { frame: 3, position: 'Top Right', framing: 'Medium escalation', action: 'Driver 1 unfolds a giant laminated city map on the hood while Driver 2 draws chalk arrows on the asphalt.', caption: 'Chalk Se Map Bana Diya!' },
      { frame: 4, position: 'Bottom Left', framing: 'Background action', action: 'While both drivers shout passionately, the passenger silently adjusts his backpack straps and starts walking down the road.', caption: 'Passenger Paidl Chal Diya!' },
      { frame: 5, position: 'Bottom Center', framing: 'Wide street progression', action: 'Ten minutes later, the drivers finally shake hands agreeing on the route and turn around to an empty sidewalk.', caption: 'Ab Chalo Bhaiya—Kahan Gaya?' },
      { frame: 6, position: 'Bottom Right', framing: 'Cutaway balcony shot', action: 'The passenger waves down from his own apartment balcony sipping tea while the traffic signal speaker beeps.', caption: 'Ghar Pahunch Gaya Bhai!' },
    ],
    shots: [
      {
        shot: 1, visual: 'Two yellow autos skid to a halt nose-to-nose in front of a tired commuter holding a backpack.', sfx: 'Dual tire screech', hindi: 'भैया, बस आगे वाले मोड़ तक चलना है।',
        turns: [{ speaker: 'PROTAGONIST: PASSENGER', role: 'protagonist', voice: 'tired polite voice', delivery: 'on-screen lip-sync, center frame', hindi: 'भैया, बस आगे वाले मोड़ तक चलना है।' }],
      },
      {
        shot: 2, visual: 'Driver 1 (frame-left) points aggressively at Driver 2 (frame-right), completely ignoring the commuter.', sfx: 'Auto engine idling', hindi: 'मैं पहले आया था! अरे तेरा मीटर खराब है!',
        turns: [
          { speaker: 'NPC-1: DRIVER 1', role: 'npc1', voice: 'loud territorial bark', delivery: 'on-screen lip-sync, frame-left, pointing right', hindi: 'हट, सवारी मैंने पहले देखी थी!' },
          { speaker: 'NPC-2: DRIVER 2', role: 'npc2', voice: 'indignant fast retort', delivery: 'on-screen lip-sync, frame-right, stepping closer', hindi: 'तेरे ऑटो का तो ब्रेक भी दुआ से चलता है!' },
        ],
      },
      {
        shot: 3, visual: 'Both drivers slap a giant paper map on the hood arguing intensely while the passenger quietly turns around in the background.', sfx: 'Paper slap and overlapping shouts', hindi: 'फ्लाईओवर से चार मिनट कम लगते हैं!',
        turns: [
          { speaker: 'NPC-1: DRIVER 1', role: 'npc1', voice: 'passionate professor lecture', delivery: 'on-screen lip-sync, jabbing map', hindi: 'फ्लाईओवर से चार मिनट कम लगते हैं!' },
          { speaker: 'NARRATOR (V.O.)', role: 'narrator', voice: 'dry documentary whisper', delivery: 'off-screen voiceover as passenger walks away', hindi: 'और यात्री ने पैदल जाने का फैसला किया।' },
        ],
      },
      {
        shot: 4, visual: 'Both drivers finally nod in mutual respect, wipe their brows, and turn toward the completely empty curb.', sfx: 'Awkward wind whistle', hindi: 'चलो भाई बैठो... अरे सवारी कहां गई?',
        turns: [{ speaker: 'NPC-2: DRIVER 2', role: 'npc2', voice: 'confused hollow echo', delivery: 'on-screen lip-sync, looking at empty pavement', hindi: 'चलो भाई बैठो... अरे सवारी कहां गई?' }],
      },
      {
        shot: 5, visual: 'Overhead pedestrian crossing speaker chimes calmly at the empty intersection.', sfx: 'Crosswalk chime', hindi: 'कृपया सड़क पार करें।',
        turns: [{ speaker: 'ENTITY: TRAFFIC SPEAKER', role: 'entity', voice: 'polite automated chime', delivery: 'overhead pole loudspeaker', hindi: 'समय समाप्त, अगला यात्री खोजें।' }],
      },
      {
        shot: 6, visual: 'Whip-pan up to a third-floor balcony where the passenger sips tea and waves down cheerfully.', sfx: 'Cup clink, instant hard cut to black', hindi: 'पैदल ही पहुंच गया, शॉर्टकट बढ़िया था!',
        turns: [{ speaker: 'PROTAGONIST: PASSENGER', role: 'protagonist', voice: 'cheerful deadpan wave', delivery: 'on-screen lip-sync, leaning on balcony', hindi: 'पैदल ही पहुंच गया, शॉर्टकट बढ़िया था!' }],
      },
    ],
  },
  {
    id: 'theater_secret_agent_samosa_award',
    title: 'UNDERCOVER SPY FRIES SAMOSAS—ACCIDENTALLY WINS BEST HALWAI AWARD',
    angle: 'fake-origin',
    brand: 'Theater Irony',
    trendHook: 'Robert McKee Subtext Gap: High-Stakes Spy Mission vs Street Food Glory',
    visualStyle: 'noir-monochrome',
    pitch:
      'A dead-serious secret agent sets up a fake samosa stall to spy on a suspect—but his tactical precision makes the samosas so crispy that a food inspector interrupts his covert radio call to hand him a gold trophy.',
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Noir close-up', action: 'A stern man in a trench coat and apron whispers into his wrist mic while dropping samosas into bubbling neon-gold oil.', caption: 'Undercover Samosa Mission!' },
      { frame: 2, position: 'Top Center', framing: 'Medium counter shot', action: 'A fussy food critic takes one bite, freezes in awe, and grabs a passing customer by the collar.', caption: 'Best Samosa In 20 Years!' },
      { frame: 3, position: 'Top Right', framing: 'Tight tension shot', action: 'His earpiece crackles urgently telling him to abort cover as a 40-person queue forms around his cart.', caption: 'Mission Compromised By Taste!' },
      { frame: 4, position: 'Bottom Left', framing: 'Wide crowd chaos', action: 'Two customers argue fiercely over the last green chutney packet while the spy tries to watch the suspect across the street.', caption: 'Chutney Pe Jung Chhid Gayi!' },
      { frame: 5, position: 'Bottom Center', framing: 'Medium reveal', action: 'A brass band arrives and the food inspector slides a giant golden "Samosa Samrat" garland over the spy’s trench coat.', caption: 'Samosa Samrat Award!' },
      { frame: 6, position: 'Bottom Right', framing: 'Deadpan close-up', action: 'Even the target suspect joins the queue politely asking for two extra-crispy plates with sweet chutney.', caption: 'Target Also Ordered 2 Plates!' },
    ],
    shots: [
      {
        shot: 1, visual: 'High-contrast noir shot of a stern spy in an apron whispering into his cuff while flipping neon-gold samosas.', sfx: 'Oil sizzle and radio static', hindi: 'बेस, मैं समोसे वाले के भेष में हूं।',
        turns: [{ speaker: 'PROTAGONIST: AGENT', role: 'protagonist', voice: 'gravelly hushed spy whisper', delivery: 'on-screen lip-sync, speaking into cuff', hindi: 'बेस, मैं समोसे वाले के भेष में हूं।' }],
      },
      {
        shot: 2, visual: 'A food critic (frame-left) bites a samosa, eyes widening, and grabs a bystander (frame-right).', sfx: 'Loud crispy crunch', hindi: 'भाई ये मसाला किस ग्रह का है?!',
        turns: [
          { speaker: 'NPC-1: FOOD CRITIC', role: 'npc1', voice: 'awed trembling gasp', delivery: 'on-screen lip-sync, frame-left, grabbing bystander', hindi: 'भाई ये मसाला किस ग्रह का है?!' },
          { speaker: 'NPC-2: CUSTOMER', role: 'npc2', voice: 'excited loud yell', delivery: 'on-screen lip-sync, frame-right, waving note', hindi: 'दस प्लेट पैक कर, हरी चटनी ज़्यादा!' },
        ],
      },
      {
        shot: 3, visual: 'Close-up on the spy’s crackling earpiece as he sweats behind a mountain of frying samosas.', sfx: 'Urgent radio beep', hindi: 'एजेंट, कवर छोड़ो, भीड़ बढ़ रही है!',
        turns: [
          { speaker: 'ENTITY: SPY EARPIECE', role: 'entity', voice: 'filtered tense radio command', delivery: 'tinny earpiece audio', hindi: 'एजेंट, कवर छोड़ो, भीड़ बढ़ रही है!' },
          { speaker: 'PROTAGONIST: AGENT', role: 'protagonist', voice: 'panicked whispered defense', delivery: 'on-screen lip-sync, flipping slotted spoon', hindi: 'सर, ये बैच जल जाएगा, दो मिनट!' },
        ],
      },
      {
        shot: 4, visual: 'The food inspector marches up with a microphone draping a marigold garland over the spy’s trench coat.', sfx: 'Dhol drum roll', hindi: 'शहर के नए समोसा सम्राट का स्वागत है!',
        turns: [{ speaker: 'NPC-1: INSPECTOR', role: 'npc1', voice: 'booming ceremonial announcer', delivery: 'on-screen lip-sync, holding mic', hindi: 'शहर के नए समोसा सम्राट का स्वागत है!' }],
      },
      {
        shot: 5, visual: 'Across the street, the mysterious trench-coated suspect lowers his newspaper and walks straight into the samosa queue.', sfx: 'Suspenseful bass pluck', hindi: 'टारगेट खुद लाइन में लग गया है।',
        turns: [{ speaker: 'NARRATOR (V.O.)', role: 'narrator', voice: 'dry noir voiceover', delivery: 'off-screen voiceover', hindi: 'टारगेट खुद लाइन में लग गया है।' }],
      },
      {
        shot: 6, visual: 'The suspect reaches the counter, slides ₹30 across, and deadpans his order to the stunned spy.', sfx: 'Coin clink, instant hard cut to black', hindi: 'दो प्लेट गरम देना, गिरफ्तारी बाद में।',
        turns: [{ speaker: 'NPC-2: SUSPECT', role: 'npc2', voice: 'velvet deadpan baritone', delivery: 'on-screen lip-sync, eye-to-eye with spy', hindi: 'दो प्लेट गरम देना, गिरफ्तारी बाद में।' }],
      },
    ],
  },
];
