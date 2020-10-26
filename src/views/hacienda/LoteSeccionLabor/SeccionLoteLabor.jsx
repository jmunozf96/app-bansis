import React, {useEffect, useState} from "react";
import {Badge, Button, ButtonGroup, Col, Container, FormGroup, Row} from "react-bootstrap";
import AlertDialog from "../../../components/AlertDialog/AlertDialog";
import SnackbarComponent from "../../../components/Snackbar/Snackbar";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import InputSearch from "../../../components/InputSearch/InputSearch";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../../actions/progressActions";
import {API_LINK} from "../../../constants/helpers";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Typography from "@material-ui/core/Typography";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableForm from "../../../components/Table/Table";
import UpdateIcon from "@material-ui/icons/Update";
import SyncIcon from "@material-ui/icons/Sync";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import 'moment/locale/es';
import ModalForm from "../../../components/ModalForm";

export default function SeccionLoteLabor() {
    const [notificacion, setNotificacion] = useState({
        open: false,
        message: ''
    });

    const [loadData, setLoadData] = useState(true);
    const [seccionLaborEmpleado, setSeccionLaborEmpleado] = useState(null);
    const [page, setPage] = useState(1);
    const [reload, setReload] = useState(true);
    const [filter, setFilter] = useState("");

    const api_haciendas = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const [hacienda, setHacienda] = useState(null);

    //Variable para abrir y cerrar el modal para eliminar el registro
    const [openModal, setOpenModal] = useState(false);
    //Variable para enviar datos al modal
    const [dataModal, setDataModal] = useState(null);

    //Variable para abrir y cerrar el modal para ver las distribuciones del empleado por labor
    const [openDistribucion, setOpenDistribucion] = useState(false);
    const [dataDistirbucion, setDataDistribucion] = useState(null);

    const history = useHistory();
    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));
    const authentication = useSelector((state) => state.login.token);

    useEffect(() => {
        if (reload) {
            (async () => {
                const progessbarStatus = (state) => dispatch(progressActions(state));
                await progessbarStatus(true);
                const api_lotes = `${API_LINK}/bansis-app/index.php/lote-seccion-labor?page=${page}${filter}`;
                const response = await fetch(api_lotes).then(
                    (response) => response.json()
                );
                await progessbarStatus(false);
                if (response.code === 200) {
                    setSeccionLaborEmpleado(response);
                } else {
                    setSeccionLaborEmpleado(null);
                    setNotificacion({open: true, message: response.message});
                    //No se encontraron datos
                }
                setLoadData(false);
            })();
            setReload(false);
        }
    }, [reload, page, dispatch, filter]);

    const onChangeValueHaciendaSearch = (e, value) => {
        setHacienda(value);
        if (value) {
            setFilter(`&hacienda=${value.id}`);
        } else {
            setFilter('');
        }
        setReload(true);
    };

    const onChangePage = (page) => {
        progessbarStatus(true);
        setPage(page);
        setReload(true);
    };

    const showModalDistribuciones = (data) => {
        setOpenDistribucion(true);
        setDataDistribucion(data);
    };

    const onDelete = (data) => {
        progessbarStatus(true);
        setOpenModal(true);
        setDataModal({
            title: `Empleado: ${data.empleado.nombres} - Labor: ${data.labor.descripcion}`,
            content: '¿Esta seguro de eliminar el registro?, de ser afirmativo se eliminara de la base de datos.',
            id: data.id
        })
    };

    const destroyData = (id) => {
        progessbarStatus(true);
        (async () => {
            try {
                (async () => {
                    const url = `${API_LINK}/bansis-app/index.php/lote-seccion-labor/${id}`;
                    const configuracion = {
                        method: 'DELETE',
                        headers: {authorization: authentication}
                    };
                    const response = await fetch(url, configuracion).then(
                        (response) => response.json()
                    );
                    const {code, message} = response;
                    if (code === 200) {
                        setReload(true);
                    }
                    setNotificacion({
                        open: true,
                        message
                    });
                    progessbarStatus(false);
                    setOpenModal(false);
                })();
            } catch (e) {
                console.log(e)
            }
        })()
    };

    if (!seccionLaborEmpleado && loadData) {
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        );
    }

    return (
        <Container fluid className="mb-5">
            <DetailDistribucion
                open={openDistribucion}
                setOpen={setOpenDistribucion}
                data={dataDistirbucion}
                setData={setDataDistribucion}
            />
            {
                openModal &&
                <AlertDialog
                    title={dataModal.title}
                    content={dataModal.content}
                    open={openModal}
                    setOpen={setOpenModal}
                    actionDestroy={destroyData}
                    id={dataModal.id}
                />
            }
            <SnackbarComponent
                notificacion={notificacion}
                setNotificacion={setNotificacion}
            />
            <Row>
                <Col className="mt-3 mb-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" to="/">
                            Hacienda
                        </Link>
                        <Typography color="textPrimary">Lote</Typography>
                    </Breadcrumbs>
                </Col>
            </Row>
            <Row className="mb-0 pb-0">
                <Col className="col-12 col-md-5 mb-3 p-0">
                    <ButtonGroup className="col-12">
                        <Button className="" variant="danger">
                            <i className="fas fa-sync fa-1x"/>
                        </Button>
                        <Button
                            variant="success"
                            className="align-self-end col-10"
                            type="button"
                            onClick={() => history.push(`${history.location.pathname}/formulario`)}
                        >
                            <AddCircleIcon/> Nueva Seccion para labor de Empleado
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <hr className="mt-0"/>
            <Row>
                <Col md={5} className="">
                    <FormGroup>
                        <InputSearch
                            id="asynchronous-hacienda"
                            label="Listado de Haciendas"
                            api_url={api_haciendas}
                            onChangeValue={onChangeValueHaciendaSearch}
                            value={hacienda}
                        />
                    </FormGroup>
                </Col>
            </Row>
            {seccionLaborEmpleado &&
            <TableCabecera
                data={seccionLaborEmpleado}
                onChangePage={onChangePage}
            >
                <TableDetalle
                    history={history}
                    data={seccionLaborEmpleado.dataArray.data}
                    onDelete={onDelete}
                    showModalDistribuciones={showModalDistribuciones}
                />
            </TableCabecera>
            }
        </Container>
    );
}

function TableCabecera(props) {
    const {data, onChangePage, children} = props;
    return (
        <TableForm
            dataAPI={data}
            onChangePage={onChangePage}
            columns={['Hacienda', 'Empleado', 'Labor', 'Has.', 'Distribucion', 'Ult. Act.', 'Estado', 'Accion']}
            pageSize={7}
        >
            {children}
        </TableForm>
    )
}

function TableDetalle(props) {
    const {data, history, onDelete, showModalDistribuciones} = props;
    return (
        <>
            {data.length > 0 && data.map((data, index) =>
                <tr key={data.id}>
                    <td className="text-center" width="25%">
                        <small>{data.empleado.hacienda.detalle}</small>
                    </td>
                    <td className="text-center" width="17%">
                        <small>{data.empleado.nombres}</small>
                    </td>
                    <td className="text-center" width="8%">
                        <b><small>{data.labor.descripcion}</small></b>
                    </td>
                    <td className="text-center" width="5%">
                        <Badge variant="dark">
                            {parseFloat(data.has).toFixed(2)}
                        </Badge>
                    </td>
                    <td className="text-center" width="15%">
                        <button
                            className={`btn btn-${data['detalle_seccion_labor'].length === 0 ? 'danger' : 'primary'}`}
                            onClick={() => showModalDistribuciones(data)}
                        >
                            <i className={`fas fa-${data['detalle_seccion_labor'].length === 0 ? 'eye-slash' : 'eye'}`}/>
                            {" "} Secciones
                            {" "} <span className="badge badge-light">{data['detalle_seccion_labor'].length}</span>
                        </button>
                    </td>
                    <td className="text-center" width="15%">
                        <small>
                            <b>
                                <UpdateIcon/>
                                {moment(data['updated_at']).fromNow()}
                            </b>
                        </small>
                    </td>
                    <td className="text-center" width="5%">
                        {data['estado'] === "1" ?
                            (<Badge variant="success">A</Badge>)
                            :
                            (<Badge variant="danger">I</Badge>)
                        }
                    </td>
                    <td className="text-center" width="10%">
                        <ButtonGroup size="sm">
                            {/*<Button variant="info">
                                <VisibilityIcon/>
                            </Button>*/}
                            <Button
                                variant="primary"
                                onClick={() => history.push(`${history.location.pathname}/formulario/${data.id}`)}
                            >
                                <SyncIcon/>
                            </Button>
                            <Button variant="danger"
                                    onClick={() => onDelete(data)}
                            >
                                <DeleteIcon/>
                            </Button>
                        </ButtonGroup>
                    </td>
                </tr>
            )}
        </>
    )
}

function DetailDistribucion(props) {
    const {open, setOpen, data, setData} = props;
    const history = useHistory();

    if (!data) {
        return (<></>);
    }

    const {id, empleado: {nombres}, labor: {descripcion}, has, detalle_seccion_labor} = data;

    const cancelar = () => {
        setOpen(false);
        setData(null);
    };

    return (
        <>
            <ModalForm
                show={open}
                animation={true}
                icon="fas fa-map-pin"
                title={`Detalles del empleado ${nombres} - Labor: ${descripcion} - ${parseFloat(has).toFixed(2)} has.`}
                backdrop="static"
                size="lg"
                centered={true}
                scrollable={true}
                save={() => null}
                cancel={cancelar}
            >
                <div className="row">
                    <div className="col-12">
                        <button
                            className="btn btn-primary btn-block"
                            onClick={() => history.push(`${history.location.pathname}/formulario/${id}`)}
                        >
                            <i className="fas fa-external-link-alt"/> Ir al formulario de distribucion
                        </button>
                    </div>
                    {detalle_seccion_labor.length === 0 ?
                        <div className="text-center pt-5 pl-2 pr-2 col-12">
                            <i className="fas fa-sad-tear fa-10x"/><br/>
                            <h5 className="mt-3">No tiene distribuciones.</h5>
                        </div>
                        :

                        <div className="col-12 mt-3 table-responsive">
                            <table className="table table-hover text-center table-bordered">
                                <thead>
                                <tr>
                                    <th>Lote</th>
                                    <th>Has Lote.</th>
                                    <th>Has Asign.</th>
                                    <th>Estado</th>
                                </tr>
                                </thead>
                                <tbody>
                                {detalle_seccion_labor.map((item, index) => (
                                    <tr key={item.id}
                                        style={{backgroundColor: `${item['estado'] !== "1" ? "#FFCCCC" : ""}`}}>
                                        <td><b>{item['seccion_lote']['alias']}</b></td>
                                        <td>{parseFloat(item['seccion_lote']['has']).toFixed(2)}</td>
                                        <td><b>{parseFloat(item['has']).toFixed(2)}</b></td>
                                        <td>{item['estado'] === "1" ? 'A' : 'I'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </ModalForm>
        </>
    );
}
