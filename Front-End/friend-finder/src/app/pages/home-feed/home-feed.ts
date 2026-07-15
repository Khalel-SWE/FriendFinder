import { Component, OnInit, signal } from '@angular/core';
import { PostComposer } from '../post-composer/post-composer';
import { PostCard } from '../post-card/post-card';
import { FriendSuggestions } from '../friend-suggestions/friend-suggestions';
import { Post, ReactionType, PostResponse } from '../../core/models/post-model';
import { PostService } from '../../core/services/post';
import { InteractionService } from '../../core/services/interaction';

@Component({
  selector: 'app-home-feed',
  standalone: true,
  imports: [ PostComposer, PostCard, FriendSuggestions],
  templateUrl: './home-feed.html',
  styleUrl: './home-feed.css'
})
export class HomeFeed implements OnInit {
  posts = signal<Post[]>([]);

  constructor(
    private postService: PostService,
    private interactionService: InteractionService
  ) {}

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(): void {
    this.postService.getFeed().subscribe({
      next: (responses: PostResponse[]) => {
        
        // 1. الترتيب: بنرتب البوستات من الأحدث للأقدم بناءً على الوقت الحقيقي
        responses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // تحويل الداتا اللي جاية من السيرفر لشكل الـ UI بتاعنا
        const mappedPosts: Post[] = responses.map(res => ({
          id: res.id,
          authorName: `${res.userFirstName} ${res.userLastName}`,
          authorInitials: (res.userFirstName.charAt(0) + res.userLastName.charAt(0)).toUpperCase(),
          
          // 2. الوقت: بنستخدم الدالة الذكية الجديدة
          timeLabel: this.calculateTimeAgo(res.createdAt),
          
          text: res.content,
          mediaUrl: res.mediaUrl ? `http://localhost:9090${res.mediaUrl}` : undefined,
          
          // 3. الميديا: بنستخدم دالة تفهم نوع الملف صح
          mediaType: this.getMediaType(res.mediaType),
          
          reactions: { like: 0, haha: 0, love: 0, sad: 0, angry: 0 },
          commentsCount: 0
        }));
        
        // بنحطهم في الـ Signal مباشرة بدون reverse لأننا رتبناهم فوق خلاص
        this.posts.set(mappedPosts);
      },
      error: (err) => console.error('Error fetching feed', err)
    });
  }

  // --- دالة مساعدة: تحديد نوع الميديا ---
  getMediaType(mimeType?: string): 'image' | 'video' | undefined {
    if (!mimeType) return undefined;
    // لو الباك إند بعت video/mp4 هنعتبره video، غير كده هنعتبره image
    return mimeType.toLowerCase().includes('video') ? 'video' : 'image';
  }

  // --- دالة مساعدة: حساب الوقت زي الفيس بوك ---
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

    // لو أقدم من أسبوع يعرض التاريخ العادي
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
    this.posts.update(list => [...list]);

    this.interactionService.reactToPost(post.id, type).subscribe({
      error: (err) => {
        console.error('Error reacting', err);
        post.reactions[type]--;
        this.posts.update(list => [...list]);
      }
    });
  }
}