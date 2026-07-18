import { Component, Input } from '@angular/core';
import { ProfileResponse } from '../../core/models/profile-model'; // 👈 استيراد الموديل الصح

@Component({
  selector: 'app-profile-about-tab',
  standalone: true,
  templateUrl: './profile-about-tab.html',
  styleUrl: './profile-about-tab.css'
})
export class ProfileAboutTab {
  @Input({ required: true }) profile!: ProfileResponse;

  get interestList(): string[] {
    return this.profile.interests ? this.profile.interests.split(',').map(s => s.trim()) : [];
  }
  
  get languageList(): string {
    return this.profile.languages ?? '';
  }
}