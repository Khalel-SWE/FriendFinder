import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ProfileResponse
} from '../models/profile-model';

import {
  FriendSuggestionResponse
} from '../models/post-model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl =
    'http://localhost:9090/friend-finder/profiles';

  constructor(
    private http: HttpClient
  ) {}

  getMyProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(
      `${this.apiUrl}/me`
    );
  }

  getUserProfile(
    userId: number
  ): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(
      `${this.apiUrl}/${userId}`
    );
  }

  getFriendSuggestions():
    Observable<FriendSuggestionResponse[]> {

    return this.http.get<FriendSuggestionResponse[]>(
      `${this.apiUrl}/suggestions`
    );
  }

  updateProfile(
    profileData: unknown,
    avatar: File | null,
    cover: File | null
  ): Observable<ProfileResponse> {

    const formData = new FormData();

    formData.append(
      'profile',
      new Blob(
        [JSON.stringify(profileData)],
        {
          type: 'application/json'
        }
      )
    );

    if (avatar) {
      formData.append('avatar', avatar);
    }

    if (cover) {
      formData.append('cover', cover);
    }

    return this.http.put<ProfileResponse>(
      `${this.apiUrl}/update`,
      formData
    );
  }
}
