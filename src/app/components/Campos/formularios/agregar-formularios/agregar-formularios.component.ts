 // Angular
import { Component, signal, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { createFormulario } from '../../../../api/formulario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-formularios',
  imports: [ReactiveFormsModule],
  templateUrl: './agregar-formularios.component.html',
})

export class AgregarFormulariosComponent {
  valores = []
  // Sección para agregar marcas      

 // Formulario
 form = signal<FormGroup>(
   new FormGroup(
     {
       Formulario: new FormControl('', [Validators.required]),
       Importe: new FormControl('', [Validators.required]),
     })
 )

 // Mostrar si está en modo de agregado 

 @Output() showAddFormularios = new EventEmitter<boolean>()
 
 
 // Botón para cancelar
 cancelar() {
   this.showAddFormularios.emit(false)

 }

   // Función para prevenir el scroll
 preventScroll(event: WheelEvent): void {
   event.preventDefault();
 }
 // Botón para enviar
 sendFormulario() {
   if (this.form().valid) {
     this.valores = this.form().value
     Swal.fire({
       title: '¿Está seguro de agregar este tipo?',
       icon: 'warning',
       confirmButtonColor: '#0C4A6E',
       cancelButtonColor: '#FF554C',
       showCancelButton: true,
       confirmButtonText: `Sí`,
       cancelButtonText: 'No'
     }).then((result) => {
       if (result.isConfirmed) {
         Swal.fire({
           title: 'Tipo agregado',
           icon: 'success',
           confirmButtonColor: '#0C4A6E',
         }).then(() => {
          createFormulario(this.valores)
           setTimeout(() => {
             this.form().reset()
           })
         })
         // this.showAddMarcas = false
       } else if (result.isDenied) {
         Swal.fire('Formulario no agregado', '', 'info')
       }
     })
   }
 }
}
