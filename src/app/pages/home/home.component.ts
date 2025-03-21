// Librerías de Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
// Servicio de usuario
import { UserService } from '../../api/user.service';

// Tipos
type Opcion = {
  texto: string, ruta: string, SVG: string
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavBarComponent],
  templateUrl: './home.component.html',
})

export class HomeComponent {
  // Instancia del servicio UserService
  constructor(private userService: UserService, private router: Router) { }
  // Variables
  usuario = "Usuario"
  usuarioRol = ""

  OpcionesFondo: Opcion[] = [
    {
      texto: "Entregas", ruta: "/entregas", SVG: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
         <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>

      ` },
  ]

  OpcionesPlanta: Opcion[] = [
    {
      texto: "Depósitos", ruta: "/depositos", SVG:
        `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
         <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>

      `

    },
    {
      texto: "Verificaciones", ruta: "/verificaciones", SVG: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
      </svg>
      ` }
  ]


  // Inicialización de la página
  ngOnInit() {
    let isAuth = this.userService.isAuthenticated(); // Verifica si el usuario está autenticado
    if (!isAuth) { // Si no está autenticado, redirige al login
      this.router.navigate(['/login']); // Redirige al login
    } else { // Si está autenticado
      this.usuarioRol = this.userService.getUser().rol; // Obtiene el rol del usuario
      this.usuario = this.userService.getUser().nombre + " " + this.userService.getUser().apellido; // Obtiene el nombre y apellido del usuario
    }
  }


}