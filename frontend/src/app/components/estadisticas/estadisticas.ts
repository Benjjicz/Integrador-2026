import { Component, OnInit, inject, ChangeDetectorRef, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChartType, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.scss',
})
export class Estadisticas implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  private readonly baseUrl = isDevMode() ? 'http://localhost:3000' : '';
  private readonly apiUrl = `${this.baseUrl}/api/v1/estadisticas`;

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

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      x: {
        grid: { display: false }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} proyecto(s)`
        }
      }
    }
  };

  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Proyectos',
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(139, 92, 246, 0.7)',
        'rgba(236, 72, 153, 0.7)',
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(236, 72, 153, 1)',
      ],
      borderWidth: 2,
      borderRadius: 6,
    }]
  };

  ngOnInit(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        this.estadisticas.proyectosActivos = data.proyectosActivos;
        this.estadisticas.proyectosFinalizados = data.proyectosFinalizados;
        this.estadisticas.tareasPendientes = data.tareasPendientes;
        this.estadisticas.tareasFinalizadas = data.tareasFinalizadas;
        this.estadisticas.clientesActivos = data.clientesActivos;
        this.estadisticas.proyectosPorCliente = data.proyectosPorCliente;

        const labels = data.proyectosPorCliente.map(
          (item: any) => item.cliente ?? 'Sin cliente'
        );
        const valores = data.proyectosPorCliente.map(
          (item: any) => Number(item.cantidad)
        );

        this.barChartData = {
          labels,
          datasets: [{
            data: valores,
            label: 'Proyectos',
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(239, 68, 68, 0.7)',
              'rgba(139, 92, 246, 0.7)',
              'rgba(236, 72, 153, 0.7)',
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(239, 68, 68, 1)',
              'rgba(139, 92, 246, 1)',
              'rgba(236, 72, 153, 1)',
            ],
            borderWidth: 2,
            borderRadius: 6,
          }]
        };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERROR HTTP', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get totalProyectos(): number { return this.estadisticas.proyectosActivos + this.estadisticas.proyectosFinalizados; }
  get totalTareas(): number { return this.estadisticas.tareasPendientes + this.estadisticas.tareasFinalizadas; }
  get porcentajeProyectos(): number { return this.totalProyectos ? Math.round((this.estadisticas.proyectosActivos / this.totalProyectos) * 100) : 0; }
  get porcentajeProyectosFinalizados(): number { return this.totalProyectos ? Math.round((this.estadisticas.proyectosFinalizados / this.totalProyectos) * 100) : 0; }
  get porcentajeTareas(): number { return this.totalTareas ? Math.round((this.estadisticas.tareasPendientes / this.totalTareas) * 100) : 0; }
  get porcentajeTareasFinalizadas(): number { return this.totalTareas ? Math.round((this.estadisticas.tareasFinalizadas / this.totalTareas) * 100) : 0; }
  get totalGeneral(): number { return this.estadisticas.proyectosActivos + this.estadisticas.proyectosFinalizados + this.estadisticas.tareasPendientes + this.estadisticas.tareasFinalizadas + this.estadisticas.clientesActivos; }
  get porcentajeClientes(): number { return this.totalGeneral ? Math.round((this.estadisticas.clientesActivos / this.totalGeneral) * 100) : 0; }
}