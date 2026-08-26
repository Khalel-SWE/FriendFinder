// import { Component, OnInit, signal, inject } from '@angular/core';
// import { FriendItem } from '../../core/models/profile-model';
// import { FriendshipService } from '../../core/services/friendship'; // 👈 استيراد السيرفيس

// @Component({
//   selector: 'app-profile-friends-tab',
//   standalone: true,
//   templateUrl: './profile-friends-tab.html',
//   styleUrl: './profile-friends-tab.css'
// })
// export class ProfileFriendsTab implements OnInit {
//   // السيجنال هيبدأ فاضي وهيتملي من الداتابيز
//   friends = signal<FriendItem[]>([]);
  
//   private friendshipService = inject(FriendshipService);

//   ngOnInit() {
//     this.loadFriends();
//   }

//   loadFriends() {
//     this.friendshipService.getMyFriends().subscribe({
//       next: (res) => this.friends.set(res),
//       error: (err) => console.error('Error fetching friends', err)
//     });
//   }

//   // 👇 تفعيل زرار حذف الصديق 👇
//   unfriend(friend: FriendItem): void {
//     this.friendshipService.removeFriend(friend.id).subscribe({
//       next: () => {
//         // بنمسحه من الشاشة فوراً بعد نجاح المسح من الداتابيز
//         this.friends.update(list => list.filter(f => f.id !== friend.id));
//       },
//       error: (err) => console.error('Error removing friend', err)
//     });
//   }
// }

import {
  Component,
  Input,
  OnInit,
  signal,
  inject
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  FriendItem
} from '../../core/models/profile-model';

import {
  FriendshipService
} from '../../core/services/friendship';


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


  // =====================================================
  // LOAD FRIENDS
  // =====================================================

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


  // =====================================================
  // PROFILE IMAGE
  // =====================================================

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


  // =====================================================
  // OPEN PROFILE
  // =====================================================

  goToProfile(
    userId: number
  ): void {

    this.router.navigate([
      '/profile',
      userId
    ]);
  }


  // =====================================================
  // UNFRIEND
  // =====================================================

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
