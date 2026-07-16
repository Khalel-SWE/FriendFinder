import { Component, Input } from '@angular/core';
import { ProfileResponse } from '../../core/models/profile-model';

@Component({
  selector: 'app-profile-cover',
  standalone: true,
  templateUrl: './profile-cover.html',
  styleUrl: './profile-cover.css'
})
export class ProfileCover {
  @Input({ required: true }) profile!: ProfileResponse;
  @Input() memberSince = '2024';

  get initials(): string {
    return (this.profile.firstName[0] ?? '') + (this.profile.lastName[0] ?? '');
  }
  get fullName(): string {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
}