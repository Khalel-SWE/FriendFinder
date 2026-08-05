import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NotificationResponse } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class Notification {

  private apiUrl = 'http://localhost:9090/friend-finder/notifications';

  constructor(private http: HttpClient) {}

  getMyNotifications(): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(this.apiUrl);
  }

}