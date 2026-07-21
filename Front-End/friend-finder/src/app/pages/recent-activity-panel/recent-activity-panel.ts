import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { PostService } from '../../core/services/post';
import { PostResponse } from '../../core/models/post-model';

@Component({
  selector: 'app-recent-activity-panel',
  standalone: true, // 👈 اتأكد إنها standalone
  imports: [],
  templateUrl: './recent-activity-panel.html',
  styleUrl: './recent-activity-panel.css',
})
export class RecentActivityPanel implements OnInit {
  @Input() userId?: number; // 👈 استقبال الـ ID
  
  activities = signal<any[]>([]);
  private postService = inject(PostService);

  ngOnInit() {
    const request$ = this.userId 
      ? this.postService.getUserPosts(this.userId)
      : this.postService.getFeed();

    request$.subscribe({
      next: (responses: PostResponse[]) => {
        // ترتيب من الأحدث للأقدم
        responses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        // 👈 نأخد أول 5 أنشطة بس ونحولهم لنص مفهوم
        const recent = responses.slice(0, 5).map(post => {
          let actionText = 'Published a new post';
          if (post.mediaType?.includes('IMAGE')) actionText = 'Shared a new photo';
          if (post.mediaType?.includes('VIDEO')) actionText = 'Uploaded a new video';

          return {
            id: post.id,
            text: actionText,
            time: this.calculateTimeAgo(post.createdAt)
          };
        });

        this.activities.set(recent);
      },
      error: (err) => console.error('Error fetching activities', err)
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
}