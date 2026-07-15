// import { Component, HostListener } from '@angular/core';
// import { RouterLink, Router } from '@angular/router';
// import { NgClass, NgIf } from '@angular/common';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [RouterLink, NgClass, NgIf],
//   templateUrl: './header.html',
//   styleUrl: './header.css'
// })
// export class Header {
//   currentLang: 'en' | 'ar' | 'de' = 'en';
//   isDropdownOpen = false;

//   // القاموس بعد إضافة اللوجين وتعديل الترجمة
//   dict = {
//     nav_home: { en: 'Home', ar: 'الرئيسية', de: 'Start' },
//     login_btn: { en: 'Sign In', ar: 'تسجيل الدخول', de: 'Anmelden' },
//     join_now: { en: 'Register', ar: 'إنشاء حساب', de: 'Registrieren' }
//   };

//   constructor(public router: Router) {}

//   toggleDropdown() {
//     this.isDropdownOpen = !this.isDropdownOpen;
//   }

//   @HostListener('document:click', ['$event'])
//   onDocumentClick(event: MouseEvent) {
//     const target = event.target as HTMLElement;
//     if (!target.closest('.lang-dropdown')) {
//       this.isDropdownOpen = false;
//     }
//   }

//   applyLang(lang: 'en' | 'ar' | 'de') {
//     this.currentLang = lang;
//     this.isDropdownOpen = false;
//     document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
//     document.documentElement.setAttribute('lang', lang);
    
//     if (lang === 'ar') {
//       document.body.classList.add('font-ar');
//     } else {
//       document.body.classList.remove('font-ar');
//     }
//   }
// }

import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs';
// استدعاء مكونات الناف بار الجديدة
import { NotificationBell } from '../notification-bell/notification-bell'; // تأكد من المسار
import { LanguageMenu } from '../language-menu/language-menu';           // تأكد من المسار
import { AccountMenu } from '../account-menu/account-menu';             // تأكد من المسار
import { LanguageService } from '../../core/services/language';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, NotificationBell, LanguageMenu, AccountMenu],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  isLoggedIn = false;
  private router = inject(Router);

  constructor(public lang: LanguageService) {}

  ngOnInit() {
    this.checkAuthStatus();

    // بنراقب أي تغيير في الصفحات عشان نحدث حالة اللوجين
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkAuthStatus();
    });
  }

  checkAuthStatus() {
    // لو التوكن موجود، يبقى اليوزر عامل لوجين
    this.isLoggedIn = !!localStorage.getItem('auth_token');
  }
}