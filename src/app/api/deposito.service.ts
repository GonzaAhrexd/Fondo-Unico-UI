import axios from './axios'

export const getDepositos = async () => {
    const response = await axios.get('/depositos')
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

export const updateDeposito = async (id: number, data: any) => {
    const response = await axios.put(`/depositos/${id}`, data)
    return response.data
}

export const deleteDeposito = async (id: number) => {
    const response = await axios.delete(`/depositos/${id}`)
    return response.data
}

