import { Component, OnInit, OnDestroy, signal, computed, Signal } from '@angular/core';
/**
 * Lista oggetti — componente che mostra gli item e permette la navigazione
 */
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../core/models/item.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './item-list.html',
  styleUrls: ['./item-list.css'],
})
export class ItemList implements OnInit, OnDestroy {
  private readonly ddVersion = '15.23.1';

  items = signal<Item[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  error = signal<string | null>(null);

  // Items filtrati in base al termine di ricerca
  filtered = computed(() => {
    const q = this.searchTerm().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter((it) => {
      const name = (it.name || '').toLowerCase();
      const plain = (it.plaintext || '').toLowerCase();
      return name.includes(q) || plain.includes(q) || (it.id || '').toString().includes(q);
    });
  });

  // Sottoscrizione agli eventi del router per ricaricare gli item quando si naviga nuovamente alla lista
  private routerSub?: Subscription;

  constructor(private itemService: ItemService, private router: Router) {}

  ngOnInit(): void {
    this.loadItems();

    // Sottoscrizione agli eventi di navigazione per ricaricare gli item se si torna alla lista
    this.routerSub = this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        // Se la navigazione è verso /items, ricarica gli item
        if (ev.urlAfterRedirects.startsWith('/items')) {
          // evita di sovraccaricare le richieste se è già in caricamento
          this.loadItems();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private loadItems(): void {
    this.loading.set(true);
    this.error.set(null);

    // Carica tutti gli item dal servizio
    this.itemService.getAllItems().subscribe(
      (res: any) => {
        const map = res && res.data ? res.data : res || {};
        const arr: Item[] = Object.keys(map)
          .map((k) => ({ id: k, ...map[k] }))
          .filter(
            (item) =>
              item.maps?.[11] === true && // oggetti usabili in Summoner's Rift
              item.gold?.purchasable !== false && // esclude oggetti non comprabili
              item.inStore !== false && // esclude oggetti "nascosti"
              !item.requiredChampion // esclude oggetti specifici
          );
        this.items.set(arr);
        this.loading.set(false);
      },
      (err) => {
        this.error.set('Impossibile caricare gli oggetti');
        this.loading.set(false);
      }
    );
  }

  onSearch(ev: Event) {
    const val = (ev.target as HTMLInputElement).value || '';
    this.searchTerm.set(val);
  }

  getItemImageUrl(item: Item): string {
    const filename = item?.image?.full || '';
    if (!filename) return this.placeholderDataUrl();
    return `https://ddragon.leagueoflegends.com/cdn/${this.ddVersion}/img/item/${filename}`;
  }

  onImageError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    img.src = this.placeholderDataUrl();
  }

  getOverlayText(item: Item): string {
    // Safely compute overlay text to avoid template "possibly undefined" errors
    const total = item?.gold?.total;
    if (typeof total === 'number') return `${total} g`;
    const tags = item?.tags;
    if (Array.isArray(tags) && tags.length) return tags.join(', ');
    return 'Item';
  }

  private placeholderDataUrl(): string {
    // simple gray SVG placeholder embedded as data URL
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="100%" height="100%" fill="%23e6e6e6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23777" font-size="12">item</text></svg>';
  }
}
