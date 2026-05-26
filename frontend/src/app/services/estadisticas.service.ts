import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {

  private apiUrl =
    'http://localhost:3000/api/v1/estadisticas';

  constructor(
    private http: HttpClient,
  ) {}

  obtenerEstadisticas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}