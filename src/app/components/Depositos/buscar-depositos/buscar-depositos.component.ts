import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { buscarDepositos, buscarDepositosPorNroDeposito } from '../../../api/deposito.service';
import { getUnidades } from '../../../api/unidades.service';
import { TableComponentDeposito } from './table/table.component';
import { ColumnDef } from '@tanstack/angular-table';
// Tipo
type Unidad = {
  id: number,
  unidad: string,
}

@Component({
  selector: 'app-buscar-depositos',
  imports: [ReactiveFormsModule, TableComponentDeposito],
  templateUrl: './buscar-depositos.component.html'
})
export class BuscarDepositosComponent {

  defaultColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'nroDeposito',
      header: () => 'nroDeposito',
      cell: info => info?.getValue(),
    },
    {
      accessorKey: 'fecha',
      header: () => 'Fecha',
      // @ts-ignore
      cell: info => new Date(info?.getValue()).toLocaleDateString("es-AR") ,
    },
    {
      accessorKey: 'periodoArqueo',
      header: () => 'Periodo Arqueo',
      // @ts-ignore
      cell: info => new Date(info?.getValue()).toLocaleDateString("es-AR") ,
    },
    {
      accessorKey: 'unidad',
      header: () => 'Unidad',
      cell: info => info?.getValue(),
    },
    {
      accessorKey: 'banco',
      header: () => 'Banco',
      cell: info => info?.getValue(),
    },      
    {
      accessorKey: 'cuenta',
      header: () => 'Cuenta',
      cell: info => info?.getValue(),
    },
    {
      accessorKey: 'boleta',
      header: () => 'Boleta',
      cell: info => '$' + info?.getValue(),
    },
    {
      accessorKey: 'importe',
      header: () => 'Importe',
      cell: info =>  info?.getValue(),
    }
  ]



  mostrarOpciones: boolean = false // Variable para mostrar/ocultar las opciones
  unidades: Unidad[] = []
  opcionesFiltradas: Unidad[] = this.unidades; // Inicialmente mostrar todas las opciones
  depositos: any[] = [] // Aquí almacenarás los depósitos obtenidos de la API
  isEmpty: boolean = true // Variable para controlar si la lista de depósitos está vacía
  buscarDepositosForm: FormGroup = new FormGroup({
    NroDeposito: new FormControl(''),
    Unidad: new FormControl('Listar todo', [Validators.required]),
    Desde: new FormControl('', [Validators.required]),
    Hasta: new FormControl('', [Validators.required]),
  });

  async fetchDepositos(){

    let depo = []
    if(this.buscarDepositosForm.value.NroDeposito != ''){
      console.log("Here")
      depo = await buscarDepositosPorNroDeposito(this.buscarDepositosForm.value.NroDeposito)

      this.depositos = depo
      this.isEmpty = false

      console.log(this.depositos)
    }else{
      depo = await buscarDepositos(this.buscarDepositosForm.value)
      this.depositos = depo
      this.isEmpty = false
    }
  }

  ngOnInit() {
    this.fetchUnidades()
  }

    fetchUnidades() {
      getUnidades().then((data) => {
        this.unidades = data
        this.opcionesFiltradas = this.unidades;
  
        // Agrega la opción listar todo
        this.unidades.unshift({ id: 0, unidad: 'Listar todo' });
      })
    }

  filtrarOpciones() {
    // console.log(this.buscarEntregasForm.value.Unidad)

    const busquedaNormalizada = this.quitarTildes(this.buscarDepositosForm.value.Unidad.trim().toLowerCase());


    if (busquedaNormalizada === '') {
      this.opcionesFiltradas = [...this.unidades]; // Mostrar todas las opciones
    } else {
      // Filtrar las opciones basadas en el valor ingresado
      this.opcionesFiltradas = this.unidades.filter(unidad =>
        this.quitarTildes(unidad.unidad.toLowerCase()).includes(busquedaNormalizada)
      );
    }

    this.mostrarOpciones = true;
  }
  // Función para quitar tildes
  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  seleccionar(opcion: string) {

    // Asignar la opción seleccionada al campo de búsqueda
    this.buscarDepositosForm.get('Unidad')?.setValue(opcion);
    this.mostrarOpciones = false;
  
  }

  @ViewChild('searchBox') searchBox!: ElementRef; // Referencia al input de búsqueda

  @HostListener('document:keydown', ['$event'])
onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    this.mostrarOpciones = false;
  }
}
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.searchBox && !this.searchBox.nativeElement.contains(event.target)) {
      this.mostrarOpciones = false;
    }
  }


}

