import { Component, signal, HostListener, ElementRef, inject, OnInit} from '@angular/core';
import { DatePipe } from '@angular/common';
import { LanguageService } from '../../core/services/language';
import { Notification } from '../../core/services/notification';
import { NotificationResponse } from '../../core/models/notification.model';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.css'
})
export class NotificationBell implements OnInit {

  private notification = inject(Notification);

  open = signal(false);

  notifications = signal<NotificationResponse[]>([]);

  unreadCount = signal(0);

  constructor(
    public lang: LanguageService,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {

    this.notification.getMyNotifications().subscribe({

      next: (data) => {

        this.notifications.set(data);

        this.unreadCount.set(
          data.filter(n => !n.read).length
        );

      },

      error: (err) => {
        console.error('Error loading notifications', err);
      }

    });
  }


  toggle(): void {

    this.open.update(v => !v);

    if (this.open() && this.unreadCount() > 0) {

      this.notification.markAllAsRead().subscribe({

        next: () => {

          this.notifications.update(list =>
            list.map(item => ({
              ...item,
              read: true
            }))
          );

          this.unreadCount.set(0);

        },

        error: err => {
          console.error('Failed to mark notifications as read', err);
        }

      });

    }
  }


  close(): void {
    this.open.set(false);
  }


  getNotificationText(
    notification: NotificationResponse
  ): string {

    /*
     * حالياً الـ Backend ما زال هو المسؤول عن
     * تكوين نص الـ notification.
     *
     * بعد ما نخلص مشاكل الـ UI هنفصل النص
     * عن الـ Backend ونخليه يعتمد على i18n.
     */

    return notification.message;
  }


  getActorInitial(notification: NotificationResponse): string {

    if (notification.actorName) {
      return notification.actorName.charAt(0).toUpperCase();
    }

    return notification.message.charAt(0).toUpperCase();
  }


  getActorImage(
    notification: NotificationResponse
  ): string | null {

    if (!notification.actorProfilePicture) {
      return null;
    }

    return 'http://localhost:9090' +
      notification.actorProfilePicture;
  }


  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {

    if (!this.eRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}