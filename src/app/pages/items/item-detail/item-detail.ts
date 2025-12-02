import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
/**
 * Pagina dettaglio item
 * Mostra le informazioni dettagliate di un item singolo e le relative immagini
 */
import { ActivatedRoute, RouterModule, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../../core/services/item.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './item-detail.html',
  styleUrls: ['./item-detail.css'],
})
export class ItemDetail implements OnInit, OnDestroy {
  item: any = null;
  loading: boolean = true;
  error: string | null = null;
  filteredStats: { [key: string]: number } = {};

  private destroy$ = new Subject<void>();

  private route = inject(ActivatedRoute);
  public itemService = inject(ItemService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: any) => {
      const id = params['id'];
      if (id) {
        this.loadItemDetails(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadItemDetails(itemId: string): void {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();
    this.itemService
      .getItemDetails(itemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.item = data;
          this.filteredStats = this.itemService.getFilteredStats(data?.stats || {});
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error = `Errore nel caricamento dell'item: ${err?.status || 'sconosciuto'}`;
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  getItemImageUrl(imageName?: string): string {
    const name = imageName || this.item?.image?.full;
    const url = this.itemService.getItemImageUrl(name);
    return url || 'assets/lol-companion-logo.jpeg';
  }

  // Ritorna il nome visualizzato di una statistica
  getStatName(key: string): string {
    return this.itemService.getStatDisplayName(key);
  }

  onImageError(event: any): void {
    const img = event?.target as HTMLImageElement | null;
    if (img) img.src = 'assets/lol-companion-logo.jpeg';
  }

  // Ritorna l'URL dell'immagine di un componente dell'item
  getComponentImageUrl(imagePath?: string): string {
    return this.itemService.getItemImageUrl(imagePath);
  }

  // Ritorna le chiavi di un oggetto
  objectKeys(obj?: any): string[] {
    return Object.keys(obj || {});
  }
}
