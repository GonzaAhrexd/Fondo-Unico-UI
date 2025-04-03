// Angular
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
// Librerías
import Swal from 'sweetalert2';
// Backend
import { getUnidades } from '../../../../api/unidades.service';
import { getBancos } from '../../../../api/bancos.service'
import { updateDeposito } from '../../../../api/deposito.service';
import { deleteDeposito } from '../../../../api/deposito.service';
import { UserService } from '../../../../api/user.service';

@Component({
  selector: 'EditModeDeposito',
  standalone: true,
  imports: [ReactiveFormsModule ],
  templateUrl: './edit-mode.component.html',
})
export class EditModeComponentDeposito {

  constructor(private userService: UserService) { }

  @Input() defaultData:any = {}
  unidades:any = []
  bancos:any = []

  form: FormGroup = new FormGroup({
    Id: new FormControl(''),
    NroDeposito: new FormControl(''),
    Fecha: new FormControl('', [Validators.required]),
    PeriodoArqueo: new FormControl('', [Validators.required]),
    Unidad: new FormControl('', [Validators.required]),
    Banco: new FormControl('', [Validators.required]),
    Cuenta: new FormControl('', [Validators.required]),
    Boleta: new FormControl('', [Validators.required]),
    Importe: new FormControl('', [Validators.required]), 
  });

  // Rellenar con los datos de defaultData

  ngOnInit() {

    this.fetchUnidades()
    this.fetchBancos()

    this.form.patchValue({
      Id: this.defaultData.id,
      NroDeposito: this.defaultData.nroDeposito,
      Fecha: this.formatDate(this.defaultData.fecha),
      PeriodoArqueo: this.formatDate(this.defaultData.periodoArqueo),
      Unidad: this.defaultData.unidad,
      Banco: this.defaultData.banco,
      Cuenta: this.defaultData.cuenta,
      Boleta: this.defaultData.boleta,
      Importe: this.defaultData.importe,
    });
    
    if(this.userService.getUser().rol != "Administrador"){
      this.form.controls['Unidad'].disable({ onlySelf: true });  
    }



  }

    fetchUnidades() {
      getUnidades().then((data) => {
        this.unidades = data
      })
    }

    fetchBancos(){
      getBancos().then((data) => {
        this.bancos = data
      })
    }

    // Función para formatear la fecha
  formatDate(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  
  tipoOpciones = [
    {value: "Depósito Efectivo"},
    {value: "Interdepósito"},
  ]

  preventScroll(event: WheelEvent): void {
    event.preventDefault();
  }

  eliminarDeposito(id: number){
    try{
      Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0C4A6E',
        cancelButtonColor: '#FF554C',
        confirmButtonText: 'Sí, enviar!'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteDeposito(id).then((res) => {
            Swal.fire(
             {
              title: 'Depósito enviado',
              icon: 'success',
              confirmButtonColor: '#0C4A6E',
              confirmButtonText: 'Aceptar'
             }
            )
          })
        }
      })
    }catch(e){
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al enviar el depósito',
        icon: 'error',
        confirmButtonColor: '#0C4A6E',
        confirmButtonText: 'Aceptar'
      })
    }
  }
  updateDeposito(){
      try{
        Swal.fire({
          title: '¿Estás seguro?',
          text: "No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0C4A6E',
          cancelButtonColor: '#FF554C',
          confirmButtonText: 'Sí, enviar!'
        }).then((result) => {
          if (result.isConfirmed) {
            console.log(this.form.value)
            const formData = this.form.getRawValue(); // getRawValue() incluye los campos deshabilitados
            updateDeposito(formData).then((res) => {
              Swal.fire(
               {
                title: 'Depósito enviado',
                icon: 'success',
                confirmButtonColor: '#0C4A6E',
                confirmButtonText: 'Aceptar'
               }
              )
            })
          }
        })
      }catch(e){
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al enviar el depósito',
          icon: 'error',
          confirmButtonColor: '#0C4A6E',
          confirmButtonText: 'Aceptar'
        })
      }
    }
  


}
