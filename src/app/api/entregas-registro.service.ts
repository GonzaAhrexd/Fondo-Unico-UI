import axios from './axios';

export const getEntregasRegistro = async (id: number) => {
    try {
        const response = await axios.get(`/entregas-registro/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching entregas registro:', error);
        throw error;
    }
    }

export const getCantidadActual = async (Data: any, renglon: any) => {
    try {
        const response = await axios.get(`/RegistroEntregas/CantidadActual/${Data.Fecha}/${Data.Unidad}/${renglon.TipoFormulario}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cantidad actual:', error);
        throw error;
    }
}

export const setRegistroEntrega = async (data: any) => {
    try {
        const response = await axios.post('/RegistroEntregas', data);
        return response.data;
    } catch (error) {
        console.error('Error posting registro entrega:', error);
        throw error;
    }
}
