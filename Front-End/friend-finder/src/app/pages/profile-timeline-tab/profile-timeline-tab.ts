import { Component, OnInit, signal, inject, Input } from '@angular/core';
import { PostComposer } from '../post-composer/post-composer';
import { RecentActivityPanel } from '../recent-activity-panel/recent-activity-panel';
import { Post, PostResponse, ReactionType } from '../../core/models/post-model';
import { PostService } from '../../core/services/post';
import { ProfileActivity } from '../../core/models/profile-model';

@Component({
  selector: 'app-profile-timeline-tab',
  standalone: true,
  imports: [
    PostComposer,
    RecentActivityPanel
  ],
  templateUrl: './profile-timeline-tab.html',
  styleUrl: './profile-timeline-tab.css'
})
export class ProfileTimelineTab implements OnInit {

  posts = signal<Post[]>([]);

  @Input()
  userId?: number;

  @Input()
  isMyProfile = false;

  @Input()
  canViewPosts = false;

  @Input()
  profileActivities: ProfileActivity[] = [];

  private postService = inject(PostService);

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {

    if (
      !this.isMyProfile &&
      !this.canViewPosts
    ) {
      this.posts.set([]);
      return;
    }

    const request$ = this.userId
      ? this.postService.getUserPosts(this.userId)
      : this.postService.getFeed();

    request$.subscribe({

      next: (responses: PostResponse[]) => {

        responses.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        const mappedPosts: Post[] = responses.map(
          (res: PostResponse): Post => ({

            id: res.id,

            authorName:
              `${res.userFirstName} ${res.userLastName}`,

            authorInitials:
              (
                res.userFirstName.charAt(0) +
                res.userLastName.charAt(0)
              ).toUpperCase(),

            profilePicture:
              res.profilePicture,

            timeLabel:
              this.calculateTimeAgo(res.createdAt),

            text:
              res.content,

            mediaUrl:
              res.mediaUrl
                ? `http://localhost:9090${res.mediaUrl}`
                : undefined,

            mediaType:
              res.mediaType?.toLowerCase().includes('video')
                ? 'video'
                : 'image',

            reactions: {
              like:
                res.reactionsCount?.['LIKE'] || 0,

              love:
                res.reactionsCount?.['LOVE'] || 0,

              haha:
                res.reactionsCount?.['HAHA'] || 0,

              wow:
                res.reactionsCount?.['WOW'] || 0,

              sad:
                res.reactionsCount?.['SAD'] || 0,

              angry:
                res.reactionsCount?.['ANGRY'] || 0
            },

            currentUserReaction:
              this.mapReaction(
                res.currentUserReaction
              ),

            commentsCount:
              res.commentsCount || 0,

            comments:
              res.comments || []

          })
        );

        this.posts.set(mappedPosts);
      },

      error: (err: unknown) => {

        console.error(
          'Error fetching timeline posts',
          err
        );

      }

    });
  }

  private mapReaction(
    reaction: string | null | undefined
  ): ReactionType | null {

    if (!reaction) {
      return null;
    }

    return reaction.toLowerCase() as ReactionType;
  }

  calculateTimeAgo(
    dateString: string
  ): string {

    if (!dateString) {
      return '';
    }

    const postDate = new Date(dateString);
    const now = new Date();

    const diffInSeconds =
      Math.floor(
        (
          now.getTime() -
          postDate.getTime()
        ) / 1000
      );

    if (diffInSeconds < 60) {
      return 'Just now';
    }

    const diffInMinutes =
      Math.floor(
        diffInSeconds / 60
      );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }

    const diffInHours =
      Math.floor(
        diffInMinutes / 60
      );

    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }

    const diffInDays =
      Math.floor(
        diffInHours / 24
      );

    if (diffInDays < 7) {
      return `${diffInDays}d`;
    }

    return postDate.toLocaleDateString();
  }

  onPosted(
    payload: {
      text?: string;
      file?: File;
    }
  ): void {

    this.postService
      .createPost(
        payload.text || '',
        payload.file
      )
      .subscribe({

        next: () => {
          this.loadPosts();
        },

        error: (err: unknown) => {

          console.error(
            'Error creating post in profile',
            err
          );

        }

      });
  }
}