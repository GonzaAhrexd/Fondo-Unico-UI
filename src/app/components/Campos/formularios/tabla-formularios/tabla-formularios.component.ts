
// Importamos cosas de Angular
import { Component, signal } from '@angular/core'

// Importamos cosas de Angular Table de TanStack
import {
  ColumnDef,
  createAngularTable,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
} from '@tanstack/angular-table'

// import { getTipos, deleteTipo, editTipo } from '../../../../api/tipos.service'
import { getFormularios, deleteFormulario, updateFormulario } from '../../../../api/formulario.service'

import Swal from 'sweetalert2'
// Definimos el tipo de dato Marca
import { TableComponent } from '../../../table/table.component'

type Formulario = {
  id: number
  formulario: string
 }

// Definimos columnas por defecto
const defaultColumns: ColumnDef<Formulario>[] = [
  {
    accessorKey: 'id',
    header: () => 'ID',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'formulario',
    header: () => 'Formulario',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'importe',
    header: () => 'Importe',
    cell: info => info.getValue(),
  }
]

@Component({
  selector: 'FormularioTableComponent',
  standalone: true,
  imports: [ TableComponent],
  template: `
    <TableComponent 
    [defaultColumns]="defaultColumns" 
    [data]="data" 
    [onDelete]="deleteThisRow" 
    [onEdit]="editThisRow" />
  `
})

export class FormularioTableComponent {
  data = signal<Formulario[]>([]);
  defaultColumns = defaultColumns

  public readonly sizesPages = signal<number[]>([5, 10, 25, 50, 100])
  public readonly paginationState = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,

  })

// Crear tabla
  table = createAngularTable(() => ({
    data: this.data(),
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
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

  fetchMarcas() {
    getFormularios().then((res) => {
      this.data.set(res);
    });
  }

  ngOnInit() {
    this.fetchMarcas();
  }

  // Editar una fila
  editThisRow(row: any) {
    // Haz un menú de editado modal utilizando Swal
    Swal.fire({
      title: 'Editando Marca',
      html: `
      <div class="flex flex-col">
      <span>Formulario</span>
      <input  id="formulario" class="swal2-input" value="${row.original.formulario}">        
      <input  id="importe" class="swal2-input" value="${row.original.importe}">    
      </form>
      `,
      showCancelButton: true,
      confirmButtonColor: '#0C4A6E',
      cancelButtonColor: '#FF554C',
      confirmButtonText: `Guardar`,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const formulario = (document.getElementById('formulario') as HTMLInputElement).value
        const importe = (document.getElementById('importe') as HTMLInputElement).value
        const tipoVehiculo = (document.getElementById('tipoVehiculo') as HTMLSelectElement).value
        const values = {
          id: row.original.id,
          formulario: formulario,
          importe: importe,
          tipoVehiculo: tipoVehiculo
        }

        updateFormulario(values)

        Swal.fire({
          title: 'Formulario editado',
          icon: 'success',
          confirmButtonColor: '#0C4A6E',
        }).then(() => {
          window.location.reload()
        })
      }
    })
  }

  // Eliminar una fila
  deleteThisRow(row: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0C4A6E',
      cancelButtonColor: '#FF554C',
      confirmButtonText: 'Sí, bórralo',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: 'El registro ha sido eliminado',
            icon: 'success',
            confirmButtonColor: '#0C4A6E',
          }).then(() => {
            deleteFormulario(row.original.id)
            window.location.reload()
          })
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el registro',
            icon: 'error',
            confirmButtonColor: '#0C4A6E',
          })

        }
      }
    })
  }
}