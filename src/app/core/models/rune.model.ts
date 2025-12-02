/**
 * Type definitions for DDragon runesReforged.json (localized)
 */

export interface RuneImage {
  w: number;
  h: number;
  png: string; // URL to icon
  full?: string;
}

export interface Rune {
  id: number;
  key: string;
  icon: string; // perk image path or URL
  name: string;
  shortDesc?: string;
  longDesc?: string;
}

export interface RuneSlot {
  runes: Rune[];
}

export interface RuneTree {
  id: number;
  key: string;
  icon: string; // tree/branch icon
  name: string;
  slots?: RuneSlot[];
}

export interface RunesReforged {
  id: number;
  key: string;
  icon?: string; // primary tree icon (e.g., Precision, Domination...)
  name: string;
  slots: RuneSlot[];
}
