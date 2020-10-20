import {API_LINK} from "../../utils/constants";
import axios from "axios";
import qs from "qs";
import Cookies from "js-cookie"

const dataInicial = {
    logueado: false,
    token: '',
    credential: null,
    recursos: []
};

const SET_LOGUEADO = 'SET_LOGUEADO';
const SET_TOKEN = 'SET_TOKEN';
const SET_CREDENTIALS = 'SET_CREDENTIALS';
const SET_RECURSOS = 'SET_RECURSOS';

export default function reducer(state = dataInicial, action) {
    switch (action.type) {
        case SET_LOGUEADO:
            return {...state, logueado: action.payload};
        case SET_TOKEN:
            return {...state, token: action.payload};
        case SET_CREDENTIALS:
            return {...state, credential: action.payload};
        case SET_RECURSOS:
            return {...state, recursos: action.payload};
        default:
            return state
    }
}

export const stateLoguin = (status) => (dispatch) => {
    dispatch({
        type: SET_LOGUEADO,
        payload: status
    });
};

export const loginSystem = (credential) => async (dispatch) => {
    try {
        const url = `${API_LINK}/bansis/login`;
        const data = qs.stringify({json: JSON.stringify({...credential})});
        const respuesta = await axios.post(url, data);

        const {code} = respuesta.data;
        if (code === 200) {
            await dispatch({
                type: SET_TOKEN,
                payload: respuesta.data.credential
            });

            await localStorage.setItem('_token', JSON.stringify(respuesta.data.credential));
            await dispatch({type: SET_LOGUEADO, payload: true});
            await dispatch(setCredentials(credential));
            return true;
        }
    } catch (e) {
        console.error(e);
    }
};

export const setCredentials = (credential) => async (dispatch) => {
    try {
        const url = `${API_LINK}/bansis/login`;
        const data = qs.stringify({json: JSON.stringify({...credential, getToken: true})});
        const respuesta = await axios.post(url, data);

        const {code} = respuesta.data;
        if (code === 200) {
            const {credential: {sub, nick, nombres, apellidos, idhacienda}} = respuesta.data;
            await dispatch({type: SET_CREDENTIALS, payload: {sub, nick, nombres, apellidos, idhacienda}});
            await dispatch({type: SET_RECURSOS, payload: respuesta.data.recursos});

            //Guardar en el localStorage
            await localStorage.setItem('_credentialUser', JSON.stringify({sub, nick, nombres, apellidos, idhacienda}));
            await Cookies.set('_recursos', JSON.stringify(respuesta.data.recursos), {expires: 7});
        }
    } catch (e) {
        console.error(e);
    }
};

export const checkToken = () => async (dispatch, getState) => {
    const loguin = getState().login;

    if (loguin.token !== "" && loguin.logueado) {
        const url = `${API_LINK}/bansis/verifyToken`;
        const respuesta = await axios.post(url, null, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': loguin.token
            }
        });
        const {code, logueado} = respuesta.data;

        if (code === 200 && logueado) {
            const {token: {sub, nick, nombres, apellidos, idhacienda}} = respuesta.data;
            dispatch({type: SET_LOGUEADO, payload: true});
            //Actualizamos credenciales
            dispatch({type: SET_CREDENTIALS, payload: {sub, nick, nombres, apellidos, idhacienda}});
        } else {
            //Seteamos todo
        }
    }
};

export const loadCredentials = () => (dispatch, getState) => {
    let credential = getState().login.credential;
    if (!credential) {
        if (localStorage.getItem('_credentialUser')) {
            stateLoguin(true);
            credential = JSON.parse(localStorage.getItem('_credentialUser'));
            dispatch({type: SET_CREDENTIALS, payload: credential});
        }
    }
};

export const loadStorageAuth = () => (dispatch, getState) => {
    const token_storage = JSON.parse(localStorage.getItem('_token'));
    const credential_storage = JSON.parse(localStorage.getItem('_credentialUser'));
    const recursos = Cookies.get('_recursos');

    if (token_storage && credential_storage && recursos) {
        let token = getState().login.token;
        if (token === '') {
            dispatch({type: SET_LOGUEADO, payload: true});
            dispatch({type: SET_TOKEN, payload: token_storage});
            dispatch({type: SET_CREDENTIALS, payload: credential_storage});
            dispatch({type: SET_RECURSOS, payload: JSON.parse(recursos)})
        }
        return;
    }

    localStorage.removeItem('_token');
    localStorage.removeItem('_credentialUser');
    Cookies.remove('_recursos');
    dispatch({type: SET_LOGUEADO, payload: false});
};

export const clearAuthentication = () => (dispatch) => {
    localStorage.removeItem('_token');
    localStorage.removeItem('_credentialUser');
    Cookies.remove('_recursos');

    dispatch({type: SET_LOGUEADO, payload: false});
    dispatch({type: SET_TOKEN, payload: ""});
    dispatch({type: SET_CREDENTIALS, payload: null});
    dispatch({type: SET_RECURSOS, payload: []});
};


