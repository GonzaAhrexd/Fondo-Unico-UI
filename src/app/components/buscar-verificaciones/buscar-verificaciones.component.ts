import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { getVerificaciones, getVerificacionesRango, getVerificacionPorRecibo } from '../../api/verificaciones.service';
import { getUnidades } from '../../api/unidades.service';
import { TableComponentVerificaciones } from './table/table.component';
import { getFormularios } from '../../api/formulario.service';
import { ColumnDef } from '@tanstack/angular-table';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { UserService } from '../../api/user.service';
@Component({
  selector: 'BuscarVerificaciones',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponentVerificaciones],
  templateUrl: './buscar-verificaciones.component.html',
})
export class BuscarVerificacionesComponent {
  // Llamando al servicio de usuario
  constructor(private userService: UserService) { }
  // Valores de las columnas
  defaultColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'recibo',
      header: () => 'Recibo',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'tipo',
      header: () => 'Tipo',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'responsable',
      header: () => 'Responsable',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'formulario',
      header: () => 'Formulario',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'marca',
      header: () => 'Marca',
      cell: info => info.getValue(),
    },

    {
      accessorKey: 'modelo',
      header: () => 'Modelo',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'anio',
      header: () => 'Año',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'dominio',
      header: () => 'Dominio',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'importe',
      header: () => 'Importe',
      cell: info => info.getValue(),
    }
  ]
  // Variables
  unidades: any = [
    { unidad: "Metropolitana"},
    { unidad: "Saenz Peña"},
    { unidad: "Juan José Castelli"},
    { unidad: "General San Martín"},
    { unidad: "Charata"}
  ]

  isEmpty = true
  modoRangoFecha = false
  formulariosTipos: any = []
  verificaciones = []


  // Formulario 
  buscarVerificacionesForm: FormGroup = new FormGroup({
    Recibo: new FormControl(''),
    Tipo: new FormControl(''),
    Unidad: new FormControl('0', [Validators.required]),
    Fecha: new FormControl(''),
    Desde: new FormControl(''),
    Hasta: new FormControl(''),
    mostrarAnulados: new FormControl(false),
  });

  // Cambiar modo de fecha
  changeMode() {
    // Reinicia desde, hasta y fecha del formulario
    this.buscarVerificacionesForm.controls['Fecha'].setValue('')
    this.buscarVerificacionesForm.controls['Desde'].setValue('')
    this.buscarVerificacionesForm.controls['Hasta'].setValue('')
    this.modoRangoFecha = !this.modoRangoFecha
  }

  // Llamados a API e inicialización de variables

  ngOnInit() {
    this.getFormulariosTipos() // Obtiene los tipos de formularios
    this.buscarVerificacionesForm.patchValue({ // Setea la unidad del usuario logueado
      Unidad: this.userService.getUser().unidad
    })
    if (this.userService.getUser().rol != "Administrador" && this.userService.getUser().rol != "Fondo") { // Si no es administrador ni fondo, deshabilita el campo de unidad
      this.buscarVerificacionesForm.controls['Unidad'].disable({ onlySelf: true });
    }
  }



  getFormulariosTipos = async () => { // Obtiene los tipos de formularios
    getFormularios().then((res) => {
      this.formulariosTipos = res;
    });
  }

  // Busca las verificaciones desde el formulario
  async fetchVerificaciones() {
    this.isEmpty = true
    // Si fecha tiene valor, se busca por fecha
    const formData = this.buscarVerificacionesForm.getRawValue(); // getRawValue() incluye los campos deshabilitados

    if (formData.Recibo != '') {
      getVerificacionPorRecibo(formData.Recibo).then((res) => {
        this.verificaciones = res;
        console.log(this.verificaciones)
        if (this.verificaciones.length > 0) {
          this.isEmpty = false
        }
      })
    } else {
      if (formData.Fecha != '') {
        getVerificaciones(formData).then((res) => {
          this.verificaciones = res;
          console.log(this.verificaciones)

          if (this.verificaciones.length > 0) {
            this.isEmpty = false
          }
        })
      } else {
        // Si no, se busca por rango de fechas
        getVerificacionesRango(formData).then((res) => {
          this.verificaciones = res;
          console.log(this.verificaciones)

          if (this.verificaciones.length > 0) {
            this.isEmpty = false
          }
        })
      }
    }
  }



  // Funciones para controlar los inputs 
  preventNegative(event: KeyboardEvent) { // Evita que se ingresen números negativos
    if (event.key === '-') {
      event.preventDefault();
    }
  }


  preventScroll(event: WheelEvent): void { // Evita que se haga scroll en los inputs
    event.preventDefault();
  }


  // EXCEL

  imprimir() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Verificaciones');

    worksheet.mergeCells('A1:H1'); // Unir celdas
    worksheet.getCell('A1').value = 'JEFATURA DE POLICÍA';
    // worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { bold: true, size: 10 };

    worksheet.mergeCells('A2:J2'); // Unir celdas
    worksheet.getCell('A2').value = 'DIRECCIÓN DE ADMINISTRACIÓN';
    // worksheet.getCell('A2').alignment = { horizontal: 'center' };
    worksheet.getCell('A2').font = { bold: true, size: 10 };

    worksheet.mergeCells('A3:J3'); // Unir celdas

    worksheet.getCell('A3').value = 'VERIFICACIÓN DEL AUTOMOTOR';
    // worksheet.getCell('A3').alignment = { horizontal: 'center' };
    worksheet.getCell('A3').font = { bold: true, size: 10 };

    worksheet.mergeCells('A4:K4'); // Unir celdas
    worksheet.getCell('A4').value = 'INFORME DE VERIFICACIONES';
    worksheet.getCell('A4').alignment = { horizontal: 'center' };
    worksheet.getCell('A4').font = { bold: true, size: 14 };
    worksheet.getRow(4).height = 20;

    worksheet.mergeCells('I1:K1'); // Unir celdas
    worksheet.getCell('I1').value = `Fecha de impresión: ${new Date().toLocaleDateString("es-AR")}`;

    worksheet.mergeCells('A6:J6'); // Unir celdas
    if(this.buscarVerificacionesForm.value.Desde != ''){
      worksheet.getCell('A6').value = `Periodo desde ${new Date(this.buscarVerificacionesForm.value.Desde).toLocaleDateString("es-AR")} hasta ${new Date(this.buscarVerificacionesForm.value.Hasta).toLocaleDateString("es-AR")}`;
    }
    // worksheet.getCell('A4').alignment = { horizontal: 'center' };
    worksheet.getCell('A6').font = { bold: true, size: 10 };




    // Encabezados personalizados en la fila 8
    worksheet.getRow(8).values = [
      'Fecha', 'Recibo', 'Tipo','Observaciones', 'Dominio', 'Marca', 'Modelo', 'Año', 'Responsable', 'Importe', 'Formulario'
    ];
    // Pon todos los del row 8 en negrita
    worksheet.getRow(8).font = { bold: true };


    // Haz que desde A8 hasta J8 tenga un borde abajo sin hacerlo manualmente uno a uno, no directamente getRow(8) porque lo hace en todo le documento y solo quiero de la A a la J
    for (let col = 1; col <= 11; col++) { // 1 = A, 10 = J
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
    worksheet.getColumn(1).width = 20; // Fecha
    worksheet.getColumn(2).width = 10; // Recibo
    worksheet.getColumn(3).width = 15; // Observaciones
    worksheet.getColumn(3).width = 25; // Tipo
    worksheet.getColumn(4).width = 10; // Patente
    worksheet.getColumn(5).width = 10; // Marca
    worksheet.getColumn(6).width = 25; // Modelo
    worksheet.getColumn(7).width = 10; // Año
    worksheet.getColumn(8).width = 20; // Responsable
    worksheet.getColumn(9).width = 10; // Importe
    worksheet.getColumn(10).width = 15; // Formulario

    // Inserción de datos comenzando en la fila 9
    this.verificaciones.forEach((data: any, index: number) => {
      const rowIndex = 9 + index; // Empieza en la fila 9
      worksheet.getRow(rowIndex).values = [
        new Date(data.fecha).toLocaleDateString("es-AR"),
        data.recibo,
        data.tipo,
        data.estaAnulado == 1 ? 'Anulado' : 'Ninguno',
        data.dominio,
        data.marca,
        data.modelo,
        data.anio,
        data.responsable,
        '$ ' + data.importe,
        data.formulario
      ];
    });


    // Crear archivo Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Verificaciones.xlsx');
    });


  }

}
