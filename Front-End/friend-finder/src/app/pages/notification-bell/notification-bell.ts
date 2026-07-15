import { Component, signal, HostListener, ElementRef } from '@angular/core';
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

  constructor(public lang: LanguageService, private eRef: ElementRef) {}

  toggle(): void { this.open.update(v => !v); }
  close(): void { this.open.set(false); }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}