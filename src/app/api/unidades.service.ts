import axios from './axios'

export const getUnidades = async () => {
  const response = await axios.get('/Unidades');
  return response.data;
};


export const sendUnidad = async (unidad: any) => {
    const response = await axios.post('/Unidades', unidad);
    return response.data;
    }

export const updateUnidad = async (unidad: any) => {

    const response = await axios.put(`/Unidades/${unidad.id}`, unidad);
    return response.data;
    }

export const deleteUnidad = async (id: any) => {
    const response = await axios.delete(`/Unidades/${id}`);
    return response.data;
    }
    