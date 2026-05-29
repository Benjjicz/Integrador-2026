import { Injectable, isDevMode } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  private readonly baseUrl = isDevMode() ? 'http://localhost:3000' : '';
  private readonly apiUrl = `${this.baseUrl}/api/v1/clientes`; 

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crearCliente(cliente: { nombre: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, cliente, { headers: this.getHeaders() });
  }

  actualizarCliente(id: number, cliente: { nombre: string, estado: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, cliente, { headers: this.getHeaders() });
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}