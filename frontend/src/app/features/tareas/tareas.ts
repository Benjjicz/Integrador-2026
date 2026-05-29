import { Component, OnInit, ViewChild, isDevMode } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { KanbanComponent } from './kanban/kanban.component';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule, KanbanComponent],
  templateUrl: './tareas.html',
  styleUrl: './tareas.scss',
})
export class Tareas implements OnInit {
  private readonly baseUrl = isDevMode() ? 'http://localhost:3000' : '';
  private readonly proyectosUrl = `${this.baseUrl}/api/v1/proyectos`;
  private readonly tareasUrl = `${this.baseUrl}/api/v1/tareas`;

  @ViewChild(KanbanComponent) kanbanComponent!: KanbanComponent;

  listaProyectosActivos: any[] = [];
  idProyectoSeleccionado: number | null = null;
  errorMensaje: string = '';

  mostrarModal: boolean = false;
  modalError: string = '';
  nuevaTarea = {
    descripcion: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarProyectosActivos();
  }

  cargarProyectosActivos(): void {
    this.errorMensaje = '';
    let params = new HttpParams().set('estado', 'ACTIVO');

    this.http.get<any[]>(this.proyectosUrl, { params }).subscribe({
      next: (data) => {
        this.listaProyectosActivos = data;
      },
      error: (err) => {
        console.error('Error al cargar proyectos activos:', err);
        this.errorMensaje = 'No se pudo obtener la lista de proyectos desde el servidor.';
      }
    });
  }

  onProyectoChange(): void {
    this.errorMensaje = '';
  }

  abrirModalCrear(): void {
    if (!this.idProyectoSeleccionado) return;
    this.mostrarModal = true;
    this.modalError = '';
    this.nuevaTarea.descripcion = '';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarTarea(): void {
    this.modalError = '';

    if (!this.nuevaTarea.descripcion.trim()) {
      this.modalError = 'La descripción de la tarea no puede estar vacía.';
      return;
    }

    const payload = {
      descripcion: this.nuevaTarea.descripcion.trim(),
      idProyecto: Number(this.idProyectoSeleccionado)
    };

    this.http.post(this.tareasUrl, payload).subscribe({
      next: () => {
        this.cerrarModal();
        if (this.kanbanComponent) {
          this.kanbanComponent.obtenerTareasDelProyecto();
        }
      },
      error: (err) => {
        console.error('Error al crear la tarea:', err);
        this.modalError = err.error?.message || 'Hubo un problema al registrar la tarea.';
      }
    });
  }

  onTareaCambiadaInKanban(): void {
    console.log('El tablero Kanban notificó un cambio de estado en una tarea.');
  }
}