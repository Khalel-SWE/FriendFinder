import { Component, HostListener } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  currentLang: 'en' | 'ar' | 'de' = 'en';
  isDropdownOpen = false;

  // القاموس بعد إضافة اللوجين وتعديل الترجمة
  dict = {
    nav_home: { en: 'Home', ar: 'الرئيسية', de: 'Start' },
    login_btn: { en: 'Sign In', ar: 'تسجيل الدخول', de: 'Anmelden' },
    join_now: { en: 'Register', ar: 'إنشاء حساب', de: 'Registrieren' }
  };

  constructor(public router: Router) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.lang-dropdown')) {
      this.isDropdownOpen = false;
    }
  }

  applyLang(lang: 'en' | 'ar' | 'de') {
    this.currentLang = lang;
    this.isDropdownOpen = false;
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    
    if (lang === 'ar') {
      document.body.classList.add('font-ar');
    } else {
      document.body.classList.remove('font-ar');
    }
  }
}