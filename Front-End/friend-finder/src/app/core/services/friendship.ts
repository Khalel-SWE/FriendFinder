import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FriendItem } from '../models/profile-model'; 

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {
  private apiUrl = 'http://localhost:9090/friend-finder/friends';
  private http = inject(HttpClient);

  // إرسال طلب صداقة (بنستقبل text لأن الباك إند بيرجع String)
  sendFriendRequest(receiverId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/request/${receiverId}`, {}, { responseType: 'text' });
  }

  // جلب قائمة الأصدقاء الفعليين
  getMyFriends(): Observable<FriendItem[]> {
    return this.http.get<FriendItem[]>(`${this.apiUrl}/my-friends`);
  }

  // مسح صديق
  removeFriend(friendId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${friendId}`);
  }
}