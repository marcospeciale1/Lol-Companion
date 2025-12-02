/**
 * Pipe per formattare il testo delle abilità (sostituisce newline con <br>)
 * e restituisce HTML sanitizzato come `SafeHtml`.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formatAbilityText',
  standalone: true,
})
export class FormatAbilityTextPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    // Sostituisce le newline con <br>
    const formatted = value.replace(/\n/g, '<br>').trim();

    // Sanitizza e ritorna come HTML sicuro
    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }
}
