import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {API_LINK} from "../utils/constants";
import {logoutActions} from "../actions/authActions";
import {cleanCredentialAction} from "../actions/credentialActions";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Cookies from "js-cookie"
import SpinnerLoadingVerify from "./SpinnerLoadingVerify";
import qs from 'qs';
import Page404 from "./Error/404 Page";

export default function VerifyAuthentication({children}) {

    const localStorageAuth = localStorage.getItem('_sessionId') === undefined || localStorage.getItem('_sessionId') === null;
    const credentialsCookie = Cookies.get('sessionId') === undefined || Cookies.get('sessionId') === null;
    const recursosCookie = Cookies.get('sessionRecursos') === undefined || Cookies.get('sessionRecursos') === null;
    const [checkAuth, setCheckAuth] = useState(true);
    const [loguinStatus, setLoguinStatus] = useState(true);
    const [renderiza, setRenderiza] = useState(false);

    const authentication = useSelector((state) => state.auth._token);
    const credentialCard = useSelector((state) => state.credential);
    const dispatch = useDispatch();

    const {idmodulo} = useParams();
    const history = useHistory();

    const [checkModule, setCheckModule] = useState(false);
    const [continueAccess, setContinueAccess] = useState(false);
    const [goPage, setGoPage] = useState(true);

    useEffect(() => {
        if (checkAuth) {
            (async () => {
                const logout = (state) => dispatch(logoutActions(state));
                const credential = (state) => dispatch(cleanCredentialAction(state));
                if (localStorageAuth) {
                    logout('');
                    credential(true);
                    setLoguinStatus(false);
                    Cookies.get('sessionId') !== undefined && Cookies.remove('sessionId');
                    Cookies.get('sessionRecursos') !== undefined && Cookies.remove('sessionRecursos');
                } else {
                    const url = `${API_LINK}/bansis/verifyToken`;
                    const configuracion = {
                        method: 'POST',
                        body: qs.stringify({
                            json: JSON.stringify({
                                credentials: credentialsCookie,
                                recursos: recursosCookie
                            })
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': authentication
                        }
                    };
                    const request = await fetch(url, configuracion);
                    const response = await request.json();
                    const {logueado} = response;
                    if (!logueado) {
                        logout('');
                        credential(true);
                        setLoguinStatus(logueado);
                    } else {
                        const {credentials, recursos} = response;
                        if (credentialsCookie) {
                            const credential = {
                                sub: credentials.sub,
                                nick: credentials.nick,
                                nombres: credentials.nombres,
                                apellidos: credentials.apellido1,
                                idhacienda: credentials.idhacienda
                            };
                            Cookies.set('sessionId', credential, {expires: 1});
                        }
                        if (recursosCookie) {
                            Cookies.set('sessionRecursos', recursos, {expires: 1});
                        }
                        setRenderiza(true);
                        setCheckModule(true);
                    }
                }
            })();
            setCheckAuth(false);
        }
    }, [checkAuth, loguinStatus, authentication, credentialCard, dispatch, localStorageAuth, credentialsCookie, recursosCookie]);

    useEffect(() => {
        if (checkModule) {
            if (idmodulo !== undefined) {
                (async () => {
                    const url = `${API_LINK}/bansis/verifyModule`;
                    const configuracion = {
                        method: 'POST',
                        body: qs.stringify({
                            json: JSON.stringify({
                                idempleado: credentialCard.sub,
                                modulo: idmodulo,
                                rutaPadre: (history.location.pathname).split(`/${idmodulo}`)[0]
                            })
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': authentication
                        }
                    };
                    const request = await fetch(url, configuracion);
                    const response = await request.json();
                    if (response.status) {
                        setContinueAccess(response.status);
                    } else {
                        setGoPage(false);
                        console.error(response.message);
                    }
                })();
            } else {
                setContinueAccess(true);
            }
            setCheckModule(false);
        }
    }, [checkModule, idmodulo, history, authentication, credentialCard]);


    if (!loguinStatus && !renderiza) {
        return (
            <Redirect
                to="/login"
            />
        );
    } else {
        if ((continueAccess && goPage && renderiza)) {
            return children;
        } else if (!continueAccess && !goPage) {
            return <Page404
                mensaje="Lo sentimos, usted no tiene acceso a este modulo."
            />;
        }else{
            return <SpinnerLoadingVerify/>;
        }
    }
}
