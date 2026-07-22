import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { ProfileCover } from '../profile-cover/profile-cover';
import { ProfileTabsNav } from '../profile-tabs-nav/profile-tabs-nav';
import { ProfileTimelineTab } from '../profile-timeline-tab/profile-timeline-tab';
import { ProfileAboutTab } from '../profile-about-tab/profile-about-tab';
import { ProfileFriendsTab } from '../profile-friends-tab/profile-friends-tab';
import { ProfileMediaGrid } from '../profile-media-grid/profile-media-grid';
import { ProfileResponse, ProfileTab } from '../../core/models/profile-model';
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
  
  isMyProfile = signal<boolean>(true); 
  
  // 👈 متغير جديد عشان يشيل سنة الانضمام ويبعتها للـ Cover
  memberSince = signal<string>('...'); 

  private profileService = inject(ProfileService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');

      if (userId) {
        this.isMyProfile.set(false);
        this.loadUserProfile(Number(userId));
      } else {
        this.isMyProfile.set(true);
        this.loadMyProfile();
      }
    });
  }

  loadUserProfile(userId: number) {
    this.profileService.getUserProfile(userId).subscribe({
      next: (res: any) => {
        this.profile.set(res as unknown as ProfileResponse);
        this.extractYear(res.createdAt); // 👈 تحديث التاريخ
      },
      error: (err: any) => console.error('Error fetching user profile', err)
    });
  }

  loadMyProfile() {
    this.profileService.getMyProfile().subscribe({
      next: (res: any) => {
        this.profile.set(res as unknown as ProfileResponse);
        this.extractYear(res.createdAt); // 👈 تحديث التاريخ
      },
      error: (err: any) => console.error('Error fetching my profile', err)
    });
  }

  // 👇 دالة صغيرة بتستخرج السنة من التاريخ اللي راجع من الداتا بيز
  private extractYear(dateString?: string) {
    if (dateString) {
      const date = new Date(dateString);
      this.memberSince.set(date.getFullYear().toString());
    } else {
      this.memberSince.set('2024'); // قيمة افتراضية لو مفيش تاريخ
    }
  }

  onTabChange(tab: ProfileTab): void {
    this.activeTab.set(tab);
  }
}