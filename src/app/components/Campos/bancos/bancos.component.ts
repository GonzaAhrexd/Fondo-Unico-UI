import { Component } from '@angular/core';
import { AgregarBancosComponent } from './agregar-banco/agregar-banco.component';
import { TablaBancosComponent } from './tabla-bancos/tabla-bancos.component';
@Component({
  selector: 'app-bancos',
  imports: [ AgregarBancosComponent, TablaBancosComponent],
  templateUrl: './bancos.component.html',
})
export class BancosComponent {

  modoAgregar = false;

  opcion = ""
  getClickedSection(text: any) {
    this.opcion = text;
  }

}
