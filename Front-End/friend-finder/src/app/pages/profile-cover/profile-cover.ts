import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject
} from '@angular/core';

import {
  ProfileResponse,
  RelationshipStatus
} from '../../core/models/profile-model';

import { FriendshipService } from '../../core/services/friendship';

import {
  Router,
  RouterModule
} from '@angular/router';

@Component({
  selector: 'app-profile-cover',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './profile-cover.html',
  styleUrl: './profile-cover.css'
})
export class ProfileCover {

  @Input()
  profile!: ProfileResponse;

  @Input()
  memberSince?: string;

  @Input()
  isMyProfile = true;

  @Output()
  relationshipChanged =
    new EventEmitter<void>();

  actionLoading = false;

  private router = inject(Router);

  private friendshipService =
    inject(FriendshipService);


  // =====================================================
  // DISPLAY
  // =====================================================

  get initials(): string {

    if (!this.profile) {
      return '';
    }

    const first =
      this.profile.firstName
        ?.charAt(0) ?? '';

    const last =
      this.profile.lastName
        ?.charAt(0) ?? '';

    return (
      first + last
    ).toUpperCase();
  }


  get fullName(): string {

    if (!this.profile) {
      return '';
    }

    return (
      `${this.profile.firstName} ${this.profile.lastName}`
    ).trim();
  }


  // =====================================================
  // IMAGE URL
  // =====================================================

  getImageUrl(
    path: string | null
  ): string | null {

    if (!path) {
      return null;
    }

    return path.startsWith('http')
      ? path
      : `http://localhost:9090${path}`;
  }


  // =====================================================
  // EDIT PROFILE
  // =====================================================

  goToEdit(): void {

    this.router.navigate([
      '/edit-profile'
    ]);
  }


  // =====================================================
  // SEND FRIEND REQUEST
  // =====================================================

  sendFriendRequest(): void {

    if (!this.profile?.id
        || this.actionLoading) {

      return;
    }

    this.actionLoading = true;

    this.friendshipService
      .sendFriendRequest(
        this.profile.id
      )
      .subscribe({

        next: () => {

          this.actionLoading = false;

          this.relationshipChanged.emit();
        },

        error: (err: unknown) => {

          this.actionLoading = false;

          console.error(
            'Error sending friend request:',
            err
          );
        }

      });
  }


  // =====================================================
  // ACCEPT FRIEND REQUEST
  // =====================================================

  acceptFriendRequest(): void {

    const requestId =
      this.profile.pendingRequestId;

    if (!requestId
        || this.actionLoading) {

      return;
    }

    this.actionLoading = true;

    this.friendshipService
      .respondToRequest(
        requestId,
        'ACCEPTED'
      )
      .subscribe({

        next: () => {

          this.actionLoading = false;

          this.relationshipChanged.emit();
        },

        error: (err: unknown) => {

          this.actionLoading = false;

          console.error(
            'Error accepting friend request:',
            err
          );
        }

      });
  }


  // =====================================================
  // REJECT FRIEND REQUEST
  // =====================================================

  rejectFriendRequest(): void {

    const requestId =
      this.profile.pendingRequestId;

    if (!requestId
        || this.actionLoading) {

      return;
    }

    this.actionLoading = true;

    this.friendshipService
      .respondToRequest(
        requestId,
        'REJECTED'
      )
      .subscribe({

        next: () => {

          this.actionLoading = false;

          this.relationshipChanged.emit();
        },

        error: (err: unknown) => {

          this.actionLoading = false;

          console.error(
            'Error rejecting friend request:',
            err
          );
        }

      });
  }


  // =====================================================
  // UNFRIEND
  // =====================================================

  unfriend(): void {

    if (!this.profile?.id
        || this.actionLoading) {

      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to remove this friendship?'
      );

    if (!confirmed) {
      return;
    }

    this.actionLoading = true;

    this.friendshipService
      .removeFriend(
        this.profile.id
      )
      .subscribe({

        next: () => {

          this.actionLoading = false;

          this.relationshipChanged.emit();
        },

        error: (err: unknown) => {

          this.actionLoading = false;

          console.error(
            'Error removing friend:',
            err
          );
        }

      });
  }


  // =====================================================
  // RELATIONSHIP
  // =====================================================

  get relationshipStatus():
    RelationshipStatus {

    return this.profile
      ?.relationshipStatus ?? 'NONE';
  }
}