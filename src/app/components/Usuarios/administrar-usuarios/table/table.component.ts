import { Component, Input, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getUnidades } from '../../../../api/unidades.service';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
} from '@tanstack/angular-table'
import { ExpandedComponentComponent } from '../expanded-component/expanded-component.component';

@Component({
  selector: 'TableComponentAdministrarUsuarios',
  standalone: true,
  imports: [FlexRenderDirective, ReactiveFormsModule, ExpandedComponentComponent],
  templateUrl: './table.component.html',
})

export class TableComponentAdministrarUsuarios {
  @Input() defaultColumns: ColumnDef<any>[] = [] // Columnas por defecto
  @Input() data: any = ([]) // Datos de la tabla
  @Input() onDelete: Function = () => { }; // Función de eliminación
  @Input() onEdit: Function = () => { }; // Función de edición
  editMode = false

  // Señales para manejar la paginación
  public readonly sizesPages = signal<number[]>([5, 10, 25, 50, 100])
  public readonly paginationState = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,

  })


  roles = [
    { rol: 'Administrador' },
    { rol: 'Usuario' },
  ]
  Unidades:any = []

  formulario: FormGroup = new FormGroup({
    Id: new FormControl('', []),
    Rol: new FormControl('', []),
    Unidad: new FormControl('', []),
  })

  ngOnInit() {
    // Pon el valor por defecto de data.Rol en Rol del formulario
    // this.formulario.get('Rol')?.setValue(this.data.Rol)
    // Rellena con los campos originales
    this.formulario.get('Id')?.setValue(this.data.id)
    this.formulario.get('Rol')?.setValue(this.data.rol)
    this.formulario.get('Unidad')?.setValue(this.data.unidad)
    getUnidades().then((res) => {
      this.Unidades = res
    })

    
  }


  // Función para expandir una fila
  expandThisRow(row: any) {
    row.toggleExpanded(!row.getIsExpanded())
  }


  // Función para crear la tabla
  table = createAngularTable(() => ({
    data: this.data,
    columns: this.defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    enableExpandingRows: true,
    debugTable: true,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: this.paginationState(),
    },
    onPaginationChange: (valueOrFunction) => {

      typeof valueOrFunction === 'function'
        ? this.paginationState.update(valueOrFunction)
        : this.paginationState.set(valueOrFunction)


    }
  }));

}
