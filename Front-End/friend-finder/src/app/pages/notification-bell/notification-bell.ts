import {Component, signal, HostListener, ElementRef, inject, OnInit}from '@angular/core';
import {LanguageService } from '../../core/services/language';
import {Notification } from '../../core/services/notification';
import { NotificationResponse } from '../../core/models/notification.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './notification-bell.html', // شلنا .component
  styleUrl: './notification-bell.css'      // شلنا .component
})
export class NotificationBell implements OnInit{
  private notification= inject(Notification);
  open = signal(false);
  notifications = signal<NotificationResponse[]>([]);
  unreadCount = signal(0);

  constructor(public lang: LanguageService, private eRef: ElementRef) {}

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

      error: err => console.error(err)

    });

  }

}

  close(): void { this.open.set(false); }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}