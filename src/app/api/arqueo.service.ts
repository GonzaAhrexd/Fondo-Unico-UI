import axios from './axios'


export const sendArqueoFondoUnico = async (arqueo: any) => {
    const response = await axios.post('/Arqueos', arqueo)
    return response.data
}
