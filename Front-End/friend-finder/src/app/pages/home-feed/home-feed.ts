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
        // تحويل الداتا اللي جاية من السيرفر لشكل الـ UI بتاعنا
        const mappedPosts: Post[] = responses.map(res => ({
          id: res.id,
          authorName: `${res.userFirstName} ${res.userLastName}`,
          authorInitials: (res.userFirstName.charAt(0) + res.userLastName.charAt(0)).toUpperCase(),
          timeLabel: new Date(res.createdAt).toLocaleDateString(), // مؤقتاً لحد ما نعمل بايب للوقت
          text: res.content,
          mediaUrl: res.mediaUrl ? `http://localhost:9090${res.mediaUrl}` : undefined,
          mediaType: res.mediaType as 'image' | 'video' | undefined,
          // الداتا دي مش جاية في الـ DTO حالياً، فهنديها صفر لحد ما تظبطها في الباك إند
          reactions: { like: 0, haha: 0, love: 0, sad: 0, angry: 0 },
          commentsCount: 0
        }));
        
        // عكس الترتيب عشان الجديد يظهر فوق
        this.posts.set(mappedPosts.reverse());
      },
      error: (err) => console.error('Error fetching feed', err)
    });
  }

  // onPostCreated(newPostData: any): void {
  //   // لما اليوزر يدوس نشر في الكومبوزر، نبعت للسيرفر
  //   this.postService.createPost(newPostData.text, newPostData.file).subscribe({
  //     next: (res) => {
  //       // نعيد تحميل الفيد بعد نجاح النشر
  //       this.loadFeed();
  //     },
  //     error: (err) => console.error('Error creating post', err)
  //   });
  // }

  onPostCreated(newPostData: {text?: string, file?: File}): void {
    // دلوقتي إحنا متأكدين إن newPostData.file شايل الصورة الحقيقية مش undefined
    this.postService.createPost(newPostData.text, newPostData.file).subscribe({
      next: (res) => {
        this.loadFeed(); // بنعمل ريفريش للفيد عشان البوست الجديد يظهر
      },
      error: (err) => console.error('Error creating post', err)
    });
  }

  onReaction(post: Post, type: ReactionType): void {
    // تحديث الواجهة فوراً (Optimistic UI Update)
    post.reactions[type]++;
    this.posts.update(list => [...list]);

    // إرسال الريكويست للسيرفر
    this.interactionService.reactToPost(post.id, type).subscribe({
      error: (err) => {
        console.error('Error reacting', err);
        // لو حصل خطأ، نرجع الواجهة زي ما كانت
        post.reactions[type]--;
        this.posts.update(list => [...list]);
      }
    });
  }
}