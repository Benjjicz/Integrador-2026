import { Component, OnInit, isDevMode } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class Clientes implements OnInit {
  private readonly baseUrl = isDevMode() ? 'http://localhost:3000' : '';
  private readonly apiUrl = `${this.baseUrl}/api/v1/clientes`;

  clientes: any[] = [];
  cargando: boolean = false;
  errorMensaje: string = '';

  mostrarFormulario: boolean = false;
  mostrarFormularioEdicion: boolean = false;

  nuevoNombre: string = '';
  nuevoCorreo: string = '';
  nuevoTelefono: string = '';

  clienteEditandoId: number | null = null;
  editNombre: string = '';
  editCorreo: string = '';
  editTelefono: string = '';
  editEstado: 'ACTIVO' | 'BAJA' = 'ACTIVO';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.cargando = true;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.clientes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al traer clientes:', err);
        this.cargando = false;
      }
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (this.mostrarFormulario) {
      this.mostrarFormularioEdicion = false;
      this.limpiarFormularioCrear();
    }
  }

  guardarCliente(): void {
    if (!this.nuevoNombre.trim()) {
      alert('El nombre del cliente es obligatorio.');
      return;
    }

    const payload = {
      nombre: this.nuevoNombre.trim(),
      correo: this.nuevoCorreo.trim() || null,
      telefono: this.nuevoTelefono.trim() || null
    };

    this.http.post(this.apiUrl, payload).subscribe({
      next: () => {
        this.toggleFormulario();
        this.obtenerClientes();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert(err.error?.message || 'No se pudo crear el cliente.');
      }
    });
  }

  abrirEditar(cliente: any): void {
    this.mostrarFormulario = false;
    this.mostrarFormularioEdicion = true;
    
    this.clienteEditandoId = cliente.id;
    this.editNombre = cliente.nombre;
    this.editCorreo = cliente.correo || '';
    this.editTelefono = cliente.telefono || '';
    this.editEstado = cliente.estado;
  }

  cancelarEdicion(): void {
    this.mostrarFormularioEdicion = false;
    this.clienteEditandoId = null;
  }

  guardarEdicion(): void {
    if (!this.editNombre.trim()) {
      alert('El nombre no puede quedar vacío.');
      return;
    }

    const payload = {
      nombre: this.editNombre.trim(),
      correo: this.editCorreo.trim() || null,
      telefono: this.editTelefono.trim() || null,
      estado: this.editEstado
    };

    this.http.patch(`${this.apiUrl}/${this.clienteEditandoId}`, payload).subscribe({
      next: () => {
        this.cancelarEdicion();
        this.obtenerClientes();
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert(err.error?.message || 'No se pudieron aplicar los cambios.');
      }
    });
  }

  soloTelefono(event: KeyboardEvent): boolean {
    const regex = /^[0-9\-\+\s]$/;
    if (!regex.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
      return false;
    }
    return true;
  }

  private limpiarFormularioCrear(): void {
    this.nuevoNombre = '';
    this.nuevoCorreo = '';
    this.nuevoTelefono = '';
  }
}