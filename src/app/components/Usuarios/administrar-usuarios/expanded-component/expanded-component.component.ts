import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getUnidades } from '../../../../api/unidades.service';
import { editUsuario, deleteUsuario } from '../../../../api/auth.service';
import Swal from 'sweetalert2';
import { UserService } from '../../../../api/user.service';
@Component({
  selector: 'expanded-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './expanded-component.component.html',


})
export class ExpandedComponentComponent {

  @Input() data: any = []
  Unidades: any = []
  formulario: FormGroup = new FormGroup({
      Id: new FormControl('', []),
      Rol: new FormControl('', []),
    })
  constructor(private userService: UserService) { 
    this.userID = this.userService.getUser().id // Obtiene el ID del usuario
  }
    
  userID = 0 

    roles = [
      { rol: "Usuario" }, 
      { rol: "Administrador" },
    ]

    
     ngOnInit() {
        // Pon el valor por defecto de data.Rol en Rol del formulario
        // this.formulario.get('Rol')?.setValue(this.data.Rol)
        // Rellena con los campos originales
        this.formulario.get('Id')?.setValue(this.data.id)
        this.formulario.get('Rol')?.setValue(this.data.rol)
    
    
        getUnidades().then((res) => {
          this.Unidades = res
        })
    
        
      }

      async editThisData() {
        Swal.fire({
          title: '¿Estás seguro de editar este usuario?',
          showCancelButton: true,
          confirmButtonText: `Editar`,
          cancelButtonText: `Cancelar`,
          confirmButtonColor: '#0C4A6E',
          cancelButtonColor: '#FF554C',
        }).then(async (result) => {
          if (result.isConfirmed) {
           await editUsuario(this.formulario.value)
            // this.editMode = true
          
            Swal.fire({
              title: 'Usuario editado',
              icon: 'success',
              confirmButtonColor: '#0C4A6E',
            })
          
          }
        })
    
      }
    

      onDelete() {
        Swal.fire({
          title: '¿Estás seguro de eliminar este usuario?',
          showCancelButton: true,
          confirmButtonText: `Eliminar`,
          cancelButtonText: `Cancelar`,
          confirmButtonColor: '#0C4A6E',
          cancelButtonColor: '#FF554C',
        }).then(async (result) => {
          if (result.isConfirmed) {
            await deleteUsuario(this.data.id)
            Swal.fire({
              title: 'Usuario eliminado',
              icon: 'success',
              confirmButtonColor: '#0C4A6E',
            })
          }
        })
      }

      
}
