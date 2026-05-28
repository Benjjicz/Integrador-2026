import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  cargando = true;

  // Formulario Crear
  mostrarFormulario = false;
  nuevoNombre = '';
  nuevoCorreo = '';
  nuevoTelefono = '';

  // Formulario Editar
  mostrarFormularioEdicion = false;
  clienteEditandoId: number | null = null;
  editNombre = '';
  editCorreo = '';
  editTelefono = '';
  editEstado = '';

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.cargando = true;
    this.clienteService.obtenerClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- SECCIÓN CREAR ---
  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mostrarFormularioEdicion = false;
    this.nuevoNombre = '';
    this.nuevoCorreo = '';
    this.nuevoTelefono = '';
  }

  guardarCliente() {
    if (!this.nuevoNombre.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }

    const payload: any = { nombre: this.nuevoNombre };
    if (this.nuevoCorreo.trim())   payload.correo   = this.nuevoCorreo.trim();
    if (this.nuevoTelefono.trim()) payload.telefono = this.nuevoTelefono.trim();

    this.clienteService.crearCliente(payload).subscribe({
      next: () => {
        this.toggleFormulario();
        this.cargarClientes();
      },
      error: (err) => {
        console.error('Error al crear cliente', err);
        alert(err.error?.message || 'Hubo un error al guardar el cliente');
      }
    });
  }

  // --- SECCIÓN EDITAR ---
  abrirEditar(cliente: any) {
    this.mostrarFormularioEdicion = true;
    this.mostrarFormulario = false;
    this.clienteEditandoId = cliente.id;
    this.editNombre    = cliente.nombre;
    this.editCorreo    = cliente.correo   ?? '';
    this.editTelefono  = cliente.telefono ?? '';
    this.editEstado    = cliente.estado;
  }

  cancelarEdicion() {
    this.mostrarFormularioEdicion = false;
    this.clienteEditandoId = null;
  }

  guardarEdicion() {
    if (!this.editNombre.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }

    const datosActualizados: any = {
      nombre:   this.editNombre,
      estado:   this.editEstado,
      correo:   this.editCorreo.trim()   || null,
      telefono: this.editTelefono.trim() || null,
    };

    this.clienteService.actualizarCliente(this.clienteEditandoId!, datosActualizados).subscribe({
      next: () => {
        this.cancelarEdicion();
        this.cargarClientes();
      },
      error: (err) => {
        console.error('Error al actualizar cliente', err);
        alert(err.error?.message || 'Hubo un error al actualizar el cliente. Revise si tiene proyectos asociados.');
      }
    });
  }
  
  soloTelefono(event: KeyboardEvent): boolean {
  const permitidos = /[0-9\-()+\s]/;
  if (!permitidos.test(event.key)) {
    event.preventDefault();
    return false;
  }
  return true;
}
}
