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

import {
  FriendshipService
} from '../../core/services/friendship';

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

  private router = inject(Router);

  private friendshipService =
    inject(FriendshipService);

  // مهم: كان ناقص وده سبب مشكلة الـ template
  actionLoading = false;

  // =====================================================
  // DISPLAY
  // =====================================================

  get initials(): string {

    if (!this.profile) {
      return '';
    }

    const first =
      this.profile.firstName?.charAt(0) ?? '';

    const last =
      this.profile.lastName?.charAt(0) ?? '';

    return (
      first + last
    ).toUpperCase();
  }

  get fullName(): string {

    if (!this.profile) {
      return '';
    }

    return `${this.profile.firstName} ${this.profile.lastName}`;
  }

  // =====================================================
  // IMAGE URL
  // =====================================================

  getImageUrl(
    path: string | null | undefined
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

    if (
      this.actionLoading ||
      !this.profile?.id
    ) {
      return;
    }

    this.actionLoading = true;

    this.friendshipService
      .sendFriendRequest(this.profile.id)
      .subscribe({

        next: () => {

          this.actionLoading = false;

          this.relationshipChanged.emit();
        },

        error: (err: unknown) => {

          console.error(
            'Error sending friend request:',
            err
          );

          this.actionLoading = false;
        }

      });
  }

  // =====================================================
  // ACCEPT FRIEND REQUEST
  // =====================================================

  acceptFriendRequest(): void {

    const requestId =
      this.profile?.pendingRequestId;

    if (
      this.actionLoading ||
      !requestId
    ) {
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

          console.error(
            'Error accepting friend request:',
            err
          );

          this.actionLoading = false;
        }

      });
  }

  // =====================================================
  // REJECT FRIEND REQUEST
  // =====================================================

  rejectFriendRequest(): void {

    const requestId =
      this.profile?.pendingRequestId;

    if (
      this.actionLoading ||
      !requestId
    ) {
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

          console.error(
            'Error rejecting friend request:',
            err
          );

          this.actionLoading = false;
        }

      });
  }

  // =====================================================
  // UNFRIEND
  // =====================================================

  unfriend(): void {

    if (
      this.actionLoading ||
      !this.profile?.id
    ) {
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
      .removeFriend(this.profile.id)
      .subscribe({

        next: () => {

          this.actionLoading = false;

          this.relationshipChanged.emit();
        },

        error: (err: unknown) => {

          console.error(
            'Error removing friend:',
            err
          );

          this.actionLoading = false;
        }

      });
  }

  // =====================================================
  // RELATIONSHIP
  // =====================================================

  get relationshipStatus():
    RelationshipStatus {

    return this.profile?.relationshipStatus
      ?? 'NONE';
  }
}