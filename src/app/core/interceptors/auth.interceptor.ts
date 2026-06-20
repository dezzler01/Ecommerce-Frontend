import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  // Check if request is targeting our backend endpoints
  const isTargetingBackend = req.url.includes(':5153') || req.url.includes(':7040') || req.url.startsWith('/api');

  if (token && isTargetingBackend) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
