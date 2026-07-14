// import { Routes } from '@angular/router';

// import { Home } from './pages/home/home';
// import { Login } from './pages/login/login';
// import { Register } from './pages/register/register';

// export const routes: Routes = [
//   { path: '', component: Home },
//   { path: 'login', component: Login },
//   { path: 'register', component: Register },
//   { path: '**', redirectTo: '' }
// ];

// import { Routes } from '@angular/router';

// // استدعاء الجاردات بمسار نظيف
// import { authGuard, noAuthGuard } from './core/guards/auth';

// // استدعاء الصفحات بمسارات نظيفة
// import { Login } from './pages/login/login';
// import { Register } from './pages/register/register';
// import { HomeFeed } from './pages/home-feed/home-feed';

// export const routes: Routes = [
//   { 
//     path: 'home', 
//     component: HomeFeed, 
//     canActivate: [authGuard] 
//   },
//   { 
//     path: 'login', 
//     component: Login, 
//     canActivate: [noAuthGuard] 
//   },
//   { 
//     path: 'register', 
//     component: Register, 
//     canActivate: [noAuthGuard] 
//   },
//   { 
//     path: '', 
//     redirectTo: 'home', 
//     pathMatch: 'full' 
//   },
//   { 
//     path: '**', 
//     redirectTo: 'home' 
//   }
// ];

import { Routes } from '@angular/router';

import { authGuard, noAuthGuard } from './core/guards/auth';

import { Home } from './pages/home/home'; // الهوم الأساسي بتاعك
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { HomeFeed } from './pages/home-feed/home-feed'; // الفيد

export const routes: Routes = [
  // الهوم الأساسي (لو مسجل دخول هيروح للفيد، لو لأ هيفتح الهوم العادي)
  { path: '', component: Home, canActivate: [noAuthGuard] },
  
  // صفحة الفيد بعد تسجيل الدخول
  { path: 'feed', component: HomeFeed, canActivate: [authGuard] },
  
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  { path: 'register', component: Register, canActivate: [noAuthGuard] },
  
  { path: '**', redirectTo: '' }
];