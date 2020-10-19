import React from "react";
import FormularioBase from "../../../../components/FormularioBase";
import {useParams} from "react-router-dom";
import CabeceraEgreso from "./CabeceraEgreso";
import DetalleEgreso from "./DetalleEgreso";
import {useDispatch, useSelector} from "react-redux";
import {
    changeStatusBtnsave,
    clearCabecera,
    clearDespacho, clearDetalle, clearRespaldo,
    saveEgresoBodega, setDataCabeceraEmpleado,
    updateEgresoBodega
} from "../../../../reducers/bodega/egresoBodegaDucks";

export default function FormEgreso() {
    const {idmodulo} = useParams();
    const Regresar = `/bodega/egreso-material/${idmodulo}`;

    const dispatch = useDispatch();
    const disabledBtn = useSelector(state => state.egresoBodega.disabledBtn);
    const saveTransaction = useSelector(state => state.egresoBodega.save);

    const nuevo = () => {
        dispatch(setDataCabeceraEmpleado(null));
        dispatch(clearDespacho());
        dispatch(clearDetalle());
        dispatch(clearRespaldo());
        dispatch(changeStatusBtnsave(true));
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

    return (
        <FormularioBase
            icon='fas fa-street-view'
            title={'Formulario Egreso de Bodega'}
            nuevo={nuevo}
            guardar={guardar}
            volver={Regresar}
            disabledElements={disabledBtn}
        >
            {/*Cabecera de la transacción*/}
            <CabeceraEgreso/>
            {/*Detalle de la transacción*/}
            <DetalleEgreso/>

        </FormularioBase>
    )
}
