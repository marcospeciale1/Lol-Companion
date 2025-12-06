/**
 * Service per gli item.
 * Fornisce metodi per recuperare la lista items, dettagli e URL delle immagini.
 * Implementa una cache semplice tramite `shareReplay`.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly version = '15.24.1';
  private readonly dataUrl = `https://ddragon.leagueoflegends.com/cdn/${this.version}/data/en_US`;
  private itemsCache$: Observable<any> | null = null;

  // Mapping per tradurre i nomi delle statistiche
  private statNames: { [key: string]: string } = {
    FlatHPPoolMod: 'Salute',
    FlatMPPoolMod: 'Mana',
    FlatArmorMod: 'Armatura',
    FlatSpellBlockMod: 'Resistenza Magica',
    FlatPhysicalDamageMod: 'Danno Fisico',
    FlatMagicDamageMod: 'Danno Magico',
    FlatMovementSpeedMod: 'Velocità Movimento',
    FlatAttackSpeedMod: 'Velocità Attacco',
    PercentAttackSpeedMod: 'Velocità Attacco %',
    FlatCritChanceMod: 'Probabilità Critico',
    FlatHPRegenMod: 'Rigenerazione Salute',
    FlatMPRegenMod: 'Rigenerazione Mana',
    rFlatGoldPer10Mod: 'Oro ogni 10s',
    rPercentCooldownMod: 'Riduzione Ricarica %',
    rFlatMagicPenetrationMod: 'Penetrazione Magica',
    PercentLifeStealMod: 'Vampirismo',
    PercentSpellVampMod: 'Vampirismo Magico',
  };

  constructor(private http: HttpClient) {}

  /**
   * Ottiene tutti gli items disponibili con cache
   */
  getAllItems(): Observable<any> {
    if (!this.itemsCache$) {
      this.itemsCache$ = this.http.get(`${this.dataUrl}/item.json`).pipe(shareReplay(1));
    }
    return this.itemsCache$;
  }

  /**
   * Ottiene i dettagli di un singolo item con accesso ai dati completi per risolvere componenti
   */
  getItemDetails(itemId: string): Observable<any> {
    return this.getAllItems().pipe(
      map((res) => {
        const item = res?.data?.[itemId];
        if (!item) return null;
        // Arricchisci item con nomi dei componenti
        if (item.from?.length) {
          item._fromItems = item.from.map((id: string) => ({
            id,
            name: res.data?.[id]?.name || `Item ${id}`,
            image: res.data?.[id]?.image?.full,
          }));
        }
        if (item.into?.length) {
          item._intoItems = item.into.map((id: string) => ({
            id,
            name: res.data?.[id]?.name || `Item ${id}`,
            image: res.data?.[id]?.image?.full,
          }));
        }
        return item;
      })
    );
  }

  /**
   * Filtra le statistiche (mostra solo quelle > 0)
   */
  getFilteredStats(stats: any): { [key: string]: number } {
    if (!stats) return {};
    const filtered: { [key: string]: number } = {};
    Object.keys(stats).forEach((key) => {
      const val = stats[key];
      if (typeof val === 'number' && val !== 0) {
        filtered[key] = val;
      }
    });
    return filtered;
  }

  /**
   * Traduce il nome di una statistica
   */
  getStatDisplayName(statKey: string): string {
    return this.statNames[statKey] || statKey;
  }

  /**
   * Ritorna l'URL dell'immagine dell'item
   */
  getItemImageUrl(imageName?: string): string {
    if (!imageName) return '';
    if (typeof imageName !== 'string') return '';
    if (imageName.startsWith('http')) return imageName;
    return `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/item/${imageName}`;
  }
}
