import axios from './axios'

export const getBancos = async () => {
    try {
        const response = await axios.get('/Bancos')
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const createBanco = async (banco: any) => {

    try {
        const response = await axios.post('/Bancos', banco)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const updateBanco = async (banco: any) => {

    try {
        const response = await axios.put(`/Bancos/${banco.id}`, banco)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const deleteBanco = async (id: string) => {

    try {
        const response = await axios.delete(`/Bancos/${id}`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const getBanco = async (id: string) => {

    try {
        const response = await axios.get(`/Bancos/${id}`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

