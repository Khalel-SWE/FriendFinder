import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  get currentLang(): 'en' | 'ar' | 'de' {
    return (document.documentElement.lang as 'en' | 'ar' | 'de') || 'en';
  }

  dict = {
    reg_eyebrow: { en: 'Your Invitation', ar: 'دعوتك جاهزة', de: 'Deine Einladung' },
    reg_headline: { en: 'Step into the light.', ar: 'ادخل النور.', de: 'Tritt ins Licht.' },
    reg_title_sub: { en: 'It takes less than a minute.', ar: 'مش هتاخد منك دقيقة.', de: 'Dauert weniger als eine Minute.' },
    label_fname: { en: 'First name', ar: 'الاسم الأول', de: 'Vorname' },
    label_lname: { en: 'Last name', ar: 'اسم العائلة', de: 'Nachname' },
    label_email: { en: 'Email address', ar: 'البريد الإلكتروني', de: 'E-Mail-Adresse' },
    label_password: { en: 'Password', ar: 'كلمة المرور', de: 'Passwort' },
    ph_fname: { en: 'Layla', ar: 'ليلى', de: 'Laila' },
    ph_lname: { en: 'Hassan', ar: 'حسن', de: 'Hassan' },
    ph_email: { en: 'you@example.com', ar: 'you@example.com', de: 'du@beispiel.com' },
    ph_password_new: { en: 'At least 8 characters', ar: '8 حروف على الأقل', de: 'Mindestens 8 Zeichen' },
    create_btn: { en: 'Create my account', ar: 'إنشاء حسابي', de: 'Konto erstellen' },
    tab_login: { en: 'Sign In', ar: 'تسجيل الدخول', de: 'Anmelden' },
    tab_register: { en: 'Create Account', ar: 'إنشاء حساب', de: 'Konto erstellen' }
  };
}