import {API_LINK} from "../../utils/constants";
import axios from "axios";
import qs from "qs";

const dataInicial = {
    token: '',
    credential: null,
    recursos: []
};

const SET_TOKEN = 'SET_TOKEN';
const SET_CREDENTIALS = 'SET_CREDENTIALS';
const SET_RECURSOS = 'SET_RECURSOS';

export default function reducer(state = dataInicial, action) {
    switch (action.type) {
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

export const loginSystem = (credential) => async (dispatch) => {
    try {
        const url = `${API_LINK}/bansis/login`;
        const data = qs.stringify({json: JSON.stringify({...credential})});
        const respuesta = await axios.post(url, data);
        console.log(respuesta.data);
        const {code} = respuesta.data;
        if (code === 200) {
            await dispatch({
                type: SET_TOKEN,
                payload: respuesta.data.credential
            });

            await localStorage.setItem('_token', JSON.stringify(respuesta.data.credential));
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
        console.log(respuesta.data);
        const {code} = respuesta.data;
        if (code === 200) {
            const {credential: {sub, nick, nombres, apellidos, idhacienda}} = respuesta.data;
            await dispatch({type: SET_CREDENTIALS, payload: {sub, nick, nombres, apellidos, idhacienda}});
            await dispatch({type: SET_RECURSOS, payload: respuesta.data.recursos});

            //Guardar en el localStorage
            await localStorage.setItem('_credentialUser', JSON.stringify({sub, nick, nombres, apellidos, idhacienda}));
        }
    } catch (e) {
        console.error(e);
    }
};

export const loadCredentials = () => (dispatch, getState) => {
    let credential = getState().login.credential;
    if (!credential) {
        if (localStorage.getItem('_credentialUser')) {
            credential = JSON.parse(localStorage.getItem('_credentialUser'));
            dispatch({type: SET_CREDENTIALS, payload: credential});
            console.log('esta pasando');
        }
    }
};

export const loadStorageAuth = () => (dispatch, getState) => {
    const token_storage = JSON.parse(localStorage.getItem('_token'));
    const credential_storage = JSON.parse(localStorage.getItem('_credentialUser'));

    if (token_storage && credential_storage) {
        let token = getState().login.token;
        if (token === '') {
            dispatch({type: SET_TOKEN, payload: token_storage});
            dispatch({type: SET_CREDENTIALS, payload: credential_storage});
        }
        return;
    }

    localStorage.removeItem('_token');
    localStorage.removeItem('_credentialUser');
};
