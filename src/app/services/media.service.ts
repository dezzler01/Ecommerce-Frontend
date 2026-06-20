import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5153/api/media';

  upload(file: File): Observable<{ isSuccess: boolean; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ isSuccess: boolean; url: string }>(`${this.apiUrl}/upload`, formData);
  }
}
