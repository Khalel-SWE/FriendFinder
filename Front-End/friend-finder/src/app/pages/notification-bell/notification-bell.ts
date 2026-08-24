import {
  Component,
  signal,
  HostListener,
  ElementRef,
  inject,
  OnInit
} from '@angular/core';

import { DatePipe } from '@angular/common';

import { Router } from '@angular/router';

import { LanguageService } from '../../core/services/language';

import { Notification } from '../../core/services/notification';

import {
  NotificationResponse
} from '../../core/models/notification.model';


@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.css'
})
export class NotificationBell
  implements OnInit {

  private notification =
    inject(Notification);

  private router =
    inject(Router);


  open =
    signal(false);

  notifications =
    signal<NotificationResponse[]>([]);

  unreadCount =
    signal(0);


  constructor(
    public lang: LanguageService,
    private eRef: ElementRef
  ) {}


  ngOnInit(): void {

    this.notification
      .getMyNotifications()
      .subscribe({

        next: (data) => {

          this.notifications.set(
            data
          );

          this.unreadCount.set(
            data.filter(
              n => !n.read
            ).length
          );
        },

        error: (err) => {

          console.error(
            'Error loading notifications',
            err
          );
        }

      });
  }


  // =====================================================
  // TOGGLE
  // =====================================================

  toggle(): void {

    this.open.update(
      value => !value
    );


    if (
      this.open()
      &&
      this.unreadCount() > 0
    ) {

      this.notification
        .markAllAsRead()
        .subscribe({

          next: () => {

            this.notifications.update(
              list =>
                list.map(
                  item => ({
                    ...item,
                    read: true
                  })
                )
            );

            this.unreadCount.set(0);
          },

          error: (err) => {

            console.error(
              'Failed to mark notifications as read',
              err
            );
          }

        });
    }
  }


  // =====================================================
  // CLOSE
  // =====================================================

  close(): void {

    this.open.set(false);
  }


  // =====================================================
  // NOTIFICATION TEXT
  // =====================================================

  getNotificationText(
    notification: NotificationResponse
  ): string {

    const actor =
      notification.actorName ?? '';


    switch (
      notification.type
    ) {

      case 'NEW_CONTACT_MESSAGE':

        return `
          ${this.lang.t('admin_notif_contact')}
          ${actor}
        `;


      case 'ADMIN_REPLY':

        return this.lang.t(
          'admin_notif_reply'
        );


      case 'FRIEND_REQUEST':

        return `
          ${actor}
          ${this.lang.t(
            'notif_friend_request'
          )}
        `;


      case 'ACCEPT_FRIEND_REQUEST':

        return `
          ${actor}
          ${this.lang.t(
            'notif_friend_accept'
          )}
        `;


      case 'LIKE':

        return `
          ${actor}
          ${this.lang.t(
            'notif_reacted'
          )}
        `;


      case 'COMMENT':

        return `
          ${actor}
          ${this.lang.t(
            'notif_commented'
          )}
        `;


      default:

        return notification.message;
    }
  }


  // =====================================================
  // ACTOR INITIAL
  // =====================================================

  getActorInitial(
    notification: NotificationResponse
  ): string {

    if (notification.actorName) {

      const parts =
        notification.actorName
          .trim()
          .split(/\s+/);

      const first =
        parts[0]?.charAt(0) ?? '';

      const last =
        parts.length > 1
          ? parts[1]?.charAt(0) ?? ''
          : '';

      return (
        first + last
      ).toUpperCase();
    }

    return notification.message
      .charAt(0)
      .toUpperCase();
  }


  // =====================================================
  // ACTOR IMAGE
  // =====================================================

  getActorImage(
    notification: NotificationResponse
  ): string | null {

    if (
      !notification.actorProfilePicture
    ) {

      return null;
    }


    return notification.actorProfilePicture
      .startsWith('http')
        ? notification.actorProfilePicture
        : `
          http://localhost:9090
          ${notification.actorProfilePicture}
        `.replace(/\s+/g, '');
  }


  // =====================================================
  // CAN OPEN PROFILE
  // =====================================================

  canOpenProfile(
    notification: NotificationResponse
  ): boolean {

    return (
      (
        notification.type === 'FRIEND_REQUEST'
        ||
        notification.type === 'ACCEPT_FRIEND_REQUEST'
      )
      &&
      notification.actorId !== null
    );
  }


  // =====================================================
  // OPEN PROFILE
  // =====================================================

  openNotification(
    notification: NotificationResponse
  ): void {

    if (
      !this.canOpenProfile(
        notification
      )
    ) {

      return;
    }


    this.close();


    this.router.navigate([
      '/profile',
      notification.actorId
    ]);
  }


  // =====================================================
  // OUTSIDE CLICK
  // =====================================================

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