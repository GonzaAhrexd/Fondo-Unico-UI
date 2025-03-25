import { Component, signal } from '@angular/core'
// Importamos cosas de Angular Table de TanStack
import {
  ColumnDef,
  createAngularTable,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState } from '@tanstack/angular-table'

import { getUnidades, updateUnidad, deleteUnidad } from '../../../../api/unidades.service'
  import { TableComponent } from '../../../table/table.component'

import Swal from 'sweetalert2'
type Unidad = {
  id: number
  Unidad: string
}

// Definimos columnas por defecto
const defaultColumns: ColumnDef<Unidad>[] = [
  {
    accessorKey: 'id',
    header: () => 'ID',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'unidad',
    header: () => 'Unidad',
    cell: info => info.getValue(),
  },

 
]

@Component({
  selector: 'UnidadesTable',
  imports: [TableComponent],
  template: `
    <TableComponent 
    [defaultColumns]="defaultColumns" 
    [data]="data" 
    [onDelete]="deleteThisRow" 
    [onEdit]="editThisRow" />
  `
})


export class UnidadesTableComponent {
  data = signal<Unidad[]>([]);
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

   fetchUnidades() {
    getUnidades().then((data) => {
        this.data.set(data)
      })
  }
  
    ngOnInit() {
      this.fetchUnidades();
    }
  
    // Editar una fila
    editThisRow(row: any) {
      // Haz un menú de editado modal utilizando Swal
 Swal.fire({
      title: 'Editando Localidad',
      html: `
      <div class="flex flex-col">
      <span>Unidad</span>
      <input id="unidad" class="swal2-input" value="${row.original.unidad}">        
    
      `,
      showCancelButton: true,
      confirmButtonColor: '#0C4A6E',
      cancelButtonColor: '#FF554C',
      confirmButtonText: `Guardar`,
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const unidad = (document.getElementById('unidad') as HTMLInputElement).value
      
        const values = {
          id: row.original.id,
          unidad: unidad,
        }

        await updateUnidad(values)

        Swal.fire({
          title: 'Unidad editada',
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
          await deleteUnidad(row.original.id)
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
