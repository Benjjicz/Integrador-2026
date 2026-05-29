import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectoService } from '../../services/proyecto.service';
import { ClienteService } from '../../services/cliente.service'; 

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proyectos.html', 
  styleUrl: './proyectos.scss'
})
export class Proyectos implements OnInit {
  proyectos: any[] = [];
  clientesActivos: any[] = []; 
  cargando = true;

  terminoBusqueda = '';

  mostrarFormulario = false;
  nuevoNombre = '';
  nuevoIdCliente: number | null = null;
  nuevoFechaFinalizacion: string = '';

  mostrarFormularioEdicion = false;
  proyectoEditandoId: number | null = null;
  editNombre = '';
  editEstado = 'ACTIVO'; 
  editIdCliente: number | null = null;
  editFechaFinalizacion: string = '';

  constructor(
    private proyectoService: ProyectoService,
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => {
        this.proyectos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar proyectos:', err)
    });

    this.clienteService.obtenerClientes().subscribe({
      next: (data) => {
        this.clientesActivos = data.filter((c: any) => c.estado === 'ACTIVO');
      }
    });
  }

  get proyectosFiltrados() {
    if (!this.terminoBusqueda) {
      return this.proyectos;
    }
    return this.proyectos.filter(p => 
      p.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  diasRestantes(fecha: string | null): number | null {
    if (!fecha) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const soloFecha = typeof fecha === 'string' ? fecha.substring(0, 10) : fecha;
    const partes = soloFecha.split('-');
    const limite = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
    
    return Math.ceil((limite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  }

  estadoPlazo(proyecto: any): string {
    if (proyecto.estado === 'FINALIZADO' || proyecto.estado === 'BAJA') return '';
    const dias = this.diasRestantes(proyecto.fechaFinalizacion);
    if (dias === null) return '';
    if (dias < 0)  return 'plazo-vencido';
    if (dias <= 7) return 'plazo-proximo';
    return 'plazo-ok';
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mostrarFormularioEdicion = false;
    this.nuevoNombre = '';
    this.nuevoIdCliente = null;
    this.nuevoFechaFinalizacion = ''; 
  }

  guardarProyecto() {
    if (!this.nuevoNombre.trim()) {
      alert('El nombre del proyecto es obligatorio');
      return;
    }
    
    const nuevoProyecto: any = { nombre: this.nuevoNombre.trim() };
    if (this.nuevoIdCliente) {
      nuevoProyecto.idCliente = Number(this.nuevoIdCliente);
    }
    if (this.nuevoFechaFinalizacion) {
      nuevoProyecto.fechaFinalizacion = this.nuevoFechaFinalizacion;
    }

    this.proyectoService.crearProyecto(nuevoProyecto).subscribe({
      next: () => {
        this.toggleFormulario();
        this.cargarDatos();
      },
      error: (err) => alert('Error al guardar el proyecto')
    });
  }

  abrirEditar(proyecto: any) {
    this.mostrarFormularioEdicion = true;
    this.mostrarFormulario = false;
    this.proyectoEditandoId = proyecto.id;
    this.editNombre = proyecto.nombre;
    this.editEstado = proyecto.estado;
    this.editIdCliente = proyecto.cliente ? proyecto.cliente.id : null;
    this.editFechaFinalizacion = proyecto.fechaFinalizacion
      ? proyecto.fechaFinalizacion.substring(0, 10)
      : '';
  }

  cancelarEdicion() {
    this.mostrarFormularioEdicion = false;
    this.proyectoEditandoId = null;
  }

  guardarEdicion() {
    if (!this.editNombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    const datosAct: any = {
      nombre: this.editNombre.trim(),
      estado: this.editEstado,
      idCliente: this.editIdCliente ? Number(this.editIdCliente) : null,
      fechaFinalizacion: this.editFechaFinalizacion || null
    };

    this.proyectoService.actualizarProyecto(this.proyectoEditandoId!, datosAct).subscribe({
      next: () => {
        this.cancelarEdicion();
        this.cargarDatos();
      },
      error: (err) => alert('Error al actualizar el proyecto')
    });
  }
}