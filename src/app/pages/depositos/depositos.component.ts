// Librerías de Angular
import { Component } from '@angular/core';
// Componentes
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { CardActionsComponent } from '../../components/card-actions/card-actions.component';
import { AgregarDepositoComponent } from '../../components/Depositos/agregar-deposito/agregar-deposito.component';
import { BuscarDepositosComponent } from '../../components/Depositos/buscar-depositos/buscar-depositos.component';
@Component({
  selector: 'app-depositos',
  imports: [NavBarComponent, CardActionsComponent, AgregarDepositoComponent, BuscarDepositosComponent],
  templateUrl: './depositos.component.html'
})
export class DepositosComponent {

  opcionSeleccionada = ""
  opcionesDatos = [
    { texto: "Búsqueda", SVG: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
  <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
 ` },
    { texto: "Agregar depósito", SVG: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
 `},
  ]


  getClickedSection(opcion: string) {
    this.opcionSeleccionada = opcion
   }

}
