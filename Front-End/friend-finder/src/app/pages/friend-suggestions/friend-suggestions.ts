import {
  Component,
  OnInit,
  signal,
  inject,
  computed
} from '@angular/core';

import { ProfileService } from '../../core/services/profile';
import { FriendshipService } from '../../core/services/friendship';

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
  private friendshipService = inject(FriendshipService);
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

        next: (res: FriendSuggestionResponse[]) => {

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

    console.log(
      'Friend request target user id:',
      id
    );

    this.friendshipService
      .sendFriendRequest(id)
      .subscribe({

        next: (response: string) => {

          console.log(
            'Friend request sent successfully:',
            response
          );

          // نشيل الشخص من المقترحات بعد إرسال الطلب
          this.suggestions.update(
            list =>
              list.filter(
                user => user.id !== id
              )
          );
        },

        error: (err: unknown) => {

          console.error(
            'Error sending friend request:',
            err
          );
        }

      });
  }
}