import { Routes, provideRouter } from '@angular/router';
// Import dei componenti standalone
import { HomeComponent } from './pages/home/home';
import { ChampionList } from './pages/champions/champion-list/champion-list';
import { ChampionDetail } from './pages/champions/champion-detail/champion-detail';
import { ItemList } from './pages/items/item-list/item-list';
import { ItemDetail } from './pages/items/item-detail/item-detail';
import { RuneList } from './pages/runes/rune-list/rune-list';
import { RuneDetail } from './pages/runes/rune-detail/rune-detail';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'champions', component: ChampionList },
  { path: 'champion/:id', component: ChampionDetail },
  { path: 'items', component: ItemList },
  { path: 'item/:id', component: ItemDetail },
  { path: 'runes', component: RuneList },
  { path: 'rune/:id', component: RuneDetail },
  { path: '**', redirectTo: '' }, // fallback per rotte non trovate
];

export const appRouterProviders = [provideRouter(routes)];
