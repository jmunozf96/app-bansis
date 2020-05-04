import React, {useState} from "react";
import {Alert, Button, ButtonGroup, Card, Col, Container, Row} from "react-bootstrap";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import moment from "moment";
import 'moment/locale/es';
import qs from 'qs';

import EgresoCabecera from "./formEgresoCabecera";
import EgresoDetalle from "./formEgresoDetalle";
import {_configStoreApi, _saveApi, API_LINK} from "../../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../actions/progressActions";
import SnackbarComponent from "../../components/Snackbar/Snackbar";

export default function FormEgreso() {
    const [cabeceraEgreso, setCabeceraEgreso] = useState({
        fecha: moment().format("DD/MM/YYYY"),
        hacienda: "",
        labor: "",
        bodega: "",
        grupo: "",
        empleado: null
    });

    const [detalleEgreso, setDetalleEgreso] = useState([]);
    const [reload, setReload] = useState(false);
    const [notificacion, setNotificacion] = useState({
        open: false,
        message: '',
        errors: [],
    });
    const [alert, setAlert] = useState(false);

    const dispatch = useDispatch();
    const progressbarStatus = (state) => dispatch(progressActions(state));
    const authentication = useSelector(state => state.auth._token);

    const onSaveTransaction = () => {
        const transaction = {
            cabecera: cabeceraEgreso,
            detalle: detalleEgreso,
            time: moment().format("DD/MM/YYYY"),
        };

        const data = qs.stringify({
            json: JSON.stringify(transaction)
        });
        progressbarStatus(true);
        (async () => {
            const url = `${API_LINK}/bansis-app/index.php/egreso-bodega`;
            const config = _configStoreApi('POST', url, data, progressbarStatus, authentication);
            const request = await _saveApi(config);
            const {code, message} = request;
            setAlert(true);
            if (code !== 200) {
                const {errors} = request;
                setNotificacion({
                    open: true,
                    message,
                    errors,
                    variant: 'danger'
                });
            } else {
                setNotificacion({
                    open: true,
                    message,
                    errors: [],
                    variant: 'success'
                });
            }
        })();
    };

    return (
        <Container className="mt-3" fluid>
            <SnackbarComponent
                notificacion={notificacion}
                setNotificacion={setNotificacion}
            />
            <Card>
                <Card.Header>
                    <ExitToAppIcon/> Formulario de Egreso de Bodega
                </Card.Header>
                <Card.Body>
                    <EgresoCabecera
                        cabeceraEgreso={cabeceraEgreso}
                        setCabeceraEgreso={setCabeceraEgreso}
                        detalleEgreso={detalleEgreso}
                        setDetalleEgreso={setDetalleEgreso}
                        setReload={setReload}
                    >
                        <Col>
                            {alert &&
                            <Alert variant={notificacion.variant}
                                   onClose={() => setAlert(false)} dismissible>
                                <strong>
                                    {notificacion.variant === 'danger' ? <i className="fas fa-times-circle"/> :
                                        <i className="fas fa-check-circle"/>} {notificacion.message}
                                </strong>
                                {notificacion.open && notificacion.errors.length > 0 &&
                                <>
                                    <hr/>
                                    <ul>
                                        {notificacion.errors.map((error, index) => (
                                            <li key={index}><i className="fas fa-exclamation-triangle"/> {error}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                                }
                            </Alert>
                            }
                        </Col>
                        <EgresoDetalle
                            reload={reload}
                            setReload={setReload}
                            detalleEgreso={detalleEgreso}
                            setDetalleEgreso={setDetalleEgreso}
                        />
                    </EgresoCabecera>
                    <hr/>
                    <Row>
                        <Col>
                            <ButtonGroup size="lg" className="col-md-4 p-0">
                                <Button variant="primary">
                                    <i className="fas fa-sticky-note"/> Nuevo
                                </Button>
                                <Button variant="success" onClick={() => onSaveTransaction()}>
                                    <i className="fas fa-save"/> Guardar
                                </Button>
                                <Button variant="danger">
                                    <i className="fas fa-home"/> Regresar
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                </Card.Footer>
            </Card>
        </Container>
    );
}
