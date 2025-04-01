// Librerías
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getUnidades } from '../../../api/unidades.service';
import { getBancos } from '../../../api/bancos.service';
import { createDeposito } from '../../../api/deposito.service';
import Swal from 'sweetalert2';

type Unidad = {
  id: number
  unidad: string
}

type Banco = {
  id: number
  banco: string
}

@Component({
  selector: 'app-agregar-deposito',
  imports: [ReactiveFormsModule],
  templateUrl: './agregar-deposito.component.html'
})
export class AgregarDepositoComponent {
  unidades: Unidad[] = []
  bancos: Banco[] = []
  mostrarOpciones = false; // Variable para controlar la visibilidad de las opcione
  opcionesFiltradas: Unidad[] = this.unidades; // Inicialmente mostrar todas las opciones

  form: FormGroup = new FormGroup({
    NroDeposito: new FormControl('', [Validators.required]),
    Fecha: new FormControl('', [Validators.required]),
    PeriodoArqueo: new FormControl('', [Validators.required]),
    Unidad: new FormControl('', [Validators.required]),
    Banco: new FormControl('', [Validators.required]),
    Cuenta: new FormControl('', [Validators.required]),
    Boleta: new FormControl('', [Validators.required]),
    Importe: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.getUnidades()
    this.getBancos()
  }

  getUnidades() {
    getUnidades().then((response) => {
      this.unidades = response
      this.opcionesFiltradas = this.unidades;

    })
  }

  getBancos() {
    getBancos().then((response) => {
      this.bancos = response
    })
  }

  preventScroll(event: Event) {
    event.preventDefault(); // Evita el desplazamiento 
  }

  postDeposito() {
    Swal.fire({
      title: '¿Está seguro de que desea guardar el depósito?',
      text: "¡No podrá revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(this.form.value)
        
        await createDeposito(this.form.value)
        Swal.fire(
          {
            title: 'Depósito guardado',
            text: 'El depósito se ha guardado correctamente.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
          }
        )
      }
    }
    )



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

}