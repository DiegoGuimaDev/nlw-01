import axios from 'axios';

export const apiLocalidades = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades/'
})

export function listarEstados() {

    return apiLocalidades.get<Array<{sigla: string}>>(`estados`)
        .then(response => response.data);
}

export function listarMunicipios(uf: string) {
    return apiLocalidades.get<Array<{nome: string}>>(`estados/${uf}/municipios`)
        .then(response => response.data);
}
