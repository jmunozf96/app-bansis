import React, {useEffect, useState} from "react";
import {Badge, Button, ButtonGroup, Col, Container, FormGroup, Row} from "react-bootstrap";
import SnackbarComponent from "../../../components/Snackbar/Snackbar";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Backdrop from "@material-ui/core/Backdrop";
import Typography from "@material-ui/core/Typography";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {useHistory} from "react-router-dom";
import TableForm from "../../../components/Table/Table";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../../actions/progressActions";
import {API_LINK} from "../../../utils/constants";
import moment from "moment";
import UpdateIcon from "@material-ui/icons/Update";
import SyncIcon from "@material-ui/icons/Sync";
import DeleteIcon from "@material-ui/icons/Delete";
import RoomIcon from '@material-ui/icons/Room';
import CircularProgress from "@material-ui/core/CircularProgress";
import AlertDialog from "../../../components/AlertDialog/AlertDialog";
import InputSearch from "../../../components/InputSearch/InputSearch";
import ShareIcon from '@material-ui/icons/Share';
import ModalForm from "../../../components/ModalForm";

export default function Lote() {
    const [notificacion, setNotificacion] = useState({
        open: false,
        message: ''
    });
    const [lotes, setLotes] = useState(null);
    const [page, setPage] = useState(1);
    const [reload, setReload] = useState(true);
    const [filter, setFilter] = useState("");

    const api_haciendas = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const [hacienda, setHacienda] = useState(null);

    //Variable para abrir y cerrar el modal para eliminar el registro
    const [openModal, setOpenModal] = useState(false);
    //Variable para enviar datos al modal
    const [dataModal, setDataModal] = useState(null);

    //Variable para abrir y cerrar el modal para ver las distribuciones del lote
    const [openDistribucion, setOpenDistribucion] = useState(false);
    const [dataLote, setDataLote] = useState(null);

    const history = useHistory();
    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));
    const authentication = useSelector((state) => state.auth._token);

    useEffect(() => {
        if (reload) {
            (async () => {
                const progessbarStatus = (state) => dispatch(progressActions(state));
                const api_lotes = `${API_LINK}/bansis-app/index.php/lote?page=${page}${filter}`;
                const response = await fetch(api_lotes).then(
                    (response) => response.json()
                );
                if (response.code === 200) {
                    setLotes(response);
                } else {
                    if (Object.entries(lotes).length === 0) {
                        const {code} = response;
                        setLotes({code});
                    }
                    setNotificacion({open: true, message: response.message})
                }
                progessbarStatus(false);
            })();
            setReload(false);
        }
    }, [reload, page, dispatch, lotes, filter]);

    const onChangePage = (page) => {
        progessbarStatus(true);
        setPage(page);
        setReload(true);
    };

    const onChangeValueHaciendaSearch = (e, value) => {
        progessbarStatus(true);
        setHacienda(value);
        if (value) {
            setFilter(`&hacienda=${value.id}`);
        } else {
            setFilter('');
        }
        setReload(true);
    };

    const onDelete = (lote) => {
        progessbarStatus(true);
        setOpenModal(true);
        setDataModal({
            title: `Lote: ${lote.identificacion} - Hacienda: ${lote.hacienda.detalle}`,
            content: '¿Esta seguro de eliminar el registo?, de ser afirmativo se eliminara de la base de datos el registro seleccionado.',
            id: lote.id
        })
    };

    const destroyData = (id) => {
        progessbarStatus(true);
        (async () => {
            try {
                (async () => {
                    const url = `${API_LINK}/bansis-app/index.php/lote/${id}`;
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
                        code,
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

    const showModalDistribuciones = (data) => {
        setOpenDistribucion(true);
        setDataLote(data);
    };

    if (!lotes) {
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
                data={dataLote}
                setData={setDataLote}
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
                <Col className="col-12 col-md-4 mb-3 p-0">
                    <ButtonGroup className="col-12">
                        <Button className="" variant="danger">
                            <i className="fas fa-sync fa-1x"/>
                        </Button>
                        <Button
                            variant="success"
                            className="align-self-end"
                            type="button"
                            onClick={() => history.push("/hacienda/lote/formulario")}
                        >
                            <AddCircleIcon/> Nuevo Lote
                        </Button>
                        <Button
                            variant="primary"
                            className="align-self-end"
                            type="button"
                            onClick={() => history.push("/hacienda/lote/seccion/formulario")}
                        >
                            <AddCircleIcon/> Nueva Distribucion
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
            {lotes &&
            <TableCabecera
                lotes={lotes}
                onChangePage={onChangePage}
            >
                <TableDetalle
                    history={history}
                    data={lotes.dataArray.data}
                    onDelete={onDelete}
                    showModalDistribuciones={showModalDistribuciones}
                />
            </TableCabecera>
            }
        </Container>
    );
}

function TableCabecera(props) {
    const {lotes, onChangePage, children} = props;
    return (
        <TableForm
            dataAPI={lotes}
            onChangePage={onChangePage}
            columns={['#', 'Hacienda', 'Lote', 'Has.', 'Distribucion', 'Ult. Act.', 'Estado', 'Accion']}
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
                    <td className="text-center" width="5%">{index + 1}</td>
                    <td className="text-center" width="28%">
                        <i className="fas fa-map-marked-alt"/> <small>{data.hacienda.detalle}</small>
                    </td>
                    <td className="text-center" width="5%">
                        {data.identificacion}
                    </td>
                    <td className="text-center" width="5%">
                        <Badge variant="dark">
                            {parseFloat(data.has)}
                        </Badge>
                    </td>
                    <td className="text-center" width="15%">
                        <button
                            className={`btn btn-${data.secciones.length === 0 ? 'danger' : 'success'}`}
                            onClick={() => showModalDistribuciones(data)}
                        >
                            <i className={`fas fa-${data.secciones.length === 0 ? 'eye-slash' : 'eye'}`}/>
                            {" "} Secciones
                            {" "} <span className="badge badge-light">{data.secciones.length}</span>
                        </button>
                    </td>
                    <td className="text-center" width="15%">
                        <small>
                            <b>
                                <UpdateIcon/>
                                {moment(data.updated_at).fromNow()}
                            </b>
                        </small>
                    </td>
                    <td className="text-center" width="5%">
                        {data.estado ?
                            (<Badge variant="success">A</Badge>)
                            :
                            (<Badge variant="danger">I</Badge>)
                        }
                    </td>
                    <td className="text-center" width="12%">
                        <ButtonGroup size="sm">
                            {/*<Button variant="info">
                                <VisibilityIcon/>
                            </Button>*/}
                            <Button
                                variant="primary"
                                onClick={() => history.push(`/hacienda/lote/formulario/${data.id}`)}
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

    const {id, identificacion, has, hacienda, secciones} = data;
    const cancelar = () => {
        setOpen(false);
        setData(null);
    };

    const totalizar = () => {
        const secciones_activas = secciones.filter((seccion) => (seccion['estado'] === "1"));
        return secciones_activas.reduce((total, seccion) => +total + +seccion.has, 0)
    };

    return (
        <>
            <ModalForm
                show={open}
                animation={true}
                icon="fas fa-map-pin"
                title={`Detalles del lote ${identificacion} - ${parseFloat(has).toFixed(2)} has.`}
                backdrop="static"
                size="xl"
                centered={true}
                scrollable={true}
                save={() => null}
                cancel={cancelar}
            >
                {secciones.length === 0 ?
                    <div className="text-center pt-5 pl-2 pr-2">
                        <i className="fas fa-sad-tear fa-10x"/><br/>
                        <h5 className="mt-3">No tiene distribuciones.</h5>
                    </div>
                    :
                    <div className="row">
                        <div className="col-12">
                            <button
                                className="btn btn-primary btn-block"
                                onClick={() => history.push(`/hacienda/lote/seccion/formulario/${id}`)}
                            >
                                <i className="fas fa-external-link-alt"/> Ir al formulario de distribucion
                            </button>
                        </div>
                        <div className="col-12 mt-3 table-responsive">
                            <table className="table table-hover text-center table-bordered">
                                <thead>
                                <tr>
                                    <th>Descripcion</th>
                                    <th>Has.</th>
                                    <th>Fecha Siemb.</th>
                                    <th>Edad</th>
                                    <th>Tipo Variedad</th>
                                    <th>Variedad</th>
                                    <th>Tipo Suelo</th>
                                    <th>Estado</th>
                                </tr>
                                </thead>
                                <tbody>
                                {secciones.map((item, index) => (
                                    <tr key={item.idDistribucion}  style={{backgroundColor: `${item['estado'] !== "1" ? "#FFCCCC" : ""}`}}>
                                        <td>{item['descripcion']}</td>
                                        <td>{parseFloat(item['has']).toFixed(2)}</td>
                                        <td>{moment(item['fecha_siembra']).format("DD/MM/YYYY")}</td>
                                        <td>{((moment().diff(moment(item['fecha_siembra']), 'days')) / 352).toFixed(0)}</td>
                                        <td>{item['tipo_variedad']}</td>
                                        <td>{item['variedad']}</td>
                                        <td>{item['tipo_suelo']}</td>
                                        <td>{item['estado'] === "1" ? 'A' : 'I'}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={4}>Hectareas
                                        distribuidas: <b>{parseFloat(totalizar()).toFixed(2)}</b></td>
                                    <td colSpan={4}>
                                        Hectareas disponibles: <b>{(parseFloat(has) - totalizar()).toFixed(2)}</b>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </ModalForm>
        </>
    );
}
