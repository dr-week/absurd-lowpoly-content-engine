import type { TopicOption } from '../types';

/**
 * Additional Movie & Global Meme Parody episodes (< 10s, 5-shot / 3-dialogue pacing).
 */
export const MOVIE_MEME_STORIES_B: readonly TopicOption[] = [
  {
    id: 'movie_jaack_chidiya_samosa_compass',
    title: 'JAACK-CHIDIYA’S MAGIC COMPASS LEADS PIRATES TO A ₹10 SAMOSA CART',
    angle: 'fake-origin',
    brand: 'Jaack-Chidiya',
    visualStyle: 'claymation-stopmo',
    trendHook: 'Movie Parody: Legendary Treasure Compass vs Hot Evening Samosas',
    pitch: 'Wobbly pirate captain Jaack-Chidiya sails an entire crew across stormy clay oceans following his magic compass—only to dock directly beside a ₹10 roadside samosa cart.',
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Clay ship deck shot', action: 'Jaack-Chidiya in glittery purple kurta wobbles across a clay ship clutching a ticking plastic compass.', caption: 'Jaadui compass khazana dikhata.' },
      { frame: 2, position: 'Top Center', framing: 'Compass close-up', action: 'The crooked red needle spins wildly and locks dead-center through thick fog.', caption: 'Sui seedhi ruk gayi!' },
      { frame: 3, position: 'Top Right', framing: 'Stormy ocean wide shot', action: 'Twelve clay pirates row furiously over giant turquoise clay waves shouting for gold.', caption: 'Sona milne wala hai!' },
      { frame: 4, position: 'Bottom Left', framing: 'Beach landing shot', action: 'The wooden ship crashes straight onto a paved street right next to a steaming brass samosa kadhai.', caption: 'Seedha thele pe pahunche!' },
      { frame: 5, position: 'Bottom Center', framing: 'Cart close-up', action: 'Jaack-Chidiya beams proudly as the compass needle points straight at a hot crispy ₹10 samosa.', caption: 'Asli khazana mil gaya.' },
      { frame: 6, position: 'Bottom Right', framing: 'Deadpan crew shot', action: 'The entire pirate crew silently pulls out ₹10 coins and queues up for extra green chutney.', caption: 'Sab chutney maangne lage.' },
    ],
    shots: [
      { shot: 1, visual: 'Handcrafted claymation ship: Jaack-Chidiya in purple kurta holds up a wobbling plastic compass in stormy waves.', sfx: 'Creaking ship wood and pirate flute', hindi: 'मेरा कम्पास असली खज़ाना दिखाता है।',
        turns: [{ speaker: 'PROTAGONIST: JAACK-CHIDIYA', role: 'protagonist', voice: 'wobbly eccentric theatrical pirate drawl', delivery: 'on-screen lip-sync, waving hand', hindi: 'मेरा कम्पास असली खज़ाना दिखाता है।' }] },
      { shot: 2, visual: 'The clay ship skids right off the ocean onto a street corner stopping beside a hot samosa cart.', sfx: 'Wet clay skid and sizzling oil', hindi: 'दो गरम समोसे हरी चटनी डालके।',
        turns: [{ speaker: 'PROTAGONIST: JAACK-CHIDIYA', role: 'protagonist', voice: 'delighted casual street order', delivery: 'on-screen lip-sync, leaning on cart', hindi: 'दो गरम समोसे हरी चटनी डालके।' }] },
      { shot: 3, visual: 'Close-up of the magic compass needle pointing dead-center at a steaming golden samosa.', sfx: 'Magical twinkle chime', hindi: 'खज़ाना।' },
      { shot: 4, visual: 'Twelve stunned clay pirates stare at the samosa, nod in unison, and dig coins from their pockets.', sfx: 'Clinking coins', hindi: 'दस रुपये।' },
      { shot: 5, visual: 'The samosa vendor calmly scoops green chutney onto a paper plate as pirates line up neatly.', sfx: 'Ladle splash, instant hard cut to black', hindi: 'तीखी चटनी एक्स्ट्रा पड़ेगी।',
        turns: [{ speaker: 'COUNTERPART: VENDOR', role: 'npc1', voice: 'bored raspy streetwise monotone', delivery: 'on-screen lip-sync, scooping chutney', hindi: 'तीखी चटनी एक्स्ट्रा पड़ेगी।' }] },
    ],
  },
  {
    id: 'meme_ceejaye_elevator_stuck',
    title: 'CEE-JAYE SIGHS "PHIR SE SHURU" AS HIS LIFT STOPS AT FLOOR 13.5',
    angle: 'breaking-news',
    brand: 'Cee-Jaye',
    visualStyle: 'vhs-found-footage',
    trendHook: 'Global Meme Parody: Retro Street Guy vs Glitching Apartment Elevator',
    pitch: 'Deadpan retro guy Cee-Jaye steps into a normal apartment lift for Floor 4—only for the VHS display to blink "FLOOR 13.5" and open onto a completely random desert highway.',
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Elevator wide shot', action: 'Cee-Jaye in crisp white cotton vest and baggy shorts presses Floor 4 inside a flickering apartment lift.', caption: 'Bas 4th floor jana tha.' },
      { frame: 2, position: 'Top Center', framing: 'Display close-up', action: 'The red LED floor counter glitches past 4, 9, 12 and freezes on "13.5" with a loud buzz.', caption: 'Lift 13.5 pe ruk gayi.' },
      { frame: 3, position: 'Top Right', framing: 'Door opening shot', action: 'The rusted metal doors slide open revealing an endless sunny desert highway with a lone camel.', caption: 'Darwaze ke bahar registan!' },
      { frame: 4, position: 'Bottom Left', framing: 'Deadpan reaction shot', action: 'Cee-Jaye does not even blink; he just sighs heavily and rubs his forehead.', caption: 'Phir se wahi natak.' },
      { frame: 5, position: 'Bottom Center', framing: 'Camel shot', action: 'The passing camel peeks inside the elevator, presses the "CLOSE DOOR" button with its nose, and walks off.', caption: 'Oont ne button daba diya.' },
      { frame: 6, position: 'Bottom Right', framing: 'Deadpan close-up', action: 'Cee-Jaye stares straight into the VHS lens as the lift calmly plays cheerful jazz music.', caption: 'Roz ka kaam ho gaya.' },
    ],
    shots: [
      { shot: 1, visual: '1990s VHS camcorder shot inside a shaky elevator: Cee-Jaye in white vest presses Floor 4 as the LED glitches to 13.5.', sfx: 'VHS tape hum and broken elevator ding', hindi: 'अरे यार, फिर से शुरू।',
        turns: [{ speaker: 'PROTAGONIST: CEE-JAYE', role: 'protagonist', voice: 'tired deadpan iconic low sigh', delivery: 'on-screen lip-sync, shaking head', hindi: 'अरे यार, फिर से शुरू।' }] },
      { shot: 2, visual: 'The metal lift doors slide open onto a wide sunny desert road where a confused camel walks past.', sfx: 'Rusty door slide and desert wind', hindi: 'चौथा फ्लोर आज रेगिस्तान बन गया।',
        turns: [{ speaker: 'NARRATOR (V.O.)', role: 'narrator', voice: 'dry deadpan Indian studio baritone', delivery: 'off-screen voiceover', hindi: 'चौथा फ्लोर आज रेगिस्तान बन गया।' }] },
      { shot: 3, visual: 'The camel leans its head inside the lift, blinks once at Cee-Jaye, and nudges the Close button.', sfx: 'Plastic elevator button click', hindi: 'बंद।' },
      { shot: 4, visual: 'The doors slide smoothly shut while cheerful tinny elevator music starts playing.', sfx: 'Tinny elevator chime melody', hindi: 'संगीत।' },
      { shot: 5, visual: 'Cee-Jaye stares deadpan straight into the VHS camera and shrugs calmly.', sfx: 'Tape static pop, instant hard cut to black', hindi: 'कल से सीढ़ी ही लूँगा।',
        turns: [{ speaker: 'PROTAGONIST: CEE-JAYE', role: 'protagonist', voice: 'flat unbothered deadpan mutter', delivery: 'on-screen lip-sync, staring at lens', hindi: 'कल से सीढ़ी ही लूँगा।' }] },
    ],
  },
];
