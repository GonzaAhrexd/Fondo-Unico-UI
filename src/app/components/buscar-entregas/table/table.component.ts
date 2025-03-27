
// Importamos cosas de Angular
import { Component, Input, signal } from '@angular/core'
import { EditModeComponentEntrega } from '../edit-mode/edit-mode.component'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Importamos cosas de Angular Table de TanStack
import {
  ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
} from '@tanstack/angular-table'

// Definimos el componente
@Component({
  selector: 'TableComponentEntrega',
  standalone: true,
  imports: [FlexRenderDirective, EditModeComponentEntrega],
  templateUrl: './table.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})

// Definimos la clase del componente
export class TableComponentEntrega {

  @Input() defaultColumns: ColumnDef<any>[] = [] // Columnas por defecto
  @Input() data: any = ([]) // Datos de la tabla
  @Input() onDelete: Function = () => { }; // Función de eliminación
  editMode = false

  // Señales para manejar la paginación
  public readonly sizesPages = signal<number[]>([5, 10, 25, 50, 100])
  public readonly paginationState = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,

  })

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

  async print() {



    const dataFromDB = this.data[0];

    // @ts-ignore
    const body = dataFromDB.renglonesEntregas.map(renglon => [
      new Date(dataFromDB.fecha).toLocaleDateString("es-AR"),             // Fecha
      dataFromDB.nroEntregaManual,      // N° Entrega
      dataFromDB.unidad,            // Unidad
      renglon.tipoFormulario,  // Formulario
      renglon.desde,           // N° Inicial
      renglon.hasta,           // N° Final
      renglon.cantidad         // Cantidad
    ]);
    console.log(body)

    const pdf = new jsPDF();

    // Encabezado
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold'); // Cambia a negrita
    pdf.text('JEFATURA DE POLICÍA', 10, 10);
    pdf.text('DIRECCIÓN DE ADMINISTRACIÓN', 10, 16);
    pdf.text('VERIFICACIÓN DEL AUTOMOTOR', 10, 22);

    pdf.setFontSize(10);
    pdf.text('Fecha:', 160, 10);

    pdf.setFont('helvetica', 'normal'); // Vuelve a texto normal
    pdf.text(new Date().toLocaleDateString("es-AR"), 180, 10);

    // Tabla de datos
    autoTable(pdf, {
      startY: 30,
      head: [['Fecha', 'N° Entrega', 'Unidad', 'Formulario', 'N° Inicial', 'N° Final', 'Cantidad']],
      body: body,  // <-- Se pasa como un array de arrays (cada sub-array es una fila)
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [200, 200, 200] }
    });

    const finalY = (pdf as any).lastAutoTable.finalY + 50;

    // Firmas ajustadas dinámicamente
    pdf.text('_____________________________________', 10, finalY);
    pdf.text(`Firma de Conformidad`, 28, finalY + 5);
    pdf.text('Aclaración: .......................................................', 10, finalY + 10);
    pdf.text('Fecha y Hora: ..................................................', 10, finalY + 15);

    pdf.text('_____________________________________', 120, finalY);
    pdf.text('Firma Responsable de Entrega', 130, finalY + 5);


    // Descargar PDF
    // pdf.save('documento.pdf');
    const pdfUrl = pdf.output('bloburl');
    window.open(pdfUrl, '_blank');

  }
}