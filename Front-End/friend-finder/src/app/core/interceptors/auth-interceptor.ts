// import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // بنجيب التوكن من الذاكرة
  const token = localStorage.getItem('auth_token');

  // لو التوكن موجود، بننسخ الريكويست ونلزق فيه التوكن
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // لو مفيش توكن (زي صفحة اللوجين)، بنعدي الريكويست عادي
  return next(req);
};
