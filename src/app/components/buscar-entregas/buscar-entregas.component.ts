// Angular
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
// Librerías 
import Swal from 'sweetalert2';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import { ColumnDef } from '@tanstack/angular-table';
// Servicios
import { getUnidades } from '../../api/unidades.service';
import { UserService } from '../../api/user.service';
import { buscarEntrega, deleteEntrega, buscarEntregaPorNro } from '../../api/entregas.service';
// Componentes
import { TableComponentEntrega } from './table/table.component'

// Tipo
type Unidad = {
  id: number,
  unidad: string,
}

// Definimos columnas por defecto
@Component({
  selector: 'app-buscar-entregas',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponentEntrega],
  templateUrl: './buscar-entregas.component.html',
})
export class BuscarEntregasComponent {

  constructor(private userService: UserService) { }

  defaultColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'nroEntregaManual',
      header: () => 'NroEntrega',
      cell: info => info?.getValue(),
    },
    {
      accessorKey: 'fecha',
      header: () => 'Fecha',
      // @ts-ignore
      cell: info => new Date(info?.getValue()).toLocaleDateString("es-AR"),
    },
    {
      accessorKey: 'unidad',
      header: () => 'Unidad',
      cell: info => info?.getValue(),

    }
  ]

  // Variables

  unidades: Unidad[] = []
  listaEntregas: any = []
  isEmpty = true
  busqueda: string = ''; // Variable para almacenar el texto ingresado en el input
  mostrarOpciones: boolean = false // Variable para mostrar/ocultar las opciones
  opcionesFiltradas: Unidad[] = this.unidades; // Inicialmente mostrar todas las opciones
  data: any = []; // Variable para almacenar los formularios


  // Formulario
  buscarEntregasForm: FormGroup = new FormGroup({
    NroEntrega: new FormControl('',),
    Unidad: new FormControl('', [Validators.required]),
    Desde: new FormControl('', [Validators.required]),
    Hasta: new FormControl('', [Validators.required]),
  });



  // Funciones
  // Evita que se ingresen números negativos
  preventNegative(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }

  // Evita que se haga scroll en el input
  preventScroll(event: WheelEvent): void {
    event.preventDefault();
  }

// Buscar entre las unidades
  fetchUnidades() {
    getUnidades().then((data) => {
      this.unidades = data
      this.opcionesFiltradas = this.unidades;

      // Agrega la opción listar todo
      this.unidades.unshift({ id: 0, unidad: 'Listar todo' });
    })
  }

  // Inicializar
  ngOnInit() {
    this.fetchUnidades()
    this.buscarEntregasForm.patchValue({
      Unidad: "Listar todo"
    })

    this.buscarEntregasForm.get('NroEntrega')?.valueChanges.subscribe(value => {
      this.actualizarValidaciones(value);
    });
  }

  // Actualizar validaciones
  actualizarValidaciones(nroEntrega: string) {
    const desdeControl = this.buscarEntregasForm.get('Desde');
    const hastaControl = this.buscarEntregasForm.get('Hasta');

    if (nroEntrega != '') {
      // Si NroEntrega tiene valor, quitar Validators.required de Desde y Hasta
      desdeControl?.clearValidators();
      hastaControl?.clearValidators();
    } else {
      // Si NroEntrega está vacío, volver a poner Validators.required en Desde y Hasta
      desdeControl?.setValidators([Validators.required]);
      hastaControl?.setValidators([Validators.required]);
    }

    // Actualizar el estado de las validaciones
    desdeControl?.updateValueAndValidity();
    hastaControl?.updateValueAndValidity();
  }
  filtrarOpciones() {
    // console.log(this.buscarEntregasForm.value.Unidad)

    const busquedaNormalizada = this.quitarTildes(this.buscarEntregasForm.value.Unidad.trim().toLowerCase());


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
    this.buscarEntregasForm.get('Unidad')?.setValue(opcion);
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
  // Función para buscar entregas
  async fetchEntregas() {
    try {

      const formData = this.buscarEntregasForm.getRawValue(); // getRawValue() incluye los campos deshabilitados 


      this.listaEntregas = []
      this.isEmpty = true

      let entrega: any

      if (formData.NroEntrega != '' && formData.NroEntrega != null) {
        entrega = await buscarEntregaPorNro(formData.NroEntrega)
        this.listaEntregas.push(entrega)
      } else {
        entrega = await buscarEntrega(formData)
        this.listaEntregas = entrega
      }


      this.isEmpty = false

    } catch (error) {
      console.error(error)
    }
  }

  deleteThisRow(row: any) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0C4A6E',
      cancelButtonColor: '#FF554C',
      confirmButtonText: 'Sí, bórralo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEntrega(row.original.nroEntrega)
        Swal.fire({
          title: 'Eliminado!',
          text: 'La entrega ha sido eliminada.',
          icon: 'success',
          confirmButtonColor: '#0C4A6E',
        }).then(() => {
          this.fetchEntregas()
        }

        )
      }
    })


  }

  // Excel

  imprimir() {
    // @ts-ignore
    const transformedData = this.listaEntregas.flatMap(entrega =>
      // @ts-ignore
      entrega.renglonesEntregas.map(renglon => ({
        id: renglon.id,
        nroEntrega: entrega.nroEntregaManual,
        fecha: new Date(entrega.fecha).toLocaleDateString("es-AR"),
        unidad: entrega.unidad,
        ...renglon
      }))
    );


    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Entregas');

    worksheet.mergeCells('A1:D1'); // Unir celdas
    worksheet.getCell('A1').value = 'JEFATURA DE POLICÍA';
    // worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { bold: true, size: 10 };

    worksheet.mergeCells('A2:D2'); // Unir celdas
    worksheet.getCell('A2').value = 'DIRECCIÓN DE ADMINISTRACIÓN';
    // worksheet.getCell('A2').alignment = { horizontal: 'center' };
    worksheet.getCell('A2').font = { bold: true, size: 10 };

    worksheet.mergeCells('A3:D3'); // Unir celdas

    // worksheet.getCell('A3').value = 'VERIFICACIÓN DEL AUTOMOTOR';
    // worksheet.getCell('A3').alignment = { horizontal: 'center' };
    worksheet.getCell('A3').font = { bold: true, size: 10 };

    worksheet.mergeCells('A4:G4'); // Unir celdas
    worksheet.getCell('A4').value = 'INFORME DE ENTREGAS';
    worksheet.getCell('A4').alignment = { horizontal: 'center' };
    worksheet.getCell('A4').font = { bold: true, size: 14 };
    worksheet.getRow(4).height = 20;


    worksheet.getCell('F1').value = `Fecha de impresión: ${new Date().toLocaleDateString("es-AR")}`;

    worksheet.mergeCells('A6:G6'); // Unir celdas
    worksheet.getCell('A6').value = `Periodo desde ${new Date(this.buscarEntregasForm.value.Desde).toLocaleDateString("es-AR")} hasta ${new Date(this.buscarEntregasForm.value.Hasta).toLocaleDateString("es-AR")}`;
    // worksheet.getCell('A4').alignment = { horizontal: 'center' };
    worksheet.getCell('A6').font = { bold: true, size: 10 };



    // Encabezados personalizados en la fila 8
    worksheet.getRow(8).values = [
      'ID Renglón', 'Nro Entrega', 'Fecha', 'Unidad', 'Tipo de Formulario', 'Desde', 'Hasta', 'Cantidad'
    ];
    worksheet.getRow(8).font = { bold: true };


    // Haz que desde A8 hasta J8 tenga un borde abajo sin hacerlo manualmente uno a uno, no directamente getRow(8) porque lo hace en todo le documento y solo quiero de la A a la J
    for (let col = 1; col <= 8; col++) { // 1 = A, 10 = J
      const cell4 = worksheet.getCell(4, col);

      const cell8 = worksheet.getCell(8, col);

      cell4.border = {
        bottom: { style: 'thick', color: { argb: '000000' } }
      }

      cell8.border = {
        bottom: { style: 'thin', color: { argb: '000000' } } // Color negro
      };
    }



    // Establecer ancho de columnas manualmente
    worksheet.getColumn(1).width = 10; // ID
    worksheet.getColumn(2).width = 10; // Nro Entrega
    worksheet.getColumn(3).width = 20; // Fecha
    worksheet.getColumn(4).width = 20; // Unidad
    worksheet.getColumn(5).width = 25; // Tipo de Formulario
    worksheet.getColumn(6).width = 10; // Desde
    worksheet.getColumn(7).width = 10; // Hasta
    worksheet.getColumn(8).width = 10; // Cantidad

    // Inserción de datos comenzando en la fila 9
    transformedData.forEach((data: any, index: number) => {
      const rowIndex = 9 + index; // Empieza en la fila 9
      worksheet.getRow(rowIndex).values = [
        data.id,
        data.nroEntrega,
        data.fecha,
        data.unidad,
        data.tipoFormulario,
        data.desde,
        data.hasta,
        data.cantidad
      ];
    });

    // Crear archivo Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Entregas.xlsx');
    });
  }

}
