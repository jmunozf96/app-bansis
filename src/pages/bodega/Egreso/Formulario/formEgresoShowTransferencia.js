import React from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import {API_LINK} from "../../../../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../../../actions/progressActions";

const style = {
    table: {
        textCenter: {
            textAlign: "center",
            verticalAlign: "middle"
        }
    }
};

export default function EgresoShowTransferencia(props) {
    const {data: {id, transfer, debito, movimiento, cantidad}, setOpen, setNotificacion, setSearchTransaccionSemana} = props;
    const dispatch = useDispatch();
    const progressbarStatus = (state) => dispatch(progressActions(state));
    const authentication = useSelector((state) => state.login.token);

    const destroyTransaction = (id) => {
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
                <div className="col-12 mt-0">
                    <div className="alert alert-info">
                        <b>Tipo de transaccion: </b> {movimiento}
                    </div>
                </div>
                {+debito === 0 ?
                    <>
                        <Col className="ml-0 mr-0 col-12">
                            <input type="text"
                                   className={`form-control bg-white`}
                                   defaultValue={`EMPLEADO SOLICITADO: ${transfer['cabecera_egreso']['egreso_empleado']['nombres']}`}
                                   disabled/>
                        </Col>

                        <Col className="text-center col-12 mt-3">
                            <SwapHorizIcon fontSize={"large"}/>
                        </Col>
                        <Col className="ml-0 mr-0 col-12 mt-3" md={10}>
                            <input type="text" className={`form-control bg-white`}
                                   defaultValue={transfer['materialdetalle']['descripcion']} disabled/>
                        </Col>
                        <Col className="ml-0 mr-0 col-6 mt-3" md={2}>
                            <input type="text" className="form-control bg-white" defaultValue={cantidad}
                                   disabled/>
                        </Col>
                        <Col className="mt-3">
                            <Button block variant="danger" onClick={() => destroyTransaction(id)}>
                                <i className="fas fa-eraser"/> Eliminar movimiento
                            </Button>
                        </Col>
                    </>
                    :
                    <>
                        {transfer.length > 0 &&
                        <div className="col-12 table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead>
                                <tr className="text-center">
                                    <th width="80%">Empleado</th>
                                    <th>Cantidad</th>
                                    <th>...</th>
                                </tr>
                                </thead>
                                <tbody className="table-sm">
                                {transfer.map((item, i) => (
                                    <tr key={i}>
                                        <td width="80%"
                                            style={style.table.textCenter}>{item['cabecera_egreso']['egreso_empleado']['nombres']}</td>
                                        <td className="text-center"
                                            style={style.table.textCenter}>{item['cantidad']}</td>
                                        <td>
                                            <Button block variant="danger"
                                                    onClick={() => destroyTransaction(item['id'])}>
                                                <i className="fas fa-eraser"/>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        }
                    </>
                }
            </Row>
        </Container>
    );
}
