import React, {useEffect, useState} from "react";
import {Badge, Button, ButtonGroup, Col, Container, FormGroup, Row} from "react-bootstrap";
import TemporaryDrawer from "../../components/Tools/TemporaryDrawer";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from "@material-ui/icons/AddCircle";
//import ApexChart from "../../../components/ApexChart";
import {API_LINK} from "../../constants/helpers";

import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../actions/progressActions";
import TableForm from "../../components/Tools/Table";
import moment from "moment";
import UpdateIcon from "@material-ui/icons/Update";

import SyncIcon from '@material-ui/icons/Sync';
import DeleteIcon from '@material-ui/icons/Delete';

import {useHistory} from "react-router-dom";
import SnackbarComponent from "../../components/Tools/Snackbar/Snackbar";
import InputSearch from "../../components/Tools/InputSearch/InputSearch";
import {FormHelperText} from "@material-ui/core";

export default function Egreso() {
    const history = useHistory();
    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));
    const credential = useSelector((state) => state.login.credential);
    //const authentication = useSelector((state) => state.auth._token);

    const [openDrawer, setOpenDrawer] = useState(false);
    const [egresos, setEgresos] = useState({});
    const [page, setPage] = useState(1);
    const [reload, setReload] = useState(true);
    const [filter, setFilter] = useState((credential && credential.idhacienda) ? `&hacienda=${credential.idhacienda.id}` : "");
    const [notificacion, setNotificacion] = useState({
        open: false,
        message: '',
    });

    const [searchEmpleado, setSearchEmpleado] = useState('');
    const [changeURL, setChangeURL] = useState(false);
    const api_origen_empleados = `${API_LINK}/bansis-app/index.php/search/empleados${(credential && credential.idhacienda) ? "?hacienda=" + credential.idhacienda.id : ''}`;
    const [api_empleados, setApiEmpleados] = useState(`${api_origen_empleados}`);
    const [empleado, setEmpleado] = useState(null);
    const api_haciendas = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const [hacienda, setHacienda] = useState((credential && credential.idhacienda) ? credential.idhacienda : null);
    const api_labores = `${API_LINK}/bansis-app/index.php/labores-select`;
    const [labor, setLabor] = useState(null);

    useEffect(() => {
        if (changeURL) {
            setApiEmpleados(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}`);
            if (hacienda) {
                setApiEmpleados(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}&hacienda=${hacienda.id}`);
            }
            if (labor) {
                setApiEmpleados(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}&labor=${labor.id}`);
            }
            if (hacienda && labor) {
                setApiEmpleados(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}&hacienda=${hacienda.id}&labor=${labor.id}`);
            }
            setChangeURL(false);
        }
    }, [changeURL, setApiEmpleados, searchEmpleado, hacienda, labor]);

    useEffect(() => {
        if (reload) {
            (async () => {
                const progessbarStatus = (state) => dispatch(progressActions(state));
                let api_egresos = `${API_LINK}/bansis-app/index.php/bodega/egresos?page=${page}${filter}`;

                const response = await fetch(api_egresos).then(
                    (response) => response.json()
                );

                if (response.code === 200) {
                    setEgresos(response);
                } else {
                    if (Object.entries(egresos).length === 0) {
                        const {code} = response;
                        setEgresos({code});
                    }
                    setNotificacion({open: true, message: response.message})
                }
                progessbarStatus(false);
            })();
            setReload(false);
        }
    }, [reload, page, dispatch, egresos, filter, credential, hacienda]);

    /*if (Object.entries(egresos).length === 0) {
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        );
    }*/

    const unFilter = () => {
        progessbarStatus(true);
        setFilter("");
        setReload(true);
        setEmpleado(null);
        setHacienda(null);
    };

    const onChangePage = (page) => {
        progessbarStatus(true);
        setPage(page);
        setReload(true);
    };

    const onChangeValueEmpleadoSearch = (e, value) => {
        progessbarStatus(true);
        setEmpleado(value);
        if (value) {
            if (hacienda) {
                setFilter(`&hacienda=${hacienda.id}&empleado=${value.id}`);
            } else {
                setFilter(`&empleado=${value.id}`);
            }
        } else {
            if (hacienda) {
                setFilter(`&hacienda=${hacienda.id}`);
            } else {
                setFilter('');
            }
        }
        setReload(true);
    };

    const onChangeValueHaciendaSearch = (e, value) => {
        progessbarStatus(true);
        setHacienda(value);
        if (value) {
            setFilter(`&hacienda=${value.id}`);
            setApiEmpleados(`${api_origen_empleados}?hacienda=${value.id}`)
        } else {
            setApiEmpleados(api_origen_empleados);
            setFilter('');
        }
        setReload(true);
    };

    const onChangeValueLaborSearch = (e, value) => {
        progessbarStatus(true);
        setLabor(value);
        if (value) {
            if (hacienda) {
                setFilter(`&hacienda=${hacienda.id}&labor=${value.id}`);
                setApiEmpleados(`${api_origen_empleados}?hacienda=${hacienda.id}&labor=${value.id}`)
            } else {
                setFilter(`&labor=${value.id}`);
                setApiEmpleados(`${api_origen_empleados}?labor=${value.id}`)
            }
        } else {
            setApiEmpleados(api_origen_empleados);
            if (hacienda) {
                setFilter(`&hacienda=${hacienda.id}`);
            } else {
                setFilter('');
            }
        }
        setReload(true);
    };

    return (
        <Container fluid className="mb-4">
            <SnackbarComponent
                notificacion={notificacion}
                setNotificacion={setNotificacion}
            />
            <Row>
                <Col className="mt-3 mb-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" to="/">
                            Bodega
                        </Link>
                        <Typography color="textPrimary">Egresos de bodega</Typography>
                    </Breadcrumbs>
                </Col>
            </Row>
            <Row className="mb-0 pb-0">
                <Col className="col-12 col-md-4 mb-3 p-0">
                    <ButtonGroup className="col-12">
                        <Button className="col-3" variant="danger" onClick={() => unFilter()}>
                            <i className="fas fa-sync fa-1x"/>
                        </Button>
                        <Button onClick={() => setOpenDrawer(true)} size="">
                            <i className="fas fa-filter fa-1x"/>
                        </Button>
                        <Button
                            variant="success"
                            className="align-self-end"
                            type="button"
                            onClick={() => history.push(`${history.location.pathname}/formulario`)}
                        >
                            <AddCircleIcon/> Nuevo despacho
                        </Button>
                    </ButtonGroup>
                    <TemporaryDrawer
                        openDrawer={openDrawer}
                        setOpenDrawer={setOpenDrawer}
                        setFilterCalendar={setFilter}
                        setReload={setReload}
                    />
                </Col>
            </Row>
            <hr className="mt-0 pt-0"/>
            <Row>
                <Col className="col-12 col-md-12">
                    <form>
                        <Row>
                            <Col md={5} className="">
                                <FormGroup>
                                    <InputSearch
                                        id="asynchronous-hacienda"
                                        label="Listado de Haciendas"
                                        api_url={api_haciendas}
                                        onChangeValue={onChangeValueHaciendaSearch}
                                        value={hacienda}
                                        disabled={!!(credential && credential.idhacienda)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col className="" md={3}>
                                <FormGroup>
                                    <InputSearch
                                        id="asynchronous-labor"
                                        label="Listado de labores"
                                        api_url={api_labores}
                                        onChangeValue={onChangeValueLaborSearch}
                                        value={labor}
                                    />
                                </FormGroup>
                            </Col>
                            <Col className="" md={4}>
                                <FormGroup>
                                    <InputSearch
                                        id="asynchronous-empleado"
                                        label="Listado de empleados"
                                        api_url={api_empleados}
                                        setSearch={setSearchEmpleado}
                                        onChangeValue={onChangeValueEmpleadoSearch}
                                        value={empleado}
                                        setChangeURL={setChangeURL}
                                    />
                                    <FormHelperText id="outlined-weight-helper-text">
                                        Puede filtrar los empleados por nombre o numero de cedula
                                    </FormHelperText>
                                </FormGroup>
                            </Col>
                        </Row>
                    </form>
                </Col>
                {/*<Col md={3}>
                    <DatePicker
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                </Col>*/}
            </Row>
            <TablaCabecera
                egresos={egresos}
                onChangePage={onChangePage}
            >
                {egresos.hasOwnProperty('dataArray') &&
                <TablaDetalle
                    history={history}
                    data={egresos.dataArray.data}
                />}
            </TablaCabecera>
            {/*<ApexChart/>*/}
        </Container>
    );
}

function TablaCabecera(props) {
    const {egresos, onChangePage, children} = props;
    return (
        <TableForm
            dataAPI={egresos}
            onChangePage={onChangePage}
            columns={['#', 'Calendario', 'Periodo', 'Semana', 'Empleado', 'Labor', 'Ult. Act.', 'Estado', 'Accion']}
            pageSize={7}
        >
            {children}
        </TableForm>
    )
}

function TablaDetalle(props) {
    const {data, history} = props;
    return (
        <>
            {data.length > 0 && data.map((data, index) =>
                <tr key={index} className="table-sm" style={{minHeight: "0 auto"}}>
                    <td className="text-center" width="4%">{index + 1}</td>
                    <td className="text-center" width="8%">
                        <Badge variant="light">
                            {data.idcalendario}
                        </Badge>
                    </td>
                    <td className="text-center" width="7%">
                        <small>
                            <b>{data.periodo}</b>
                        </small>
                    </td>
                    <td className="text-center" width="7%">
                        <small>
                            <b>{data.semana}</b>
                        </small>
                    </td>
                    <td>{" "}{data.egreso_empleado.nombres}</td>
                    <td className="text-center" width="10%">
                        <small>
                            <b>{data.egreso_empleado.labor.descripcion}</b>
                        </small>
                    </td>
                    <td className="text-center" width="16%">
                        <small>
                            <b>
                                <UpdateIcon/>
                                {moment(data.updated_at).fromNow()}
                            </b>
                        </small>
                    </td>
                    <td className="text-center" width="5%">
                        {+data.estado === 1 ?
                            (<Badge variant="success">A</Badge>)
                            :
                            (<Badge variant="danger">I</Badge>)
                        }
                    </td>
                    <td className="text-center" width="9%">
                        {+data.estado === 1 ?
                            <ButtonGroup size="sm">
                                {/*<Button variant="info">
                                <VisibilityIcon/>
                            </Button>*/}
                                <Button
                                    variant="primary"
                                    onClick={() => history.push({
                                        pathname: `${history.location.pathname}/formulario/${data.id}`,
                                        state: {idTransaccion: data.id}
                                    })}
                                >
                                    <SyncIcon/>
                                </Button>
                                <Button variant="danger">
                                    <DeleteIcon/>
                                </Button>
                            </ButtonGroup>
                            :
                            <button className="btn btn-info">
                                <i className="fas fa-lock"/>
                            </button>
                        }
                    </td>
                </tr>
            )}
        </>
    )
}
