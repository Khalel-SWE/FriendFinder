import { Component, signal } from '@angular/core';
import { LanguageService } from '../../core/services/language';
import { Lang } from '../../i18n';

@Component({
  selector: 'app-language-menu',
  standalone: true,
  imports: [],
  templateUrl: './language-menu.component.html',
  styleUrl: './language-menu.component.css'
})
export class LanguageMenuComponent {
  open = signal(false);
  langs: Lang[] = ['en', 'ar', 'de'];
  labels: Record<Lang, string> = { en: 'English', ar: 'العربية', de: 'Deutsch' };
  codes: Record<Lang, string> = { en: 'EN', ar: 'AR', de: 'DE' };

  constructor(public lang: LanguageService) {}

  toggle(): void { this.open.update(v => !v); }
  close(): void { this.open.set(false); }
  choose(l: Lang): void { this.lang.setLang(l); this.close(); }
}