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
  
  
  // Variables
  opcion:string = ""
  opcionesDatos = [
    { texto: "Búsqueda", SVG: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
  <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
 ` },
    { texto: "Agregar verificación", SVG: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
 `},
  ]
  // Inicialización
  ngOnInit() { 
    let isAuth = this.userService.isAuthenticated(); // Verifica si el usuario está autenticado
    if(!isAuth){ // Si no está autenticado, redirige al login
      this.router.navigate(['/login']);
      }else{
        
    }
  }

  // Funciones
  getClickedSection(text: any) { // Función para obtener la opción seleccionada
    this.opcion = text
  }

  
}
