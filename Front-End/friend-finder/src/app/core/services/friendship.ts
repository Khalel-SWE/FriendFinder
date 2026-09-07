import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FriendRequestResponse {

  requestId: number;

  requesterEmail: string;

  requesterFirstName: string;

  requesterLastName: string;

  status: string;
}

export interface FriendResponse {

  id: number;

  name: string;

  initials: string;

  gradient:
    | 'from-burgundy'
    | 'from-gold';

  mutualCount: number;

  profilePicture: string | null;

  coverPhoto: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  private apiUrl =
    'http://localhost:9090/friend-finder/friends';


  constructor(
    private http: HttpClient
  ) {}

  sendFriendRequest(
    receiverId: number
  ): Observable<string> {

    return this.http.post(
      `${this.apiUrl}/request/${receiverId}`,
      {},
      {
        responseType: 'text'
      }
    );
  }

  sendFriendRequestByEmail(
    email: string
  ): Observable<string> {

    return this.http.post(
      `${this.apiUrl}/request`,
      null,
      {
        params: {
          toEmail: email
        },

        responseType: 'text'
      }
    );
  }

  getPendingRequests():
    Observable<FriendRequestResponse[]> {

    return this.http.get<
      FriendRequestResponse[]
    >(
      `${this.apiUrl}/requests/pending`
    );
  }

  respondToRequest(
    requestId: number,
    status: 'ACCEPTED' | 'REJECTED'
  ): Observable<string> {

    return this.http.put(
      `${this.apiUrl}/requests/${requestId}`,
      null,
      {
        params: {
          status
        },

        responseType: 'text'
      }
    );
  }

  getMyFriends():
    Observable<FriendResponse[]> {

    return this.http.get<
      FriendResponse[]
    >(
      `${this.apiUrl}/my-friends`
    );
  }

  getFriendsForProfile(
    userId: number
  ): Observable<FriendResponse[]> {

    return this.http.get<
      FriendResponse[]
    >(
      `${this.apiUrl}/profile/${userId}`
    );
  }

  removeFriend(
    friendId: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/remove/${friendId}`
    );
  }
}
