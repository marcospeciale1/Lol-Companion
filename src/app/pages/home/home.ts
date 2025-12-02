/**
 * Pagina principale (home)
 * Visualizza una panoramica e link rapidi alle sezioni (champions, items, runes)
 */
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {}
