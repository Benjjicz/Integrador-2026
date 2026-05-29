import { Injectable, isDevMode } from '@angular/core'; 
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  
  private readonly baseUrl = isDevMode() ? 'http://localhost:3000' : '';
  private readonly apiUrl = `${this.baseUrl}/api/v1/tareas`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerTareas(idProyecto?: number): Observable<any[]> {
    let params = new HttpParams();
    if (idProyecto) {
      params = params.set('idProyecto', idProyecto.toString());
    }
    return this.http.get<any[]>(this.apiUrl, { 
      headers: this.getHeaders(), 
      params 
    });
  }

  crearTarea(tarea: { descripcion: string, idProyecto: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, tarea, { headers: this.getHeaders() });
  }

  actualizarTarea(id: number, tarea: { descripcion: string, estado: string, idProyecto: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tarea, { headers: this.getHeaders() });
  }

  actualizarEstado(id: number, estado: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${id}/estado`, 
      { estado }, 
      { headers: this.getHeaders() }
    );
  }

  eliminarTarea(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}