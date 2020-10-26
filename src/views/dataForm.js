import React from "react";
import Formulario from "../components/Formulario/Formulario";
import FormComponent from "../components/Form";

import {Col, Row} from "react-bootstrap";
import {Alert} from "@material-ui/lab";

export default function DataForm(props) {
    const {
        titleForm, onClicksubmit, onNuevo,
        notificacion, setNotificacion, statusResponseForm,
        arrayFormulario, getData, setData,
        routeReturn
    } = props;


    return (
        <Formulario
            routeReturn={routeReturn}
            title={`Formulario de Registro de ${titleForm}`}
            notificacion={notificacion}
            setNotificacion={setNotificacion}
            onClicksubmit={onClicksubmit}
            onNuevo={onNuevo}
        >
            <Row>
                <Col>
                    <Alert severity={statusResponseForm.severity} className="mb-2" color={statusResponseForm.color}>
                        {statusResponseForm.message}
                    </Alert>
                </Col>
            </Row>
            <FormComponent
                arrayFormulario={arrayFormulario}
                getData={getData}
                setData={setData}
            />
        </Formulario>
    );
}

