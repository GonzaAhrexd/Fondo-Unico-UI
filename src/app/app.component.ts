import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common'; // Asegúrate de importar esto

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  // templateUrl: './app.component.html',
  template: `
  <!DOCTYPE html>
    <html lang="en">
   
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body [ngClass]="{'flex flex-col ml-[1rem] md:ml-[5rem]': !isLoginPage}">
  <router-outlet />   
  </body>
</html>
  `,
})
export class AppComponent {
  // Variables
  title = 'FondoUnicoUI';
  isLoginPage = false;

  constructor(private router: Router) {
    // Escucha los cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Si la ruta es 'login', no agregues la clase 'flex flex-col lg:ml-[15rem]'
      this.isLoginPage = this.router.url.includes('login');
    });
  }

}
