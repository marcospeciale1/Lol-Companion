/**
 * Componente lista rune
 * - Carica gli alberi rune dal servizio
 * - Fornisce ricerca e placeholder per le icone
 */
import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RuneService } from '../../../core/services/rune.service';
import { RunesReforged } from '../../../core/models/rune.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rune-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './rune-list.html',
  styleUrls: ['./rune-list.css'],
})
export class RuneList implements OnInit, OnDestroy {
  private readonly ddVersion = '15.23.1';

  runes = signal<RunesReforged[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  error = signal<string | null>(null);

  // Runes filtrate in base al termine di ricerca
  filtered = computed(() => {
    const q = this.searchTerm().trim().toLowerCase();
    if (!q) return this.runes();
    return this.runes().filter((r) => {
      const name = (r.name || '').toLowerCase();
      const key = (r.key || '').toLowerCase();
      return name.includes(q) || key.includes(q);
    });
  });

  private routerSub?: Subscription;

  constructor(private runeService: RuneService, private router: Router) {}

  ngOnInit(): void {
    this.loadRunes();

    this.routerSub = this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        if (ev.urlAfterRedirects.startsWith('/runes')) {
          this.loadRunes();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private loadRunes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.runeService.getAllRunes().subscribe(
      (res: any) => {
        // res is an array of rune trees; we filter only primary ones (no isAdvanced flag)
        const arr: RunesReforged[] = (Array.isArray(res) ? res : []).filter(
          (r: any) => !r.isAdvanced
        );
        this.runes.set(arr);
        this.loading.set(false);
        console.log('[RuneList] loaded rune trees:', arr.length);
      },
      () => {
        this.error.set('Impossibile caricare le rune');
        this.loading.set(false);
      }
    );
  }

  getRuneImageUrl(rune: any): string {
    return `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`;
  }

  onImageError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    img.src = this.placeholderDataUrl();
  }

  private placeholderDataUrl(): string {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="100%" height="100%" fill="%23e6e6e6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23777" font-size="12">rune</text></svg>';
  }
}
