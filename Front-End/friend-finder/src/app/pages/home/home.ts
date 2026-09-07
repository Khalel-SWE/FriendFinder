import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  get currentLang(): 'en' | 'ar' | 'de' {
    return (document.documentElement.lang as 'en' | 'ar' | 'de') || 'en';
  }

  dict = {
    title: { en: 'Find Your Circle.', ar: 'اكتشف دايرتك.', de: 'Finde deinen Kreis.' },
    subtitle: { 
      en: 'Where real friendships begin. Connect with like-minded people and build relationships that matter.', 
      ar: 'هنا تبدأ الصداقات الحقيقية. تواصل مع أشخاص بيشاركوك نفس الاهتمامات وابني علاقات ليها قيمة.', 
      de: 'Wo echte Freundschaften beginnen. Verbinde dich mit Gleichgesinnten.' 
    },
    cta: { en: 'Start Exploring', ar: 'ابدأ الاستكشاف', de: 'Jetzt entdecken' },
    welcome: { en: 'Welcome to Friend Finder', ar: 'مرحباً بك في Friend Finder', de: 'Willkommen bei Friend Finder' }
  };
}