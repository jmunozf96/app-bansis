import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Redirect, useHistory, useParams} from "react-router-dom";
import {checkToken} from "../reducers/seguridad/loginDucks";
import {checkModule, defaultAccess} from "../reducers/seguridad/accessModuleDucks";

export default function VerifyAuthentication({children}) {
    const authentication = useSelector((state) => state.login.token);
    //const credentialCard = useSelector((state) => state.login.credential);

    const dispatch = useDispatch();
    const {idmodulo} = useParams();
    const history = useHistory();

    const logueado = useSelector(state => state.login.logueado);
    const [stateCheckToken, setStateCheckToken] = useState(logueado);

    const acceso_modulo = useSelector(state => state.accesoModulo);

    useEffect(() => {
        if (stateCheckToken) {
            dispatch(checkToken());

            const ruta = (history.location.pathname).split(`/${idmodulo}`)[0];
            if (ruta !== "/") {
                dispatch(checkModule(idmodulo, ruta));
            } else {
                dispatch(defaultAccess(true));
            }

            setStateCheckToken(false);
        }
    }, [stateCheckToken, setStateCheckToken, dispatch, history, idmodulo]);

    if (authentication === '') {
        return (
            <Redirect
                to="/login"
            />
        );
    } else {
        if (!logueado) {
            return (
                <Redirect
                    to="/login"
                />
            );
        } else {
            if (!acceso_modulo.acceso) {
                return acceso_modulo.view
            } else {
                return children;
            }
        }
    }
}
