import { Component } from '@angular/core';
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
  unidades:Unidad[] = []
  bancos:Banco[] = []

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
      this.unidades = response.data
    })
  }
  
  getBancos() {
    getBancos().then((response) => {
      this.bancos = response.data
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
}