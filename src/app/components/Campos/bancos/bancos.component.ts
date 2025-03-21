import { Component } from '@angular/core';
import { CardActionsComponent } from '../../card-actions/card-actions.component';
import { AgregarBancosComponent } from './agregar-banco/agregar-banco.component';
import { TablaBancosComponent } from './tabla-bancos/tabla-bancos.component';
@Component({
  selector: 'app-bancos',
  imports: [CardActionsComponent, AgregarBancosComponent, TablaBancosComponent],
  templateUrl: './bancos.component.html',
})
export class BancosComponent {

  modoAgregar = false;

  opcion = ""
  getClickedSection(text: any) {
    this.opcion = text;
  }

}
