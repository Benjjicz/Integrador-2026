import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoriaService } from '../../services/auditoria.service'

@Component({
  selector: 'app-auditorias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auditorias.html',
  styleUrls: ['./auditorias.scss'] 
})
export class AuditoriasComponent implements OnInit {
  historial: any[] = [];
  cargando: boolean = true;

  constructor(
    private auditoriaService: AuditoriaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTabla();
  }


  cargarTabla() {
    this.cargando = true;
    this.auditoriaService.obtenerHistorial().subscribe({
      next: (data) => {
        this.historial = data || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar la tabla de auditoría:', err);
        this.historial = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }





  formatearDetalles(item: any): string {
    if (!item || !item.datosCambio) return 'Sin detalles disponibles';
    
    let objeto = item.datosCambio;
    if (typeof objeto === 'string') {
      try {
        objeto = JSON.parse(objeto);
      } catch (e) {
        return objeto;
      }
    }


    const op = item.tipo_operacion ? item.tipo_operacion.toUpperCase() : '';
    const entidad = item.tipo_entidad ? item.tipo_entidad.toLowerCase() : '';



    //logica para armar las descripciones de los cambios
    

    switch (entidad) {
      case 'clientes':
        return op === 'INSERT'
          ? `• Se dio de alta al cliente: "${objeto.nombre || 'S/N'}"`
          : `• Se actualizaron datos del cliente: "${objeto.nombre || 'S/N'}" (Estado: ${objeto.estado || 'ACTIVO'})`;

      case 'proyectos':
        return op === 'INSERT'
          ? `• Se creó el proyecto técnico: "${objeto.nombre || 'S/N'}"`
          : `• Se modificaron datos del proyecto: "${objeto.nombre || 'S/N'}" (Estado: ${objeto.estado || 'ACTIVO'})`;

      case 'tareas':
        return op === 'INSERT'
          ? `• Se generó la tarea: "${objeto.descripcion || 'S/D'}"`
          : `• Se movió la tarea "${objeto.descripcion || 'S/D'}" al estado [${(objeto.estado || 'PENDIENTE').toUpperCase()}]`;

      default:
        return `• Operación ${op} en ${item.tipo_entidad}: ${objeto.nombre || objeto.descripcion || 'Registro afectado'}`;
    }
  }



  descargarCSV() {
    this.auditoriaService.exportarCSV().subscribe({
      next: (blobData) => {
        const url = window.URL.createObjectURL(blobData);
        const link = document.createElement('a');
        link.href = url;
        
        const fechaHoy = new Date().toLocaleDateString('es-AR').replace(/\//g, '-');
        link.setAttribute('download', `reporte_auditoria_${fechaHoy}.csv`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error al exportar el reporte CSV:', err)
    });
  }
}