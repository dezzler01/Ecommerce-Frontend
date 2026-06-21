import { environment } from '../../../environments/environment';

export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  const trimmed = url.trim();
  if (!trimmed) return '';

  // If it's a relative path starting with /uploads/ or uploads/
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const path = trimmed.startsWith('/') ? trimmed : '/' + trimmed;
    return environment.apiUrl + path;
  }
  
  // If it's an absolute URL that contains localhost:5153, replace it in production
  if (trimmed.includes('localhost:5153')) {
    return trimmed.replace('http://localhost:5153', environment.apiUrl);
  }
  
  return trimmed;
}
