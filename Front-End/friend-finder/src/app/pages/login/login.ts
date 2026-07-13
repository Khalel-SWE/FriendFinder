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
    loading_btn: { en: 'Signing in...', ar: 'جاري الدخول...', de: 'Anmelden...' },
    err_bad_creds: { en: 'Invalid email or password.', ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', de: 'Falsche E-Mail oder Passwort.' },
    err_server: { en: 'Cannot connect to server.', ar: 'لا يمكن الاتصال بالخادم.', de: 'Keine Verbindung zum Server.' }
  };

  constructor(private auth: Auth, private router: Router) {}

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.auth.login(this.loginForm.value as any).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('✅ Token:', response.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('🔴 Error caught in Angular:', err); // سطر المراقبة
        this.isLoading = false;
        
        if (err.status === 401) {
          this.errorMessage = this.dict.err_bad_creds[this.currentLang] || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
        } else if (err.status === 0) {
          this.errorMessage = this.dict.err_server[this.currentLang] || 'لا يمكن الاتصال بالخادم.';
        } else {
          this.errorMessage = err.error?.message || 'حدث خطأ غير متوقع.';
        }

        console.log('🔴 Error Message set to:', this.errorMessage); // سطر المراقبة
      }
    });
  }
}