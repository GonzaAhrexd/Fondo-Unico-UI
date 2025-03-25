import { Component, signal } from '@angular/core'
// Importamos cosas de Angular Table de TanStack
import {
  ColumnDef,
  createAngularTable,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState } from '@tanstack/angular-table'

import { getLocalidades, updateLocalidad, deleteLocalidad } from '../../../../api/localidad.service'
import { TableComponent } from '../../../table/table.component'

import Swal from 'sweetalert2'
type Localidad = {
  id: number
  codigoPostal: string
  localidad: string
}

// Definimos columnas por defecto
const defaultColumns: ColumnDef<Localidad>[] = [
  {
    accessorKey: 'id',
    header: () => 'ID',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'codigoPostal',
    header: () => 'Código Postal',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'localidad',
    header: () => 'Localidad',
    cell: info => info.getValue(),
  }, 
 
]

@Component({
  selector: 'LocalidadesTable',
  imports: [TableComponent],
  template: `
    <TableComponent 
    [defaultColumns]="defaultColumns" 
    [data]="data" 
    [onDelete]="deleteThisRow" 
    [onEdit]="editThisRow" />
  `
})


export class LocalidadTableComponent {
  data = signal<Localidad[]>([]);
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

   fetchLocalidades() {
      getLocalidades().then((data) => {
        this.data.set(data)
      })
  }
  
    ngOnInit() {
      this.fetchLocalidades();
    }
  
    // Editar una fila
    editThisRow(row: any) {
      // Haz un menú de editado modal utilizando Swal
 Swal.fire({
      title: 'Editando Localidad',
      html: `
      <div class="flex flex-col">
      <span>Código Postal</span>
      <input id="codigoPostal" class="swal2-input" value="${row.original.codigoPostal}">        
      <span>Localidad</span>
      <input id="localidad" class="swal2-input" value="${row.original.localidad}">    
      </form>
      `,
      showCancelButton: true,
      confirmButtonColor: '#0C4A6E',
      cancelButtonColor: '#FF554C',
      confirmButtonText: `Guardar`,
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const localidad = (document.getElementById('localidad') as HTMLInputElement).value
        const codigoPostal = (document.getElementById('codigoPostal') as HTMLInputElement).value
        
        const values = {
          id: row.original.id,
          localidad: localidad,
          codigoPostal: codigoPostal,
        }

        await updateLocalidad(values)

        Swal.fire({
          title: 'Localidad editada',
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
        text: 'Esta acción no se puede revertir',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0C4A6E',
        cancelButtonColor: '#FF554C',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteLocalidad(row.original.id)
          Swal.fire({
            title: 'Localidad eliminada',
            icon: 'success',
            confirmButtonColor: '#0C4A6E',
          }).then(() => {
            window.location.reload()
          })
        }
      })
      
    }

}
