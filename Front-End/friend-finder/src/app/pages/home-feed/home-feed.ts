import { Component, signal } from '@angular/core';
import { AppNavbar } from '../app-navbar/app-navbar';
import { PostComposer } from '../post-composer/post-composer';
import { PostCard } from '../post-card/post-card';
import { FriendSuggestions } from '../friend-suggestions/friend-suggestions';
import { Post, ReactionType } from '../../core/models/post-model';

@Component({
  selector: 'app-home-feed',
  standalone: true,
  imports: [AppNavbar, PostComposer, PostCard, FriendSuggestions],
  templateUrl: './home-feed.html',
  styleUrl: './home-feed.css'
})
export class HomeFeed {
  posts = signal<Post[]>([
    {
      id: 1, authorName: 'Omar Mostafa', authorInitials: 'OM', timeLabel: '3 hours ago',
      text: "Spent the evening on the Corniche with old friends — the best conversations happen when no one's checking the time.",
      mediaType: 'image',
      reactions: { like: 14, haha: 2, love: 6, sad: 0, angry: 0 }, commentsCount: 6
    },
    {
      id: 2, authorName: 'Sara Adel', authorInitials: 'SA', timeLabel: 'Yesterday',
      text: 'Finally organized the little reunion we kept postponing. Six years apart, zero minutes of awkward silence.',
      mediaType: 'video',
      reactions: { like: 30, haha: 5, love: 4, sad: 1, angry: 0 }, commentsCount: 12
    },
  ]);

  onPostCreated(post: Post): void {
    this.posts.update(list => [post, ...list]);
  }

  onReaction(post: Post, type: ReactionType): void {
    post.reactions[type]++;
    this.posts.update(list => [...list]);
  }
}