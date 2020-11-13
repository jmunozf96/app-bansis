import {API_LINK} from "../../constants/helpers";
import axios from "axios";
import qs from "qs";

import {loadingProgressBar, uploadProgressBar} from "../progressDucks";

const dataInicial = {
    loading: false,
    logueado: false,
    token: '',
    credential: null,
    recursos: [],
    error: {
        status: false,
        message: 'Credenciales Incorrectas'
    }
};

const SET_LOADING = 'SET_LOADING';
const SET_LOGUEADO = 'SET_LOGUEADO';
const SET_TOKEN = 'SET_TOKEN';
const SET_CREDENTIALS = 'SET_CREDENTIALS';
const SET_RECURSOS = 'SET_RECURSOS';
const SET_ERROR = 'SET_ERROR';

export default function reducer(state = dataInicial, action) {
    switch (action.type) {
        case SET_LOADING:
            return {...state, loading: action.payload};
        case SET_LOGUEADO:
            return {...state, logueado: action.payload};
        case SET_TOKEN:
            return {...state, token: action.payload};
        case SET_CREDENTIALS:
            return {...state, credential: action.payload};
        case SET_RECURSOS:
            return {...state, recursos: action.payload};
        case SET_ERROR:
            return {...state, error: action.payload};
        default:
            return state
    }
}

export const stateLoading = (status) => (dispatch) => {
    dispatch({
        type: SET_LOADING,
        payload: status
    });
};

export const stateLoguin = (status) => (dispatch) => {
    dispatch({
        type: SET_LOGUEADO,
        payload: status
    });
};

export const setError = (status, message) => (dispatch) => {
    dispatch({
        type: SET_ERROR,
        payload: {status, message}
    });
};

export const loginSystem = (credential) => async (dispatch) => {
    try {
        const url = `${API_LINK}/bansis/login`;
        const data = qs.stringify({json: JSON.stringify({...credential})});
        const respuesta = await axios.post(url, data, {
            onUploadProgress: (progressEvent) => {
                dispatch(uploadProgressBar(progressEvent.loaded));
            },
            onDownloadProgress: () => {
                dispatch(loadingProgressBar(false));
                dispatch(stateLoading(false));
            }
        });

        const {code, message} = respuesta.data;
        if (code === 200) {
            await dispatch({
                type: SET_TOKEN,
                payload: respuesta.data.credential
            });

            await dispatch({type: SET_LOGUEADO, payload: true});
            await dispatch(setCredentials(credential));

            localStorage.setItem('_token', JSON.stringify(respuesta.data.credential));
            return true;
        }
        dispatch(setError(true, message));
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const setCredentials = (credential) => async (dispatch) => {
    try {
        const url = `${API_LINK}/bansis/login`;
        const data = qs.stringify({json: JSON.stringify({...credential, getToken: true})});
        const respuesta = await axios.post(url, data);

        const {code, message} = respuesta.data;
        if (code === 200) {
            const {credential: {sub, nick, nombres, apellidos, idhacienda}} = respuesta.data;
            await dispatch({type: SET_CREDENTIALS, payload: {sub, nick, nombres, apellidos, idhacienda}});
            await dispatch({type: SET_RECURSOS, payload: respuesta.data.recursos});

            //Guardar en el localStorage
            localStorage.setItem('_credentialUser', JSON.stringify({sub, nick, nombres, apellidos, idhacienda}));
            localStorage.setItem('_recursos', JSON.stringify(respuesta.data.recursos));
            return;
        }

        dispatch(stateLoading(false));
        dispatch(setError(true, message));
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
            //Seteamos
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
    const token_storage = localStorage.getItem('_token');
    const credential_storage = localStorage.getItem('_credentialUser');
    const recursos = localStorage.getItem('_recursos');

    if (token_storage && credential_storage && recursos) {
        let token = getState().login.token;
        if (token === '') {
            dispatch({type: SET_LOGUEADO, payload: true});
            dispatch({type: SET_TOKEN, payload: JSON.parse(token_storage)});
            dispatch({type: SET_CREDENTIALS, payload: JSON.parse(credential_storage)});
            dispatch({type: SET_RECURSOS, payload: JSON.parse(recursos)})
        }
        return;
    }

    localStorage.removeItem('_token');
    localStorage.removeItem('_credentialUser');
    localStorage.removeItem('_recursos');
    dispatch({type: SET_LOGUEADO, payload: false});
};

export const clearAuthentication = () => (dispatch) => {
    localStorage.removeItem('_token');
    localStorage.removeItem('_credentialUser');
    localStorage.removeItem('_recursos');

    dispatch({type: SET_LOGUEADO, payload: false});
    dispatch({type: SET_TOKEN, payload: ""});
    dispatch({type: SET_CREDENTIALS, payload: null});
    dispatch({type: SET_RECURSOS, payload: []});
};


