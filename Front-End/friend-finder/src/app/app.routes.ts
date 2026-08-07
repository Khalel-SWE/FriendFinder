import { Routes } from '@angular/router';

import { authGuard, noAuthGuard } from './core/guards/auth';

import { Home } from './pages/home/home'; // الهوم الأساسي بتاعك
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { HomeFeed } from './pages/home-feed/home-feed'; // الفيد
import { ProfilePage } from './pages/profile-page/profile-page';
import { EditProfile } from './pages/edit-profile/edit-profile';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  // الهوم الأساسي (لو مسجل دخول هيروح للفيد، لو لأ هيفتح الهوم العادي)
  { path: '', component: Home, canActivate: [noAuthGuard] },
  
  // صفحة الفيد بعد تسجيل الدخول
  { path: 'feed', component: HomeFeed, canActivate: [authGuard] },
  { path: 'profile', component: ProfilePage }, // 👈 إضافة طريق البروفايل
  { path: 'edit-profile', component: EditProfile, canActivate: [authGuard] },
  
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  { path: 'register', component: Register, canActivate: [noAuthGuard] },
  { path: 'contact', component: Contact, canActivate: [authGuard]},
  
  { path: '**', redirectTo: '' }
];