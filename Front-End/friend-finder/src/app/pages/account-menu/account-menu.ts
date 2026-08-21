import { Component, OnInit, signal, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../core/services/language';
import { ProfileService } from '../../core/services/profile';

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

  profilePicture = signal<string | null>(null);


  constructor(
    public lang: LanguageService,
    private router: Router,
    private profileService: ProfileService,
    private eRef: ElementRef
  ) {}


  ngOnInit(): void {

    this.profileService.getMyProfile().subscribe({

      next: (res) => {

        this.fullName.set(
          `${res.firstName} ${res.lastName}`
        );

        this.initials.set(
          (
            res.firstName.charAt(0) +
            res.lastName.charAt(0)
          ).toUpperCase()
        );

        this.profilePicture.set(
          res.profilePicture ?? null
        );

      },

      error: (err) => {

        console.error(
          'Failed to load current user profile',
          err
        );

      }

    });

  }


  getProfileImageUrl(): string | null {

    const picture = this.profilePicture();

    if (!picture) {
      return null;
    }

    return picture.startsWith('http')
      ? picture
      : 'http://localhost:9090' + picture;
  }


  toggle(): void {

    this.open.update(
      value => !value
    );

  }


  close(): void {

    this.open.set(false);

  }


  goTo(path: string): void {

    this.router.navigateByUrl(path);

    this.close();

  }


  logout(): void {

    localStorage.removeItem('auth_token');

    localStorage.removeItem('role');

    this.router.navigateByUrl('/login');

    this.close();

  }


  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {

    if (
      !this.eRef.nativeElement.contains(
        event.target
      )
    ) {

      this.close();

    }

  }


  goToEditProfile(): void {

    this.open.set(false);

    this.router.navigate([
      '/edit-profile'
    ]);

  }

}