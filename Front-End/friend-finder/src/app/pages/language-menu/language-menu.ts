import { Component, signal } from '@angular/core';
import { LanguageService } from '../../core/services/language';
import { Lang } from '../../i18n';

@Component({
  selector: 'app-language-menu',
  standalone: true,
  imports: [],
  templateUrl: './language-menu.html', // شلنا .component
  styleUrl: './language-menu.css'      // شلنا .component
})
export class LanguageMenu {
  open = signal(false);
  langs: Lang[] = ['en', 'ar', 'de'];
  labels: Record<Lang, string> = { en: 'English', ar: 'العربية', de: 'Deutsch' };
  codes: Record<Lang, string> = { en: 'EN', ar: 'AR', de: 'DE' };

  constructor(public lang: LanguageService) {}

  toggle(): void { this.open.update(v => !v); }
  close(): void { this.open.set(false); }
  choose(l: Lang): void { this.lang.setLang(l); this.close(); }
}