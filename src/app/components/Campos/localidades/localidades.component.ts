import { Component } from '@angular/core';
import { AgregarLocalidadComponent } from './agregar-localidad/agregar-localidad.component';
import { LocalidadTableComponent } from './localidad-table/localidad-table.component';
@Component({
  selector: 'app-localidades',
  imports: [AgregarLocalidadComponent, LocalidadTableComponent],
  templateUrl: './localidades.component.html',
})

export class LocalidadesComponent {

  modoAgregar = false;


}
