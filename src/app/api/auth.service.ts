import axios from './axios';
import { UserService } from './user.service';  // Asegúrate de importar UserService

// Asegúrate de inyectar el servicio en el constructor del servicio o componente que estés usando
export const login = async (userForm: any, userService: UserService) => {
  try {
    // Envía la solicitud POST para el login

    
    
    const response = await axios.post('/Usuarios/login', userForm);
    
    // Guarda el token de autenticación en la cookie
    document.cookie = `AuthToken=${response.data.tokenString}`;  // Suponiendo que la respuesta contiene un token
    
    userService.setUser(response.data.usuario);
    // Obtiene los datos del usuario logueado
    
    // Guarda los datos del usuario en el UserService
    
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;  // Opcionalmente maneja el error según sea necesario
  }
}

// Función para obtener los datos del usuario logueado
export const getLoggedUser = async () => {
  const response = await axios.get('/Usuarios/logged');
  return response.data;
}

export const altaUsuario = async (userForm: any) => {
  try {
    const response = await axios.post('/Usuarios/registrar-usuario', userForm);
    return response.data;
  } catch (error) {
    console.error("Error during user creation:", error);
    throw error;
  }
}

export const buscarUsuarioDNI = async (dni: string) => {
  try {
    const response = await axios.get(`/Usuarios/buscar-usuario-dni/${dni}`);
    return response.data;
  } catch (error) {
    console.error("Error during user search:", error);
    throw error;
  }
}

export const buscarUsuarios = async (userForm: any) => {
  try {

    const response = await axios.get(`/Usuarios/buscar-usuarios/${userForm.Rol !="" && userForm.Rol != "0" ? userForm.Rol : "no_ingresado"}/${userForm.Unidad !="" && userForm.Unidad != "0" ? userForm.Unidad : "no_ingresado"}`, );
    return response.data;
  } catch (error) {
    console.error("Error during user search:", error);
    throw error;
  }
}

export const editUsuario = async (userForm: any) => {
  try {
    const response = await axios.put(`/Usuarios/update-usuario/${userForm.Id}`, userForm);
    return response.data;
  } catch (error) {
    console.error("Error during user edit:", error);
    throw error;
  }
}

export const deleteUsuario = async (id: string) => {
  try {
    const response = await axios.delete(`/Usuarios/delete-usuario/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error during user deletion:", error);
    throw error;
  }
}
