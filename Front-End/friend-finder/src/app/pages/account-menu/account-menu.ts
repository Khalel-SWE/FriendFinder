import { Component, OnInit, OnDestroy, signal, HostListener, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LanguageService } from '../../core/services/language';
import { ProfileService } from '../../core/services/profile';

@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [],
  templateUrl: './account-menu.html',
  styleUrl: './account-menu.css'
})
export class AccountMenu implements OnInit, OnDestroy {

  open = signal(false);

  fullName = signal<string>('');

  initials = signal<string>('..');

  profilePicture = signal<string | null>(null);

  private routerEventsSubscription?: Subscription;


  constructor(
    public lang: LanguageService,
    private router: Router,
    private profileService: ProfileService,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {

    this.loadProfile();
    this.routerEventsSubscription =
      this.router.events
        .pipe(
          filter(
            event => event instanceof NavigationEnd
          )
        )
        .subscribe(() => {

          this.loadProfile();

        });
  }

  ngOnDestroy(): void {

    this.routerEventsSubscription?.unsubscribe();

  }

  private loadProfile(): void {

    this.profileService
      .getMyProfile()
      .subscribe({

        next: (res) => {

          this.fullName.set(
            `${res.firstName} ${res.lastName}`
          );


          this.initials.set(
            (
              (res.firstName?.charAt(0) || '') +
              (res.lastName?.charAt(0) || '')
            ).toUpperCase()
          );


          this.profilePicture.set(
            res.profilePicture || null
          );

        },

        error: (err: unknown) => {

          console.error(
            'Failed to load account profile',
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

    if (picture.startsWith('http')) {
      return picture;
    }

    return `http://localhost:9090${picture}`;
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

  goToEditProfile(): void {

    this.close();

    this.router.navigate([
      '/edit-profile'
    ]);

  }

  logout(): void {

    localStorage.removeItem(
      'auth_token'
    );

    localStorage.removeItem(
      'role'
    );

    this.router.navigateByUrl(
      '/login'
    );

    this.close();

  }

  @HostListener(
    'document:click',
    ['$event']
  )
  clickout(event: Event): void {

    if (
      !this.eRef.nativeElement
        .contains(event.target)
    ) {

      this.close();

    }
  }
}