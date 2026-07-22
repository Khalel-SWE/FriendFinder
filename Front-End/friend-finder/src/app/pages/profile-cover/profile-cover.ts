import { Component, Input, inject } from '@angular/core'; // 👈 ضفنا inject هنا
import { ProfileResponse } from '../../core/models/profile-model';
import { Router, RouterModule } from '@angular/router'; // 👈 ضفنا Router هنا

@Component({
  selector: 'app-profile-cover',
  standalone: true,
  imports: [RouterModule], 
  templateUrl: './profile-cover.html',
  styleUrl: './profile-cover.css'
})
export class ProfileCover {
  @Input() profile!: ProfileResponse;
  @Input() memberSince?: string;
  
  @Input() isMyProfile: boolean = true; 

  get initials(): string {
    if (!this.profile) return '';
    return (this.profile.firstName?.charAt(0) || '') + (this.profile.lastName?.charAt(0) || '');
  }

  get fullName(): string {
    if (!this.profile) return '';
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }

  private router = inject(Router);

  goToEdit() {
    this.router.navigate(['/edit-profile']);
  }
}