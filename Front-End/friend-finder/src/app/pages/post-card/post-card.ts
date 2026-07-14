import { Component, input, output } from '@angular/core';
import { LanguageService } from '../../core/services/language';
import { Post, ReactionType } from '../../core/models/post-model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css'
})
export class PostCard {
  post = input.required<Post>();
  reactionClicked = output<ReactionType>();

  reactionIcons: Record<ReactionType, string> = { like: '👍', haha: '😆', love: '❤️', sad: '😢', angry: '😡' };
  reactionKeys: ReactionType[] = ['like', 'haha', 'love', 'sad', 'angry'];

  constructor(public lang: LanguageService) {}

  totalReactions(): number {
    return Object.values(this.post().reactions).reduce((a, b) => a + b, 0);
  }
}