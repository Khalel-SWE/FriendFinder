import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentResponse, ReactionType } from '../models/post-model';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  private apiUrl = 'http://localhost:9090/friend-finder/interactions';

  constructor(private http: HttpClient) {}

  // إضافة تعليق
  addComment(postId: number, content: string): Observable<CommentResponse> {
    const formData = new FormData();
    formData.append('content', content);
    return this.http.post<CommentResponse>(`${this.apiUrl}/posts/${postId}/comments`, formData);
  }

  // جلب التعليقات
  getComments(postId: number): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(`${this.apiUrl}/posts/${postId}/comments`);
  }

  // إضافة رياكشن (بنبعته كـ FormData عشان هو RequestParam)
  reactToPost(postId: number, type: ReactionType): Observable<string> {
    const formData = new FormData();
    // بنخليها Uppercase لو الباك إند شغال بـ Enum
    formData.append('type', type.toUpperCase()); 
    return this.http.post(`${this.apiUrl}/posts/${postId}/react`, formData, { responseType: 'text' });
  }
}