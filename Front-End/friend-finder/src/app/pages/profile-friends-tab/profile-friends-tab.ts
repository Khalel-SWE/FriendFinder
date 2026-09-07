import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FriendItem } from '../../core/models/profile-model';
import { FriendshipService } from '../../core/services/friendship';

@Component({
  selector: 'app-profile-friends-tab',
  standalone: true,
  templateUrl: './profile-friends-tab.html',
  styleUrl: './profile-friends-tab.css'
})
export class ProfileFriendsTab
  implements OnInit {

  @Input()
  userId?: number;

  @Input()
  isMyProfile = false;

  friends =
    signal<FriendItem[]>([]);

  private friendshipService =
    inject(FriendshipService);

  private router =
    inject(Router);


  ngOnInit(): void {

    this.loadFriends();
  }

  loadFriends(): void {

    if (!this.userId) {

      this.friends.set([]);

      return;
    }

    const request$ =
      this.isMyProfile

        ? this.friendshipService
            .getMyFriends()

        : this.friendshipService
            .getFriendsForProfile(
              this.userId
            );

    request$.subscribe({

      next: res => {

        this.friends.set(res);
      },

      error: err => {

        console.error(
          'Error fetching profile friends',
          err
        );

        this.friends.set([]);
      }

    });
  }

  getImageUrl(
    path?: string | null
  ): string | null {

    if (!path) {
      return null;
    }

    return path.startsWith('http')
      ? path
      : `http://localhost:9090${path}`;
  }

  goToProfile(
    userId: number
  ): void {

    this.router.navigate([
      '/profile',
      userId
    ]);
  }

  unfriend(
    friend: FriendItem
  ): void {

    if (!this.isMyProfile) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to remove this friendship?'
      );


    if (!confirmed) {
      return;
    }


    this.friendshipService
      .removeFriend(friend.id)
      .subscribe({

        next: () => {

          this.friends.update(
            list =>
              list.filter(
                f =>
                  f.id !== friend.id
              )
          );
        },

        error: err => {

          console.error(
            'Error removing friend',
            err
          );
        }

      });
  }
}
