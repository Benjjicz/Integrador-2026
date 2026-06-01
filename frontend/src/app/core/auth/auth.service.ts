import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly apiUrl = '/api/v1/auth';

  constructor(private http: HttpClient) { }

  login(credenciales: { usuario: string; clave: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales);
  }

  guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  cerrarSesion() {
    localStorage.removeItem('token');
  }
}