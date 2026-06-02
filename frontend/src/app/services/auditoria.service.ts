import { Injectable, isDevMode } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  
  private readonly baseUrl = isDevMode() ? 'http://localhost:3000' : '';
  private readonly apiUrl = `${this.baseUrl}/api/v1/auditorias`;

  constructor(private http: HttpClient) { }

  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }


  
  obtenerHistorial(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }



  exportarCSV(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/exportar`, { 
      headers: this.getHeaders(),
      responseType: 'blob' 
    });
  }
}