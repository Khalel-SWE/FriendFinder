import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationBellComponent } from '../notification-bell/notification-bell';
import { LanguageMenuComponent } from '../language-menu/language-menu';
import { AccountMenuComponent } from '../account-menu/account-menu';
import { LanguageService } from '../../core/services/language';
import { ProfileService } from '../../core/services/profile';
import { ProfileResponse } from '../../core/models/post-model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NotificationBellComponent, LanguageMenuComponent, AccountMenuComponent],
  templateUrl: './app-navbar.html',
  styleUrl: './app-navbar.css'
})
export class AppNavbar implements OnInit {
  userProfile: ProfileResponse | null = null;
  userInitials: string = '..';

  constructor(
    public lang: LanguageService, 
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        this.userProfile = res;
        this.userInitials = (res.firstName.charAt(0) + res.lastName.charAt(0)).toUpperCase();
      },
      error: (err) => console.error('Error fetching profile', err)
    });
  }
}