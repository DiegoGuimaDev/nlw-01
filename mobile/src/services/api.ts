import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.110:3333'
});

export interface Item {
    id: number;
    title: string;
    imageUrl: string;
}

export function listarItems() {
    return api.get<Array<Item>>('/items').then(response => response.data);
}

export interface Point {
    id: number,
    name: string,
    image: string,
    latitude: number,
    longitude: number,
    imageUrl: string
}

export interface PointDetail {
    point: {
        id: number,
        name: string,
        image: string,
        latitude: number,
        longitude: number
        city: string,
        uf: string,
        email: string,
        whatsapp: string,
        imageUrl: string
    },
    items: {
        title: string
    }[]
}

export function listarPontos(filters?: {
    city?: string,
    uf?: string,
    items?: number[]
}) {
    return api.get<Array<Point>>('/points',{
        params: filters
    }).then(response => response.data);
}

export function obterPonto(id: number) {
    return api.get<PointDetail>(`/points/${id}`)
        .then(response => response.data);
}
