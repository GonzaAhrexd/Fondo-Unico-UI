// Angular
import { Component } from '@angular/core';
// Componentes
import { AgregarFormulariosComponent } from './agregar-formularios/agregar-formularios.component';
import { FormularioTableComponent } from './tabla-formularios/tabla-formularios.component';

@Component({
  selector: 'app-formularios',
  standalone: true,
  imports: [AgregarFormulariosComponent, FormularioTableComponent],
  templateUrl: './formularios.component.html',
})



export class FormulariosComponent {
  showAddFormularios = false


}
