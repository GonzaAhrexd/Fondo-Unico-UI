import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
// APIs
import { getUnidades } from '../../api/unidades.service'
import { getFormularios } from '../../api/formulario.service';
// Librerías
import Swal from 'sweetalert2';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getCantidadDepositos, getTotalDepositos } from '../../api/deposito.service';
import { getCantidadActual } from '../../api/entregas-registro.service';

type Unidad = {
  id: number
  unidad: string
  fondoUnico: boolean
  verificaciones: boolean
}

@Component({
  selector: 'app-arqueo-verificaciones',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './arqueo-verificaciones.component.html'
})
export class ArqueoVerificacionesComponent {
  unidades: Unidad[] = [] // Variable para almacenar las unidades
  modoUnidadVerificaciones = false; // Variable para controlar el modo de unidad 
  mostrarResultados = false
  opcionesFormularios: any[] = []; // Variable para almacenar las opciones de formularios


  form: FormGroup = new FormGroup({
    Desde: new FormControl('', Validators.required),
    Hasta: new FormControl('', Validators.required),
    Unidad: new FormControl('', Validators.required),
    TipoFormulario: new FormControl('', Validators.required),
  });

  async ngOnInit() {
    await this.fetchUnidades()
    await this.fetchFormularios()

  }

  async generarArqueoFondoUnico() {

    const totalDeposito = await getTotalDepositos(this.form.value); // Llama a la función para obtener el total de depósitos
    const totalArqueoAnterior = await getCantidadActual(this.form.value.Desde, this.form.value.Unidad, this.form.value.TipoFormulario); // Llama a la función para obtener la cantidad actual de entrega de entrega 
    const totalEntregaExistente = await getCantidadActual(this.form.value.Hasta, this.form.value.Unidad, this.form.value.TipoFormulario) - totalArqueoAnterior; // Llama a la función para obtener la cantidad actual de entrega de entrega 
    
        const cantidadDepositos = await getCantidadDepositos({
          Desde: this.form.value.Desde,
          Hasta: this.form.value.Hasta,
          Unidad: this.form.value.Unidad,
          TipoFormulario: this.form.value.TipoFormulario
        })


    const Arqueo = {

      Desde: this.form.value.Desde,
      Hasta: this.form.value.Hasta,
      Unidad: this.form.value.Unidad,
      TipoDeFormulario: this.form.value.TipoFormulario,
      ValorFormulario: 1,
      // Valores entregados
      TotalEntregado: totalEntregaExistente,
      ValorEntregado: totalEntregaExistente * 1,
      // Saldo arqueo anterior
      ArqueoAnteriorCantidad: totalArqueoAnterior,
      ArqueoAnteriorImporte: totalArqueoAnterior * 1,
      // Existencia actual
      CantidadDepositos: cantidadDepositos,
      TotalDeposito: totalDeposito, 

    }

    console.log(Arqueo)


  }

  fetchUnidades() {
    getUnidades().then((res) => {
      this.unidades = res;
      // Haz que solo salgan las de tipo verificaciones
      this.unidades = this.unidades.filter(unidad => unidad.verificaciones);
    })


    };
  
   fetchFormularios() {
      getFormularios().then((res) => {
        this.opcionesFormularios = res; // Asignar la respuesta a la variable data
      });
    }
  

}
