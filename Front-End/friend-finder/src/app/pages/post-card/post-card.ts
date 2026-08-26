import {
  Component,
  input,
  output,
  signal,
  inject,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { LanguageService } from '../../core/services/language';

import {
  Post,
  ReactionType,
  CommentResponse
} from '../../core/models/post-model';

import { InteractionService } from '../../core/services/interaction';

import { ProfileService } from '../../core/services/profile';


@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css'
})
export class PostCard implements OnInit {

  post =
    input.required<Post>();


  reactionClicked =
    output<ReactionType>();


  showComments =
    signal(false);


  comments =
    signal<CommentResponse[]>([]);


  newCommentText =
    signal('');


  // =====================================================
  // CURRENT USER
  // =====================================================

  currentUserEmail =
    signal<string>('');

  currentUserName =
    signal<string>('');


  editingCommentId =
    signal<number | null>(null);


  editingCommentText =
    signal<string>('');


  // =====================================================
  // REACTION PICKER
  // =====================================================

  reactionPickerOpen =
    signal(false);


  reactionIcons:
    Record<ReactionType, string> = {

      like: '👍',
      love: '❤️',
      haha: '😆',
      wow: '😮',
      sad: '😢',
      angry: '😡'

    };


  reactionKeys:
    ReactionType[] = [

      'like',
      'love',
      'haha',
      'wow',
      'sad',
      'angry'

    ];


  private interactionService =
    inject(InteractionService);


  private profileService =
    inject(ProfileService);


  constructor(
    public lang: LanguageService
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.profileService
      .getMyProfile()
      .subscribe({

        next: (profile) => {

          this.currentUserEmail.set(
            profile.email ?? ''
          );


          this.currentUserName.set(
            `${profile.firstName ?? ''} ${profile.lastName ?? ''}`
              .trim()
          );

        },

        error: (err: unknown) => {

          console.error(
            'Failed to load current user',
            err
          );

        }

      });

  }


  // =====================================================
  // REACTIONS
  // =====================================================

  totalReactions(): number {

    return Object.values(
      this.post().reactions
    ).reduce(

      (total, value) =>
        total + value,

      0

    );

  }


  toggleReactionPicker(): void {

    this.reactionPickerOpen.update(
      value => !value
    );

  }


  selectReaction(
    type: ReactionType
  ): void {

    this.reactionPickerOpen.set(
      false
    );

    this.reactionClicked.emit(
      type
    );

  }


  getCurrentReactionIcon(): string {

    const current =
      this.post().currentUserReaction;

    if (!current) {
      return '👍';
    }

    return this.reactionIcons[current];

  }


  getCurrentReactionLabel(): string {

    const current =
      this.post().currentUserReaction;

    if (!current) {

      return this.lang.t(
        'like'
      );

    }

    return this.lang.t(
      `reaction_${current}`
    );

  }


  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  getProfileImageUrl(
    picture?: string
  ): string | null {

    if (!picture) {
      return null;
    }

    return picture.startsWith('http')
      ? picture
      : `http://localhost:9090${picture}`;

  }


  // =====================================================
  // INITIALS
  // =====================================================

  getInitials(
    firstName?: string,
    lastName?: string
  ): string {

    if (!firstName && !lastName) {
      return '..';
    }

    const first =
      firstName?.charAt(0) ?? '';

    const last =
      lastName?.charAt(0) ?? '';

    return (
      first + last
    ).toUpperCase();

  }


  // =====================================================
  // COMMENTS
  // =====================================================

  toggleComments(): void {

    this.showComments.update(
      value => !value
    );

    if (this.showComments()) {

      this.loadComments();

    }

  }


  loadComments(): void {

    this.interactionService
      .getComments(
        this.post().id
      )
      .subscribe({

        next: (
          res: CommentResponse[]
        ) => {

          this.comments.set(res);

        },

        error: (err: unknown) => {

          console.error(
            'Error loading comments',
            err
          );

        }

      });

  }


  submitComment(): void {

    const text =
      this.newCommentText()
        .trim();

    if (!text) {
      return;
    }


    this.interactionService
      .addComment(
        this.post().id,
        text
      )
      .subscribe({

        next: (
          newComment: CommentResponse
        ) => {

          this.comments.update(
            list => [

              ...list,
              newComment

            ]
          );


          this.newCommentText
            .set('');


          this.post()
            .commentsCount++;

        },

        error: (err: unknown) => {

          console.error(
            'Error adding comment',
            err
          );

        }

      });

  }


  // =====================================================
  // COMMENT EDIT
  // =====================================================

  canEditComment(
    comment: CommentResponse
  ): boolean {

    if (
      comment.userEmail !==
      this.currentUserEmail()
    ) {

      return false;

    }


    const created =
      new Date(
        comment.createdAt
      );


    const difference =
      Date.now() -
      created.getTime();


    const twentyFourHours =
      24 *
      60 *
      60 *
      1000;


    return difference <=
      twentyFourHours;

  }


  startEditing(
    comment: CommentResponse
  ): void {

    if (
      !this.canEditComment(comment)
    ) {

      return;

    }


    this.editingCommentId.set(
      comment.id
    );


    this.editingCommentText.set(
      comment.content
    );

  }


  cancelEditing(): void {

    this.editingCommentId.set(
      null
    );


    this.editingCommentText.set(
      ''
    );

  }


  saveEditedComment(
    comment: CommentResponse
  ): void {

    const newContent =
      this.editingCommentText()
        .trim();


    if (!newContent) {
      return;
    }


    this.interactionService
      .updateComment(
        comment.id,
        newContent
      )
      .subscribe({

        next: (
          updated: CommentResponse
        ) => {

          this.comments.update(
            list =>
              list.map(
                item =>
                  item.id ===
                  updated.id
                    ? updated
                    : item
              )
          );


          this.cancelEditing();

        },

        error: (err: unknown) => {

          console.error(
            'Error updating comment',
            err
          );

        }

      });

  }


  // =====================================================
  // COMMENT DELETE
  // =====================================================

  canDeleteComment(
    comment: CommentResponse
  ): boolean {

    // ---------------------------------------------
    // 1. Comment owner
    // ---------------------------------------------

    const isCommentOwner =
      comment.userEmail ===
      this.currentUserEmail();


    // ---------------------------------------------
    // 2. Post owner
    // ---------------------------------------------

    const isPostOwner =
      this.currentUserName()
        .trim()
        .toLowerCase()
      ===
      this.post()
        .authorName
        .trim()
        .toLowerCase();


    // ---------------------------------------------
    // Final permission
    // ---------------------------------------------

    return (
      isCommentOwner ||
      isPostOwner
    );

  }


  deleteComment(
    comment: CommentResponse
  ): void {

    // ---------------------------------------------
    // Frontend protection
    // ---------------------------------------------

    if (
      !this.canDeleteComment(comment)
    ) {

      return;

    }


    const confirmed =
      confirm(
        this.lang.t(
          'confirm_delete_comment'
        )
      );


    if (!confirmed) {
      return;
    }


    this.interactionService
      .deleteComment(
        comment.id
      )
      .subscribe({

        next: () => {

          this.comments.update(

            list =>
              list.filter(
                item =>
                  item.id !==
                  comment.id
              )

          );


          this.post().commentsCount =
            Math.max(

              0,

              this.post().commentsCount - 1

            );

        },

        error: (err: unknown) => {

          console.error(
            'Error deleting comment',
            err
          );

        }

      });

  }

}