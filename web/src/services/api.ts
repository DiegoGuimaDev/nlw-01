import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://192.168.1.110:3333'
})

export function criarPontoDeColeta(data: any, file: File) {
    const formData = new FormData();

    formData.set('name', data.name);
    formData.set('email', data.email);
    formData.set('whatsapp', data.whatsapp);
    formData.set('uf', data.uf);
    formData.set('city', data.city);
    formData.set('latitude', data.latitude);
    formData.set('longitude', data.longitude);
    formData.set('items', data.items.join(','));
    formData.set('image', file);

    return api.post('/points', formData);
}
