import axios from './axios'

export const getFormulario = async (id: string) => {
  try {
    const response = await axios.get(`/Formularios/${id}`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const getFormularios = async () => {
    try {
        const response = await axios.get('/Formularios')
        return response.data
    } catch (error) {
        console.error(error)
    }
    }
    

export const createFormulario = async (formulario: any) => {
    try {
        const response = await axios.post('/Formularios', formulario)
        return response.data
    } catch (error) {
        console.error(error)
    }
    }

export const updateFormulario = async (formulario: any) => {
    try {
        const response = await axios.put(`/Formularios/${formulario.id}`, formulario)
        return response.data
    } catch (error) {
        console.error(error)
    }
    }

export const deleteFormulario = async (id: string) => {
    try {
        const response = await axios.delete(`/Formularios/${id}`)
        return response.data
    } catch (error) {
        console.error(error)
    }
    }
