import { Component, OnInit, inject, HostListener } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { filter } from 'rxjs';
import { SearchService } from '../../core/services/search';
import { NotificationBell } from '../notification-bell/notification-bell';
import { LanguageMenu } from '../language-menu/language-menu';
import { AccountMenu } from '../account-menu/account-menu';
import { LanguageService } from '../../core/services/language';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass, NotificationBell, LanguageMenu, AccountMenu],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  // المتغيرات اللي الـ HTML محتاجها
  isLoggedIn = false;
  isDropdownOpen = false;
  public router = inject(Router);

  dict: Record<string, Record<string, string>> = {
    login_btn: { en: 'Sign In', ar: 'تسجيل الدخول', de: 'Anmelden' },
    join_now: { en: 'Register', ar: 'إنشاء حساب', de: 'Konto erstellen' }
  };

  constructor(
    public lang: LanguageService,
    private searchService: SearchService
  ) {}

  get currentLang() { 
    return this.lang.currentLang(); 
  }

  ngOnInit() {
    this.checkAuthStatus();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkAuthStatus();
    });
  }

  checkAuthStatus() {
    this.isLoggedIn = !!localStorage.getItem('auth_token');
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  applyLang(lang: 'en' | 'ar' | 'de') {
    this.lang.setLang(lang);
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.lang-dropdown')) {
      this.isDropdownOpen = false;
    }
  }

  onSearchChange(event: Event) {
  const text = (event.target as HTMLInputElement).value;
  this.searchService.setQuery(text); // بنبعت النص للـ Service
}
}