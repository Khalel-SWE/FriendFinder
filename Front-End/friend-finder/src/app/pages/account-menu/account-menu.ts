import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  HostListener,
  ElementRef
} from '@angular/core';

import {
  Router,
  NavigationEnd
} from '@angular/router';

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

    /*
     * تحميل البروفايل أول مرة
     */
    this.loadProfile();


    /*
     * كل Navigation جديد:
     *
     * مثال:
     * Edit Profile
     *     ↓
     * Save
     *     ↓
     * Profile
     *
     * نعيد تحميل الداتا
     * عشان الصورة الجديدة تظهر في الـ Header.
     */
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


  /*
   * =====================================================
   * LOAD PROFILE
   * =====================================================
   */
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


  /*
   * =====================================================
   * PROFILE IMAGE URL
   * =====================================================
   */
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


  /*
   * =====================================================
   * MENU
   * =====================================================
   */
  toggle(): void {

    this.open.update(
      value => !value
    );

  }


  close(): void {

    this.open.set(false);

  }


  /*
   * =====================================================
   * NAVIGATION
   * =====================================================
   */
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


  /*
   * =====================================================
   * LOGOUT
   * =====================================================
   */
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


  /*
   * =====================================================
   * CLICK OUTSIDE
   * =====================================================
   */
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