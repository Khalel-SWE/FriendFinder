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
  templateUrl: './app-navbar.component.html',
  styleUrl: './app-navbar.component.css'
})
export class AppNavbar {
  constructor(public lang: LanguageService) {}
}