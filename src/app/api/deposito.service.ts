import axios from './axios'


type TotalDeposito = {
    Desde: Date,
    Hasta: Date,
    Unidad: string,
    TipoFormulario: string,
}  

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

export const getTotalDepositos = async (value: TotalDeposito) => {
    const response = await axios.get(`/depositos/total-por-fecha/${value.Desde}/${value.Hasta}/${value.Unidad}/${value.TipoFormulario}`)
    return response.data
}

export const getCantidadDepositos = async (value: TotalDeposito) => {
    const response = await axios.get(`/depositos/cantidad-por-fecha/${value.Desde}/${value.Hasta}/${value.Unidad}/${value.TipoFormulario}`)
    return response.data
}


