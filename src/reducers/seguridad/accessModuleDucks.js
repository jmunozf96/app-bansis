import React from "react";
import Page404 from "../../components/Errors/404 Page";
import {API_LINK} from "../../constants/helpers";
import axios from "axios";
import qs from "qs";

const dataInicial = {
    acceso: false,
    view: <React.Fragment/>
};

const SET_ACCESO = 'SET_ACCESO';
const SET_VIEW = 'SET_VIEW';

export default function reduce(state = dataInicial, action) {
    switch (action.type) {
        case SET_ACCESO:
            return {...state, acceso: action.payload};
        case SET_VIEW:
            return {...state, view: action.payload};
        default:
            return state;
    }
}

export const defaultAccess = (state) => (dispatch) => {
    dispatch({
        type: SET_ACCESO,
        payload: state
    })
};

export const checkModule = (modulo, ruta) => async (dispatch, getState) => {
    const logueado = getState().login.logueado;
    const credential = getState().login.credential;

    if (logueado && credential) {

        const url = `${API_LINK}/bansis/verifyModule`;
        const data = qs.stringify({
            json: JSON.stringify({idempleado: credential.sub, modulo, rutaPadre: ruta})
        });
        const respuesta = await axios.post(url, data);

        const {status} = respuesta.data;
        if (status) {
            dispatch({type: SET_ACCESO, payload: true});
            return;
        }

        //Si se ha cambiado el codigo de algun modulo en el storage, retornar el codigo original al mismo.
        const recursos = localStorage.getItem('_recursos');
        if (recursos !== 'undefined' && recursos !== null) {
            localStorage.removeItem('_recursos');
            localStorage.setItem('_recursos', JSON.stringify(respuesta.data.recursos));
        }

        dispatch({type: SET_ACCESO, payload: false});
        dispatch({
            type: SET_VIEW,
            payload: <Page404 mensaje="Lo sentimos, usted no tiene acceso a este modulo."/>
        })
    }
};
