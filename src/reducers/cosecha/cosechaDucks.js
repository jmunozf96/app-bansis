import moment from "moment";
import 'moment/locale/es';
import qs from "qs";
import axios from "axios";

import {API_LINK} from "../../constants/helpers";
import Echo from "laravel-echo";
import {clearDataChart, updateDataChart} from "./cosechaChartDucks";

const dataInicial = {
    hacienda: null,
    canal: null,
    listen: false,
    searchData: false,
    prepareData: false,
    loadingData: false,
    build: false,
    fecha: moment().format("DD/MM/YYYY"),
    cosecha: [], //Todos los items de la cosecha
    cintas: [],
    cintas_data: [],
    cinta_select: '',
    cintas_select: [
        {label: '13 SEMANAS', status: false, value: 13},
        {label: '12 SEMANAS', status: false, value: 12},
        {label: '11 SEMANAS', status: false, value: 11},
        {label: '10 SEMANAS', status: false, value: 10},
        {label: '09 SEMANAS', status: false, value: 9},
        {label: '08 SEMANAS', status: false, value: 8},
    ], //Array de cintas seleccionadas
    errors: {
        status: false,
        message: ''
    }
};

const SET_HACIENDA = 'SET_HACIENDA';
const SET_CANAL = 'SET_CANAL';
const LISTEN_CHANNEL = 'LISTEN_CHANNEL';
const SEARCH_DATA = 'SEARCH_DATA';
const LOADING_DATA = 'LOADING_DATA';
const PREPARE_DATA = 'PREPARE_DATA';
const BUILD_APP = 'BUILD_APP';
const SET_CINTAS = 'SET_CINTAS';
const SET_DATA_CINTAS = 'SET_DATA_CINTAS';
const SET_CINTA_SELECT = 'SET_CINTA_SELECT';
const SET_CINTAS_SELECT = 'SET_CINTAS_SELECT';

const SET_ADD_COSECHA = 'SET_ADD_COSECHA';

const SET_ERRORS = 'SET_ERRORS';

export default function reducer(state = dataInicial, action) {
    switch (action.type) {
        case SET_HACIENDA:
            return {...state, hacienda: action.payload};
        case SET_CANAL:
            return {...state, canal: action.payload};
        case LISTEN_CHANNEL:
            return {...state, listen: action.payload};
        case SEARCH_DATA:
            return {...state, searchData: action.payload};
        case PREPARE_DATA:
            return {...state, prepareData: action.payload};
        case LOADING_DATA:
            return {...state, loadingData: action.payload};
        case BUILD_APP:
            return {...state, build: action.payload};
        case SET_CINTAS:
            return {...state, cintas: action.payload};
        case SET_DATA_CINTAS:
            return {...state, cintas_data: action.payload};
        case SET_CINTA_SELECT:
            return {...state, cinta_select: action.payload};
        case SET_CINTAS_SELECT:
            return {...state, cintas_select: action.payload};
        case SET_ADD_COSECHA:
            return {...state, cosecha: action.payload};
        case SET_ERRORS:
            return {...state, errors: action.payload};
        default:
            return state;
    }
}

export const setDataHacienda = (value) => (dispatch) => {
    dispatch({
        type: SET_HACIENDA,
        payload: value
    });

    if (value) {
        dispatch(setCanal());
        dispatch(listenChanel());
    }
};

export const setCanal = () => (dispatch, getState) => {
    const hacienda = getState().cosecha.hacienda;
    let canal = {nombre: '', evento: ''};
    if (hacienda) {
        if (hacienda.id === 1) {
            canal.nombre = 'BalanzaPrimo';
            canal.evento = 'CosechaPrimo';
        } else if (hacienda.id === 3) {//Id de Sofca es 3
            canal.nombre = 'BalanzaSofca';
            canal.evento = 'CosechaSofca';
        }
    }
    dispatch({type: SET_CANAL, payload: canal})
};

export const listenChannelBalanza = (value) => (dispatch) => {
    dispatch({
        type: LISTEN_CHANNEL,
        payload: value
    })
};

export const searchData = (value) => (dispatch) => {
    dispatch({
        type: SEARCH_DATA,
        payload: value
    })
};

export const prepareData = (value) => (dispatch) => {
    dispatch({
        type: PREPARE_DATA,
        payload: value
    })
};

export const loadingData = (value) => (dispatch) => {
    dispatch({
        type: LOADING_DATA,
        payload: value
    })
};

export const buildApp = (value) => (dispatch) => {
    dispatch({
        type: BUILD_APP,
        payload: value
    })
};

export const setDataCintas = (data) => (dispatch) => {
    dispatch({
        type: SET_DATA_CINTAS,
        payload: data
    })
};

export const cintaSelect = (value) => (dispatch) => {
    dispatch({
        type: SET_CINTA_SELECT,
        payload: value
    })
};

export const setDefaultCintas = () => (dispatch, getState) => {
    const cintas_seleccionadas = getState().cosecha.cintas_select;
    dispatch({type: SET_CINTAS_SELECT, payload: cintas_seleccionadas.map(item => ({...item, status: false}))});
};

export const cintasSelectBackup = (value) => (dispatch, getState) => {
    const cintas_seleccionadas = getState().cosecha.cintas_select;
    let cintas_update = [];
    cintas_seleccionadas.forEach(data => {
        const seleccion = value.filter(item => (item.value === data.value && item.status));
        if (seleccion.length > 0) {
            cintas_update.push({...seleccion[0], status: true})
        } else {
            cintas_update.push({...data, status: false});
        }
    });
    dispatch({
        type: SET_CINTAS_SELECT,
        payload: cintas_update
    })
};

export const listenChanel = () => (dispatch, getState) => {
    const canal = getState().cosecha.canal;
    if (canal) {
        window.Pusher = require('pusher-js');
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: 'ASDASD123',
            wsHost: '192.168.191.1',
            wsPort: 6001,
            wssPort: 6001,
            disableStats: true,
            enabledTransports: ['ws', 'wss'],
        });

        window.Echo.channel(canal.nombre)
            .listen(canal.evento, (e) => {
                console.log(e.cosecha);
                if (e.cosecha) {
                    const cintas = getState().cosecha.cintas;
                    const cinta_select = getState().cosecha.cinta_select;
                    if (cinta_select !== e.cosecha['cs_color']) {
                        const existe = cintas.filter(item => item.codigo === e.cosecha['cs_color']);
                        if (existe.length > 0) {
                            dispatch(cintaSelect(e.cosecha['cs_color']));
                        } else {
                            alert(`Error al capturar registro, la cinta con codigo:  ${e.cosecha['cs_color']}, no se encuentra seleccionada`);
                            return;
                        }
                    }
                    const data_cosecha = {
                        cs_id: parseInt(e.cosecha['cs_id']),
                        cs_fecha: e.cosecha['cs_fecha'],
                        cs_haciend: e.cosecha['cs_haciend'],
                        cs_seccion: e.cosecha['cs_seccion'],
                        cs_cortados: 1,
                        cs_peso: parseFloat(e.cosecha['cs_peso']).toFixed(2),
                        cs_color: e.cosecha['cs_color'],
                        ultima_actualizacion: e.cosecha['fechacre'],
                        pesando: true
                    };
                    dispatch(addCosechaLoteCinta(data_cosecha));
                }
            });
    }
};

export const closeChanel = () => (dispatch, getState) => {
    const canal = getState().cosecha.canal;
    if (canal !== '' && window.Echo) {
        window.Echo.leave(canal.nombre);
        //Limpiamos los estados
        dispatch({type: SET_ADD_COSECHA, payload: []});
        dispatch({type: SET_CINTAS, payload: []});
        dispatch({type: SET_DATA_CINTAS, payload: []});
        dispatch({type: SET_CINTA_SELECT, payload: ''});
        dispatch(clearDataChart());//Limpiamos el grafico
    }
};

export const statusError = (status, message) => (dispatch) => {
    dispatch({type: SET_ERRORS, payload: {status, message}})
};

export const searchaDataByCintasSemana = () => async (dispatch, getState) => {
        const semanas = getState().cosecha.cintas_select.filter(item => item.status);
        if (semanas.length > 0) {
            const state = getState().cosecha;
            const token = getState().login.token;

            let get_cinta = true;
            let get_data_cinta = {status: true, except: []};

            if (localStorage.getItem('_cintasSemanaLotes')) {
                const data = JSON.parse(localStorage.getItem('_cintasSemanaLotes'));
                //Trae las cintas, excepto los datos que se encuentran registrados localmente
                get_data_cinta.except = data.cintas.map(item => item.recobro.codigo);

                //Por ahora elimina y vuelve a generar los storage
                localStorage.removeItem('_cintasSemana');
                localStorage.removeItem('_cintasSemanaLotes');
            }

            try {
                const url = `${API_LINK}/bansis-app/index.php/cosecha/loading/data`;
                const data = qs.stringify({
                    json: JSON.stringify({
                        semanas: semanas,
                        fecha: state.fecha,
                        hacienda: state.hacienda.id,
                        cinta: get_cinta,
                        data_cinta: get_data_cinta
                    })
                });

                const respuesta = await axios.post(url, data, {
                    onDownloadProgress: function () {
                        dispatch(loadingData(false));
                        dispatch(searchData(false));
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': token //token,
                    }
                });

                //console.log(await respuesta.data);
                if (respuesta.data.code === 200) {
                    await dispatch({type: SET_CINTAS, payload: respuesta.data.cintas.map(item => (item.recobro))});
                    await localStorage.setItem('_cintasSemana', JSON.stringify(respuesta.data.cintas.map(item => (item.recobro))));

                    await dispatch({type: SET_DATA_CINTAS, payload: respuesta.data.cintas});
                    await localStorage.setItem('_cintasSemanaLotes', JSON.stringify({
                        fecha: moment().format("DD/MM/YYYY"),
                        cintas: respuesta.data.cintas
                    }));

                    await dispatch({
                        type: SET_ADD_COSECHA, payload: respuesta.data.cosecha.map(data => {
                            //Para sacar el enfunde y matas caidas
                            const status_cinta = (item) => (item.recobro.codigo === data.cs_color);
                            const cintas = getState().cosecha.cintas_data.filter(item => status_cinta(item));
                            const data_enfunde_caidas = searchEnfunde_MatasCaidas(data, cintas);

                            return {
                                ...data,
                                cs_enfunde: data_enfunde_caidas.enfunde,
                                cs_caidas: data_enfunde_caidas.caidas,
                                cs_cosecha_inicial: data_enfunde_caidas.cosecha_inicial,
                                pesando: false
                            }
                        })
                    });

                    //Construir aplicación
                    await dispatch(buildApp(true));
                    await dispatch(listenChannelBalanza(true));
                    //await dispatch(prepareData(false));
                } else {
                    console.error(respuesta.data.code, respuesta.data.error);
                    dispatch(statusError(true, "Errors al procesar los datos.."));
                }
            } catch (e) {
                console.error(e);
                dispatch(statusError(true, "Errors al procesar los datos.."));
                //dispatch(setDefaultCintas());//Seteamos las cintas seleccionadas
            }
        } else {
            alert("Seleccione por lo menos una semana de corte.")
        }
    }
;

export const addCosechaLoteCinta = (data) => (dispatch, getState) => {
    //Para sacar el enfunde y matas caidas
    const status_cinta = (item) => (item.recobro.codigo === data.cs_color);
    const cintas = getState().cosecha.cintas_data.filter(item => status_cinta(item));
    const data_enfunde_caidas = searchEnfunde_MatasCaidas(data, cintas);

    //Consolidar informacion
    const listen = getState().cosecha.listen;
    if (listen) {
        const item = getState().cosecha;
        if (item.cosecha.length > 0) {
            const status_id = (item) => (item['cs_id'] === data['cs_id']);
            const existe = item.cosecha.filter(item => status_id(item));

            if (existe.length === 0) {
                const status_lote_cinta = (item) => (item['cs_fecha'] === data['cs_fecha']
                    && item['cs_haciend'] === data['cs_haciend'] && item['cs_color'] === data['cs_color']
                    && item['cs_seccion'] === data['cs_seccion']);
                const existe = item.cosecha.filter(item => status_lote_cinta(item));
                if (existe.length > 0) {
                    //Actualizar cosecha
                    let nw_data = {
                        ...existe[0],
                        cs_id: data.cs_id,
                        cs_cortados: parseInt(existe[0].cs_cortados) + parseInt(data.cs_cortados),
                        cs_peso: (parseFloat(existe[0].cs_peso) + parseFloat(data.cs_peso)).toFixed(2),
                        ultima_actualizacion: data.ultima_actualizacion,
                        pesando: true
                    };
                    dispatch({
                        type: SET_ADD_COSECHA,
                        payload: item.cosecha.map(item => status_lote_cinta(item) ? nw_data : {
                            ...item,
                            pesando: false
                        })
                    });

                } else {
                    //Nuevo item
                    let cosecha = [...item.cosecha.map(item => ({...item, pesando: false}))];
                    cosecha.push({
                        ...data,
                        cs_enfunde: data_enfunde_caidas.enfunde,
                        cs_caidas: data_enfunde_caidas.caidas,
                        cs_cosecha_inicial: data_enfunde_caidas.cosecha_inicial
                    });
                    dispatch({type: SET_ADD_COSECHA, payload: cosecha});
                }
                dispatch(updateDataChart(data));
                dispatch(updateStorage());
                return;
            } else {
                return;
            }
        }
        //
        const data_cinta = {
            ...data,
            cs_enfunde: data_enfunde_caidas.enfunde,
            cs_caidas: data_enfunde_caidas.caidas,
            cs_cosecha_inicial: data_enfunde_caidas.cosecha_inicial
        };

        dispatch({type: SET_ADD_COSECHA, payload: [data_cinta]});
        dispatch(updateDataChart(data));
        dispatch(updateStorage());
    }
};

export const updateStorage = () => (dispatch, getState) => {
    const data = getState().cosecha.cintas_data;

    localStorage.removeItem('_cintasSemanaLotes');
    localStorage.setItem('_cintasSemanaLotes', JSON.stringify({
        fecha: moment().format("DD/MM/YYYY"),
        cintas: data
    }));
};

const searchEnfunde_MatasCaidas = (data, cintas) => {
    let enfunde = 0;
    let caidas = 0;
    let cosecha_inicial = 0;

    const status_lote = (item) => (item.lote === data.cs_seccion);

    if (cintas.length > 0) {
        const filter_lote = cintas[0].data.lotes.filter(item => status_lote(item));
        enfunde = filter_lote.reduce((total, item) => total + item.enfunde, 0);
        caidas = filter_lote.reduce((total, item) => total + item.caidas, 0);
        cosecha_inicial = filter_lote.reduce((total, item) => total + item.cortado, 0);
    }
    return data = {enfunde, caidas, cosecha_inicial};
};

