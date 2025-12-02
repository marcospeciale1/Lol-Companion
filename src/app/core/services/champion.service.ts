import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChampionService {
  private readonly version = '15.23.1';
  private readonly dataUrl = `https://ddragon.leagueoflegends.com/cdn/${this.version}/data/it_IT`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches all available champions
   */
  getAllChampions(): Observable<any> {
    return this.http
      .get<any>(`${this.dataUrl}/champion.json`)
      .pipe(map((response) => Object.values(response.data)));
  }

  /**
   * Gets details for a specific champion by name
   */
  getChampionDetails(championName: string): Observable<any> {
    const name = championName;
    return this.http.get<any>(`${this.dataUrl}/champion/${name}.json`).pipe(
      map((response) => response.data?.[name]),
      catchError((err) => {
        // Fallback to searching in the full champion list if not found
        if (err && err.status === 404) {
          return this.http.get<any>(`${this.dataUrl}/champion.json`).pipe(
            map((listResp) => {
              const data = listResp?.data || {};
              const foundKey = Object.keys(data).find(
                (k) =>
                  k.toLowerCase() === name.toLowerCase() ||
                  (data[k]?.id && data[k].id.toLowerCase() === name.toLowerCase()) ||
                  (data[k]?.key && String(data[k].key) === String(name))
              );
              const result = foundKey ? data[foundKey] : null;
              return result;
            })
          );
        }
        return throwError(() => err);
      })
    );
  }

  /**
   * Gets splash image URL
   */
  getSplashUrl(championId: string, skinNum: number = 0): string {
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_${skinNum}.jpg`;
  }

  /**
   * Gets ability icon URL
   */
  getAbilityIconUrl(imageName: string): string {
    if (!imageName) return '';
    if (imageName.startsWith('http')) return imageName;
    const url = `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/spell/${imageName}`;
    return url;
  }
}
