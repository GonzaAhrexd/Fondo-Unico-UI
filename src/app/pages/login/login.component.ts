// Librerías de Angular
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
// Servicio de login
import { login } from '../../api/auth.service';
import { UserService } from '../../api/user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink ],
  templateUrl: './login.component.html',
})

export class LoginComponent {
  // Inicialización del servicio
  constructor(private userService: UserService, private router: Router) {}

  // Variables
  errorLogin = ""


  // Formulario
  loginForm: FormGroup = new FormGroup({
    Usuario: new FormControl('', [Validators.required]),
    Clave: new FormControl('', [Validators.required]),
  });

  // Inicialización
  ngOnInit() {
    // Toma .isAuthenticated del servicio UserService y si es true redirecciona al home
    if (this.userService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  // Función para loguear
  async loginUser() {
    try {
      const res = await login(this.loginForm.value, this.userService); // Llama a la función login del servicio auth.service
      this.router.navigate(['/']); // Redirige al home

    } catch (err: any) {
      if (err.response && err.response.status === 404) { // Si el error es 404 
        this.errorLogin = 'Usuario o contraseña incorrecto'; // Muestra mensaje de error
      } else { // Si no es 404
        this.errorLogin = 'Error en el login'; // Muestra mensaje de error 
      }
      console.error(err); // Muestra el error en consola
    }
  }

  
}
