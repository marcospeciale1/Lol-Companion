/**
 * Service per le rune.
 * Espone metodi per ottenere tutte le rune e per cercare un albero rune per chiave.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RunesReforged } from '../models/rune.model';

@Injectable({
  providedIn: 'root',
})
export class RuneService {
  private readonly version = '15.24.1';
  private readonly dataUrl = `https://ddragon.leagueoflegends.com/cdn/${this.version}/data/en_US`;

  constructor(private http: HttpClient) {}

  /**
   * Ottiene tutte le rune disponibili
   */
  getAllRunes(): Observable<any> {
    return this.http.get(`${this.dataUrl}/runesReforged.json`);
  }

  /**
   * Ottiene un singolo albero di rune per chiave (e.g. "Domination").
   */
  getRuneTreeByKey(key: string): Observable<RunesReforged | null> {
    return this.getAllRunes().pipe(
      map((res: any) => {
        const arr = Array.isArray(res) ? res : [];
        const found = arr.find((r: any) => String(r.key) === String(key));
        return (found as RunesReforged) || null;
      })
    );
  }
}
