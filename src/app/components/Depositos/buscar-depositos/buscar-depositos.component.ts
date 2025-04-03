import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { buscarDepositos, buscarDepositosPorNroDeposito } from '../../../api/deposito.service';
import { getUnidades } from '../../../api/unidades.service';
import { TableComponentDeposito } from './table/table.component';
import { ColumnDef } from '@tanstack/angular-table';
import { Workbook } from 'exceljs';
import fs from 'file-saver';
// Tipo
type Unidad = {
  id: number,
  unidad: string,
}

type Deposito = {
  nroDeposito: number,
  fecha: Date,
  periodoArqueo: Date,
  unidad: string,
  banco: string,
  cuenta: string,
  boleta: number,
  importe: number,
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

  
  imprimir(){
      
      
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Depósitos');
  
    worksheet.mergeCells('A1:B1'); // Unir celdas
    worksheet.getCell('A1').value = 'JEFATURA DE POLICÍA';
    // worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { bold: true, size: 10 };
  
    worksheet.mergeCells('A2:D2'); // Unir celdas
    worksheet.getCell('A2').value = 'DIRECCIÓN DE ADMINISTRACIÓN';
    // worksheet.getCell('A2').alignment = { horizontal: 'center' };
    worksheet.getCell('A2').font = { bold: true, size: 10 };
  
    worksheet.mergeCells('A4:H4'); // Unir celdas
    worksheet.getCell('A4').value = 'INFORME DE DEPÓSITOS';
    worksheet.getCell('A4').alignment = { horizontal: 'center' };
    worksheet.getCell('A4').font = { bold: true, size: 10 };
  
    worksheet.mergeCells('F1:H1'); // Unir celdas
    worksheet.getCell('F1').value = `Fecha de impresión: ${new Date().toLocaleDateString("es-AR")}`;
  
    worksheet.mergeCells('A6:G6'); // Unir celdas
    worksheet.getCell('A6').value = `Periodo desde ${new Date(this.buscarDepositosForm.value.Desde).toLocaleDateString("es-AR")} hasta ${new Date(this.buscarDepositosForm.value.Hasta).toLocaleDateString("es-AR")}`;
    // worksheet.getCell('A4').alignment = { horizontal: 'center' };
    worksheet.getCell('A6').font = { bold: true, size: 10 };
  
  
  
  
    // Encabezados personalizados en la fila 8
  worksheet.getRow(8).values = [
   'Nro Depósito', 'Fecha', 'Periodo Arqueo', 'Unidad', 'Banco', 'Cuenta', 'Boleta', 'Importe'
  ];
  
  // Establecer ancho de columnas manualmente
  worksheet.getColumn(1).width = 15; // Nro Depósito
  worksheet.getColumn(2).width = 20; // Fecha
  worksheet.getColumn(3).width = 20; // Periodo Arqueo
  worksheet.getColumn(4).width = 30; // Unidad
  worksheet.getColumn(5).width = 25; // Banco
  worksheet.getColumn(6).width = 10; // Cuenta
  worksheet.getColumn(7).width = 10; // Boleta
  worksheet.getColumn(8).width = 10; // Importe
  
  // Inserción de datos comenzando en la fila 9
  this.depositos.forEach((data: Deposito, index:number) => {
    const rowIndex = 9 + index; // Empieza en la fila 9
    worksheet.getRow(rowIndex).values = [
      data.nroDeposito,
      data.fecha,
      data.periodoArqueo,
      data.unidad,
      data.banco,
      data.cuenta,
      data.boleta,
      '$' + data.importe
    ];
  });
  
  
        // Agregar los datos
     //   worksheet.insertRows(9, transformedData);
    
        // Crear archivo Excel
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Depositos.xlsx');
        });
  
  
      // listaEntregas viene con un NroEntrega y 
    }


}

