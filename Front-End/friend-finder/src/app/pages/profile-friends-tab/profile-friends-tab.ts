import { Component, signal } from '@angular/core';
import { FriendItem } from '../../core/models/profile-model';

@Component({
  selector: 'app-profile-friends-tab',
  standalone: true,
  templateUrl: './profile-friends-tab.html',
  styleUrl: './profile-friends-tab.css'
})
export class ProfileFriendsTab {
  // داتا مؤقتة لحد ما نربطها بالباك إند
  friends = signal<FriendItem[]>([
    { id: 1, name: 'Karim Magdy', initials: 'KM', gradient: 'from-burgundy', mutualCount: 5 },
    { id: 2, name: 'Nour Farouk', initials: 'NF', gradient: 'from-gold', mutualCount: 2 },
    { id: 3, name: 'Yara Tarek', initials: 'YT', gradient: 'from-burgundy', mutualCount: 9 },
  ]);

  unfriend(friend: FriendItem): void {
    // بتمسح الصديق من الواجهة مؤقتاً
    this.friends.update(list => list.filter(f => f.id !== friend.id));
  }
}