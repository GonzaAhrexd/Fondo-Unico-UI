// Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BuscarVerificacionesComponent } from '../../components/buscar-verificaciones/buscar-verificaciones.component';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

// Autenticación
import { UserService } from '../../api/user.service';

@Component({
  selector: 'app-verificaciones',
  standalone: true,
  imports: [NavBarComponent, BuscarVerificacionesComponent],
  templateUrl: './verificaciones.component.html',
})
export class VerificacionesComponent {
  
  // Inicialización de los servicios
  constructor (private userService: UserService, private router: Router) {}
  
  // Inicialización
  ngOnInit() { 
    let isAuth = this.userService.isAuthenticated(); // Verifica si el usuario está autenticado
    if(!isAuth){ // Si no está autenticado, redirige al login
      this.router.navigate(['/login']);
      }else{
        
    }
  }

  
}
