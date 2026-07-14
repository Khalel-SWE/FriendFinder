import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileResponse } from '../models/post-model'; // عدل المسار لو حطيتهم في ملف تاني

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // الدومين الأساسي بتاع الباك إند
  private apiUrl = 'http://localhost:9090/friend-finder/profiles';

  constructor(private http: HttpClient) {}

  // بتجيب بيانات اليوزر اللي عامل لوجين
  getMyProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/me`);
  }
}