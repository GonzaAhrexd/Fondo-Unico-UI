import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { sendLocalidad } from '../../../../api/localidad.service';
@Component({
  selector: 'app-agregar-localidades',
  imports: [ReactiveFormsModule],
  templateUrl: './agregar-localidad.component.html',
})
export class AgregarLocalidadComponent {
  @Output() showAddLocalidades = new EventEmitter<boolean>()

 // Formulario
 form = signal<FormGroup>(
  new FormGroup(
    {
      CodigoPostal: new FormControl('', [Validators.required]),
      Localidad: new FormControl('', [Validators.required]),
    })
)


   // Función para prevenir el scroll
   preventScroll(event: WheelEvent): void {
    event.preventDefault();
  }

  cancelar(){
    this.showAddLocalidades.emit(false)
  }

  sendLocalidadToBD() {
    Swal.fire({
      title: '¿Está seguro de agregar esta localidad?',
      icon: 'warning',
      confirmButtonColor: '#0C4A6E',
      cancelButtonColor: '#FF554C',
      showCancelButton: true,
      confirmButtonText: `Sí`,
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await sendLocalidad(this.form().value)

        Swal.fire({
          title: 'Localidad agregada',
          icon: 'success',
          confirmButtonColor: '#0C4A6E',
        }).then((result) => {
          if(result.isConfirmed){
            this.showAddLocalidades.emit(false)
          }
        })
      
      }

    })


  }

}
