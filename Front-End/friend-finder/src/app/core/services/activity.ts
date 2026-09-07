import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityResponse } from '../models/activity-model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private apiUrl =
    'http://localhost:9090/friend-finder/activities';

  constructor(private http: HttpClient) {}

  getActivities(): Observable<ActivityResponse[]> {

    return this.http.get<ActivityResponse[]>(this.apiUrl);

  }

}