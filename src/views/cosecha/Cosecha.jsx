import React, {useCallback, useEffect} from "react";
import CosechaBalanza from "./CosechaBalanza";
import {
    buildApp,
    closeChanel,
    listenChannelBalanza, setDataFecha,
    setDataHacienda, setDefaultCintas
} from "../../reducers/cosecha/cosechaDucks";
import {useDispatch} from "react-redux";
import moment from "moment";

export default function () {
    const dispatch = useDispatch();

    const clear = useCallback(() => {
        dispatch(closeChanel());//Cerramos canal
        dispatch(listenChannelBalanza(false));//Apagamos el listening en redux
        dispatch(setDataHacienda(null));
        dispatch(buildApp(false));//Destruimos la app
        dispatch(setDefaultCintas());//Seteamos las cintas seleccionadas

        //Eliminamos el storage
        const existe = JSON.parse(localStorage.getItem('_cintasSemanaLotes'));
        if (existe) {
            localStorage.removeItem('_cintasSemana');
            localStorage.removeItem('_cintasSemanaLotes');
        }
    }, [dispatch]);

    useEffect(() => {
        clear();
        console.log('salio');
        dispatch(setDataFecha(moment().format("DD/MM/YYYY")));
        return () => {
            console.log('salio aaaa');
            clear();
        }
    }, [clear, dispatch]);

    return <CosechaBalanza/>;
}
