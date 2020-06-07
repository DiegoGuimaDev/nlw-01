import axios from 'axios';

export const apiLocalidades = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades/'
})

export interface Estado {
    sigla: string,
    nome: string
}

export interface Cidade {
    nome: string
}

export function listarEstados() {

    return apiLocalidades.get<Array<Estado>>(`estados`)
        .then(response => response.data);
}

export function listarCidades(uf: string) {

    return apiLocalidades.get<Array<Cidade>>(`estados/${uf}/municipios`)
        .then(response => response.data);
}
