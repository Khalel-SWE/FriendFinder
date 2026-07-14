import { Component, signal } from '@angular/core';
import { LanguageService } from '../../core/services/language';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.css'
})
export class NotificationBellComponent {
  open = signal(false);

  constructor(public lang: LanguageService) {}

  toggle(): void { this.open.update(v => !v); }
  close(): void { this.open.set(false); }
}