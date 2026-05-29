import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isDevMode } from '@angular/core';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css'
})
export class KanbanComponent implements OnInit {
  private readonly baseUrl = isDevMode() ? 'http://localhost:3000' : '';
  private readonly apiUrl = `${this.baseUrl}/api/v1/tareas`;
  private readonly proyectosUrl = `${this.baseUrl}/api/v1/proyectos`;

  proyectos: any[] = [];
  idProyectoSeleccionado: number | null = null;

  tareasPendientes: any[] = [];
  tareasFinalizadas: any[] = [];
  tareasDeBaja: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.http.get<any[]>(this.proyectosUrl).subscribe({
      next: (proyectos) => {
        
        this.proyectos = proyectos.filter(p => p.estado !== 'BAJA');
      },
      error: (err) => console.error('Error al cargar proyectos:', err)
    });
  }

  onProyectoChange() {
    if (this.idProyectoSeleccionado) {
      this.obtenerTareasDelProyecto();
    } else {
      this.tareasPendientes = [];
      this.tareasFinalizadas = [];
      this.tareasDeBaja = [];
    }
  }

  obtenerTareasDelProyecto() {
    const params = new HttpParams().set('idProyecto', this.idProyectoSeleccionado!.toString());

    this.http.get<any[]>(this.apiUrl, { params }).subscribe({
      next: (tareas) => {
        this.tareasPendientes = tareas.filter(t => t.estado === 'PENDIENTE');
        this.tareasFinalizadas = tareas.filter(t => t.estado === 'FINALIZADA');
        this.tareasDeBaja = tareas.filter(t => t.estado === 'BAJA');
      },
      error: (err) => console.error('Error al cargar tareas:', err)
    });
  }

  onDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const tarea = event.item.data;
      const nuevoEstado = event.container.id; 

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.http.patch(`${this.apiUrl}/${tarea.id}/estado`, { estado: nuevoEstado }).subscribe({
        error: (err) => {
          console.error('Error de sync, revirtiendo...', err);
          this.obtenerTareasDelProyecto();
        }
      });
    }
  }
}