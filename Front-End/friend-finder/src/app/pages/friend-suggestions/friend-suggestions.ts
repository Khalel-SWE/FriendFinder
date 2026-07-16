import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { ProfileService } from '../../core/services/profile';
import { FriendSuggestionResponse } from '../../core/models/post-model';
import { LanguageService } from '../../core/services/language';
import { SearchService } from '../../core/services/search'; // 👈 ضفنا ده

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
  private searchService = inject(SearchService); // 👈 ضفنا ده

  // 👇 الـ Computed لتصفية المقترحات فوراً لو بتبحث عن اسم يوزر 👇
  filteredSuggestions = computed(() => {
    const q = this.searchService.query().toLowerCase().trim();
    if (!q) return this.suggestions();
    return this.suggestions().filter(s => 
      s.firstName.toLowerCase().includes(q) || 
      s.lastName.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.profileService.getFriendSuggestions().subscribe({
      next: (res) => this.suggestions.set(res),
      error: (err) => console.error('Error fetching suggestions', err)
    });
  }

  addFriend(id: number) {
    console.log('Add friend clicked for User ID:', id);
  }
}