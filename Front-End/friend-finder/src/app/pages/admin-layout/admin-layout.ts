import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout {

  constructor(private router: Router) {}

  goDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  goUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  goPosts(): void {
    this.router.navigate(['/admin/posts']);
  }

  goContacts(): void {
    this.router.navigate(['/admin/contacts']);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');

    this.router.navigate(['/']);
  }
}