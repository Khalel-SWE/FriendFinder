import { Component, OnInit, signal, inject } from '@angular/core';
import { ProfileCover } from '../profile-cover/profile-cover';
import { ProfileTabsNav } from '../profile-tabs-nav/profile-tabs-nav';
import { ProfileTimelineTab } from '../profile-timeline-tab/profile-timeline-tab';
import { ProfileAboutTab } from '../profile-about-tab/profile-about-tab';
import { ProfileFriendsTab } from '../profile-friends-tab/profile-friends-tab';
import { ProfileMediaGrid } from '../profile-media-grid/profile-media-grid';
import { ProfileResponse, ProfileTab } from '../../core/models/profile-model'; // 👈 التعديل هنا
import { ProfileService } from '../../core/services/profile';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileCover,
    ProfileTabsNav,
    ProfileTimelineTab,
    ProfileAboutTab,
    ProfileFriendsTab,
    ProfileMediaGrid
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage implements OnInit {
  activeTab = signal<ProfileTab>('timeline');
  
  profile = signal<ProfileResponse | null>(null);

  private profileService = inject(ProfileService);

  ngOnInit() {
    this.profileService.getMyProfile().subscribe({
      next: (res) => this.profile.set(res as unknown as ProfileResponse),
      error: (err) => console.error('Error fetching profile', err)
    });
  }

  onTabChange(tab: ProfileTab): void {
    this.activeTab.set(tab);
  }
}