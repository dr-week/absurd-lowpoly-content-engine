export interface CharacterPreset {
  id: string;
  label: string;
  starter: string;
}

export const CHARACTER_ROSTER: readonly CharacterPreset[] = [
  { id: 'elon', label: 'Elon', starter: 'Elon Musk builds an orbital rig for ' },
  { id: 'trump', label: 'Trump', starter: 'Trump negotiates a 200% deal over ' },
  { id: 'gandhi', label: 'Gandhiji', starter: 'Young Gandhiji silently solves ' },
  { id: 'putin', label: 'Putin', starter: 'Putin opens an underground silo for ' },
  { id: 'modi', label: 'Modi', starter: 'Modi holds a live televised ribbon-cutting for ' },
  { id: 'goa', label: 'Goa Uncle', starter: 'Retired Goa shack uncle invents ' },
  { id: 'mit', label: 'MIT Lab', starter: 'MIT scientists run a 40-crore study on ' },
];
