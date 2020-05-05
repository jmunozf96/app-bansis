import React, {useEffect, useState} from "react";
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
    const [searchTransaccionSemana, setSearchTransaccionSemana] = useState(false);
    const [cabeceraEgreso, setCabeceraEgreso] = useState({
        fecha: moment().format("DD/MM/YYYY"),
        hacienda: "",
        labor: "",
        bodega: "",
        grupo: "",
        empleado: null
    });

    const [disabledElements, setDisabledElements] = useState({
        change: true,
        hacienda: false,
        labor: true,
        empleado: true,
        bodega: true,
        grupo: true,
        material: true,
        btnnuevo: true,
        btnsave: true
    });

    const [material, serMaterial] = useState(null);
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

    useEffect(() => {
        if (disabledElements.change) {
            return setDisabledElements({
                ...disabledElements,
                change: false
            });
        }
    }, [disabledElements, setDisabledElements]);

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
            console.log(request);
            const {code, message} = request;

            setAlert(true);
            if (code !== 200) {
                const {errors} = request;
                setNotificacion({open: true, message, errors, variant: 'danger'});
            } else {
                setNotificacion({open: true, message, errors: [], variant: 'success'});
            }
            setSearchTransaccionSemana(true);
        })();
    };

    const onClickNuevo = () => {
        setCabeceraEgreso({...cabeceraEgreso, empleado: null});
        setReload(true);
        setDisabledElements({
            change: true, hacienda: true, btnnuevo: false, btnsave: true
        });
        setAlert(null);
        setDetalleEgreso([]);
        serMaterial(null);
        setAlert(false);
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
                        disabledElements={disabledElements}
                        setDisabledElements={setDisabledElements}
                        searchTransaccionSemana={searchTransaccionSemana}
                        setSearchTransaccionSemana={setSearchTransaccionSemana}
                        item={material}
                        setItem={serMaterial}
                    >
                        <Col>
                            {alert &&
                            <Alert variant={notificacion.variant}
                                   onClose={() => setAlert(false)} dismissible>
                                {notificacion.variant === 'danger' ? <i className="fas fa-times-circle"/> :
                                    <i className="fas fa-check-circle"/>} {notificacion.message}
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
                                <Button
                                    variant="primary"
                                    onClick={() => onClickNuevo()}
                                    disabled={disabledElements.btnnuevo}
                                >
                                    <i className="fas fa-sticky-note"/> Nuevo
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={() => !disabledElements.btnsave ? onSaveTransaction() : null}
                                    disabled={disabledElements.btnsave}
                                >
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
