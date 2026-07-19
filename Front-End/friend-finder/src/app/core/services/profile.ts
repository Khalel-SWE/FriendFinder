import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileResponse} from '../models/profile-model'; 
import {FriendSuggestionResponse} from '../models/post-model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:9090/friend-finder/profiles';

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/me`);
  }

  // 👇 الدالة الجديدة اللي بتجيب المقترحات 👇
  getFriendSuggestions(): Observable<FriendSuggestionResponse[]> {
    return this.http.get<FriendSuggestionResponse[]>(`${this.apiUrl}/suggestions`);
  }

  // جلب بروفايل يوزر تاني بالـ ID
  getUserProfile(userId: number): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/${userId}`);
  }
}