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


  // =====================================================
  // INIT
  // =====================================================

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
              notification =>
                !notification.read
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

        return `${actor} sent you a contact message`;


      case 'ADMIN_REPLY':

        return 'Admin replied to your message';


      case 'FRIEND_REQUEST':

        return `${actor} sent you a friend request`;


      case 'ACCEPT_FRIEND_REQUEST':

        return `${actor} accepted your friend request`;


      case 'LIKE':

        return `${actor} reacted to your post`;


      case 'COMMENT':

        return `${actor} commented on your post`;


      default:

        return notification.message;
    }
  }


  // =====================================================
  // SHOULD SHOW ACTOR AVATAR?
  // =====================================================

  showActorAvatar(
    notification: NotificationResponse
  ): boolean {

    return notification.type !== 'ADMIN_REPLY';
  }


  // =====================================================
  // ACTOR INITIALS
  // =====================================================

  getActorInitial(
    notification: NotificationResponse
  ): string {

    if (
      notification.actorName
    ) {

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


    return '?';
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


    return notification
      .actorProfilePicture
      .startsWith('http')

      ? notification.actorProfilePicture

      : `http://localhost:9090${notification.actorProfilePicture}`;
  }


  // =====================================================
  // CAN NAVIGATE
  // =====================================================

  canOpenNotification(
    notification: NotificationResponse
  ): boolean {

    switch (
      notification.type
    ) {

      case 'FRIEND_REQUEST':

      case 'ACCEPT_FRIEND_REQUEST':

        return (
          notification.actorId !== null
        );


      case 'LIKE':

      case 'COMMENT':

        return (
          notification.relatedId !== null
        );


      case 'NEW_CONTACT_MESSAGE':

      case 'ADMIN_REPLY':

        return true;


      default:

        return false;
    }
  }


  // =====================================================
  // OPEN NOTIFICATION
  // =====================================================

  openNotification(
    notification: NotificationResponse
  ): void {

    if (
      !this.canOpenNotification(
        notification
      )
    ) {

      return;
    }


    this.close();


    // ===================================================
    // FRIEND REQUEST
    // ===================================================

    if (
      notification.type === 'FRIEND_REQUEST'
      ||
      notification.type === 'ACCEPT_FRIEND_REQUEST'
    ) {

      if (
        notification.actorId === null
      ) {

        return;
      }


      this.router.navigate([
        '/profile',
        notification.actorId
      ]);

      return;
    }


    // ===================================================
    // ADMIN / CONTACT
    // ===================================================

    if (
      notification.type === 'NEW_CONTACT_MESSAGE'
      ||
      notification.type === 'ADMIN_REPLY'
    ) {

      this.router.navigate([
        '/my-messages'
      ]);

      return;
    }


    // ===================================================
    // LIKE / COMMENT
    // ===================================================

    if (
      notification.type === 'LIKE'
      ||
      notification.type === 'COMMENT'
    ) {

      if (
        notification.relatedId === null
      ) {

        return;
      }


      this.router.navigate(
        ['/feed'],
        {
          queryParams: {
            postId:
              notification.relatedId
          }
        }
      );
    }
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
      !this.eRef
        .nativeElement
        .contains(event.target)
    ) {

      this.close();
    }
  }
}