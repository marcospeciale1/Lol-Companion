/**
 * Rappresenta la struttura base di un campione come fornita dall'endpoint
 * generale di DDragon.
 */
export interface ImageRef {
  full: string;
  sprite?: string;
  group?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export interface Passive {
  name: string;
  description: string;
  image?: ImageRef;
}

export interface Spell {
  id?: string;
  name: string;
  description: string;
  tooltip?: string;
  leveltip?: any;
  maxrank?: number;
  cooldown?: any;
  cost?: any;
  range?: any;
  image?: ImageRef;
}

export interface Skin {
  id?: string;
  num: number;
  name: string;
}

export interface Champion {
  id: string; // e.g. "Ahri"
  key?: string; // numeric string id
  name: string;
  title?: string;
  image?: ImageRef;
  info?: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  stats?: {
    hp?: number;
    mp?: number;
    armor?: number;
    spellblock?: number;
    attackdamage?: number;
    movespeed?: number;
    [k: string]: any;
  };
  lore?: string;
  blurb?: string;
  tags?: string[];
  passive?: Passive;
  spells?: Spell[];
  skins?: Skin[];
  [k: string]: any;
}
