import axios from './axios';

export const sendEntrega = async (entrega: any) => {
    try {
        const response = await axios.post('/Entregas', entrega);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const buscarEntrega = async (entrega: any) => {
    try {
        const response = await axios.get(`/Entregas/${entrega.Unidad}/${entrega.Desde}/${entrega.Hasta}/${entrega.Formulario}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const buscarEntregaPorNro = async (nroEntrega: string) => {
    try {
        const response = await axios.get(`/Entregas/${nroEntrega}`);
        return response.data;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}



export const deleteEntrega = async (id: string) => {
    try {
        const response = await axios.delete(`/Entregas/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const updateEntrega = async (id: number, entrega: any) => {
    try {
        const response = await axios.put(`/Entregas/${id}`, entrega);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const deleteRenglonEntrega = async(id: number) => {
    try {
        const response = await axios.delete(`/RenglonesEntregas/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
    export const getLastNumeroEntrega = async () => {
        try {
            const response = await axios.get('/Entregas/last');
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

