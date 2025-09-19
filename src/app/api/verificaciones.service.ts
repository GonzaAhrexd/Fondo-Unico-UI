import axios from './axios'

type verificacion = {
    Unidad: string,
    Tipo: String,
    Fecha: string,
    Desde: string,
    Hasta: string,
    mostrarAnulados: string
}

export const getVerificaciones = async (values: verificacion) => {
    const response = await axios.get(`/Verificaciones/${values.Unidad ? values.Unidad : 'no_ingresado'}/${values.Fecha}/${values.Tipo ? (values.Tipo != '0' ? values.Tipo : 'no_ingresado')  : 'no_ingresado'}/${values.mostrarAnulados}`)
    console.log(response.data)

    return response.data
}

export const getVerificacionPorRecibo = async (recibo: string) => {
    const response = await axios.get(`/Verificaciones/buscar-por-verificacion/${recibo}`)
    console.log(response.data)

    return response.data
}

export const getVerificacionesRango = async (values: verificacion) => {
    const response = await axios.get(`/Verificaciones/${values.Unidad ? values.Unidad : 'no_ingresado'}/${values.Desde}/${values.Hasta}/${values.Tipo ? (values.Tipo != '0' ? values.Tipo : 'no_ingresado')  : 'no_ingresado'}/${values.mostrarAnulados}`)
    console.log(response.data)
    return response.data
}

export const sendVerificacion = async (verificacion: any) => {
    const response = await axios.post('/Verificaciones', verificacion)
    return response.data
}



export const cambiarAnuladoDeVerificacion = async (id: number) => {
    const response = await axios.put(`/Verificaciones/anular/${id}`)
    return response.data
}

export const deleteVerificacion = async (id: number) => {
    const response = await axios.delete(`/Verificaciones/${id}`)
    return response.data
}

