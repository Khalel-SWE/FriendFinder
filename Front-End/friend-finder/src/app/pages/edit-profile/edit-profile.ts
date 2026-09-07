import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileMediaEditorComponent } from './profile-media-editor/profile-media-editor';
import { ProfileDetailsFormComponent } from './profile-details-form/profile-details-form';
import { ProfileMedia } from '../../core/models/profile-model';
import { ProfileService } from '../../core/services/profile';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ProfileMediaEditorComponent, ProfileDetailsFormComponent],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private profileService = inject(ProfileService); 

  media = signal<ProfileMedia>({
    avatarUrl: null,
    avatarInitials: '..',
    coverUrl: null
  });

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    bio: [''],
    jobTitle: [''],
    location: [''],
    interests: [''],
    languages: ['']
  });

  private newAvatarFile: File | null = null;
  private newCoverFile: File | null = null;

  ngOnInit() {
    this.profileService.getMyProfile().subscribe({
      next: (profile: any) => {
        this.form.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          bio: profile.bio,
          jobTitle: profile.jobTitle,
          location: profile.location,
          interests: profile.interests,
          languages: profile.languages
        });

        this.media.set({
          avatarUrl: profile.profilePicture ? `http://localhost:9090${profile.profilePicture}` : null,
          avatarInitials: (profile.firstName.charAt(0) + profile.lastName.charAt(0)).toUpperCase(),
          coverUrl: profile.coverPhoto ? `http://localhost:9090${profile.coverPhoto}` : null
        });
      },
      error: (err: any) => console.error('Error loading profile for edit', err)
    });
  }

  onAvatarChange(file: File): void {
    this.newAvatarFile = file;
  }

  onCoverChange(file: File): void {
    this.newCoverFile = file;
  }

  onSave(): void {
    if (this.form.invalid) return;

    this.profileService.updateProfile(this.form.getRawValue(), this.newAvatarFile, this.newCoverFile).subscribe({
      next: () => {
        this.router.navigate(['/profile'], { queryParams: { tab: 'about' } });
      },
      error: (err: any) => console.error('Error saving profile', err)
    });
  }

  onCancel(): void {
    this.router.navigate(['/profile'], { queryParams: { tab: 'timeline' } });
  }
}