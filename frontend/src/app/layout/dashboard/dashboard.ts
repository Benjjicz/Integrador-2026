import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss' 
})
export class DashboardComponent implements OnInit {
  nombreUsuario: string = 'Usuario'; 

  constructor(private router: Router) {}

  ngOnInit() {
    this.extraerNombreDelToken();
  }

  extraerNombreDelToken() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token'); 
      
      if (token) {
        try {
          const payloadBase64 = token.split('.')[1]; 
          const payloadDecodificado = JSON.parse(window.atob(payloadBase64)); 
          
          this.nombreUsuario = payloadDecodificado.usuario || 
                               payloadDecodificado.nombre || 
                               payloadDecodificado.username || 
                               'Usuario'; 
        } catch (e) {
          console.error('Error al decodificar el token:', e);
          this.nombreUsuario = 'Usuario';
        }
      }
    }
  }

  cerrarSesion() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }
}