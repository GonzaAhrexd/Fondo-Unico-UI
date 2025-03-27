// Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Servicios
import { UserService } from '../../api/user.service';
// Componentes
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { CardActionsComponent } from '../../components/card-actions/card-actions.component';
import { BancosComponent } from '../../components/Campos/bancos/bancos.component';
import { FormulariosComponent } from "../../components/Campos/formularios/formularios.component";
import { LocalidadesComponent } from '../../components/Campos/localidades/localidades.component';
import { UnidadesComponent } from '../../components/Campos/unidades/unidades.component';
@Component({
  selector: 'app-editar-campos',
  imports: [NavBarComponent, CardActionsComponent, BancosComponent, FormulariosComponent, LocalidadesComponent, UnidadesComponent], 
  templateUrl: './editar-campos.component.html',
})

export class EditarCamposComponent {

  // Constructor
  constructor(private userService: UserService, private router: Router) { }

  // Variables
  usuarioRol = ""
  seccion = ""
  seccionesCampos = [
    {texto: "Bancos"},
    {texto: "Formularios"},
    {texto:"Localidades"},
    {texto:"Unidades"}

  ]

  // Inicialización
  ngOnInit() {
    let isAuth = this.userService.isAuthenticated(); // Verifica si el usuario está autenticado
    if (!isAuth) { // Si no está autenticado, redirige al login
      this.router.navigate(['/login']); // Redirige al login
    } else { // Si está autenticado
      this.usuarioRol = this.userService.getUser().rol; // Obtiene el rol del usuario
     }
  }

  // Funciones
  getClickedSection(text: any) {
    this.seccion = text;
  }
}
