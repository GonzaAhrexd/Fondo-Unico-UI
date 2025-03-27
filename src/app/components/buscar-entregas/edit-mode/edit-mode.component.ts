// Angular
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
// APIs
import { getFormularios } from '../../../api/formulario.service';
import { updateEntrega, deleteRenglonEntrega } from '../../../api/entregas.service';
import { getUnidades } from '../../../api/unidades.service';
//SweetAlert
import Swal from 'sweetalert2';
import { UserService } from '../../../api/user.service';
// Tipo de datos para las unidades
type Unidad = {
  id: number
  unidad: string
}

// Componente para editar una entrega
@Component({
  selector: 'EditModeEntrega',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-mode.component.html',
})
export class EditModeComponentEntrega implements OnInit {
  constructor(private userService: UserService) { }
  // Datos de entrada
  @Input() defaultData:any = []
  // Variables internas
  unidades:Unidad[] = []
  renglones:number = 0
  renglonesToDelete: number[] = [];
  data: any = [];
  busqueda: string = '';
  mostrarOpciones: boolean = false
  opcionesFiltradas: Unidad[] = this.unidades;





  // Formulario principal con FormArray para los renglones
  form: FormGroup = new FormGroup({
    NroEntrega: new FormControl(''),
    NroEntregaManual: new FormControl(''),
    Fecha: new FormControl('', [Validators.required]),
    Unidad: new FormControl('', [Validators.required]),
    renglonesEntregas: new FormArray([])  // FormArray para manejar los renglones
  });

  // Función para acceder a los renglones como FormArray
  get renglonesEntregas() {
    return this.form.get('renglonesEntregas') as FormArray;
  }

  // Función para agregar un nuevo renglon
  addRenglones(renglonData: any = null) {
    const renglonFormGroup = new FormGroup({
      Id: new FormControl(renglonData?.id || null),
      TipoFormulario: new FormControl(renglonData?.tipoFormulario || '', [Validators.required]),
      NroRenglon: new FormControl(renglonData?.nroRenglon || this.renglonesEntregas.length + 1, [Validators.required]),
      Desde: new FormControl(renglonData?.desde || '', [Validators.required]),
      Hasta: new FormControl(renglonData?.hasta || '', [Validators.required]),
      Cantidad: new FormControl(renglonData?.cantidad || '', [Validators.required]),
    }, { validators: this.hastaMayorQueDesdeValidator() });

    this.renglonesEntregas.push(renglonFormGroup);
  }
  // Validador para que la fecha de inicio sea menor a la fecha de fin
  hastaMayorQueDesdeValidator = () => {
    return (control: any): { [key: string]: any } | null => {
      const desde = control.get('Desde')?.value;
      const hasta = control.get('Hasta')?.value;
      return hasta && desde && hasta < desde ? { 'hastaMenorQueDesde': true } : null;
    };
  }

  
  filtrarOpciones() {
    console.log('Texto en input:', this.form.value.Unidad); // Debug: Verificar que el input cambia
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

  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  seleccionar(opcion: string) {
 
    // Asignar la opción seleccionada al campo de búsqueda
    this.form.get('Unidad')?.setValue(opcion);
    this.mostrarOpciones = false;

    // También puedes usar patchValue en lugar de setValue si lo prefieres
    // this.form.patchValue({ Unidad: opcion.unidad });
  
  }

  // Función para eliminar un renglón	
  deleteLesson(renglonIndex: number) {
    // Obtener el ID del renglón
    const renglon = this.defaultData.renglonesEntregas[renglonIndex];
    // Cargarlo al array de renglones para eliminar 
    this.renglonesToDelete.push(renglon.id);
    // Eliminar el renglón del FormArray
    this.renglonesEntregas.removeAt(renglonIndex);

  }

  // Función para obtener los formularios
  fetchFormulario() {
    getFormularios().then((res) => {
      this.data = res;
    });
  }
  // Inicialización del componente
  ngOnInit() {
    this.fetchUnidades()
    this.fetchFormulario();
    if(this.defaultData){
      this.setFormValues()
    }
    if(this.userService.getUser().rol != "Administrador"){
      this.form.controls['Unidad'].disable({ onlySelf: true });
  }
}

  setFormValues() {
    // Establecer valores de fecha y unidad
    this.form.patchValue({
      NroEntrega: this.defaultData.nroEntrega,
      NroEntregaManual: this.defaultData.nroEntregaManual,
      Fecha: this.formatDate(this.defaultData.fecha),
      Unidad: this.defaultData.unidad
    });

    // Establecer los valores de los renglones (si existen)
    if (this.defaultData.renglonesEntregas && this.defaultData.renglonesEntregas.length > 0) {
      this.defaultData.renglonesEntregas.forEach((renglon: any) => {
        this.addRenglones(renglon);
      });
    }
  }
  
// Función para formatear la fecha
  formatDate(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Función para obtener las unidades
  fetchUnidades(){
    getUnidades().then((res) => {
      this.unidades = res;
    });
  }

  @Output() cancelEditMode = new EventEmitter<void>(false);
  
cancelChanges(){
  this.cancelEditMode.emit();
}

// Guardar cambios
  saveChanges(){
    console.log(this.form)
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Desea guardar los cambios?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0C4A6E',
      cancelButtonColor: '#FF554C',
       confirmButtonText: 'Guardar'
    }).then(async (result) => {
      if (result.isConfirmed) {

        // Si hay valores nulos en los campos id de los renglones, elimina solo el campo de id
        const renglones = this.form.value.renglonesEntregas.map((renglon: any) => {
          if (!renglon.Id) {
            delete renglon.Id;
          }
          return renglon;
        });

        // Establecer los renglones en el formulario
        this.form.value.renglonesEntregas = renglones

        for(const renglon of this.renglonesToDelete){
          await deleteRenglonEntrega(renglon)
        }

        await updateEntrega(this.defaultData.nroEntrega, this.form.value)
        Swal.fire({
          title: 'Cambios guardados',
          icon: 'success',
          confirmButtonColor: '#0C4A6E',
        }).then(() => {
          // window.location.reload()   
        })  
        }
    })
  }

  // Función para prevenir el scroll
  preventScroll(event: WheelEvent): void {
    event.preventDefault();
  }

}
