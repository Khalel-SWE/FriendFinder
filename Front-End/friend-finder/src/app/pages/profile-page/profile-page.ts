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
export class ProfilePage
  implements OnInit {

  activeTab =
    signal<ProfileTab>('timeline');

  profile =
    signal<ProfileResponse | null>(null);

  isMyProfile =
    signal<boolean>(true);

  memberSince =
    signal<string>('...');


  private profileService =
    inject(ProfileService);

  private route =
    inject(ActivatedRoute);

  ngOnInit(): void {

    this.route.paramMap.subscribe(
      params => {

        const userId =
          params.get('id');

        if (userId) {

          this.isMyProfile.set(false);

          this.loadUserProfile(
            Number(userId)
          );

        } else {

          this.isMyProfile.set(true);

          this.loadMyProfile();
        }
      }
    );
  }

  loadUserProfile(
    userId: number
  ): void {

    this.profileService
      .getUserProfile(userId)
      .subscribe({

        next: (
          res: ProfileResponse
        ) => {

          this.profile.set(res);

          this.extractYear(
            res.createdAt
          );
        },

        error: (
          err: unknown
        ) => {

          console.error(
            'Error fetching user profile',
            err
          );
        }

      });
  }

  loadMyProfile(): void {

    this.profileService
      .getMyProfile()
      .subscribe({

        next: (
          res: ProfileResponse
        ) => {

          const myProfile:
            ProfileResponse = {

            ...res,

            relationshipStatus:
              'SELF',

            pendingRequestId:
              null,

            canViewPosts:
              true,

            recentActivities:
              res.recentActivities ?? []

          };

          this.profile.set(
            myProfile
          );

          this.extractYear(
            res.createdAt
          );
        },

        error: (
          err: unknown
        ) => {

          console.error(
            'Error fetching my profile',
            err
          );
        }

      });
  }

  onRelationshipChanged(): void {

    const currentProfile =
      this.profile();

    if (!currentProfile) {
      return;
    }

    if (this.isMyProfile()) {
      return;
    }

    this.loadUserProfile(
      currentProfile.id
    );
  }

  private extractYear(
    dateString?: string
  ): void {

    if (dateString) {

      const date =
        new Date(dateString);

      this.memberSince.set(
        date.getFullYear().toString()
      );

    } else {

      this.memberSince.set(
        '2024'
      );
    }
  }

  onTabChange(
    tab: ProfileTab
  ): void {

    this.activeTab.set(tab);
  }
}