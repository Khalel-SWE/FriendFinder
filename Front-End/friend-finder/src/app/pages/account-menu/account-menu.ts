import { Component, OnInit, signal, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../core/services/language';
import { ProfileService } from '../../core/services/profile'; // ضفنا ده

@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [],
  templateUrl: './account-menu.html',
  styleUrl: './account-menu.css'
})
export class AccountMenu implements OnInit {
  open = signal(false);
  fullName = signal<string>('');
  initials = signal<string>('..');

  constructor(
    public lang: LanguageService, 
    private router: Router,
    private profileService: ProfileService,
    private eRef: ElementRef
  ) {}

  ngOnInit() {
    // بنجيب داتا اليوزر أول ما الكومبوننت يفتح
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        this.fullName.set(`${res.firstName} ${res.lastName}`);
        this.initials.set((res.firstName.charAt(0) + res.lastName.charAt(0)).toUpperCase());
      }
    });
  }

  toggle(): void { this.open.update(v => !v); }
  close(): void { this.open.set(false); }

  goTo(path: string): void {
    this.router.navigateByUrl(path);
    this.close();
  }

  logout(): void {
    // بنمسح التوكن ونرميه برا
    localStorage.removeItem('auth_token');
    this.router.navigateByUrl('/login');
    this.close();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  goToEditProfile(): void {
    this.open.set(false); // بتقفل القائمة المنسدلة
    this.router.navigate(['/edit-profile']); // بتنقل لصفحة التعديل فوراً
  }
}