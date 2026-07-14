import { Injectable, signal } from '@angular/core';
import { Lang, TRANSLATIONS } from '../../i18n';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  currentLang = signal<Lang>('en');

  setLang(lang: Lang): void {
    this.currentLang.set(lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    document.body.classList.toggle('font-ar', lang === 'ar');
  }

  t(key: string): string {
    return TRANSLATIONS[key]?.[this.currentLang()] ?? key;
  }
}