import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  AdminService,
  AdminPost
} from '../../core/services/admin';

@Component({
  selector: 'app-admin-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-posts.html',
  styleUrl: './admin-posts.css'
})
export class AdminPosts implements OnInit {

  posts: AdminPost[] = [];

  currentPage = 0;
  pageSize = 10;

  totalPages = 0;

  loading = false;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {

    this.loading = true;

    this.adminService
      .getPosts(this.currentPage, this.pageSize)
      .subscribe({

        next: (response) => {

          this.posts = response.content;

          this.totalPages = response.totalPages;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error('Failed to load posts', err);

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }

  deletePost(post: AdminPost): void {

    const confirmed = confirm(
      `Delete post #${post.postId}?`
    );

    if (!confirmed) {
      return;
    }

    this.adminService
      .deletePost(post.postId)
      .subscribe({

        next: () => {

          this.loadPosts();

        },

        error: (err) => {

          console.error('Failed to delete post', err);

        }

      });
  }

  nextPage(): void {

    if (this.currentPage < this.totalPages - 1) {

      this.currentPage++;

      this.loadPosts();
    }
  }

  previousPage(): void {

    if (this.currentPage > 0) {

      this.currentPage--;

      this.loadPosts();
    }
  }
}