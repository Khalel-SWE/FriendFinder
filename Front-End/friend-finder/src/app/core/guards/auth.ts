import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// الجارد ده بيحمي صفحة الهوم (بيمنع اللي مش مسجل دخول)
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// الجارد ده بيحمي صفحة اللوجين والريجستر (بيمنع اللي مسجل دخول إنه يرجعهم)
export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  if (token) {
    router.navigate(['/feed']);
    return false;
  }

  return true;
};