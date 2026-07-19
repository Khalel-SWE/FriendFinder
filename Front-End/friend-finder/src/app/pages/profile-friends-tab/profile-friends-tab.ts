import { Component, OnInit, signal, inject } from '@angular/core';
import { FriendItem } from '../../core/models/profile-model';
import { FriendshipService } from '../../core/services/friendship'; // 👈 استيراد السيرفيس

@Component({
  selector: 'app-profile-friends-tab',
  standalone: true,
  templateUrl: './profile-friends-tab.html',
  styleUrl: './profile-friends-tab.css'
})
export class ProfileFriendsTab implements OnInit {
  // السيجنال هيبدأ فاضي وهيتملي من الداتابيز
  friends = signal<FriendItem[]>([]);
  
  private friendshipService = inject(FriendshipService);

  ngOnInit() {
    this.loadFriends();
  }

  loadFriends() {
    this.friendshipService.getMyFriends().subscribe({
      next: (res) => this.friends.set(res),
      error: (err) => console.error('Error fetching friends', err)
    });
  }

  // 👇 تفعيل زرار حذف الصديق 👇
  unfriend(friend: FriendItem): void {
    this.friendshipService.removeFriend(friend.id).subscribe({
      next: () => {
        // بنمسحه من الشاشة فوراً بعد نجاح المسح من الداتابيز
        this.friends.update(list => list.filter(f => f.id !== friend.id));
      },
      error: (err) => console.error('Error removing friend', err)
    });
  }
}