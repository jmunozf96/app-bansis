import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, Card, Col, Container, Row} from "react-bootstrap";
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
import {v4 as uuidv4} from "uuid";

export default function FormEgreso() {
    const {id, idmodulo} = useParams();
    const [loadTransacionEdit, setLoadTransaccionEdit] = useState({
        load: id !== undefined,
        id
    });

    const credential = useSelector((state) => state.credential);
    const [searchEmpleado, setSearchEmpleado] = useState('');
    const [searchMaterial, setSearchMaterial] = useState('');
    const [changeURL, setChangeURL] = useState(false);

    const [searchTransaccionSemana, setSearchTransaccionSemana] = useState(false);
    const [cabeceraEgreso, setCabeceraEgreso] = useState({
        fecha: moment().format("DD/MM/YYYY"),
        hacienda: credential.idhacienda ? credential.idhacienda.id : "",
        labor: "",
        bodega: "",
        grupo: "",
        empleado: null
    });

    const [disabledElements, setDisabledElements] = useState({
        change: true,
        hacienda: !!(credential && credential.idhacienda),
        labor: true,
        empleado: false,
        bodega: false,
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
    //const [alert, setAlert] = useState(false);

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
                        id,
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
                empleado: true,
                hacienda: true,
                bodega: false,
                btnnuevo: true,
                btnsave: false,
                transfer: true
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
            const {code, message} = request;

            //setAlert(true);
            if (code !== 200) {
                const {errors} = request;
                setNotificacion({open: true, message, errors, variant: 'danger'});
            } else {
                setNotificacion({open: true, message, errors: [], variant: 'success'});
                if (!loadTransacionEdit.load) {
                    setDisabledElements({
                        ...disabledElements,
                        change: true,
                        btnnuevo: false,
                        btnsave: true
                    });

                    if (cabeceraEgreso.bodega !== "" && cabeceraEgreso.grupo !== "") {
                        setDisabledElements({
                            ...disabledElements,
                            material: false,
                            cantidad: false
                        });
                    }
                }
                /*setMaterial(null);
                setStock(0);*/
            }
            setDetalleEgreso([]);
            setSearchTransaccionSemana(true);
        })();
    };

    const onClickNuevo = () => {
        if (!loadTransacionEdit.load && loadTransacionEdit.id === undefined) {
            setCabeceraEgreso({
                ...cabeceraEgreso,
                empleado: null
            });
            setSearchEmpleado('');
            setSearchMaterial('');
            setChangeURL(true);
            setReload(true);
            setDisabledElements({
                ...disabledElements,
                change: true,
                hacienda: true,
                btnnuevo: false,
                btnsave: true,
                material: false,
                cantidad: true,
                transfer: true
            });
            //setAlert(null);
            setDetalleEgreso([]);
            setMaterial(null);
            setStock(0);
            //setAlert(false);
        } else {
            setMaterial(null);
            setStock(0);
            setDisabledElements({
                ...disabledElements,
                change: true,
                btnnuevo: false,
                btnsave: true,
                material: false,
                cantidad: true
            });
        }
    };

    const onClickOpenFullScreen = () => {
        setOpenFullScreen(true);
    };

    const transferSaldoMaterialEmpleado = (dataTransfer) => {
        if (dataTransfer) {
            const {cantidad, emp_solicitado: {inventario}} = dataTransfer;
            let materialTransfer = {
                shortid: uuidv4(),
                idmaterial: inventario[0].idmaterial,
                descripcion: inventario[0].material.descripcion,
                movimiento: 'CREDIT-SAL',
                cantidad: +cantidad,
                stock: parseFloat(inventario[0].material.stock),
                time: moment().format("DD/MM/YYYY"),
                transfer: true,
                dataTransfer: dataTransfer
            };
            setDetalleEgreso([
                ...detalleEgreso,
                materialTransfer
            ]);
            setNotificacion({
                ...notificacion,
                open: true,
                message: 'Debito agregado a la lita de espera para ser procesado',
            });
            setDisabledElements({
                ...disabledElements,
                btnsave: false,
            });
        }
    };

    return (
        <Container className="mb-3" fluid style={{marginTop: "4rem"}}>
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
                        searchEmpleado={searchEmpleado}
                        setSearchEmpleado={setSearchEmpleado}
                        searchMaterial={searchMaterial}
                        setSearchMaterial={setSearchMaterial}
                        changeURL={changeURL}
                        setChangeURL={setChangeURL}
                        searchTransaccionSemana={searchTransaccionSemana}
                        setSearchTransaccionSemana={setSearchTransaccionSemana}
                        item={material}
                        setItem={setMaterial}
                        stock={stock}
                        setStock={setStock}
                    >
                        {/*<Col>
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
                        </Col>*/}
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
                                    grupo={cabeceraEgreso.grupo}
                                    hacienda={cabeceraEgreso.hacienda}
                                    recibe={cabeceraEgreso.empleado}
                                    setOpen={setOpenFullScreen}
                                    setSearchTransaccionSemana={setSearchTransaccionSemana}
                                    setNotificacion={setNotificacion}
                                    detalleEgreso={detalleEgreso}
                                    transferSaldo={transferSaldoMaterialEmpleado}
                                />
                            </FullScreen>
                            <Button
                                variant="primary mt-3"
                                disabled={disabledElements.transfer}
                                onClick={() => !disabledElements.transfer && onClickOpenFullScreen()}
                            >
                                <i className="fas fa-exchange-alt"/> Transferir Saldo
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
                                        onClick={() => history.push(`/bodega/egreso-material/${idmodulo}`)}
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
