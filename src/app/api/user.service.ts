import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userData: any = null;
  constructor() {}

  // Establecer datos del usuario
  setUser(user: any): void {

    this.userData = user;
    // Guardalo en el session storage
    sessionStorage.setItem('userData', JSON.stringify(this.userData));

    // localStorage.setItem('userData', JSON.stringify(this.userData));
    }

  // Obtener los datos del usuario
  getUser(): any {
    
    if (this.userData) {
      return this.userData;
    } else {
      // Si no está en la memoria, busca en el local storage
      const userData = sessionStorage.getItem('userData');
      if (userData) {
        this.userData = JSON.parse(userData);
        return this.userData;
      }
    }


    // return this.userData;
  }

  // Limpiar los datos del usuario (cuando cierre sesión, por ejemplo)
  clearUser(): void {
    this.userData = null;
    sessionStorage.removeItem('userData');
  }

  isAuthenticated(): boolean {

    return this.getUser() !== null && this.getUser() !== undefined;
  }
}
