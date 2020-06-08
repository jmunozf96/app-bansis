import React, {useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import PanelExpansion from "../../../../components/PanelExpansion";
import {API_LINK} from "../../../../utils/constants";
import useFetch from "../../../../hooks/useFetch";
import {Backdrop, CircularProgress} from "@material-ui/core";

import EgresoTransDetail from "./formEgresoTransDetail";

export default function EgresoTransferencia(props) {
    const {hacienda, recibe, setOpen, setSearchTransaccionSemana, setNotificacion} = props;
    const [empleados, setEmpleados] = useState([]);
    const [loadData, setLoadData] = useState(true);

    const url = `${API_LINK}/bansis-app/index.php/search/empleados/${hacienda}/${recibe.id}/inventario`;
    const response = useFetch(url);
    const {loading} = response;

    if (loading) {
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        )
    }

    const {result} = response;

    if (empleados.length === 0 && loadData) {
        if (result.length === 0) {
            setOpen(false);
            alert("No hay saldos para transferir")
        } else {
            setEmpleados(result);
        }
        setLoadData(false);
    }

    return (
        <>
            <Row className="ml-0 mr-0 mt-2">
                {empleados.length > 0 &&
                empleados.map((empleado, index) =>
                    <Col className="pt-1 col-12 mb-2" key={index}>
                        <PanelExpansion
                            icon="fas fa-exchange-alt"
                            contentTabPanel="Transferencia de saldo"
                            data={empleado}
                        >
                            <Container fluid className="p-0 m-0">
                                {empleado.hasOwnProperty('inventario') && empleado.inventario.map((inv, index) =>
                                    <Row className="col-12 ml-0 p-0" key={index}>
                                        <EgresoTransDetail
                                            data={inv}
                                            hacienda={hacienda}
                                            recibe={recibe}
                                            solicita={empleado}
                                            setSearchTransaccionSemana={setSearchTransaccionSemana}
                                            setNotificacion={setNotificacion}
                                        />
                                    </Row>
                                )}
                            </Container>
                        </PanelExpansion>
                    </Col>
                )}
            </Row>
        </>
    );
}
