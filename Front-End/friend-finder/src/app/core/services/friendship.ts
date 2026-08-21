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
  gradient: 'from-burgundy' | 'from-gold';
  mutualCount: number;
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


  // =====================================================
  // SEND FRIEND REQUEST BY USER ID
  // =====================================================

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


  // =====================================================
  // SEND FRIEND REQUEST BY EMAIL
  // =====================================================

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


  // =====================================================
  // GET PENDING REQUESTS
  // =====================================================

  getPendingRequests():
    Observable<FriendRequestResponse[]> {

    return this.http.get<FriendRequestResponse[]>(
      `${this.apiUrl}/requests/pending`
    );

  }


  // =====================================================
  // ACCEPT / REJECT REQUEST
  // =====================================================

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


  // =====================================================
  // GET MY FRIENDS
  // =====================================================

  getMyFriends():
    Observable<FriendResponse[]> {

    return this.http.get<FriendResponse[]>(
      `${this.apiUrl}/my-friends`
    );

  }


  // =====================================================
  // REMOVE FRIEND
  // =====================================================

  removeFriend(
    friendId: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/remove/${friendId}`
    );

  }

}