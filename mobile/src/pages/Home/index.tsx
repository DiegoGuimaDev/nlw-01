import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, StyleSheet, Text, View, Alert} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {Feather as Icon} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

import RNPickerSelect,{Item} from 'react-native-picker-select';
import {apiLocalidades, Cidade, Estado, listarCidades, listarEstados} from "../../services/apiLocalidades";


const Home = () => {

    const navigation = useNavigation();

    const [estados, setEstados] = useState<Item[]>([])
    const [cidades, setCidades] = useState<Item[]>([])

    const [estadoSelecionado, setEstadoSelecionado] = useState<string>("0");
    const [cidadeSelecionada, setCidadeSelecionada] = useState<string>("0");

    const emptyItemFactory = (label: string): Item => {
        return {
            label: label,
            value: "0"
        }
    }

    useEffect(() => {

        function toPickerSelectItem(estados: Array<Estado>): Item[] {
            return estados.map(estado => ({
                value: estado.sigla,
                label: estado.nome
            }))
        }

        listarEstados().then(estados => {
            const items = toPickerSelectItem(estados);
            setEstados(items);
        });
    }, []);

    useEffect(() => {

        function toPickerSelectItem(cidades: Array<Cidade>): Item[] {
            return cidades.map(cidade => ({
                value: cidade.nome,
                label: cidade.nome
            }))
        }

        listarCidades(estadoSelecionado).then(cidades => {
            const items = toPickerSelectItem(cidades);
            setCidades(items);
        })
    }, [estadoSelecionado]);


    function handleNavigateToPoints() {

        if(cidadeSelecionada == "0") {
            Alert.alert('Oooops!','Você precisa selecionar um estado e uma cidade');
            return
        }

        navigation.navigate('Points', {
            estado: estadoSelecionado,
            cidade: cidadeSelecionada
        });
    }

    function handleSelectedEstado(item: string) {
        setEstadoSelecionado(item);
        setCidades([]);
        setCidadeSelecionada("0");

    }

    return (
        <ImageBackground source={require('../../assets/home-background.png')}
                         style={styles.container}
                         imageStyle={{width: 274, height: 368}}

        >

            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')}/>
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma
                    eficiente</Text>
            </View>

            <View style={styles.footer}>
                <RNPickerSelect
                    style={{
                        viewContainer: styles.input
                    }}
                    placeholder={emptyItemFactory('Selecione um estado')}
                    onValueChange={value => handleSelectedEstado(value)}
                    items={estados} />
                <RNPickerSelect
                    disabled={estadoSelecionado === "0"}
                    style={{
                        viewContainer: styles.input
                    }}
                    placeholder={emptyItemFactory('Selecione uma cidade')}
                    onValueChange={value => setCidadeSelecionada(value)}
                    items={cidades} />
                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Icon name="arrow-right" color="#FFF" size={24}/>
                    </View>
                    <Text style={styles.buttonText}>Entrar</Text>
                </RectButton>
            </View>

        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginTop: 8,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home;
