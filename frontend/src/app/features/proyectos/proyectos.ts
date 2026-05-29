import { Component, OnInit, isDevMode } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.scss'
})
export class Proyectos implements OnInit {
  private readonly baseUrl = isDevMode() ? 'http://localhost:3000' : '';
  private readonly proyectosUrl = `${this.baseUrl}/api/v1/proyectos`;
  private readonly clientesUrl = `${this.baseUrl}/api/v1/clientes`;

  listaProyectos: any[] = [];
  listaClientesActivos: any[] = [];
  estadoFiltro: string = '';
  errorMensaje: string = '';

  mostrarModal: boolean = false;
  modalError: string = '';
  nuevoProyecto: { nombre: string; idCliente: number | null } = {
    nombre: '',
    idCliente: null
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarProyectos();
    this.cargarClientesActivos();
  }

  cargarProyectos(): void {
    this.errorMensaje = '';
    let params = new HttpParams();

    if (this.estadoFiltro) {
      params = params.set('estado', this.estadoFiltro);
    }

    this.http.get<any[]>(this.proyectosUrl, { params }).subscribe({
      next: (data) => {
        this.listaProyectos = data;
      },
      error: (err) => {
        console.error('Error al cargar proyectos:', err);
        this.errorMensaje = 'No se pudo obtener la lista de proyectos desde el servidor.';
      }
    });
  }

  cargarClientesActivos(): void {
    let params = new HttpParams().set('estado', 'ACTIVO');
    
    this.http.get<any[]>(this.clientesUrl, { params }).subscribe({
      next: (data) => {
        this.listaClientesActivos = data;
      },
      error: (err) => {
        console.error('Error al cargar clientes activos:', err);
      }
    });
  }

  abrirModalCrear(): void {
    this.mostrarModal = true;
    this.modalError = '';
    this.nuevoProyecto = { nombre: '', idCliente: null };
    this.cargarClientesActivos();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarProyecto(): void {
    this.modalError = '';

    if (!this.nuevoProyecto.nombre.trim()) {
      this.modalError = 'El nombre del proyecto es obligatorio.';
      return;
    }

    const payload: any = {
      nombre: this.nuevoProyecto.nombre.trim()
    };

    if (this.nuevoProyecto.idCliente) {
      payload.idCliente = Number(this.nuevoProyecto.idCliente);
    }

    this.http.post(this.proyectosUrl, payload).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarProyectos();
      },
      error: (err) => {
        console.error('Error al crear proyecto:', err);
        this.modalError = err.error?.message || 'Error al registrar el proyecto.';
      }
    });
  }

  finalizarProyecto(proyecto: any): void {
    this.errorMensaje = '';
    
    const payload = {
      estado: 'FINALIZADO',
      fechaFinalizacion: new Date().toISOString()
    };

    this.http.patch(`${this.proyectosUrl}/${proyecto.id}`, payload).subscribe({
      next: () => {
        this.cargarProyectos();
      },
      error: (err) => {
        console.error('Error al finalizar proyecto:', err);
        this.errorMensaje = err.error?.message || 'No se pudo finalizar el proyecto.';
      }
    });
  }

  cambiarEstado(id: number, nuevoEstado: string): void {
    this.errorMensaje = '';

    this.http.patch(`${this.proyectosUrl}/${id}`, { estado: nuevoEstado }).subscribe({
      next: () => {
        this.cargarProyectos();
      },
      error: (err) => {
        console.error('Error al cambiar de estado:', err);
        this.errorMensaje = err.error?.message || 'No se pudo actualizar el estado del proyecto.';
      }
    });
  }
}