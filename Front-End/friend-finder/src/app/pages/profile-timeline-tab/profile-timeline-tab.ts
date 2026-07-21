import { Component, OnInit, signal, inject, Input } from '@angular/core'; // 👈 ضفنا Input هنا
import { PostComposer } from '../post-composer/post-composer'; 
import { RecentActivityPanel } from '../recent-activity-panel/recent-activity-panel'; 
import { Post, PostResponse } from '../../core/models/post-model'; 
import { PostService } from '../../core/services/post';

@Component({
  selector: 'app-profile-timeline-tab',
  standalone: true,
  imports: [PostComposer, RecentActivityPanel],
  templateUrl: './profile-timeline-tab.html',
  styleUrl: './profile-timeline-tab.css'
})
export class ProfileTimelineTab implements OnInit {
  // سيجنال عشان نشيل البوستات الحقيقية
  posts = signal<Post[]>([]);
  
  // 👈 استقبلنا الـ userId 
  @Input() userId?: number;
  
  private postService = inject(PostService);

  ngOnInit() {
    this.loadPosts(); // 👈 هننادي على الدالة الموحدة أول ما الصفحة تفتح
  }

  // 👇 دالة موحدة بتجيب البوستات سواء للفيد أو لليوزر وتعملها Mapping 👇
  loadPosts() {
    // نحدد هنكلم أي API بناءً على وجود userId
    const request$ = this.userId 
      ? this.postService.getUserPosts(this.userId) 
      : this.postService.getFeed();

    request$.subscribe({
      next: (responses: PostResponse[]) => {
        // ترتيب البوستات من الأحدث للأقدم
        responses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        // تحويل الداتا اللي جاية من السيرفر للشكل اللي الأنجولار بيفهمه
        const mappedPosts: Post[] = responses.map(res => ({
          id: res.id,
          authorName: `${res.userFirstName} ${res.userLastName}`,
          authorInitials: (res.userFirstName.charAt(0) + res.userLastName.charAt(0)).toUpperCase(),
          timeLabel: this.calculateTimeAgo(res.createdAt),
          text: res.content,
          mediaUrl: res.mediaUrl ? `http://localhost:9090${res.mediaUrl}` : undefined,
          mediaType: res.mediaType?.toLowerCase().includes('video') ? 'video' : 'image',
          reactions: {
            like: res.reactionsCount?.['LIKE'] || 0,
            haha: res.reactionsCount?.['HAHA'] || 0,
            love: res.reactionsCount?.['LOVE'] || 0,
            sad: res.reactionsCount?.['SAD'] || 0,
            angry: res.reactionsCount?.['ANGRY'] || 0
          },
          commentsCount: res.commentsCount || 0,
          comments: res.comments || []
        }));
        
        this.posts.set(mappedPosts);
      },
      error: (err) => console.error('Error fetching timeline posts', err)
    });
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

  onPosted(payload: { text: string; file: File | null }): void {
    // إرسال البوست الجديد للسيرفر مباشرة
    this.postService.createPost(payload.text, payload.file || undefined).subscribe({
      next: () => {
        this.loadPosts(); // 👈 تحديث التايم لاين فوراً بعد النشر
      },
      error: (err) => console.error('Error creating post', err)
    });
  }
}