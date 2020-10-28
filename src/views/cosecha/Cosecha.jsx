import React, {useEffect} from "react";
import CosechaBalanza from "./CosechaBalanza";
import {
    buildApp,
    closeChanel,
    listenChannelBalanza,
    setCanal,
    setDataHacienda, setDefaultCintas
} from "../../reducers/cosecha/cosechaDucks";
import {useDispatch} from "react-redux";

export default function () {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(closeChanel());//Cerramos canal
        dispatch(listenChannelBalanza(false));//Apagamos el listening en redux
        dispatch(setCanal());//Seteamos el canal
        dispatch(buildApp(false));//Destruimos la app
        dispatch(setDataHacienda(null));
        dispatch(setDefaultCintas());//Seteamos las cintas seleccionadas
    },[dispatch]);

    return <CosechaBalanza/>;
}