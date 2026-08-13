import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminUser {
  userId: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  joinedAt: string;
  enabled: boolean;
}

export interface AdminPost {
  postId: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
}

export interface AdminContact {
  id: number;
  senderName: string;
  senderEmail: string;
  type: 'COMPLAINT' | 'SUGGESTION' | 'BUG' | 'OTHER';
  message: string;
  adminReply: string | null;
  status: 'OPEN' | 'REPLIED' | 'CLOSED';
  createdAt: string;
  repliedAt: string | null;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private api = 'http://localhost:9090/friend-finder/admin';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.api}/stats`);
  }

  getUsers(
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse<AdminUser>> {

    return this.http.get<PageResponse<AdminUser>>(
      `${this.api}/users?page=${page}&size=${size}`
    );
  }

  toggleUserStatus(userId: number): Observable<string> {

    return this.http.patch(
      `${this.api}/users/${userId}/status`,
      {},
      {
        responseType: 'text'
      }
    );
  }

  getPosts(
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse<AdminPost>> {

    return this.http.get<PageResponse<AdminPost>>(
      `${this.api}/posts?page=${page}&size=${size}`
    );
  }

  deletePost(postId: number): Observable<string> {

    return this.http.delete(
      `${this.api}/posts/${postId}`,
      {
        responseType: 'text'
      }
    );
  }

  getContacts(): Observable<AdminContact[]> {

    return this.http.get<AdminContact[]>(
      `${this.api}/contacts`
    );
  }

  replyToContact(
    id: number,
    adminReply: string
  ): Observable<string> {

    return this.http.patch(
      `${this.api}/contacts/${id}/reply`,
      { adminReply },
      {
        responseType: 'text'
      }
    );
  }

  closeContact(id: number): Observable<string> {

    return this.http.patch(
      `${this.api}/contacts/${id}/close`,
      {},
      {
        responseType: 'text'
      }
    );
  }
}