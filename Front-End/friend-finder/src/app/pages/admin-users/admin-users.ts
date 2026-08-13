import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  AdminService,
  AdminUser
} from '../../core/services/admin';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers implements OnInit {

  users: AdminUser[] = [];

  currentPage = 0;
  pageSize = 10;

  totalPages = 0;
  totalElements = 0;

  loading = false;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.loading = true;

    this.adminService
      .getUsers(this.currentPage, this.pageSize)
      .subscribe({

        next: (response) => {

          this.users = response.content;

          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error('Failed to load users', err);

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }

  toggleUser(user: AdminUser): void {

    this.adminService
      .toggleUserStatus(user.userId)
      .subscribe({

        next: (message) => {

          console.log(message);

          this.loadUsers();
        },

        error: (err) => {

          console.error('Failed to change user status', err);
        }

      });
  }

  nextPage(): void {

    if (this.currentPage < this.totalPages - 1) {

      this.currentPage++;

      this.loadUsers();
    }
  }

  previousPage(): void {

    if (this.currentPage > 0) {

      this.currentPage--;

      this.loadUsers();
    }
  }

  isBanned(user: AdminUser): boolean {

    /*
     * ملاحظة:
     * AdminUserResponse الحالي من الـ Backend
     * لا يحتوي isEnabled.
     *
     * لذلك في المرحلة الحالية
     * لا نستطيع معرفة حالة المستخدم الحقيقية
     * من الـ response.
     */
    return false;
  }
}