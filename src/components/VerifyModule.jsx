import React, {useEffect, useState} from "react";
import {Redirect, useHistory, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {API_LINK} from "../utils/constants";
import qs from 'qs';
import SpinnerLoadingVerify from "./SpinnerLoadingVerify/SpinnerLoadingVerify";

export default function VerifyModule({children}) {
    const {idmodulo} = useParams();
    const history = useHistory();

    const [checkModule, setCheckModule] = useState(true);
    const [continueAccess, setContinueAccess] = useState(false);
    const [goPage, setGoPage] = useState(true);
    const credentialCard = useSelector((state) => state.credential.credential);
    const authentication = useSelector((state) => state.auth._token);

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
            }
            setCheckModule(false);
        }
    }, [checkModule, idmodulo, history, authentication, credentialCard]);

    if (!continueAccess && !goPage) {
        return (
            <Redirect
                to="/error"
            />
        );
    }

    return (
        <>
            {goPage ? children : <SpinnerLoadingVerify/>}
        </>
    )
}
