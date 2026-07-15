import { Component, signal } from '@angular/core';
import { LanguageService } from '../../core/services/language';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [],
  templateUrl: './notification-bell.html', // شلنا .component
  styleUrl: './notification-bell.css'      // شلنا .component
})
export class NotificationBell{
  open = signal(false);

  constructor(public lang: LanguageService) {}

  toggle(): void { this.open.update(v => !v); }
  close(): void { this.open.set(false); }
}