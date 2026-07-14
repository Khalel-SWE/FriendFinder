import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../core/services/language';
import { Auth } from '../../core/services/auth'; // استدعينا الاوث سيرفيس عشان اللوج اوت

@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [],
  templateUrl: './account-menu.html', // شلنا .component
  styleUrl: './account-menu.css'      // شلنا .component
})
export class AccountMenuComponent {
  open = signal(false);

  constructor(public lang: LanguageService, private router: Router, private auth: Auth) {}

  toggle(): void { this.open.update(v => !v); }
  close(): void { this.open.set(false); }

  goTo(path: string): void {
    this.router.navigateByUrl(path);
    this.close();
  }

  logout(): void {
    // اللوج اوت الحقيقي
    localStorage.removeItem('auth_token');
    this.router.navigateByUrl('/login');
    this.close();
  }
}