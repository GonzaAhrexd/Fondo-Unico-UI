import { Component, signal } from '@angular/core'
// Importamos cosas de Angular Table de TanStack
import {
  ColumnDef,
  createAngularTable,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState
} from '@tanstack/angular-table'

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
  {
    accessorKey: 'fondoUnico',
    header: () => 'Fondo único',
    cell: info => info.getValue() == true ? '✅' : '❌',
  },
  {
    accessorKey: 'verificaciones',
    header: () => 'Verificaciones',
    cell: info => info.getValue() == true ? '✅' : '❌',
  }


]

@Component({
  selector: 'UnidadesTable',
  imports: [TableComponent],
  template: `
    <div class="grid grid-cols-3 gap-4 mb-4">
      <button class="cursor-pointer z-10 rounded-lg md:h-32 lg:h-24 xl:h-32 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-sky-900 hover:bg-sky-950 transform transition-transform duration-300 ease-in-out hover:scale-105" (click)="showFondoUnico()">
      <h5 class="mb-2 text-xl font-medium leading-tight text-neutral-50">Fondo Único</h5>
    </button>
      <button class="cursor-pointer z-10 rounded-lg md:h-32 lg:h-24 xl:h-32 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-sky-900 hover:bg-sky-950 transform transition-transform duration-300 ease-in-out hover:scale-105" (click)="showVerificaciones()">
      <h5 class="mb-2 text-xl font-medium leading-tight text-neutral-50">Verificaciones</h5>
      </button>
      <button class="cursor-pointer z-10 rounded-lg md:h-32 lg:h-24 xl:h-32 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-sky-900 hover:bg-sky-950 transform transition-transform duration-300 ease-in-out hover:scale-105" (click)="showTodo()">
      <h5 class="mb-2 text-xl font-medium leading-tight text-neutral-50">Todo</h5>
      </button>
    </div>
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

  showFondoUnico(){
    // @ts-ignore
    this.data = this.data.filter((item) => item.fondoUnico == true) 

  }

  showVerificaciones(){
    console.log("Verificaciones")
  }

  showTodo(){
    console.log("Todo")
  }



  // Editar una fila
  editThisRow(row: any) {
    // Haz un menú de editado modal utilizando Swal
    Swal.fire({
      title: 'Editando Localidad',
      html: `
      ${row.original.fondoUnico}
      <div class="flex flex-col">
      <span>Unidad</span>
      <input id="unidad" class="swal2-input" value="${row.original.unidad}" placeholder="Unidad" />
               <span class="flex font-medium ml-4"> Disponibilidad </span>
        <div class="flex flex-row items-center justify-center">
            <input id="FondoUnico" type="checkbox" class="m-2" ${row.original.fondoUnico ? 'checked' : ''} />   
            <label for="FondoUnico">Fondo único</label>

            <input id="Verificaciones" type="checkbox" class="m-2" ${row.original.verificaciones ? 'checked' : ''} />

            <label for="Verificaciones">Verificaciones</label>
            
        </div>   
      </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#0C4A6E',
      cancelButtonColor: '#FF554C',
      confirmButtonText: `Guardar`,
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const unidad = (document.getElementById('unidad') as HTMLInputElement).value
        const verificaciones = (document.getElementById('Verificaciones') as HTMLInputElement).checked
        const fondoUnico = (document.getElementById('FondoUnico') as HTMLInputElement).checked

        const values = {
          id: row.original.id,
          unidad: unidad,
          fondoUnico: fondoUnico,
          verificaciones: verificaciones,
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
