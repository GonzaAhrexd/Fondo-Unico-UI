import axios from './axios'

export const getDepositos = async () => {
    const response = await axios.get('/depositos')
    return response.data
}

export const buscarDepositos = async (data: any) => {
    const response = await axios.get(`/depositos/${data.Unidad}/${data.Desde}/${data.Hasta}`)

    console.log(response.data)
    return response.data
}

export const buscarDepositosPorNroDeposito = async (nroDeposito: string) => {
    const response = await axios.get(`/depositos/buscar-por-nro-deposito/${nroDeposito}`)
    return response.data
}



export const getDeposito = async (id: number) => {
    const response = await axios.get(`/depositos/${id}`)
    return response.data
}

export const createDeposito = async (data: any) => {
    const response = await axios.post('/depositos', data)
    return response.data
}

export const updateDeposito = async (data: any) => {
    const response = await axios.put(`/Depositos/${data.Id}`, data)
    return response.data
}

export const deleteDeposito = async (id: number) => {
    const response = await axios.delete(`/depositos/${id}`)
    return response.data
}

