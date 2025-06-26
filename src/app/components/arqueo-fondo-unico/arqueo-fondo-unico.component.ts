// Angular Imports
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Librerías
import Swal from 'sweetalert2';
// APIs
import { getFormularios, getValorFormularioPorFecha } from '../../api/formulario.service';
import { getTotalDepositos, getCantidadDepositos } from '../../api/deposito.service';
import { getCantidadActual } from '../../api/entregas-registro.service';
import { getUnidades } from '../../api/unidades.service';
import { sendArqueoFondoUnico } from '../../api/arqueo.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


type Unidad = {
  id: number
  unidad: string
  fondoUnico: boolean
  verificaciones: boolean
}

@Component({
  selector: 'app-arqueo-fondo-unico',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './arqueo-fondo-unico.component.html'
})
export class ArqueoFondoUnicoComponent {
  unidades: Unidad[] = [] // Variable para almacenar las unidades
  modoUnidadVerificaciones = false; // Variable para controlar el modo de unidad 
  opcionesFiltradas: Unidad[] = this.unidades; // Inicialmente mostrar todas las opciones
  data: any = []; // Variable para almacenar los formularios
  mostrarOpciones: boolean = false // Variable para mostrar/ocultar las opciones
  opcionesFormularios: any[] = []; // Variable para almacenar las opciones de formularios

  mostrarResultados = false
  showArqueo: any = {}
  // Formulario principal con FormArray para los renglones
  form: FormGroup = new FormGroup({
    Desde: new FormControl('', Validators.required),
    Hasta: new FormControl('', Validators.required),
    Unidad: new FormControl('', Validators.required),
    TipoFormulario: new FormControl('', Validators.required),
    CantidadRestante: new FormControl('', Validators.required),
  });


  async generarArqueoFondoUnico() {
    // Buscamos de la BD estos valores
    const totalDeposito = await getTotalDepositos(this.form.value); // Llama a la función para obtener el total de depósitos
    const totalArqueoAnterior = await getCantidadActual(this.form.value.Desde, this.form.value.Unidad, this.form.value.TipoFormulario); // Llama a la función para obtener la cantidad actual de entrega de entrega 
    const totalEntregaExistente = await getCantidadActual(this.form.value.Hasta, this.form.value.Unidad, this.form.value.TipoFormulario) - totalArqueoAnterior; // Llama a la función para obtener la cantidad actual de entrega de entrega 
    
    const valorFormulario = await getValorFormularioPorFecha(this.form.value.Desde, this.form.value.Hasta, this.form.value.TipoFormulario); // Busca por fecha el valor del formulario
    let posibleValorAnterior = await getValorFormularioPorFecha(this.form.value.Desde, this.form.value.Desde, this.form.value.TipoFormulario); // Busca por fecha el valor del formulario
    posibleValorAnterior = posibleValorAnterior ? posibleValorAnterior : valorFormulario; // Si no hay valor anterior, asigna 0


    const cantidadDepositos = await getCantidadDepositos({
      Desde: this.form.value.Desde,
      Hasta: this.form.value.Hasta,
      Unidad: this.form.value.Unidad,
      TipoFormulario: this.form.value.TipoFormulario
    })

    // Obtener la cantidad que tiene que depositar
    // Para ello se debe calcular del (total entregado + lo que quedó del importe anterior) - lo que sobró
    
    const CantidadADepositar = ((totalEntregaExistente + totalArqueoAnterior) - this.form.value.CantidadRestante) * valorFormulario; // Cantidad a depositar
    
    const Arqueo = {
      // Detalles del arqueo
      Desde: this.form.value.Desde,
      Hasta: this.form.value.Hasta,
      Unidad: this.form.value.Unidad,
      TipoDeFormulario: this.form.value.TipoFormulario,
      ValorFormulario: valorFormulario, // Valor del formulario
      // Valores entregados
      TotalEntregado: totalEntregaExistente, // Total de entrega de depósito 
      ValorEntregado: totalEntregaExistente * valorFormulario, // Valor registrado
      // Saldo valores arqueo anterior
      ArqueoAnteriorCantidad: totalArqueoAnterior,
      ArqueoAnteriorImporte: totalArqueoAnterior * posibleValorAnterior, // Saldo de arqueo anterior en importe
      // Existencia actual
      CantidadRestante: this.form.value.CantidadRestante,
      TotalSobrante: this.form.value.CantidadRestante * valorFormulario,
      // Depósitos efectuados
      CantidadDepositos: cantidadDepositos,
      TotalDepositos: totalDeposito, // Total de depósitos
      CantidadADepositar: CantidadADepositar,
      TotalEntregadoImporte: totalEntregaExistente * valorFormulario, // Total de entrega de depósito en importe
      Coincidente: CantidadADepositar == totalDeposito
    }

    this.showArqueo = Arqueo; // Asigna el resultado al objeto showArqueo
    this.mostrarResultados = true; // Muestra los resultados

  }

  cambiarModoUnidadVerificaciones() {
    this.modoUnidadVerificaciones = !this.modoUnidadVerificaciones; // Cambia el modo de unidad
    // Haz que las unidades solo muestren verificaciones = true
    if (this.modoUnidadVerificaciones) {
      this.unidades = this.unidades.filter(unidad => unidad.verificaciones == true);
    } else {
      this.fetchUnidades(); // Vuelve a cargar todas las unidades
    }
  }
  // Función para quitar tildes
  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Función para filtrar las opciones
  filtrarOpciones() {
    const busquedaNormalizada = this.quitarTildes(this.form.value.Unidad.trim().toLowerCase());
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

  seleccionar(opcion: string) {
    // Asignar la opción seleccionada al campo de búsqueda
    this.form.get('Unidad')?.setValue(opcion);
    this.mostrarOpciones = false;
  }

  async ngOnInit() {
    await this.fetchUnidades()
    await this.fetchFormularios()

  }

  fetchUnidades() {
    getUnidades().then((res) => {
      this.unidades = res;
      this.opcionesFiltradas = this.unidades;
    });
  }
  fetchFormularios() {
    getFormularios().then((res) => {
      this.opcionesFormularios = res; // Asignar la respuesta a la variable data
    });
  }

  guardarArqueo() {
    Swal.fire({
      title: '¿Está seguro de que desea guardar el arqueo?',
      text: "¡No podrá deshacer esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0C4A6E',
      cancelButtonColor: '#FF554C',
      confirmButtonText: 'Sí, guardar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Aquí puedes agregar la lógica para guardar el arqueo 

        await sendArqueoFondoUnico(this.showArqueo)
        Swal.fire(
          {
            title: 'Arqueo guardado',
            text: 'El arqueo se ha guardado correctamente.',
            icon: 'success',
            confirmButtonColor: '#0C4A6E'
          }
        )
      }
    })
  }

  imprimirArqueo() {
    const desdeDate = new Date(this.showArqueo.Desde + 'T12:00:00'); // Añade una hora al mediodía local
    const hastaDate = new Date(this.showArqueo.Hasta + 'T12:00:00'); // Añade una hora al mediodía local



    const doc = new jsPDF();
    let y = 10;

    // --- Encabezado ---
    doc.setFontSize(10);
    // Agrega la imagen que está en /public/Escudo_Policia_Chaco_Transparente.png
    const img = new Image();
    img.src = './Escudo_Policia_Chaco_Transparente.png';
    doc.addImage(img, 'PNG', 15, 5, 18, 18); // Escudo más pequeño y alineado

    // Encabezado alineado a la derecha del escudo
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('JEFATURA DE POLICIA DEL CHACO', 36, 12);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Dirección de Administración', 36, 17);
    doc.text('Sección Fondo Único Policial', 36, 22);

    doc.text(`Fecha de Impresión: ${new Date().toLocaleDateString('es-AR')}`, 150, 10);
    doc.text('Nro. Página: 1', 150, 15);

    y = 35; // Reiniciar Y para la siguiente sección

    // --- Título del Informe ---
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORME DE ARQUEO', doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y += 10;
    doc.setFont('helvetica', 'normal'); // Restablecer estilo de fuente

    // --- Unidad y Período ---
   
    

    // --- Tabla de Detalles (usando jspdf-autotable) ---
    const tableRows = [
      [
        this.showArqueo.TipoDeFormulario, // <--- Formulario
        this.showArqueo.TotalEntregado, // <--- Valores entregados - Cantidad
        this.showArqueo.ValorEntregado.toFixed(2), // <--- Valores entregados - Importe
        this.showArqueo.ArqueoAnteriorCantidad, // Saldo valores arqueo anterior - importe
        this.showArqueo.ArqueoAnteriorImporte.toFixed(2), // Saldo valores arqueo anterior - saldo
        this.showArqueo.CantidadRestante, // <--- Existencia actual - Cantidad
        this.showArqueo.TotalSobrante.toFixed(2) // <--- Existencia actual - Importe
      ]
    ];

    let finalYAfterTable = y;

    autoTable(doc, {
      startY: y,
      head: [
        [
          { content: 'Formulario', rowSpan: 2 },
          { content: 'Valores Entregados', colSpan: 2, styles: { halign: 'center' } },
          { content: 'Saldo Valores Arqueo Anterior', colSpan: 2, styles: { halign: 'center' } },
          { content: 'Existencia Actual', colSpan: 2, styles: { halign: 'center' } }
        ],
        ['Cantidad', 'Importe', 'Importe', 'Saldo', 'Existencia Act.', 'Importe']
      ],
      body: [...tableRows],
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        halign: 'center'
      },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        halign: 'center'
      },
      didParseCell: function (data: any) {
        if (data.row.raw[0] === 'TOTALES') {
          data.cell.styles.fontStyle = 'bold';
        }
      },
      didDrawPage: (data: any) => {
        finalYAfterTable = data.cursor.y;
      }
    });

    y = finalYAfterTable + 15;

    // --- Sección "Informe Final" ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Informe Final:', 15, y);
    doc.setFont('helvetica', 'normal');
    y += 10;

    const boxWidth = 60;
    const boxHeight = 35;
    const startX = 15;
    const spacing = 10;

    // Ajustar el ancho de las cajas para que todo entre en la página
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const totalSpacing = 2 * spacing;
    const numBoxes = 3;
    const availableWidth = pageWidth - 2 * margin - totalSpacing;
    const adjustedBoxWidth = availableWidth / numBoxes;
    // Ajustar las cajas para que estén una debajo de la otra y ocupen todo el ancho disponible
    const fullBoxWidth = pageWidth - 2 * margin;

    // Caja 1: Depósitos Efectuados
    doc.rect(startX, y, fullBoxWidth, boxHeight);
    doc.setFontSize(12);
    doc.text('Depósitos Efectuados', startX + 5, y + 8, { align: 'left' });
    doc.setFontSize(10);
    doc.text('Cantidad Depósitos:', startX + 5, y + 20, { align: 'left' });
    doc.text(`${this.showArqueo.CantidadDepositos}`, startX + fullBoxWidth - 5, y + 20, { align: 'right' });
    doc.text('Importe Depositado:', startX + 5, y + 28, { align: 'left' });
    doc.text(`$${this.showArqueo.TotalDepositos.toFixed(2)}`, startX + fullBoxWidth - 5, y + 28, { align: 'right' });

    y += boxHeight + spacing;

    // Caja 2: Entregas Efectuadas
    doc.rect(startX, y, fullBoxWidth, boxHeight);
    doc.setFontSize(12);
    doc.text('Entregas Efectuadas', startX + 5, y + 8, { align: 'left' });
    doc.setFontSize(10);
    doc.text('Importe Valores Entregados:', startX + 5, y + 18, { align: 'left' });
    doc.text(`$${this.showArqueo.TotalEntregadoImporte.toFixed(2)}`, startX + fullBoxWidth - 5, y + 18, { align: 'right' });
    doc.text('Imp. Saldo Valores Arq. Anterior:', startX + 5, y + 23, { align: 'left' });
    doc.text(`$${0}`, startX + fullBoxWidth - 5, y + 23, { align: 'right' });
    doc.text('Importe Valores Anulados:', startX + 5, y + 28, { align: 'left' });
    doc.text(`$${0}`, startX + fullBoxWidth - 5, y + 28, { align: 'right' });

    doc.text('Total a Depositar:', startX + 5, y + 33, { align: 'left' });
    doc.text(`$${this.showArqueo.CantidadADepositar.toFixed(2)}`, startX + fullBoxWidth - 5, y + 33, { align: 'right' });

    y += boxHeight + spacing;

    // Caja 3: Resumen de Totales y Diferencia
    doc.rect(startX, y, fullBoxWidth, boxHeight);
    doc.setFontSize(12);
    doc.text('Resumen de Totales y Diferencia', startX + 5, y + 8, { align: 'left' });
    doc.setFontSize(10);
    doc.text('Total a Depositar:', startX + 5, y + 18, { align: 'left' });
    doc.text(`$${this.showArqueo.CantidadADepositar.toFixed(2)}`, startX + fullBoxWidth - 5, y + 18, { align: 'right' });

    doc.text('Total Depositado:', startX + 5, y + 24, { align: 'left' });
    doc.text(`$${this.showArqueo.TotalDepositos.toFixed(2)}`, startX + fullBoxWidth - 5, y + 24, { align: 'right' });

    const diferencia = this.showArqueo.CantidadADepositar - this.showArqueo.TotalDepositos;
    doc.text('Diferencia:', startX + 5, y + 30, { align: 'left' });
    doc.text(`$${diferencia.toFixed(2)}`, startX + fullBoxWidth - 5, y + 30, { align: 'right' });

    const pdfUrl = doc.output('bloburl');
    window.open(pdfUrl, '_blank');


  }
}
