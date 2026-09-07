import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostResponse } from '../models/post-model'; 

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:9090/friend-finder/posts';

  constructor(private http: HttpClient) {}

  getFeed(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`${this.apiUrl}/feed`);
  }

  getUserPosts(userId: number): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`${this.apiUrl}/user/${userId}`);
  }

  createPost(content?: string, file?: File): Observable<PostResponse> {
    const formData = new FormData();
    
    if (content) {
      formData.append('content', content);
    }
    if (file) {
      formData.append('file', file);
    }

    return this.http.post<PostResponse>(`${this.apiUrl}/create`, formData);
  }
}