// Curated Indian everyday + surreal randomization dictionaries (zero external cost)

export const INDIAN_PROPS: readonly string[] = [
  'steel tiffin box', 'faded UPI QR standee', 'plastic red stool', 'broken umbrella',
  'aluminium chai kettle', 'leather chappal', 'laminated Aadhaar card', 'wooden lunch plaque',
  'battery-powered fan mask', 'cracked smartphone', 'stainless steel water bottle',
  'yellow meter box', 'blue Paytm soundbox', 'Parle-G biscuit pack', 'cardboard office file',
  'dusty ceiling fan', 'red plastic bucket', 'wedding buffet spoon',
];

export const INDIAN_LOCATIONS: readonly string[] = [
  'Connaught Place footpath', 'Andheri local platform', 'Bengaluru Silk Board signal',
  'Noida Sector 18 metro gate', 'old SBI branch Counter 4', 'Kota coaching terrace',
  'Chandni Chowk paan tapri', 'Gurugram high-rise balcony', 'Mumbai airport security line',
  'Patna highway petrol pump', 'Jaipur shaadi marquee', 'hostel mess hall at 1 PM',
];

export const DEADPAN_REACTIONS: readonly string[] = [
  'OTP batao, rating 5 dena.', 'Teen baje ke baad aana.', 'Chhutta nahi hai bhaiya.',
  'Cancel kar do, cash chalenge.', 'Sir, raita extra lagega.', 'Zero dekh liya tha na?',
  'Beta, chappal utaar ke baith.', 'Pankha 3 pe chalao, kaafi hai.',
  'Bhaiya, 2 rupaye parcel ka alag.', 'Set hai? Gel laga doon?',
  'Sir, zero processing fee hai.', 'Andar bohot jagah hai bhai.',
];

export const SURREAL_MODIFIERS: readonly string[] = [
  'at 12fps jerky speed', 'with zero rotation', 'while ignoring gravity',
  'leaving a neat rectangular cutout', 'inside thick grey fog', 'like a rigid statue',
  'while traffic glides past unbothered', 'in dead silence',
];

export function pickRandom<T>(list: readonly T[], rng: () => number = Math.random): T {
  return list[Math.floor(rng() * list.length)];
}
