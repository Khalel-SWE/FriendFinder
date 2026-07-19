// import { Component, OnInit, signal, inject, computed } from '@angular/core';
// import { ProfileService } from '../../core/services/profile';
// import { FriendshipService } from '../../core/services/friendship'; // 👈 استيراد السيرفيس
// import { FriendSuggestionResponse } from '../../core/models/post-model';
// import { LanguageService } from '../../core/services/language';
// import { SearchService } from '../../core/services/search';

// @Component({
//   selector: 'app-friend-suggestions',
//   standalone: true,
//   imports: [],
//   templateUrl: './friend-suggestions.html',
//   styleUrl: './friend-suggestions.css'
// })
// export class FriendSuggestions implements OnInit {
//   suggestions = signal<FriendSuggestionResponse[]>([]);
  
//   private profileService = inject(ProfileService);
//   private friendshipService = inject(FriendshipService); // 👈 حقن السيرفيس
//   public lang = inject(LanguageService);
//   private searchService = inject(SearchService);

//   filteredSuggestions = computed(() => {
//     const q = this.searchService.query().toLowerCase().trim();
//     if (!q) return this.suggestions();
//     return this.suggestions().filter(s => 
//       s.firstName.toLowerCase().includes(q) || 
//       s.lastName.toLowerCase().includes(q)
//     );
//   });

//   ngOnInit() {
//     this.profileService.getFriendSuggestions().subscribe({
//       next: (res) => this.suggestions.set(res),
//       error: (err) => console.error('Error fetching suggestions', err)
//     });
//   }

//   // 👇 تفعيل زرار إرسال الطلب 👇
//   addFriend(id: number) {
//     this.friendshipService.sendFriendRequest(id).subscribe({
//       next: (res) => {
//         console.log(res); // هيطبع رسالة النجاح من السيرفر
//         // نخفي اليوزر من المقترحات بعد ما بعتناله الطلب عشان الشكل يبقى واقعي
//         this.suggestions.update(list => list.filter(u => u.id !== id));
//       },
//       error: (err) => console.error('Error sending request', err)
//     });
//   }
// }

import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { UpperCasePipe } from '@angular/common'; // 👈 السطر ده
import { ProfileService } from '../../core/services/profile';
import { FriendshipService } from '../../core/services/friendship'; 
import { FriendSuggestionResponse } from '../../core/models/post-model';
import { LanguageService } from '../../core/services/language';
import { SearchService } from '../../core/services/search';

@Component({
  selector: 'app-friend-suggestions',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './friend-suggestions.html',
  styleUrl: './friend-suggestions.css'
})
export class FriendSuggestions implements OnInit {
  suggestions = signal<FriendSuggestionResponse[]>([]);
  pendingRequests = signal<any[]>([]); // 👈 ضفنا مصفوفة للطلبات المعلقة
  
  private profileService = inject(ProfileService);
  private friendshipService = inject(FriendshipService); 
  public lang = inject(LanguageService);
  private searchService = inject(SearchService);

  filteredSuggestions = computed(() => {
    const q = this.searchService.query().toLowerCase().trim();
    if (!q) return this.suggestions();
    return this.suggestions().filter(s => 
      s.firstName.toLowerCase().includes(q) || 
      s.lastName.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    // 1. جلب مقترحات الأصدقاء
    this.profileService.getFriendSuggestions().subscribe({
      next: (res) => this.suggestions.set(res),
      error: (err) => console.error('Error fetching suggestions', err)
    });

    // 2. جلب طلبات الصداقة المعلقة
    this.loadPendingRequests();
  }

  // 👇 دالة جلب الطلبات المعلقة 👇
  loadPendingRequests() {
    this.friendshipService.getPendingRequests().subscribe({
      next: (requests) => {
        this.pendingRequests.set(requests);
        console.log('Pending requests loaded:', requests); // عشان تتأكد من الداتا
      },
      error: (err) => console.error('Error fetching pending requests', err)
    });
  }

  // 👇 دالة إرسال طلب صداقة 👇
  addFriend(id: number) {
    this.friendshipService.sendFriendRequest(id).subscribe({
      next: (res) => {
        console.log(res);
        this.suggestions.update(list => list.filter(u => u.id !== id));
      },
      error: (err) => console.error('Error sending request', err)
    });
  }

  // 👇 دالة الرد على طلب الصداقة (قبول أو رفض) 👇
  // 👇 دالة الرد على طلب الصداقة (قبول أو رفض) 👇
  respondToRequest(requestId: number, status: 'ACCEPTED' | 'REJECTED') {
    this.friendshipService.respondToRequest(requestId, status).subscribe({
      next: (res) => {
        console.log(`Request ${status}:`, res);
        // التعديل هنا: غيرنا req.id لـ req.requestId
        this.pendingRequests.update(list => list.filter(req => req.requestId !== requestId));
      },
      error: (err) => console.error('Error responding to request', err)
    });
  }
}
