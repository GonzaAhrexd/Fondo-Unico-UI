import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColumnDef } from '@tanstack/angular-table';

import { getUnidades } from '../../../api/unidades.service';
import { buscarUsuarioDNI, buscarUsuarios } from '../../../api/auth.service';
import { TableComponentAdministrarUsuarios } from './table/table.component';
import { UserService } from '../../../api/user.service';



@Component({
  selector: 'AdministrarUsuarios',
  imports: [ReactiveFormsModule, TableComponentAdministrarUsuarios ],
  templateUrl: './administrar-usuarios.component.html'
})
export class AdministrarUsuariosComponent {

  constructor(private userService: UserService) {}  

    formulario: FormGroup = new FormGroup({
      DNI: new FormControl('', []),
      Rol: new FormControl('', []),
    })

    
      defaultColumns: ColumnDef<any>[] = [
        {
          accessorKey: 'id',
          header: () => 'ID',
          cell: info => info.getValue(),
        },
        {
          accessorKey: 'nombre',
          header: () => 'Nombre',
          cell: info => info.getValue(),
        },
        {
          accessorKey: 'apellido',
          header: () => 'Apellido',
          cell: info => info.getValue(),
        },
        {
          accessorKey: 'nombre_de_usuario',
          header: () => 'Nombre de usuario',
          cell: info => info.getValue(),
        },
        {
          accessorKey: 'rol',
          header: () => 'Rol',
          cell: info => info.getValue(),
        },
        {
          accessorKey: 'dni',
          header: () => 'DNI',
          cell: info => info.getValue(),
        }
      ]
      
      modoDNI = true
      unidadesOpciones: any = []
      isEmpty = true




    opcionesRol = [
      { texto: "Usuario" }, 
      { texto: "Administrador" },
    ]

    ngOnInit() {
      this.fetchUnidades()
    }

    async fetchUnidades(){
      try{
        const res = await getUnidades()
        this.unidadesOpciones = res;
      }catch(err){
        console.log(err)
      }
      }

      listaUsuarios:[] = []

      async BuscarUsuarios(){
   

        if(this.modoDNI){
          this.FiltrarDNI()

        }else{
          this.FiltrarRol()
        }
      }


      async FiltrarDNI(){
         
        try{

          
          this.listaUsuarios = []
          this.isEmpty = true 

          const buscarPorDNI =  await buscarUsuarioDNI(this.formulario.value.DNI)

          // @ts-ignore
          this.listaUsuarios.push(buscarPorDNI)
          this.isEmpty = false
        }catch(err){
          console.log(err)
        }

      }



      async FiltrarRol(){
        try{
          this.isEmpty = true 
          this.listaUsuarios = []

          const  buscarPorRol =  await buscarUsuarios(this.formulario.value)
          this.listaUsuarios = buscarPorRol
          this.isEmpty = false
        
        }catch(err){
          console.log(err)
        }
    
      }

}
