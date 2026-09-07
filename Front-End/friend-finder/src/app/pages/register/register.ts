import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule],
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
    err_server: { en: 'Cannot connect to server.', ar: 'لا يمكن الاتصال بالخادم.', de: 'Keine Verbindung zum Server.' },
    err_req_fname: { en: 'First name is required.', ar: 'الاسم الأول مطلوب.', de: 'Vorname ist erforderlich.' },
    err_req_lname: { en: 'Last name is required.', ar: 'اسم العائلة مطلوب.', de: 'Nachname ist erforderlich.' },
    err_req_email: { en: 'A valid email is required.', ar: 'بريد إلكتروني صحيح مطلوب.', de: 'Eine gültige E-Mail ist erforderlich.' },
    err_bad_pass: { en: 'Password must be 7-12 chars with letters, numbers, and symbols.', ar: 'كلمة المرور يجب أن تكون 7-12 حرفاً وتحتوي على حروف وأرقام ورموز.', de: 'Das Passwort muss 7-12 Zeichen lang sein und Buchstaben, Zahlen und Symbole enthalten.' }
  };

  constructor(private auth: Auth, private router: Router, private cdr: ChangeDetectorRef) {}

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      
      if (this.registerForm.get('firstName')?.invalid) {
        this.errorMessage = this.dict.err_req_fname[this.currentLang];
      } else if (this.registerForm.get('lastName')?.invalid) {
        this.errorMessage = this.dict.err_req_lname[this.currentLang];
      } else if (this.registerForm.get('email')?.invalid) {
        this.errorMessage = this.dict.err_req_email[this.currentLang];
      } else if (this.registerForm.get('password')?.invalid) {
        this.errorMessage = this.dict.err_bad_pass[this.currentLang];
      }
      
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.cdr.detectChanges();

    this.auth.register(this.registerForm.value as any).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        
        if (err.status === 409) {
          this.errorMessage = this.dict.err_email_exists[this.currentLang];
        } else if (err.status === 400) {
          this.errorMessage = err.error?.message || 'Invalid input data.';
        } else if (err.status === 0) {
          this.errorMessage = this.dict.err_server[this.currentLang];
        } else {
          this.errorMessage = err.error?.message || 'An unexpected error occurred.';
        }
        
        this.cdr.detectChanges(); 
      }
    });
  }
}