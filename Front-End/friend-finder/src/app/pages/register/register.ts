import { Component, ChangeDetectorRef } from '@angular/core'; // استدعينا السلاح هنا
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
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(12),
      Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]+$')
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
    loading_btn: { en: 'Creating account...', ar: 'جاري الإنشاء...', de: 'Konto wird erstellt...' },
    err_email_exists: { en: 'Email is already registered.', ar: 'البريد الإلكتروني مسجل مسبقاً.', de: 'E-Mail ist bereits registriert.' },
    err_server: { en: 'Cannot connect to server.', ar: 'لا يمكن الاتصال بالخادم.', de: 'Keine Verbindung zum Server.' }
  };

  // حقنّا الـ ChangeDetectorRef هنا
  constructor(private auth: Auth, private router: Router, private cdr: ChangeDetectorRef) {}

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = this.currentLang === 'ar' ? 'الرجاء التأكد من صحة البيانات' : 'Please check your input.';
      this.cdr.detectChanges(); // إجبار تحديث الشاشة
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.cdr.detectChanges(); // إجبار تحديث الشاشة

    this.auth.register(this.registerForm.value as any).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        
        if (err.status === 409) {
          this.errorMessage = this.dict.err_email_exists[this.currentLang] || 'البريد الإلكتروني مسجل مسبقاً.';
        } else if (err.status === 0) {
          this.errorMessage = this.dict.err_server[this.currentLang] || 'لا يمكن الاتصال بالخادم.';
        } else {
          this.errorMessage = err.error?.message || 'حدث خطأ غير متوقع.';
        }
        
        // دي الضربة القاضية اللي بتصحي الـ HTML وتخليه يعرض المربع فوراً
        this.cdr.detectChanges(); 
      }
    });
  }
}