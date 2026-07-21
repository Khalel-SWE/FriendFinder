import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { PostService } from '../../core/services/post';
import { PostResponse } from '../../core/models/post-model';

interface MediaPost {
  id: number;
  url: string;
}

@Component({
  selector: 'app-profile-media-grid',
  standalone: true,
  templateUrl: './profile-media-grid.html',
  styleUrl: './profile-media-grid.css'
})
export class ProfileMediaGrid implements OnInit {
  @Input({ required: true }) mediaType!: 'photo' | 'video';
  @Input() userId?: number; // 👈 ضفنا استقبال الـ ID هنا

  items = signal<MediaPost[]>([]);
  
  private postService = inject(PostService);

  ngOnInit() {
    // 👇 ذكاء الجلب: لو فيه ID يجيب بوستات اليوزر، لو مفيش يجيب الفيد العام
    const request$ = this.userId 
      ? this.postService.getUserPosts(this.userId)
      : this.postService.getFeed();

    request$.subscribe({
      next: (responses: PostResponse[]) => {
        const mediaPosts = responses
          .filter(res => {
            if (!res.mediaUrl || !res.mediaType) return false;
            const isPhotoTab = this.mediaType === 'photo';
            const isImagePost = res.mediaType.toLowerCase().includes('image');
            const isVideoPost = res.mediaType.toLowerCase().includes('video');
            
            return isPhotoTab ? isImagePost : isVideoPost;
          })
          .map(res => ({
            id: res.id,
            url: `http://localhost:9090${res.mediaUrl}`
          }));
        
        this.items.set(mediaPosts);
      },
      error: (err) => console.error('Error fetching media', err)
    });
  }

  get emptyMessage(): string {
    return this.mediaType === 'photo' ? 'No photos yet.' : 'No videos yet.';
  }
  get hintMessage(): string {
    return this.mediaType === 'photo'
      ? 'Only image posts show up here — pulled automatically from the timeline.'
      : 'Only video posts show up here — pulled automatically from the timeline.';
  }
}