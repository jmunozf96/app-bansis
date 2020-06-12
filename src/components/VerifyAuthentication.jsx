import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {API_LINK} from "../utils/constants";
import {logoutActions} from "../actions/authActions";
import {cleanCredentialAction} from "../actions/credentialActions";
import {Redirect} from "react-router-dom";
import Cookies from "js-cookie"
import SpinnerLoadingVerify from "./SpinnerLoadingVerify";
import qs from 'qs';

export default function VerifyAuthentication({children}) {

    const [checkAuth, setCheckAuth] = useState(true);
    const [loguinStatus, setLoguinStatus] = useState(true);
    const [renderiza, setRenderiza] = useState(false);

    const authentication = useSelector((state) => state.auth._token);
    const dispatch = useDispatch();

    useEffect(() => {
        if (checkAuth) {
            (async () => {
                const sessionId = localStorage.getItem('_sessionId');
                const logout = (state) => dispatch(logoutActions(state));
                const credential = (state) => dispatch(cleanCredentialAction(state));
                if (sessionId === null) {
                    logout('');
                    credential(true);
                    setLoguinStatus(false);
                    Cookies.get('sessionId') !== undefined && Cookies.remove('sessionId');
                    Cookies.get('sessionRecursos') !== undefined && Cookies.remove('sessionRecursos');
                } else {
                    const url = `${API_LINK}/bansis/verifyToken`;
                    const credentials = Cookies.get('sessionId') === undefined;
                    const recursos = Cookies.get('sessionRecursos') === undefined;
                    const configuracion = {
                        method: 'POST',
                        body: qs.stringify({
                            json: JSON.stringify({credentials, recursos})
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
                        if (Cookies.get('sessionId') === undefined) {
                            const credential = {
                                nick: credentials.nick,
                                nombres: credentials.nombres,
                                apellidos: credentials.apellido1,
                                idhacienda: credentials.idhacienda
                            };
                            Cookies.get('sessionId') === undefined && Cookies.set('sessionId', credential, {expires: 1});
                            Cookies.get('sessionRecursos') === undefined && Cookies.set('sessionRecursos', recursos, {expires: 1});
                        }
                        setRenderiza(true);
                    }
                }
            })();
            setCheckAuth(false);
        }
    }, [checkAuth, loguinStatus, authentication, dispatch]);



    if (!loguinStatus && !renderiza) {
        return (
            <Redirect
                to="/login"
            />
        );
    }

    return (
        <>
            {renderiza ? children : <SpinnerLoadingVerify/>}
        </>
    )
}
