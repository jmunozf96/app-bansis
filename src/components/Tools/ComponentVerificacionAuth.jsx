import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Redirect, useHistory, useParams} from "react-router-dom";
import {checkToken, clearAuthentication, setError} from "../../reducers/seguridad/loginDucks";
import {checkModule, defaultAccess} from "../../reducers/seguridad/accessModuleDucks";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";

export default function ComponentVerificacionAuth({children}) {
    const authentication = useSelector((state) => state.login.token);
    //const credentialCard = useSelector((state) => state.login.credential);
    const dispatch = useDispatch();
    const {idmodulo} = useParams();
    const history = useHistory();

    const logueado = useSelector(state => state.login.logueado);
    const [verifyToken, setVerifyToken] = useState(logueado);
    const [stateCheckToken, setStateCheckToken] = useState(logueado);
    const [loginFail, setLoginFail] = useState(false);

    const acceso_modulo = useSelector(state => state.accesoModulo);

    useEffect(() => {
        if (loginFail) {
            dispatch(setError(true, "Su sesión ha caducado, porfavor vuelva a ingresar sus credenciales."));
            dispatch(clearAuthentication());
        }
        return () => {
            if (loginFail) {
                dispatch(setError(true, "Su sesión ha caducado, porfavor vuelva a ingresar sus credenciales."));
                dispatch(clearAuthentication());
            }
        }
    }, [loginFail, dispatch]);

    useEffect(() => {
        if (stateCheckToken) {
            dispatch(checkToken()).then(response => {
                if (!response) {
                    setLoginFail(true);
                }
                setVerifyToken(false);
            });
            const ruta = (history.location.pathname).split(`/${idmodulo}`)[0];
            if (ruta !== "/") {
                dispatch(checkModule(idmodulo, ruta));
            } else {
                dispatch(defaultAccess(true));
            }
            setStateCheckToken(false);
        }
    }, [stateCheckToken, setStateCheckToken, dispatch, history, idmodulo]);

    if(verifyToken){
        return(
            <Backdrop open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        )
    }

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
