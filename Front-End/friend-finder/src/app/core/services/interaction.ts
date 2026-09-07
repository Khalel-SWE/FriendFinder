import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentResponse, ReactionType } from '../models/post-model';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  private apiUrl =
    'http://localhost:9090/friend-finder/interactions';


  constructor(
    private http: HttpClient
  ) {}

  addComment(
    postId: number,
    content: string
  ): Observable<CommentResponse> {

    const formData =
      new FormData();

    formData.append(
      'content',
      content
    );

    return this.http.post<CommentResponse>(
      `${this.apiUrl}/posts/${postId}/comments`,
      formData
    );

  }

  getComments(
    postId: number
  ): Observable<CommentResponse[]> {

    return this.http.get<CommentResponse[]>(
      `${this.apiUrl}/posts/${postId}/comments`
    );

  }

  updateComment(
    commentId: number,
    newContent: string
  ): Observable<CommentResponse> {

    const formData =
      new FormData();

    formData.append(
      'newContent',
      newContent
    );

    return this.http.put<CommentResponse>(
      `${this.apiUrl}/comments/${commentId}`,
      formData
    );

  }

  deleteComment(
    commentId: number
  ): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/comments/${commentId}`,
      {
        responseType: 'text'
      }
    );

  }

  reactToPost(
    postId: number,
    type: ReactionType
  ): Observable<string> {

    const formData =
      new FormData();

    formData.append(
      'type',
      type.toUpperCase()
    );

    return this.http.post(
      `${this.apiUrl}/posts/${postId}/react`,
      formData,
      {
        responseType: 'text'
      }
    );

  }

}