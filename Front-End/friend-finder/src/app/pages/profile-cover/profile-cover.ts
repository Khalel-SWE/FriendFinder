import { Component, Input } from '@angular/core'; // 👈 ضيف Input هنا
import { ProfileResponse } from '../../core/models/profile-model'; 

@Component({
  selector: 'app-profile-cover',
  standalone: true,
  imports: [],
  templateUrl: './profile-cover.html',
  styleUrl: './profile-cover.css'
})
export class ProfileCover {
  @Input() profile!: ProfileResponse;
  @Input() memberSince?: string;
  
  // 👇 السطر ده اللي هيحل الإيرور 👇
  @Input() isMyProfile: boolean = true; 

  get initials(): string {
    if (!this.profile) return '';
    return (this.profile.firstName?.charAt(0) || '') + (this.profile.lastName?.charAt(0) || '');
  }

  get fullName(): string {
    if (!this.profile) return '';
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
}