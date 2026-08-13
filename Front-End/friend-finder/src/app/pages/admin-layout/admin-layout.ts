import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router  } from '@angular/router';

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

  logout(): void {

  localStorage.removeItem('auth_token');
  localStorage.removeItem('role');

  this.router.navigate(['/login']);

}
}