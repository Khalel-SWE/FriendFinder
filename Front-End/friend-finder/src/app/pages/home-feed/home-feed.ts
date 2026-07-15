import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { PostComposer } from '../post-composer/post-composer';
import { PostCard } from '../post-card/post-card';
import { FriendSuggestions } from '../friend-suggestions/friend-suggestions';
import { Post, ReactionType, PostResponse } from '../../core/models/post-model';
import { PostService } from '../../core/services/post';
import { InteractionService } from '../../core/services/interaction';
import { SearchService } from '../../core/services/search';

@Component({
  selector: 'app-home-feed',
  standalone: true,
  imports: [PostComposer, PostCard, FriendSuggestions],
  templateUrl: './home-feed.html',
  styleUrl: './home-feed.css'
})
export class HomeFeed implements OnInit {
  // المصفوفة الأساسية اللي بتشيل كل الداتا
  allPosts = signal<Post[]>([]);

  // السيرش السحري اللي بيفلتر البوستات
  posts = computed(() => {
    const q = this.searchService.query().toLowerCase().trim();
    if (!q) return this.allPosts();
    
    return this.allPosts().filter(p => 
      p.authorName.toLowerCase().includes(q) || 
      (p.text && p.text.toLowerCase().includes(q))
    );
  });

  // الـ Constructor النظيف
  constructor(
    private postService: PostService,
    private interactionService: InteractionService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(): void {
    this.postService.getFeed().subscribe({
      next: (responses: PostResponse[]) => {
        responses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        const mappedPosts: Post[] = responses.map(res => ({
          id: res.id,
          authorName: `${res.userFirstName} ${res.userLastName}`,
          authorInitials: (res.userFirstName.charAt(0) + res.userLastName.charAt(0)).toUpperCase(),
          timeLabel: this.calculateTimeAgo(res.createdAt),
          text: res.content,
          mediaUrl: res.mediaUrl ? `http://localhost:9090${res.mediaUrl}` : undefined,
          mediaType: this.getMediaType(res.mediaType),
          reactions: { like: 0, haha: 0, love: 0, sad: 0, angry: 0 },
          commentsCount: 0
        }));
        
        this.allPosts.set(mappedPosts); 
      },
      error: (err) => console.error('Error fetching feed', err)
    });
  }

  getMediaType(mimeType?: string): 'image' | 'video' | undefined {
    if (!mimeType) return undefined;
    return mimeType.toLowerCase().includes('video') ? 'video' : 'image';
  }

  calculateTimeAgo(dateString: string): string {
    if (!dateString) return '';
    const postDate = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;

    return postDate.toLocaleDateString();
  }

  onPostCreated(newPostData: {text?: string, file?: File}): void {
    this.postService.createPost(newPostData.text, newPostData.file).subscribe({
      next: (res) => {
        this.loadFeed(); 
      },
      error: (err) => console.error('Error creating post', err)
    });
  }

  onReaction(post: Post, type: ReactionType): void {
    post.reactions[type]++;
    this.allPosts.update(list => [...list]);

    this.interactionService.reactToPost(post.id, type).subscribe({
      error: (err) => {
        console.error('Error reacting', err);
        post.reactions[type]--;
        this.allPosts.update(list => [...list]);
      }
    });
  }
}