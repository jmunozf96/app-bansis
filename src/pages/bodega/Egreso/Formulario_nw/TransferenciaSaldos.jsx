import React from "react";
import ModalForm from "../../../../components/ModalForm";
import FormTransferenciaSaldos from "./FormTransferenciaSaldos";
import {useDispatch, useSelector} from "react-redux";
import {
    clearDetallesEmpleadoSinConfirmar, procesarDetallesEmpleados,
    showTransferModal
} from "../../../../reducers/bodega/egresoBodegaDucks";

export default function TransferenciaSaldos() {
    const dispatch = useDispatch();
    const confirguracionModal = useSelector(state => state.egresoBodega.configuracionModalTransfer);
    const cabecera_transferencia = useSelector(state => state.egresoBodega.transferencia.cabecera);

    const onHideModal = () => {
        //Eliminar las transferencias
        dispatch(clearDetallesEmpleadoSinConfirmar(cabecera_transferencia.empleado));
        dispatch(showTransferModal(false, <React.Fragment/>));
    };

    const onSaveTransfer = () => {
        dispatch(procesarDetallesEmpleados(cabecera_transferencia.empleado));
        dispatch(showTransferModal(false, <React.Fragment/>));
    };

    return (
        <ModalData
            configuracion={confirguracionModal}
            onHide={onHideModal}
            onSave={onSaveTransfer}
        >
            <FormTransferenciaSaldos/>
        </ModalData>
    )
}


function ModalData({configuracion, onHide, onSave}) {
    return (
        <ModalForm
            show={configuracion.show}
            icon={configuracion.icon}
            title={configuracion.title}
            animation={configuracion.animation}
            backdrop={configuracion.backdrop}
            size={configuracion.size}
            centered={configuracion.centered}
            scrollable={configuracion.scrollable}
            dialogSize={'65'}
            cancel={onHide}
            save={onSave}
        >
            {configuracion.view}
        </ModalForm>
    )
}
