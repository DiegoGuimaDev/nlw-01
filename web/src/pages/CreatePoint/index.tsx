import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';

import './styles.css';
import logo from '../../assets/logo.svg';
import {Link, useHistory} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";
import {Map, Marker, TileLayer} from 'react-leaflet';
import {api, criarPontoDeColeta} from '../../services/api';
import {listarEstados, listarMunicipios} from "../../services/apiLocalidades";
import {LeafletMouseEvent} from "leaflet";
import Dropzone from "../../components/Dropzone";

interface Item {
    id: number;
    title: string;
    imageUrl: string;
}


const CreatePoint = () => {

    const [items, setItems] = useState<Array<Item>>([]);
    const [ufs, setUfs] = useState<Array<string>>([]);
    const [municipios, setMunicipios] = useState<Array<string>>([]);

    const [selectedUf, setSelectedUf] = useState("0");
    const [selectedMunicipio, setSelectedMunicipio] = useState("0");
    const [selectedFile, setSelectedFile] = useState<File>();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setInitialPosition([
                position.coords.latitude,
                position.coords.longitude
            ])
        });
    }, [])

    useEffect(() => {
        api.get('/items').then(response => {
            setItems(response.data);
        })
    }, [])


    useEffect(() => {
        listarEstados().then(estados => {
            setUfs(estados.map(uf => uf.sigla));
        })
    }, [])

    useEffect(() => {
        listarMunicipios(selectedUf).then(municipios => {
            setMunicipios(municipios.map(mu => mu.nome));
        })
    }, [selectedUf])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectedMunicio(event: ChangeEvent<HTMLSelectElement>) {
        const mu = event.target.value;
        setSelectedMunicipio(mu);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handleInputEvent(event: ChangeEvent<HTMLInputElement>) {

        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })

    }

    function handleSelectedItem(id: number) {
        const jaEhItemSelecionado = selectedItems.find(item => item === id) != null;

        if(jaEhItemSelecionado) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const {name, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedMunicipio;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }

        if(selectedFile == null) {
            alert('Você deve selecionar uma imagem');
            return;
        }



        await criarPontoDeColeta(data, selectedFile);
        history.push('/')
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft/>
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>
                    Cadastro do ponto de coleta
                </h1>
                <Dropzone onFileUploaded={setSelectedFile} />
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">
                            Nome da entidade
                        </label>
                        <input
                            onChange={handleInputEvent}
                            type="text"
                            name="name"
                            id="id"
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">
                                E-mail
                            </label>
                            <input
                                onChange={handleInputEvent}
                                type="email"
                                name="email"
                                id="email"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">
                                WhatsApp
                            </label>
                            <input
                                onChange={handleInputEvent}
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                            />
                        </div>
                    </div>

                </fieldset>


                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione um endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition}/>

                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="id" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedMunicipio} onChange={handleSelectedMunicio}>
                                <option value="0">Selecione uma Cidade</option>
                                {municipios.map(mu => (
                                    <option key={mu} value={mu}>{mu}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>


                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li
                                key={item.id}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                                onClick={() => handleSelectedItem(item.id)}>
                                <img src={item.imageUrl} alt=""/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>

            </form>

        </div>
    )
}

export default CreatePoint;
