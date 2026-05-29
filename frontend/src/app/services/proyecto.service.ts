import { Injectable, isDevMode } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  
  private readonly baseUrl = isDevMode() ? 'http://localhost:3000' : '';
  private apiUrl = `${this.baseUrl}/api/v1/proyectos`; 

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerProyectos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crearProyecto(proyecto: { nombre: string, clienteId?: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, proyecto, { headers: this.getHeaders() });
  }

  actualizarProyecto(id: number, proyecto: { nombre: string, estado: string, clienteId?: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, proyecto, { headers: this.getHeaders() });
  }

  eliminarProyecto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}