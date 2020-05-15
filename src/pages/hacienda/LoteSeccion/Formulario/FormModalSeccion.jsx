import React, {useState} from "react";
import ModalForm from "../../../../components/ModalForm";
import MapaBase from "../../../../components/MapaBase";

const FormModalSeccion = ({show, setShow}) => {
    const [reload, setReload] = useState(false);

    const saveData = () => {
        alert("entro");
        setShow(false);
    };

    const hideModal = () => {
        setShow(false);
    };

    return (
        <ModalForm
            show={show}
            icon="fas fa-map-pin"
            title="UBICAR SECCION EN EL MAPA"
            backdrop="static"
            size="xl"
            centered={true}
            scrollable={true}
            save={saveData}
            cancel={hideModal}
        >

        </ModalForm>
    );
};

export default FormModalSeccion;
