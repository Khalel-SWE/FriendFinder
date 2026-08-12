// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-admin-dashboard',
//   imports: [],
//   templateUrl: './admin-dashboard.html',
//   styleUrl: './admin-dashboard.css',
// })
// export class AdminDashboard {}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminService } from '../../core/services/admin';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {

  stats: any = {};

  constructor(
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.adminService.getDashboardStats()
      .subscribe({
        next: (response) => {
          this.stats = response;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

}