import { Component, OnInit, signal, inject } from '@angular/core';
import { ProfileService } from '../../core/services/profile';
import { FriendSuggestionResponse } from '../../core/models/post-model';
import { LanguageService } from '../../core/services/language';

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

  ngOnInit() {
    this.profileService.getFriendSuggestions().subscribe({
      next: (res) => this.suggestions.set(res),
      error: (err) => console.error('Error fetching suggestions', err)
    });
  }

  addFriend(id: number) {
    // هنربطها بالـ API بتاع إضافة الصديق بعدين
    console.log('Add friend clicked for User ID:', id);
  }
}