/**
 * Type definitions for DDragon `item.json` entries (localized)
 */

export interface ItemImage {
  full: string; // filename e.g. 1001.png
  sprite?: string;
  group?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export interface ItemGold {
  base?: number;
  total?: number;
  sell?: number;
  purchasable?: boolean;
}

export interface ItemStats {
  [key: string]: number | undefined;
}

export interface ItemTagMap {
  [mapId: string]: boolean;
}

export interface Item {
  id: string; // numeric string key
  name?: string;
  description?: string;
  plaintext?: string;
  colloq?: string;
  into?: string[];
  from?: string[];
  image?: ItemImage;
  gold?: ItemGold;
  tags?: string[];
  maps?: ItemTagMap;
  stats?: ItemStats;
  group?: string;
  depth?: number;
  [k: string]: any;
}

export type ItemJson = { [id: string]: Item };
