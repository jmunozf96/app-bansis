import React from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import {API_LINK} from "../../../../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../../../actions/progressActions";

export default function EgresoShowTransferencia(props) {
    const {data: {transfer, entra}, setOpen, setNotificacion, setSearchTransaccionSemana} = props;
    console.log(transfer);

    const {
        cantidad, id,
        materialdetalle: {descripcion},
        cabecera_egreso: {egreso_empleado: {nombres}}
    } = transfer;

    const dispatch = useDispatch();
    const progressbarStatus = (state) => dispatch(progressActions(state));
    const authentication = useSelector(state => state.auth._token);

    const destroyTransaction = () => {
        (async () => {
            progressbarStatus(true);
            const url = `${API_LINK}/bansis-app/index.php/delete-transaction?id=${id}`;
            const request = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': authentication
                }
            }).then(
                (response) => response.json()
            );

            const {code, message} = request;

            if (code === 200) {
                setSearchTransaccionSemana(true);
                setOpen(false);
            }

            await progressbarStatus(false);
            setNotificacion({
                open: true,
                message
            });
        })();
    };

    return (
        <Container fluid>
            <Row>
                <Col className="ml-0 mr-0 col-12">
                    <input type="text"
                           className={`form-control bg-white`}
                           defaultValue={entra ? `EMPLEADO SOLICITADO: ${nombres}` : `EMPLEADO SOLICITANTE: ${nombres}`}
                           disabled/>
                </Col>
                <Col className="text-center col-12 mt-3">
                    <SwapHorizIcon fontSize={"large"}/>
                </Col>
                <Col className="ml-0 mr-0 col-12 mt-3" md={10}>
                    <input type="text" className={`form-control bg-white`}
                           defaultValue={descripcion} disabled/>
                </Col>
                <Col className="ml-0 mr-0 col-6 mt-3" md={2}>
                    <input type="text" className="form-control bg-white" defaultValue={cantidad} disabled/>
                </Col>
                {cantidad < 0 &&
                <Col className="mt-3">
                    <Button block variant="danger" onClick={() => cantidad < 0 ? destroyTransaction() : null}>
                        <i className="fas fa-eraser"/> Eliminar movimiento
                    </Button>
                </Col>
                }
            </Row>
        </Container>
    );
}
