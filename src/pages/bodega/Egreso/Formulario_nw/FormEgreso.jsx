import React, {useEffect, useState} from "react";
import ComponentFormularioBase from "../../../../components/ComponentFormularioBase";
import {useParams, useLocation} from "react-router-dom";
import CabeceraEgreso from "./CabeceraEgreso";
import DetalleEgreso from "./DetalleEgreso";
import {useDispatch, useSelector} from "react-redux";
import {
    clearDespacho,
    clearFormulario,
    clearNotificacion, existEgreso,
    saveEgresoBodega,
    setDataCabeceraBodega, setDataCabeceraGrupo,
    setDataCabeceraHacienda,
    updateEgresoBodega
} from "../../../../reducers/bodega/egresoBodegaDucks";
import ComponentNotificacion from "../../../../components/ComponentNotificacion";
import {loginSystem} from "../../../../reducers/seguridad/loginDucks";

export default function FormEgreso() {
    const {idmodulo, id} = useParams();
    const Regresar = `/bodega/egreso-material/${idmodulo}`;
    const dispatch = useDispatch();
    const credential = useSelector(state => state.login.credential);
    const disabledBtn = useSelector(state => state.egresoBodega.disabledBtn);
    const saveTransaction = useSelector(state => state.egresoBodega.save);
    const state_notificacion = useSelector(state => state.egresoBodega.notificacion);

    const [loadFormulario, setLoadFormulario] = useState(true);

    useEffect(() => {
        if (loadFormulario) {
            dispatch(setDataCabeceraHacienda(null));
            dispatch(setDataCabeceraBodega(null));
            dispatch(setDataCabeceraGrupo(null));
            dispatch(clearFormulario());
            setLoadFormulario(false);

            if (id !== undefined) {
                dispatch(existEgreso(null, null, id));
            }

            if (credential.idhacienda) {
                dispatch(setDataCabeceraHacienda({...credential.idhacienda, ruc: null}));
            }
        }
    }, [loadFormulario, setLoadFormulario, dispatch, credential, id]);

    const nuevo = () => {
        dispatch(clearFormulario());
    };

    const guardar = () => {
        if (saveTransaction) {
            dispatch(saveEgresoBodega());
        } else {
            console.warn("Se actualizo la transacción...");
            dispatch(updateEgresoBodega());
        }

        //Limpiar formulario
        dispatch(clearDespacho());
    };

    const closeNotificacion = () => {
        dispatch(clearNotificacion());
    };

    return (
        <ComponentFormularioBase
            icon='fas fa-street-view'
            title={'Formulario Egreso de Bodega'}
            nuevo={nuevo}
            guardar={guardar}
            volver={Regresar}
            disabledElements={disabledBtn}
        >
            <ComponentNotificacion
                notificacion={state_notificacion}
                closeNotificacion={closeNotificacion}
            />

            {/*Cabecera de la transacción*/}
            <CabeceraEgreso/>
            {/*Detalle de la transacción*/}
            <DetalleEgreso/>

        </ComponentFormularioBase>
    )
}
