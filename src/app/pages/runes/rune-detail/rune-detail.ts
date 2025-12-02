/**
 * Pagina dettaglio rune
 * Mostra i dettagli di un albero rune e fornisce helper per le icone
 */
import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RuneService } from '../../../core/services/rune.service';
import { RunesReforged, RuneSlot } from '../../../core/models/rune.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-rune-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './rune-detail.html',
  styleUrls: ['./rune-detail.css'],
})
export class RuneDetail implements OnInit, OnDestroy {
  runeTree: RunesReforged | null = null;
  loading: boolean = false;
  error: string | null = null;
  hoveredRuneId: number | null = null;
  private destroy$ = new Subject<void>();

  private route = inject(ActivatedRoute);
  private runeService = inject(RuneService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const runeKey = params['id'];
      this.loadRuneTree(runeKey);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRuneTree(runeKey: string): void {
    this.loading = true;
    this.error = null;
    this.runeService.getRuneTreeByKey(runeKey).subscribe({
      next: (found) => {
        if (found) {
          this.runeTree = found;
        } else {
          this.error = `Albero di rune non trovato: ${runeKey}`;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('[RuneDetail] Errore nel caricamento:', err);
        this.error = `Errore nel caricamento dell'albero: ${err.status || 'sconosciuto'}`;
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  // Ritorna l'URL dell'immagine di una runa
  getRuneImageUrl(iconPath?: string | null): string {
    if (!iconPath) return 'assets/lol-companion-logo.jpeg';
    if (iconPath.startsWith('http')) return iconPath;
    return `https://ddragon.leagueoflegends.com/cdn/img/${iconPath}`;
  }

  // Imposta la runa attualmente evidenziata (hover)
  setHoveredRune(runeId: number | null): void {
    this.hoveredRuneId = runeId;
  }

  onImageError(event: any): void {
    const img = event?.target as HTMLImageElement | null;
    if (img) img.src = 'assets/lol-companion-logo.jpeg';
  }

  // Pulisce il testo rimuovendo i tag HTML
  sanitizeHtml(html?: string | null): string {
    if (!html) return '';
    // Rimuove i tag HTML e decodifica le entità
    return html
      .replace(/<[^>]*>/g, '') // rimuove tutti i tag HTML
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#x27;/g, "'")
      .replace(/<br\s*\/?>/gi, '\n')
      .trim();
  }
}
