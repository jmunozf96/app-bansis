import React from "react";
import FormularioBase from "../../../../components/FormularioBase";
import {useParams} from "react-router-dom";
import CabeceraEgreso from "./CabeceraEgreso";
import DetalleEgreso from "./DetalleEgreso";
import {useDispatch, useSelector} from "react-redux";
import {
    clearDespacho, clearFormulario, clearNotificacion, saveEgresoBodega, updateEgresoBodega
} from "../../../../reducers/bodega/egresoBodegaDucks";
import ComponentNotificacion from "../../../../components/ComponentNotificacion";

export default function FormEgreso() {
    const {idmodulo} = useParams();
    const Regresar = `/bodega/egreso-material/${idmodulo}`;

    const dispatch = useDispatch();
    const disabledBtn = useSelector(state => state.egresoBodega.disabledBtn);
    const saveTransaction = useSelector(state => state.egresoBodega.save);
    const state_notificacion = useSelector(state => state.egresoBodega.notificacion);

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
        <FormularioBase
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

        </FormularioBase>
    )
}
