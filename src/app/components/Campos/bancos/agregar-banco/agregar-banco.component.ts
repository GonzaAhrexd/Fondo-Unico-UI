// Angular
import { Component, signal, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// SweetAlert
import Swal from 'sweetalert2';
// API
import { createBanco } from '../../../../api/bancos.service';

@Component({
  selector: 'app-agregar-bancos',
  standalone: true,
  imports: [ReactiveFormsModule ],
  templateUrl: './agregar-banco.component.html',
})

export class AgregarBancosComponent {
  valores = []
   // Sección para agregar marcas      

  // Formulario
  form = signal<FormGroup>(
    new FormGroup(
      {
        Banco: new FormControl('', [Validators.required]),
      })
  )

  // Mostrar si está en modo de agregado 

  @Output() showAddBanco = new EventEmitter<boolean>()
  
  
  // Botón para cancelar
  cancelar() {
    this.showAddBanco.emit(false)

  }
  // Botón para enviar
  sendBanco() {
    if (this.form().valid) {
      this.valores = this.form().value
      Swal.fire({
        title: '¿Está seguro de agregar este banco?',
        icon: 'warning',
        confirmButtonColor: '#0C4A6E',
        cancelButtonColor: '#FF554C',
        showCancelButton: true,
        confirmButtonText: `Sí`,
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Banco agregado',
            icon: 'success',
            confirmButtonColor: '#0C4A6E',
          }).then(() => {
            createBanco(this.valores)
            setTimeout(() => {
              this.form().reset()
            })
          })
          // this.showAddMarcas = false
        } else if (result.isDenied) {
          Swal.fire('Banco no agregado', '', 'info')
        }
      })
    }
  }


}
