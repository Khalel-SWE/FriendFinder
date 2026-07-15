import { Component, input, output, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language';
import { Post, ReactionType, CommentResponse } from '../../core/models/post-model';
import { InteractionService } from '../../core/services/interaction';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css'
})
export class PostCard {
  post = input.required<Post>();
  reactionClicked = output<ReactionType>();

  // الـ Signals الخاصة بالتعليقات
  showComments = signal(false);
  comments = signal<CommentResponse[]>([]);
  newCommentText = signal('');

  reactionIcons: Record<ReactionType, string> = { like: '👍', haha: '😆', love: '❤️', sad: '😢', angry: '😡' };
  reactionKeys: ReactionType[] = ['like', 'haha', 'love', 'sad', 'angry'];

  private interactionService = inject(InteractionService);
  constructor(public lang: LanguageService) {}

  totalReactions(): number {
    return Object.values(this.post().reactions).reduce((a, b) => a + b, 0);
  }

  toggleComments(): void {
    this.showComments.update(v => !v);
    if (this.showComments()) {
      this.loadComments();
    }
  }

  loadComments(): void {
    this.interactionService.getComments(this.post().id).subscribe({
      next: (res) => this.comments.set(res),
      error: (err) => console.error('Error loading comments', err)
    });
  }

  submitComment(): void {
    const text = this.newCommentText().trim();
    if (!text) return;

    this.interactionService.addComment(this.post().id, text).subscribe({
      next: (newComment) => {
        this.comments.update(list => [...list, newComment]);
        this.newCommentText.set('');
        // تزويد العداد في الواجهة مؤقتاً
        this.post().commentsCount++;
      },
      error: (err) => console.error('Error adding comment', err)
    });
  }

  getInitials(firstName: string, lastName: string): string {
    if (!firstName || !lastName) return '..';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
}