import {
  Component,
  OnInit,
  signal,
  inject,
  computed
} from '@angular/core';

import { ProfileService } from '../../core/services/profile';
import { FriendSuggestionResponse } from '../../core/models/post-model';
import { LanguageService } from '../../core/services/language';
import { SearchService } from '../../core/services/search';

@Component({
  selector: 'app-friend-suggestions',
  standalone: true,
  imports: [],
  templateUrl: './friend-suggestions.html',
  styleUrl: './friend-suggestions.css'
})
export class FriendSuggestions implements OnInit {

  suggestions = signal<FriendSuggestionResponse[]>([]);

  private profileService = inject(ProfileService);

  public lang = inject(LanguageService);

  private searchService = inject(SearchService);


  filteredSuggestions = computed(() => {

    const q = this.searchService
      .query()
      .toLowerCase()
      .trim();

    if (!q) {
      return this.suggestions();
    }

    return this.suggestions().filter(user =>
      user.firstName.toLowerCase().includes(q) ||
      user.lastName.toLowerCase().includes(q)
    );

  });


  ngOnInit(): void {

    this.loadSuggestions();

  }


  private loadSuggestions(): void {

    this.profileService
      .getFriendSuggestions()
      .subscribe({

        next: (res) => {

          this.suggestions.set(res);

        },

        error: (err: unknown) => {

          console.error(
            'Error fetching suggestions',
            err
          );

        }

      });

  }


  addFriend(id: number): void {

    /*
     * هذه الدالة كانت مرتبطة بـ FriendshipService.
     *
     * لكن FriendshipService تم فصلها من هذا component
     * لأننا لم نعد نعرض Pending Requests هنا.
     *
     * سنعيد ربط زر Add Friend بالخدمة الصحيحة
     * بعد التأكد من اسم الـ Angular Friendship Service
     * الموجود فعليًا في المشروع.
     */

    console.log(
      'Friend request target user id:',
      id
    );

  }

}