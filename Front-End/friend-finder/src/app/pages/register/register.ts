// import { Component } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { NgClass } from '@angular/common';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [RouterLink, NgClass],
//   templateUrl: './register.html',
//   styleUrl: './register.css',
// })
// export class Register {
//   get currentLang(): 'en' | 'ar' | 'de' {
//     return (document.documentElement.lang as 'en' | 'ar' | 'de') || 'en';
//   }

//   dict = {
//     reg_eyebrow: { en: 'Your Invitation', ar: 'دعوتك جاهزة', de: 'Deine Einladung' },
//     reg_headline: { en: 'Step into the light.', ar: 'ادخل النور.', de: 'Tritt ins Licht.' },
//     reg_title_sub: { en: 'It takes less than a minute.', ar: 'مش هتاخد منك دقيقة.', de: 'Dauert weniger als eine Minute.' },
//     label_fname: { en: 'First name', ar: 'الاسم الأول', de: 'Vorname' },
//     label_lname: { en: 'Last name', ar: 'اسم العائلة', de: 'Nachname' },
//     label_email: { en: 'Email address', ar: 'البريد الإلكتروني', de: 'E-Mail-Adresse' },
//     label_password: { en: 'Password', ar: 'كلمة المرور', de: 'Passwort' },
//     ph_fname: { en: 'Layla', ar: 'ليلى', de: 'Laila' },
//     ph_lname: { en: 'Hassan', ar: 'حسن', de: 'Hassan' },
//     ph_email: { en: 'you@example.com', ar: 'you@example.com', de: 'du@beispiel.com' },
//     ph_password_new: { en: 'At least 8 characters', ar: '8 حروف على الأقل', de: 'Mindestens 8 Zeichen' },
//     create_btn: { en: 'Create my account', ar: 'إنشاء حسابي', de: 'Konto erstellen' },
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
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  // هنا بنطبق نفس شروط الـ DTO بتاعك بالمللي
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(12),
      Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]+$') // نفس الريجكس بتاع الجافا
    ])
  });

  errorMessage: string | null = null;
  isLoading = false;

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
    loading_btn: { en: 'Creating account...', ar: 'جاري الإنشاء...', de: 'Konto wird erstellt...' }
  };

  constructor(private auth: Auth, private router: Router) {}

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = this.currentLang === 'ar' ? 'الرجاء التأكد من صحة البيانات (كلمة المرور يجب أن تحتوي على حروف وأرقام ورموز من 7 لـ 12 حرف)' : 'Please check your input. Password must be 7-12 chars containing letters, numbers, and symbols.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.auth.register(this.registerForm.value as any).subscribe({
      next: (response) => {
        this.isLoading = false;
        // توجيه للوجين بعد نجاح إنشاء الحساب
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        // عرض رسالة الإيميل مسجل مسبقاً أو أي إيرور من الباك إند
        this.errorMessage = err.error?.message || (this.currentLang === 'ar' ? 'حدث خطأ، قد يكون البريد الإلكتروني مسجل مسبقاً.' : 'An error occurred. Email might be already in use.');
      }
    });
  }
}