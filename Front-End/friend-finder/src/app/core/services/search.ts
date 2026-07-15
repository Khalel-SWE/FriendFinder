import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // شارة الإشارة اللي شايلة الكلمة المكتوبة في البحث
  query = signal<string>('');

  setQuery(q: string) {
    this.query.set(q);
  }
}