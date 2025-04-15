// Librerías
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// Backend
import { getFormularios } from '../../api/formulario.service';
import { sendEntrega, getLastNumeroEntrega } from '../../api/entregas.service';
import { getUnidades } from '../../api/unidades.service';
import { UserService } from '../../api/user.service';
import { FormsModule } from '@angular/forms'; 



type Unidad = {
  id: number
  unidad: string
}

@Component({
  selector: 'app-agregar-entrega',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './agregar-entrega.component.html',

})
export class AgregarEntregaComponent implements OnInit {

  constructor(private userService: UserService) { }

  // Variables
  unidades: Unidad[] = [] // Variable para almacenar las unidades
  renglones = 0 // Variable para contar los renglones 
  showAdvertencia = false // Variable para mostrar/ocultar la advertencia
  busqueda: string = ''; // Variable para almacenar el texto ingresado en el input
  mostrarOpciones: boolean = false // Variable para mostrar/ocultar las opciones
  opcionesFiltradas: Unidad[] = this.unidades; // Inicialmente mostrar todas las opciones
  data: any = []; // Variable para almacenar los formularios


  // Formulario principal con FormArray para los renglones
  form: FormGroup = new FormGroup({
    NroEntregaManual: new FormControl('', [Validators.required]),
    Fecha: new FormControl('', [Validators.required]),
    Unidad: new FormControl('', [Validators.required]),
    renglonesEntregas: new FormArray([])  // FormArray para manejar los renglones
  });

  // Función para acceder a los renglones como FormArray
  get renglonesEntregas() {
    return this.form.get('renglonesEntregas') as FormArray;
  }

  // Función para agregar un nuevo renglon
  addRenglones() {
    this.renglones++;
    const renglonFormGroup = new FormGroup({
      TipoFormulario: new FormControl('0', [Validators.required]),
      NroRenglon: new FormControl(this.renglones, [Validators.required]),
      Desde: new FormControl('', [Validators.required]),
      Hasta: new FormControl('', [Validators.required]),
      EstaActivo: new FormControl(true),
      Cantidad: new FormControl('', [Validators.required]),
    }, { validators: this.hastaMayorQueDesdeValidator() });
    renglonFormGroup.get('Desde')?.valueChanges.subscribe(() => this.actualizarCantidad(renglonFormGroup));
    renglonFormGroup.get('Hasta')?.valueChanges.subscribe(() => this.actualizarCantidad(renglonFormGroup));


    this.renglonesEntregas.push(renglonFormGroup);

  }

  // Función para actualizar la cantidad en base a los campos Desde y Hasta
  actualizarCantidad(renglon: FormGroup) {
    const desde = renglon.get('Desde')?.value;
    const hasta = renglon.get('Hasta')?.value;
    if (desde && hasta) {
      renglon.get('Cantidad')?.setValue(hasta - desde);
    }
  }

  // Validador personalizado para verificar que el campo Hasta sea mayor que el campo Desde
  hastaMayorQueDesdeValidator = () => {
    return (control: any): { [key: string]: any } | null => {
      const desde = control.get('Desde')?.value;
      const hasta = control.get('Hasta')?.value;
      return hasta && desde && hasta < desde ? { 'hastaMenorQueDesde': true } : null;
    };
  }

  // Función para eliminar un renglón
  deleteLesson(lessonIndex: number) {
    this.renglonesEntregas.removeAt(lessonIndex);

  }

  // Función para obtener los formularios
  fetchFormulario() {
    getFormularios().then((res) => {
      this.data = res;
    });
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
  // Función para quitar tildes
  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  seleccionar(opcion: string) {
    // Asignar la opción seleccionada al campo de búsqueda
    this.form.get('Unidad')?.setValue(opcion);
    this.mostrarOpciones = false;
  }

  async ngOnInit() {
    await this.fetchUnidades()
    this.fetchFormulario();
    const recentNumberGenerated = await getLastNumeroEntrega() + 1;
    this.form.get('NroEntregaManual')?.setValue(recentNumberGenerated);
  }

  fetchUnidades() {
    getUnidades().then((res) => {
      this.unidades = res;
      this.opcionesFiltradas = this.unidades;
    });
  }

  // Función para enviar la entrega (ejemplo de uso)
  postEntrega() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Desea enviar la entrega?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0C4A6E',
      cancelButtonColor: '#FF554C',
      confirmButtonText: 'Enviar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = this.form.getRawValue(); // getRawValue() incluye los campos deshabilitados
        await sendEntrega(formData)
        Swal.fire({
          title: 'Entrega enviada',
          icon: 'success',
          confirmButtonColor: '#0C4A6E',
        }).then(() => {
          this.form.reset();
          this.renglonesEntregas.clear();
        })


      }

    })

  }


  // Función para imprimir el formulario
  imprimirFormulario() {

    // @ts-ignore
    const body = this.form.value.renglonesEntregas.map(renglon => [
      new Date(this.form.value.Fecha).toLocaleDateString("es-AR"),             // Fecha
      this.form.value.NroEntregaManual,      // N° Entrega
      this.form.value.Unidad,            // Unidad
      renglon.TipoFormulario,  // Formulario
      renglon.Desde,           // N° Inicial
      renglon.Hasta,           // N° Final
      renglon.Cantidad         // Cantidad
    ]);
    console.log(body)

    const pdf = new jsPDF();

    // Encabezado
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold'); // Cambia a negrita
    pdf.text('JEFATURA DE POLICÍA', 10, 10);
    pdf.text('DIRECCIÓN DE ADMINISTRACIÓN', 10, 16);

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

    const finalY = (pdf as any).lastAutoTable.finalY + 20;

    // Firmas ajustadas dinámicamente
    pdf.text('_____________________________________', 10, finalY);
    pdf.text('Firma de Conformidad', 28, finalY + 5);
    pdf.text('Aclaración: .......................................................', 10, finalY + 10);
    pdf.text('Fecha y Hora: ..................................................', 10, finalY + 15);

    pdf.text('_____________________________________', 120, finalY);
    pdf.text('Firma Responsable de Entrega', 130, finalY + 5);


    // Descargar PDF
    // pdf.save('documento.pdf');
    const pdfUrl = pdf.output('bloburl');
    window.open(pdfUrl, '_blank');

  }



  // Función para prevenir el scroll en la lista de opciones
  preventScroll(event: WheelEvent): void {
    event.preventDefault();
  }

}
