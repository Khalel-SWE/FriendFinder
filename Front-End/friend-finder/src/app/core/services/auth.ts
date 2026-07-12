import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // ده الرابط الأساسي بتاع الـ Spring Boot بتاعك
  private baseUrl = 'http://localhost:9090/friend-finder/auth';

  constructor(private http: HttpClient) {}

  // دالة تسجيل الدخول
  login(data: LoginRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  // دالة إنشاء الحساب
  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }
}