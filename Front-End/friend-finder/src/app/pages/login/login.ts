// import { Component } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { NgClass } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [RouterLink, NgClass],
//   templateUrl: './login.html',
//   styleUrl: './login.css',
// })
// export class Login {
//   // بيقرأ اللغة الحالية من الهيدر تلقائي
//   get currentLang(): 'en' | 'ar' | 'de' {
//     return (document.documentElement.lang as 'en' | 'ar' | 'de') || 'en';
//   }

//   dict = {
//     login_eyebrow: { en: 'Members Only', ar: 'لأعضاء الموقع فقط', de: 'Nur für Mitglieder' },
//     login_headline: { en: 'Real friendships have a certain light.', ar: 'للصداقة الحقيقية نور خاص بيها.', de: 'Echte Freundschaften haben ihr eigenes Licht.' },
//     login_welcome_sub: { en: 'Sign in — your circle has missed you.', ar: 'سجّل دخولك — دايرتك مستنياك.', de: 'Melde dich an — dein Kreis hat dich vermisst.' },
//     label_email: { en: 'Email address', ar: 'البريد الإلكتروني', de: 'E-Mail-Adresse' },
//     label_password: { en: 'Password', ar: 'كلمة المرور', de: 'Passwort' },
//     forgot: { en: 'Forgot it?', ar: 'نسيتها؟', de: 'Vergessen?' },
//     ph_email: { en: 'you@example.com', ar: 'you@example.com', de: 'du@beispiel.com' },
//     ph_password: { en: '••••••••', ar: '••••••••', de: '••••••••' },
//     signin_btn: { en: 'Sign In', ar: 'تسجيل الدخول', de: 'Anmelden' },
//     tab_login: { en: 'Sign In', ar: 'تسجيل الدخول', de: 'Anmelden' },
//     tab_register: { en: 'Create Account', ar: 'إنشاء حساب', de: 'Konto erstellen' }
//   };
// }

import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  errorMessage: string | null = null;
  isLoading = false;

  get currentLang(): 'en' | 'ar' | 'de' {
    return (document.documentElement.lang as 'en' | 'ar' | 'de') || 'en';
  }

  dict = {
    login_eyebrow: { en: 'Members Only', ar: 'لأعضاء الموقع فقط', de: 'Nur für Mitglieder' },
    login_headline: { en: 'Real friendships have a certain light.', ar: 'للصداقة الحقيقية نور خاص بيها.', de: 'Echte Freundschaften haben ihr eigenes Licht.' },
    login_welcome_sub: { en: 'Sign in — your circle has missed you.', ar: 'سجّل دخولك — دايرتك مستنياك.', de: 'Melde dich an — dein Kreis hat dich vermisst.' },
    label_email: { en: 'Email address', ar: 'البريد الإلكتروني', de: 'E-Mail-Adresse' },
    label_password: { en: 'Password', ar: 'كلمة المرور', de: 'Passwort' },
    forgot: { en: 'Forgot it?', ar: 'نسيتها؟', de: 'Vergessen?' },
    ph_email: { en: 'you@example.com', ar: 'you@example.com', de: 'du@beispiel.com' },
    ph_password: { en: '••••••••', ar: '••••••••', de: '••••••••' },
    signin_btn: { en: 'Sign In', ar: 'تسجيل الدخول', de: 'Anmelden' },
    loading_btn: { en: 'Signing in...', ar: 'جاري الدخول...', de: 'Anmelden...' }
  };

  constructor(private auth: Auth, private router: Router) {}

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // بنبعت الداتا للباك إند
    this.auth.login(this.loginForm.value as any).subscribe({
      next: (response) => {
        this.isLoading = false;
        // هنا لو النجاح، بنوجهه للصفحة الرئيسية
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        // بنعرض رسالة الخطأ اللي جاية من الباك إند
        this.errorMessage = err.error?.message || (this.currentLang === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid email or password.');
      }
    });
  }
}