import { Component } from '@angular/core';
import { AgregarUnidadesComponent } from './agregar-unidades/agregar-unidades.component';
import { UnidadesTableComponent } from './unidades-table/unidades-table.component';
@Component({
  selector: 'app-unidades',
  imports: [AgregarUnidadesComponent, UnidadesTableComponent],
  templateUrl: './unidades.component.html',
})

export class UnidadesComponent {
  modoAgregar = false;

}
