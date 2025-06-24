// Angular Imports
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Librerías
import Swal from 'sweetalert2';
// APIs
import { getFormularios, getValorFormularioPorFecha  } from '../../api/formulario.service';
import { getTotalDepositos } from '../../api/deposito.service';
import { getCantidadActual } from '../../api/entregas-registro.service';
import { getUnidades } from '../../api/unidades.service';
import { sendArqueoFondoUnico } from '../../api/arqueo.service';

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
  ShowArqueo: any = {}
  // Formulario principal con FormArray para los renglones
  form: FormGroup = new FormGroup({
    Desde: new FormControl('', Validators.required),
    Hasta: new FormControl('', Validators.required),
    Unidad: new FormControl('', Validators.required),
    TipoFormulario: new FormControl('', Validators.required),
    CantidadUtilizada: new FormControl('', Validators.required),
  });


  async generarArqueoFondoUnico() {
    // Buscamos de la BD estos valores
    const totalDeposito = await getTotalDepositos(this.form.value); // Llama a la función para obtener el total de depósitos
    const totalEntregaExistente = await getCantidadActual(this.form.value, this.form.value.TipoFormulario); // Llama a la función para obtener la cantidad actual de entrega de entrega 
    const valorFormulario = await getValorFormularioPorFecha(this.form.value.Desde,  this.form.value.Hasta, this.form.value.TipoFormulario); // Busca por fecha el valor del formulario

    // Calcula el total restando el total de depósitos y la cantidad actual de entrega de depósito
    const total = totalEntregaExistente - this.form.value.CantidadUtilizada;

    const Arqueo = {
      Desde: this.form.value.Desde,
      Hasta: this.form.value.Hasta,
      Unidad: this.form.value.Unidad,
      TipoDeFormulario: this.form.value.TipoFormulario,
      CantidadUtilizada: this.form.value.CantidadUtilizada,
      TotalSobrante: total,
      TotalDepositos: totalDeposito, // Total de depósitos
      TotalEntregado: totalEntregaExistente, // Total de entrega de depósito 
      Valor: this.form.value.CantidadUtilizada * valorFormulario, // Valor registrado
      Coincidente: (this.form.value.CantidadUtilizada * valorFormulario) == totalDeposito
    }

    this.ShowArqueo = Arqueo; // Asigna el resultado al objeto ShowArqueo
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
     
        await sendArqueoFondoUnico(this.ShowArqueo)
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

  }
}
