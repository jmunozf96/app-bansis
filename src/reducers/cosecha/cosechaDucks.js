import moment from "moment";
import 'moment/locale/es';
import qs from "qs";
import axios from "axios";

import {API_LINK} from "../../utils/constants";
import Echo from "laravel-echo";
import {updateDataChart} from "./cosechaChartDucks";

const dataInicial = {
    listen: false,
    searchData: false,
    prepareData: false,
    loadingData: false,
    build: false,
    fecha: moment().format("DD/MM/YYYY"),
    itemBalanza: null, //Dato que viene de balanza
    cosecha: [], //Todos los items de la cosecha
    cintas: [],
    cintas_data: [],
    cinta_select: ''
};

const LISTEN_CHANNEL = 'LISTEN_CHANNEL';
const SEARCH_DATA = 'SEARCH_DATA';
const LOADING_DATA = 'LOADING_DATA';
const PREPARE_DATA = 'PREPARE_DATA';
const BUILD_APP = 'BUILD_APP';
const SET_CINTAS = 'SET_CINTAS';
const SET_DATA_CINTAS = 'SET_DATA_CINTAS';
const SET_CINTA_SELECT = 'SET_CINTA_SELECT';

const SET_ADD_COSECHA = 'SET_ADD_COSECHA';

export default function reducer(state = dataInicial, action) {
    switch (action.type) {
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
        case SET_ADD_COSECHA:
            return {...state, cosecha: action.payload};
        default:
            return state;
    }
}

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

export const listenChanel = () => (dispatch, getState) => {
    const cinta_select = getState().cosecha.cinta_select;
    window.Pusher = require('pusher-js');
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: 'ASDASD123',
        wsHost: window.location.hostname,
        wsPort: 6001,
        wssPort: 6001,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
    });

    window.Echo.channel('BalanzaPrimo')
        .listen('CosechaPrimo', (e) => {
            console.log(e.cosecha);
            if (e.cosecha) {
                if (cinta_select !== e.cosecha['cs_color']) {
                    dispatch(cintaSelect(e.cosecha['cs_color']));
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

};

export const searchaDataByCintasSemana = (semanas) => async (dispatch, getState) => {
    const state = getState().cosecha;
    const token = getState().login.token;

    let get_cinta = true;
    let get_data_cinta = {
        status: true,
        except: []
    };

    if (localStorage.getItem('_cintasSemanaLotes')) {
        const cintas = JSON.parse(localStorage.getItem('_cintasSemanaLotes'));
        //Trae las cintas, excepto los datos que se encuentran registrados localmente
        get_data_cinta.except = cintas.data.map(item => item.cinta.data.idcalendar);

        //Por ahora elimina y vuelve a generar los storage
        localStorage.removeItem('_cintasSemana');
        localStorage.removeItem('_cintasSemanaLotes');
    }

    try {
        const url = `${API_LINK}/bansis-app/index.php/cosecha/loading/data`;
        const data = qs.stringify({
            json: JSON.stringify({semanas: semanas, fecha: state.fecha, cinta: get_cinta, data_cinta: get_data_cinta})
        });

        const respuesta = await axios.post(url, data, {
            onDownloadProgress: function () {
                dispatch(listenChannelBalanza(true));
                dispatch(loadingData(false));
                dispatch(searchData(false));
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': token //token,
            }
        });

        console.log(await respuesta.data);
        await dispatch({type: SET_CINTAS, payload: respuesta.data.cintas.map(item => ({cinta: item.cinta.data}))});
        await localStorage.setItem('_cintasSemana', JSON.stringify(respuesta.data.cintas.map(item => ({cinta: item.cinta.data}))));

        await dispatch({type: SET_DATA_CINTAS, payload: respuesta.data.cintas});
        await localStorage.setItem('_cintasSemanaLotes', JSON.stringify({
            fecha: moment().format("DD/MM/YYYY"),
            data: respuesta.data.cintas
        }));

        //Construir aplicación
        await dispatch(buildApp(true));
        //await dispatch(prepareData(false));
    } catch (e) {
        console.error(e);
    }
};

export const addCosechaLoteCinta = (data) => (dispatch, getState) => {
    const status_cinta = (item) => (item.cinta.data.idcalendar === data.cs_color);
    const data_cintas = getState().cosecha.cintas_data.filter(item => status_cinta(item));

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
                        payload: item.cosecha.map(item => status_lote_cinta(item) ? nw_data : {...item, pesando: false})
                    });

                } else {
                    //Nuevo item
                    let cosecha = [...item.cosecha.map(item => ({...item, pesando: false}))];
                    cosecha.push({
                        ...data,
                        cs_enfunde: searchEnfunde_MatasCaidas(data, data_cintas).enfunde,
                        cs_caidas: searchEnfunde_MatasCaidas(data, data_cintas).caidas
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
            cs_enfunde: searchEnfunde_MatasCaidas(data, data_cintas).enfunde,
            cs_caidas: searchEnfunde_MatasCaidas(data, data_cintas).caidas
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
        data: data
    }));
};

const searchEnfunde_MatasCaidas = (data, cinta) => {
    let enfunde = 0;
    let caidas = 0;
    const status_lote = (item) => (item.lote === data.cs_seccion);

    if (cinta.length > 0) {
        const filter_lote = cinta[0].cinta.lotes.data.filter(item => status_lote(item));
        enfunde = filter_lote.reduce((total, item) => total + item.enfunde, 0);
        caidas = filter_lote.reduce((total, item) => total + item.caidas, 0);
    }
    return data = {enfunde, caidas};
};

