import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { sendUnidad } from '../../../../api/unidades.service';
@Component({
  selector: 'app-agregar-unidades',
  imports: [ReactiveFormsModule],
  templateUrl: './agregar-unidades.component.html',
})
export class AgregarUnidadesComponent {
  @Output() showAddUnidades = new EventEmitter<boolean>()
  form = signal<FormGroup>(
    new FormGroup(
      {
        Unidad: new FormControl('', [Validators.required]),
        FondoUnico: new FormControl(false, [Validators.required]),
        Verificaciones: new FormControl(false, [Validators.required]),
      })
  )

  cancelar(){
    this.showAddUnidades.emit(false)

  }

  sendUnidadToBD() {
    Swal.fire({
      title: '¿Está seguro de agregar esta unidad?',
      icon: 'warning',
      confirmButtonColor: '#0C4A6E',
      cancelButtonColor: '#FF554C',
      showCancelButton: true,
      confirmButtonText: `Sí`,
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await sendUnidad(this.form().value)
        Swal.fire({
          title: 'Unidad agregada',
          icon: 'success',
          confirmButtonColor: '#0C4A6E',
        }).then((result) => {
          if(result.isConfirmed){
            this.showAddUnidades.emit(false)
          }
        })
      
      }

    })
  }

  


}
