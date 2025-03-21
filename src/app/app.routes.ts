import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { EditarCamposComponent } from './pages/editar-campos/editar-campos.component';
export const routes: Routes = [
    { path: '', component: HomeComponent },
     { path: 'login', component: LoginComponent},
     { path: 'editar-campos', component: EditarCamposComponent},
     // Por defecto envía a login
    { path: '**', redirectTo: 'login' }
];
