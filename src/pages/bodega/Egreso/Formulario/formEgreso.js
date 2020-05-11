import React, {useEffect, useState} from "react";
import {Alert, Button, ButtonGroup, Card, Col, Container, Row} from "react-bootstrap";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import moment from "moment";
import 'moment/locale/es';
import qs from 'qs';

import EgresoCabecera from "./formEgresoCabecera";
import EgresoDetalle from "./formEgresoDetalle";
import EgresoTransferencia from "./formEgresoTransferencia";

import {_configStoreApi, _saveApi, API_LINK} from "../../../../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../../../actions/progressActions";
import SnackbarComponent from "../../../../components/Snackbar/Snackbar";
import FullScreen from "../../../../components/FullScreen";
import {useHistory, useParams} from "react-router-dom";

export default function FormEgreso(props) {
    const {id} = useParams();
    const [loadTransacionEdit, setLoadTransaccionEdit] = useState({
        load: id !== undefined,
        id
    });
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
        cantidad: true,
        btnnuevo: true,
        btnsave: true,
        transfer: true
    });

    const [material, setMaterial] = useState(null);
    const [stock, setStock] = useState(0);

    const [detalleEgreso, setDetalleEgreso] = useState([]);
    const [reload, setReload] = useState(false);
    const [notificacion, setNotificacion] = useState({
        open: false,
        message: '',
        errors: [],
    });
    const [alert, setAlert] = useState(false);

    const history = useHistory();
    const dispatch = useDispatch();
    const progressbarStatus = (state) => dispatch(progressActions(state));
    const authentication = useSelector(state => state.auth._token);

    //Estados de transferencia de saldo
    const [openFullScreen, setOpenFullScreen] = useState(false);

    useEffect(() => {
        if (loadTransacionEdit.load) {
            (async () => {
                const api = `${API_LINK}/bansis-app/index.php/egreso-bodega/${loadTransacionEdit.id}`;
                const request = await fetch(api).then(
                    (response) => response.json()
                );
                const {code} = request;
                if (code === 200) {
                    const {egreso: {id, fecha, egreso_empleado}} = request;
                    await setCabeceraEgreso({
                        ...cabeceraEgreso,
                        hacienda: egreso_empleado.idhacienda,
                        fecha: moment(fecha).format('DD/MM/YYYY'),
                        empleado: egreso_empleado,
                        labor: egreso_empleado.labor
                    });
                    await setSearchTransaccionSemana(true);
                }
                /*setNotificacion({
                    ...notificacion,
                    open: true,
                    message
                });*/
            })();
            setDisabledElements({
                ...disabledElements,
                change: false,
                hacienda: true,
                bodega: false,
                btnnuevo: true,
                btnsave: false
            });
            setLoadTransaccionEdit({...loadTransacionEdit, load: false});
        }
    }, [loadTransacionEdit, notificacion,
        cabeceraEgreso, disabledElements,
        setDisabledElements, setSearchTransaccionSemana,]);

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
                setDisabledElements({
                    change: true, btnnuevo: false, btnsave: true, material: false, cantidad: true
                });
                setMaterial(null);
                setStock(0);
            }
            setSearchTransaccionSemana(true);
        })();
    };

    const onClickNuevo = () => {
        setCabeceraEgreso({...cabeceraEgreso, empleado: null});
        setReload(true);
        setDisabledElements({
            change: true,
            hacienda: true,
            btnnuevo: false,
            btnsave: true,
            material: false,
            cantidad: true,
            transfer: true
        });
        setAlert(null);
        setDetalleEgreso([]);
        setMaterial(null);
        setStock(0);
        setAlert(false);
    };

    const onClickOpenFullScreen = () => {
        setOpenFullScreen(true);
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
                        setItem={setMaterial}
                        stock={stock}
                        setStock={setStock}
                    >
                        <Col>
                            {alert &&
                            <Alert variant={notificacion.variant}
                                   onClose={() => setAlert(false)} dismissible>
                                {notificacion.variant === 'danger' ? <i className="fas fa-times-circle"/> :
                                    <i className="fas fa-check-circle"/>} {notificacion.message}
                                {notificacion.open && (notificacion.hasOwnProperty('errors') && notificacion.errors.length > 0) &&
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
                            setNotificacion={setNotificacion}
                            setSearchTransaccionSemana={setSearchTransaccionSemana}
                        />
                        <Col>

                            <FullScreen
                                open={openFullScreen}
                                setOpen={setOpenFullScreen}
                            >
                                <EgresoTransferencia
                                    hacienda={cabeceraEgreso.hacienda}
                                    recibe={cabeceraEgreso.empleado}
                                    setOpen={setOpenFullScreen}
                                    setSearchTransaccionSemana={setSearchTransaccionSemana}
                                    setNotificacion={setNotificacion}
                                />
                            </FullScreen>

                            <Button
                                variant="primary mt-3"
                                disabled={disabledElements.transfer}
                                onClick={() => !disabledElements.transfer && onClickOpenFullScreen()}
                            >
                                <i className="fas fa-exchange-alt"/> Traspaso de Saldo
                            </Button>
                        </Col>
                    </EgresoCabecera>
                    <hr/>
                    <Row>
                        <Col>
                            <ButtonGroup className="col-md-4 pl-0">
                                <Button
                                    variant="primary"
                                    onClick={() => onClickNuevo()}
                                    disabled={disabledElements.btnnuevo}
                                >
                                    <i className="fas fa-sticky-note"/> Nuevo
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={() => !disabledElements.btnsave && onSaveTransaction()}
                                    disabled={disabledElements.btnsave}
                                >
                                    <i className="fas fa-save"/> Guardar
                                </Button>
                                <Button variant="danger"
                                        onClick={() => history.push("/bodega/egreso-material")}
                                >
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