import { Component, signal } from '@angular/core';
import { LanguageService } from '../../core/services/language';
import { FriendSuggestion } from '../../core/models/post-model';

@Component({
  selector: 'app-friend-suggestions',
  standalone: true,
  imports: [],
  templateUrl: './friend-suggestions.html',
  styleUrl: './friend-suggestions.css'
})
export class FriendSuggestions {
  suggestions = signal<FriendSuggestion[]>([
    { id: 1, name: 'Karim Magdy', initials: 'KM', mutualCount: 5 },
    { id: 2, name: 'Nour Farouk', initials: 'NF', mutualCount: 2 },
    { id: 3, name: 'Yara Tarek', initials: 'YT', mutualCount: 9 },
  ]);

  constructor(public lang: LanguageService) {}

  addFriend(id: number): void {
    this.suggestions.update(list => list.filter(s => s.id !== id));
  }
}