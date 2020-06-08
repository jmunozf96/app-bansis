import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {API_LINK} from "../utils/constants";
import {logoutActions} from "../actions/authActions";
import {cleanCredentialAction} from "../actions/credentialActions";
import {Redirect} from "react-router-dom";

import SpinnerLoadingVerify from "./SpinnerLoadingVerify";

export default function VerifyAuthentication({children}) {
    const [checkAuth, setCheckAuth] = useState(true);
    const [loguinStatus, setLoguinStatus] = useState(true);
    const [renderiza, setRenderiza] = useState(false);

    const authentication = useSelector((state) => state.auth._token);
    const dispatch = useDispatch();

    useEffect(() => {
        if (checkAuth) {
            (async () => {
                const logout = (state) => dispatch(logoutActions(state));
                const credential = (state) => dispatch(cleanCredentialAction(state));
                const url = `${API_LINK}/bansis/verifyToken`;
                const configuracion = {method: 'POST', headers: {'Authorization': authentication}};
                const request = await fetch(url, configuracion);
                const response = await request.json();
                const {logueado} = response;
                if (!logueado) {
                    logout('');
                    credential(true);
                    setLoguinStatus(logueado);
                } else {
                    setRenderiza(true);
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
            {renderiza ? children :
                <SpinnerLoadingVerify/>
            }
        </>
    )
}