import {
  Component,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { PostComposer } from '../post-composer/post-composer';
import { PostCard } from '../post-card/post-card';
import { FriendSuggestions } from '../friend-suggestions/friend-suggestions';

import {
  Post,
  ReactionType,
  PostResponse
} from '../../core/models/post-model';

import { PostService } from '../../core/services/post';
import { InteractionService } from '../../core/services/interaction';
import { SearchService } from '../../core/services/search';

@Component({
  selector: 'app-home-feed',
  standalone: true,
  imports: [
    PostComposer,
    PostCard,
    FriendSuggestions
  ],
  templateUrl: './home-feed.html',
  styleUrl: './home-feed.css'
})
export class HomeFeed implements OnInit {

  allPosts = signal<Post[]>([]);

  posts = computed(() => {

    const q = this.searchService
      .query()
      .toLowerCase()
      .trim();

    if (!q) {
      return this.allPosts();
    }

    return this.allPosts().filter(post =>
      post.authorName
        .toLowerCase()
        .includes(q)
      ||
      (
        post.text &&
        post.text
          .toLowerCase()
          .includes(q)
      )
      ||
      (
        post.comments &&
        post.comments.some(
          comment =>
            comment.content
              .toLowerCase()
              .includes(q)
        )
      )
    );
  });

  constructor(
    private postService: PostService,
    private interactionService: InteractionService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(): void {

    this.postService
      .getFeed()
      .subscribe({

        next: (responses: PostResponse[]) => {

          responses.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );

          const mappedPosts: Post[] =
            responses.map(res => ({

              id: res.id,

              authorName:
                `${res.userFirstName} ${res.userLastName}`,

              authorInitials:
                (
                  res.userFirstName.charAt(0) +
                  res.userLastName.charAt(0)
                ).toUpperCase(),

              profilePicture:
                res.profilePicture ?? null,

              timeLabel:
                this.calculateTimeAgo(
                  res.createdAt
                ),

              text:
                res.content,

              mediaUrl:
                res.mediaUrl
                  ? `http://localhost:9090${res.mediaUrl}`
                  : undefined,

              mediaType:
                this.getMediaType(
                  res.mediaType
                ),

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
                res.currentUserReaction
                  ? res.currentUserReaction.toLowerCase() as ReactionType
                  : null,

              commentsCount:
                res.commentsCount || 0,

              comments:
                res.comments || []

            }));

          this.allPosts.set(
            mappedPosts
          );
        },

        error: (err) => {

          console.error(
            'Error fetching feed',
            err
          );

        }

      });
  }

  getMediaType(
    mimeType?: string
  ): 'image' | 'video' | undefined {

    if (!mimeType) {
      return undefined;
    }

    return mimeType
      .toLowerCase()
      .includes('video')
      ? 'video'
      : 'image';
  }

  calculateTimeAgo(
    dateString: string
  ): string {

    if (!dateString) {
      return '';
    }

    const postDate =
      new Date(dateString);

    const now =
      new Date();

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

  onPostCreated(
    newPostData: {
      text?: string;
      file?: File;
    }
  ): void {

    this.postService
      .createPost(
        newPostData.text,
        newPostData.file
      )
      .subscribe({

        next: () => {
          this.loadFeed();
        },

        error: (err) => {

          console.error(
            'Error creating post',
            err
          );

        }

      });
  }

  onReaction(
    post: Post,
    type: ReactionType
  ): void {

    const previous =
      post.currentUserReaction;

    /*
     * Remove the old reaction
     */
    if (previous) {

      post.reactions[previous] =
        Math.max(
          0,
          post.reactions[previous] - 1
        );
    }

    /*
     * Same reaction = remove it
     */
    if (previous === type) {

      post.currentUserReaction =
        null;

    } else {

      post.currentUserReaction =
        type;

      post.reactions[type]++;
    }

    this.allPosts.update(
      list => [...list]
    );

    this.interactionService
      .reactToPost(
        post.id,
        type
      )
      .subscribe({

        error: (err) => {

          console.error(
            'Error reacting',
            err
          );

          /*
           * Rollback current state
           */

          if (post.currentUserReaction) {

            post.reactions[
              post.currentUserReaction
            ] = Math.max(
              0,
              post.reactions[
                post.currentUserReaction
              ] - 1
            );
          }

          if (previous) {
            post.reactions[previous]++;
          }

          post.currentUserReaction =
            previous;

          this.allPosts.update(
            list => [...list]
          );
        }

      });
  }
}