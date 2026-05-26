import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.scss',
})


export class Estadisticas implements OnInit {

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  loading: boolean = true;

  estadisticas: any = {
    proyectosActivos: 0,
    proyectosFinalizados: 0,
    tareasPendientes: 0,
    tareasFinalizadas: 0,
    clientesActivos: 0,
    proyectosPorCliente: []
  };

  public barChartLabels: string[] = [];

  public barChartOptions = {
    responsive: true,
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    },
    plugins: { legend: { display: false } }
  };

  public barChartType: ChartType = 'bar';

  public barChartData = [
    { data: [] as number[], label: 'Proyectos' }
  ];

  ngOnInit(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.http.get<any>('http://localhost:3000/api/v1/estadisticas')
      .subscribe({
        next: (data) => {

        
          this.estadisticas.proyectosActivos = data.proyectosActivos;
          this.estadisticas.proyectosFinalizados = data.proyectosFinalizados;
          this.estadisticas.tareasPendientes = data.tareasPendientes;
          this.estadisticas.tareasFinalizadas = data.tareasFinalizadas;
          this.estadisticas.clientesActivos = data.clientesActivos;
          this.estadisticas.proyectosPorCliente = data.proyectosPorCliente;

          this.barChartLabels = data.proyectosPorCliente.map(
            (item: any) => item.cliente ?? 'Sin cliente'
          );

          this.barChartData = [{
            data: data.proyectosPorCliente.map(
              (item: any) => Number(item.cantidad)
            ),
            label: 'Proyectos',
          }];

          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('ERROR HTTP', err);
          this.loading = false;
        }
      });
  }

  // TOTAL GENERAL
  get totalGeneral(): number {
    return (
      this.estadisticas.proyectosActivos +
      this.estadisticas.proyectosFinalizados +
      this.estadisticas.tareasPendientes +
      this.estadisticas.tareasFinalizadas +
      this.estadisticas.clientesActivos
    );
  }

  // PORCENTAJES
  get porcentajeProyectos(): number {
    return this.totalGeneral
      ? Math.round((this.estadisticas.proyectosActivos / this.totalGeneral) * 100)
      : 0;
  }

  get porcentajeProyectosFinalizados(): number {
  return this.totalGeneral
    ? Math.round((this.estadisticas.proyectosFinalizados / this.totalGeneral) * 100)
    : 0;
}


  get porcentajeTareas(): number {
    return this.totalGeneral
      ? Math.round((this.estadisticas.tareasPendientes / this.totalGeneral) * 100)
      : 0;
    }

  get porcentajeTareasFinalizadas(): number {
  return this.totalGeneral
    ? Math.round((this.estadisticas.tareasFinalizadas / this.totalGeneral) * 100)
    : 0;
}

  get porcentajeClientes(): number {
    return this.totalGeneral
      ? Math.round((this.estadisticas.clientesActivos / this.totalGeneral) * 100)
      : 0;
  }
}