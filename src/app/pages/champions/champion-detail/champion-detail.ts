/**
 * Pagina dettaglio campione
 * - Recupera i dettagli del campione selezionato
 * - Fornisce helper per splash, skin e icone abilità
 */
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChampionService } from '../../../core/services/champion.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-champion-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './champion-detail.html',
  styleUrls: ['./champion-detail.css'],
})
export class ChampionDetail implements OnInit, OnDestroy {
  champion: any = null;
  loading: boolean = false;
  error: string | null = null;
  selectedSkinNum = 0;
  selectedSpellIndex: number | null = null;
  private destroy$ = new Subject<void>();

  private route = inject(ActivatedRoute);
  private championService = inject(ChampionService);
  private cdr = inject(ChangeDetectorRef);

  // Inizializza la pagina e carica i dettagli del campione
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const championName = params['id'];
      this.loadChampionDetails(championName);
    });
  }
  // Pulisce le sottoscrizioni per evitare memory leak
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Carica i dettagli del campione
  loadChampionDetails(championName: string): void {
    this.loading = true;
    this.error = null;
    this.championService.getChampionDetails(championName).subscribe({
      next: (data) => {
        if (data && data.data && data.data[championName]) {
          this.champion = data.data[championName];
        } else {
          this.champion = data;
        }
        this.selectedSkinNum = 0;
        this.selectedSpellIndex = null;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = `Errore nel caricamento del campione: ${err.status || 'sconosciuto'}`;
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }
  // Gestisce la selezione della skin
  selectSkin(skinNum: number): void {
    this.selectedSkinNum = skinNum;
  }

  selectSpell(index: number): void {
    this.selectedSpellIndex = this.selectedSpellIndex === index ? null : index;
  }

  getSplashUrl(): string {
    if (!this.champion) return '';
    return this.championService.getSplashUrl(this.champion.id, this.selectedSkinNum);
  }

  getSkinSplashUrl(skinNum: number): string {
    if (!this.champion) return '';
    return this.championService.getSplashUrl(this.champion.id, skinNum);
  }

  // Helper per ottenere l'icona di un'abilità
  getAbilityIconUrl(imageName: string): string {
    return this.championService.getAbilityIconUrl(imageName);
  }

  // Helper per ottenere l'icona della passiva
  getPassiveIconUrl(filename: string): string {
    if (!filename) return 'assets/default-ability.png'; // fallback se manca
    return `https://ddragon.leagueoflegends.com/cdn/15.23.1/img/passive/${filename}`;
  }
  // Gestisce gli errori di caricamento immagini
  onImageError(event: any): void {
    event.target.src = 'assets/lol-companion-logo.jpeg';
  }
}
