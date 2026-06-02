import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { DashboardComponent } from './layout/dashboard/dashboard'; 
import { ClientesComponent } from './layout/clientes/clientes.component'; 
import { Proyectos } from './layout/proyectos/proyectos'; 
import { Tareas } from './layout/tareas/tareas'; 
import { Estadisticas } from './components/estadisticas/estadisticas';
import { KanbanComponent } from './features/tareas/kanban/kanban.component';
import { AuditoriasComponent } from './features/auditorias/auditorias'; 
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  { path: 'login', component: LoginComponent },
  
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [ 
      { path: 'clientes', component: ClientesComponent },
      { path: 'proyectos', component: Proyectos },
      { path: 'tareas', component: Tareas },
      { path: 'kanban', component: KanbanComponent },
      { path: 'estadisticas', component: Estadisticas },
      { path: 'auditorias', component: AuditoriasComponent }, 
      { path: '', redirectTo: 'proyectos', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];