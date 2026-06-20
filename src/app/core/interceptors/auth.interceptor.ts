import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  let url = req.url;
  if (url.includes('localhost:5153')) {
    url = url.replace('http://localhost:5153', environment.apiUrl);
  } else if (url.startsWith('/api')) {
    url = environment.apiUrl + url;
  }

  const isTargetingBackend = url.includes(environment.apiUrl) || url.startsWith('/api');

  if (token && isTargetingBackend) {
    req = req.clone({
      url,
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    req = req.clone({ url });
  }

  return next(req);
};
