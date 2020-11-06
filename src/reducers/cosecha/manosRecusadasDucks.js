import moment from "moment";

const dataInicial = {
    hacienda: null,
    desde: moment().format("DD/MM/YYYY"),
    hasta: moment().format("DD/MM/YYYY")
};

const SET_HACIENDA = 'SET_HACIENDA';
const SET_DESDE = 'SET_DESDE';
const SET_HASTA = 'SET_HASTA';

export default function reducer(state = dataInicial, action) {
    switch (action.type) {
        case SET_HACIENDA:
            return {...state, hacienda: action.payload};
        case SET_DESDE:
            return {...state, desde: action.payload};
        case SET_HASTA:
            return {...state, hasta: action.payload};
        default:
            return state;
    }
}

export const setHacienda = (hacienda) => (dispatch) => {
    dispatch({
        type: SET_HACIENDA,
        payload: hacienda
    })
};

export const setDesde = (fecha) => (dispatch) => {
    dispatch({
        type: SET_DESDE,
        payload: fecha
    })
};

export const setHasta = (fecha) => (dispatch) => {
    dispatch({
        type: SET_HASTA,
        payload: fecha
    })
};
