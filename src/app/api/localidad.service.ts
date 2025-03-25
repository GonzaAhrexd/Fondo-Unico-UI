import axios from './axios';

export const getLocalidades = async () => {
  const response = await axios.get('/Localidades');
  return response.data;
};

export const sendLocalidad = async (localidad: any) => {
    const response = await axios.post('/Localidades', localidad);
    return response.data;
    }

export const updateLocalidad = async (localidad: any) => {
    const response = await axios.put(`/Localidades/${localidad.id}`, localidad);
    return response.data;
    }

export const deleteLocalidad = async (id: any) => {
    const response = await axios.delete(`/Localidades/${id}`);
    return response.data;
    }

