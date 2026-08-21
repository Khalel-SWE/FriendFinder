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

  pendingRequests = signal<any[]>([]);

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

    return this.suggestions().filter(s =>
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q)
    );

  });


  ngOnInit(): void {

    this.profileService
      .getFriendSuggestions()
      .subscribe({

        next: (res) => {

          this.suggestions.set(res);

        },

        error: (err) => {

          console.error(
            'Error fetching suggestions',
            err
          );

        }

      });


    /*
     * الطلبات المعلقة ما زالت يتم تحميلها
     * لأن الـ functionality نفسها ما اتلغتش.
     *
     * لكننا لم نعد نعرضها داخل الـ Feed.
     *
     * هنربطها لاحقًا بالـ Notifications.
     */
    this.loadPendingRequests();

  }


  loadPendingRequests(): void {

    this.friendshipService
      .getPendingRequests()
      .subscribe({

        next: (requests) => {

          this.pendingRequests.set(requests);

          console.log(
            'Pending requests loaded:',
            requests
          );

        },

        error: (err) => {

          console.error(
            'Error fetching pending requests',
            err
          );

        }

      });

  }


  addFriend(id: number): void {

    this.friendshipService
      .sendFriendRequest(id)
      .subscribe({

        next: (res) => {

          console.log(res);

          this.suggestions.update(
            list =>
              list.filter(
                user => user.id !== id
              )
          );

        },

        error: (err) => {

          console.error(
            'Error sending request',
            err
          );

        }

      });

  }


  respondToRequest(
    requestId: number,
    status: 'ACCEPTED' | 'REJECTED'
  ): void {

    this.friendshipService
      .respondToRequest(
        requestId,
        status
      )
      .subscribe({

        next: (res) => {

          console.log(
            `Request ${status}:`,
            res
          );

          this.pendingRequests.update(
            list =>
              list.filter(
                req =>
                  req.requestId !== requestId
              )
          );

        },

        error: (err) => {

          console.error(
            'Error responding to request',
            err
          );

        }

      });

  }

}