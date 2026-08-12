import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private api = 'http://localhost:9090/friend-finder/admin';

  constructor(private http: HttpClient) {}

  // ================= Dashboard =================

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.api}/stats`);
  }

  // ================= Users =================

  getUsers(page: number, size: number): Observable<any> {
    return this.http.get<any>(
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

  // ================= Posts =================

  getPosts(page: number, size: number): Observable<any> {
    return this.http.get<any>(
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

  // ================= Contacts =================

  getContacts(): Observable<any> {
    return this.http.get<any>(
      `${this.api}/contacts`
    );
  }

  replyContact(id: number, adminReply: string): Observable<string> {

    return this.http.patch(
      `${this.api}/contacts/${id}/reply`,
      {
        adminReply: adminReply
      },
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