import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationBellComponent } from '../notification-bell/notification-bell';
import { LanguageMenuComponent } from '../language-menu/language-menu';
import { AccountMenuComponent } from '../account-menu/account-menu';
import { LanguageService } from '../../core/services/language';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NotificationBellComponent, LanguageMenuComponent, AccountMenuComponent],
  templateUrl: './app-navbar.html', // شلنا .component
  styleUrl: './app-navbar.css'      // شلنا .component
})
export class AppNavbar {
  constructor(public lang: LanguageService) {}
}