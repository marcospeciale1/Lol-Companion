/**
 * Componente lista campioni
 * - Carica e mostra tutti i campioni
 * - Gestisce la ricerca locale e lo stato di caricamento
 */
import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChampionService } from '../../../core/services/champion.service';

@Component({
  selector: 'app-champion-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './champion-list.html',
  styleUrls: ['./champion-list.css'],
})
export class ChampionList implements OnInit {
  champions = signal<any[]>([]);
  filteredChampions = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal<string>('');

  constructor(private championService: ChampionService) {}

  ngOnInit() {
    this.loadChampions();
  }

  loadChampions() {
    this.loading.set(true);
    this.error.set(null);
    this.championService.getAllChampions().subscribe({
      next: (championsArray: any[]) => {
        this.champions.set(championsArray);
        this.filteredChampions.set(championsArray);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(`Errore: ${err.status} - ${err.statusText || err.message}`);
        this.loading.set(false);
      },
    });
  }

  /**
   * Gestisce gli errori di caricamento immagini
   */
  onImageError(event: any) {
    event.target.src = './assets/lol-companion-logo.jpeg';
  }

  /**
   * Ritorna l'URL dell'immagine splash del champion
   */
  getChampionImageUrl(champion: any): string {
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;
  }

  /**
   * Filtra i champion in base al termine di ricerca (dinamico, mentre digiti)
   */
  search() {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) {
      // Se il termine è vuoto, mostra tutti i champion
      this.filteredChampions.set(this.champions());
    } else {
      // Filtra per nome
      const filtered = this.champions().filter((champion: any) =>
        champion.name?.toLowerCase().includes(term)
      );
      this.filteredChampions.set(filtered);
    }
  }
}
