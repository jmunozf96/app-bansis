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

    if (!lotes) {
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        );
    }

    return (
        <Container fluid className="mb-5">
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
                <Col className="col-12 col-md-2 mb-3 p-0">
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
            columns={['#', 'Hacienda', 'Lote', 'Has.', 'Coord.X', 'Coord.Y', 'Ult. Act.', 'Estado', 'Accion']}
            pageSize={7}
        >
            {children}
        </TableForm>
    )
}

function TableDetalle(props) {
    const {data, history, onDelete} = props;
    return (
        <>
            {data.length > 0 && data.map((data, index) =>
                <tr key={data.id}>
                    <td className="text-center">{index + 1}</td>
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
                    <td className="text-center" width="14%">
                        <small><b><RoomIcon style={{color: "#1A4BAE"}}/> {parseFloat(data.longitud)}</b></small>
                    </td>
                    <td className="text-center" width="14%">
                        <small><b><RoomIcon style={{color: "#E54C4C"}}/> {parseFloat(data.latitud)}</b></small>
                    </td>
                    <td className="text-center">
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
                            <Button
                                variant="warning"
                                onClick={() => history.push(`/hacienda/lote/formulario/${data.id}`)}
                            >
                                <ShareIcon/>
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
