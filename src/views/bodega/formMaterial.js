import React, {useEffect, useState} from "react";
import {Alert, Button, ButtonGroup, Card, Col, Container, Row} from "react-bootstrap";
import {API_LINK, API_XASS_PRIMO, _saveApi, _configStoreApi, API_XASS_SOFCA} from "../../constants/helpers";

import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../actions/progressActions";

import InputSearch from "../../components/Tools/InputSearch";
import SimpleTableUI from "../../components/Tools/TableUI";
import ConfirmationDialog from "../../components/Tools/ConfirmationDialog";
import SnackbarComponent from "../../components/Tools/Snackbar";

import {TableCell, TableRow} from "@material-ui/core";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn';
import ListIcon from '@material-ui/icons/List';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import WarningIcon from '@material-ui/icons/Warning';
import AutorenewIcon from '@material-ui/icons/Autorenew';

import qs from 'qs';
import {Link, useHistory, useParams} from "react-router-dom";

export default function FormMaterial() {
    const {idmodulo} = useParams();
    const [haciendaOrigen, setHaciendaOrigen] = useState('');
    const [openDialogHaciendaOrigenDatos, setOpenDialogHaciendaOrigenDatos] = useState(true);
    const [dataApiHaciendaOrigen, setDataApiHaciendaOrigen] = useState(false);

    const [search, setSearch] = useState('');
    const [cellar, setCellar] = useState(0);
    const [group, setGroup] = useState(0);

    const [api_busquedaPrincipal, setApi_busquedaPrincipal] = useState('');
    const [api_url, setApi_Url] = useState('');

    const [grupoPadre, setGrupoPadre] = useState(null);
    const [grupo, setGrupo] = useState(null);
    const [bodega, setBodega] = useState(null);
    const [articulo, setArticulo] = useState(null);

    const [articuloBodega, setArticuloBodega] = useState('');
    const [articuloGrupo, setArticuloGrupo] = useState('');
    const [openDialogBodega, setOpenDialogBodega] = useState(false);
    const [openDialogGrupo, setOpenDialogGrupo] = useState(false);
    const [changeSelect, setChangeSelect] = useState(false);
    const [api_grupoChildren, setApi_GrupoChildren] = useState('');
    const [disabledSelectGrupoChildren, setDisabledSelectGrupoChildren] = useState(true);

    const [newArticulo, setNewArticulo] = useState(null);
    const [arrayArticulosNew, setArrayArticulosNew] = useState([]);
    const [errorsStoreArticles, setErrorsStoreArticles] = useState([]);


    const [notificacion, setNotificacion] = useState({
        open: false,
        message: ''
    });

    const history = useHistory();
    const dispatch = useDispatch();
    const progressbarStatus = (state) => dispatch(progressActions(state));
    const authentication = useSelector((state) => state.login.token);

    useEffect(() => {
        if (dataApiHaciendaOrigen) {
            if (haciendaOrigen[0].id === 1) {
                //En caso de ser primobanano
                setApi_busquedaPrincipal(`${API_XASS_PRIMO}`);
                setApi_Url(`${API_XASS_PRIMO}/productos`);
            } else {
                //En caso de ser Sofca
                setApi_busquedaPrincipal(`${API_XASS_SOFCA}`);
                setApi_Url(`${API_XASS_SOFCA}/productos`);
            }
            setDataApiHaciendaOrigen(false);
        }
    }, [dataApiHaciendaOrigen, api_busquedaPrincipal, haciendaOrigen, setApi_Url]);

    //Cada que se cambie un valor en los select se actualiza la api de consulta para el articulo
    useEffect(() => {
        if (changeSelect || search !== '') {
            setApi_Url(`${api_busquedaPrincipal}/productos?search=${search}&cellar=${cellar}&group=${group}&size=5`);
            setChangeSelect(false);
        }
    }, [api_busquedaPrincipal, changeSelect, search, cellar, group]);

    //Para agregar articulos al array
    useEffect(() => {
        if (newArticulo !== null) {
            setArrayArticulosNew([
                ...arrayArticulosNew,
                newArticulo
            ]);
            setNewArticulo(null);
        }
    }, [setArrayArticulosNew, newArticulo, setNewArticulo, arrayArticulosNew]);

    const cancelOrigenDatos = () => {
        if (openDialogHaciendaOrigenDatos) {
            setOpenDialogHaciendaOrigenDatos(true);
        }
        history.goBack();
    };

    const onCloseDialogHaciendaOrigenDatos = () => {
        if (haciendaOrigen === '') {
            setNotificacion({open: true, message: 'Debe seleccionar un origen de datos'});
        } else {
            setOpenDialogHaciendaOrigenDatos(false);
            setDataApiHaciendaOrigen(true);
        }
    };

    if (openDialogHaciendaOrigenDatos || haciendaOrigen === '') {
        return (
            <>
                <SnackbarComponent
                    notificacion={notificacion}
                    setNotificacion={setNotificacion}
                />
                <ConfirmationDialog
                    title="Seleccione origen de Datos"
                    api={`${API_LINK}/bansis-app/custom.php/haciendas/option`}
                    setValue={setHaciendaOrigen}
                    open={openDialogHaciendaOrigenDatos}
                    onClose={onCloseDialogHaciendaOrigenDatos}
                    cancelDialog={cancelOrigenDatos}
                />
            </>
        );
    }

    const onChangeValueArticulo = (e, value) => {
        if (value) {
            setArticulo(value);
        } else {
            setArticulo(null);
        }
        setSearch('');
        setChangeSelect(true);
    };

    const addItemtoList = () => {
        if (articulo) {
            setArticuloBodega('');
            setArticuloGrupo('');
            setOpenDialogBodega(true);
        } else {
            setNotificacion({open: true, message: "Debe seleccionar un articulo"});
        }
    };

    const cancelDialog = () => {
        if (!openDialogBodega) {
            setArticuloBodega('');
            setArticuloGrupo('');
            setOpenDialogGrupo(false);
        }
        setOpenDialogBodega(false);
    };

    const onCloseDialogBodega = () => {
        if (articuloBodega[0].hacienda.id === haciendaOrigen[0].id) {
            if (articuloBodega) {
                setOpenDialogBodega(false);
                setOpenDialogGrupo(true);
            } else {
                setNotificacion({open: true, message: "Seleccione una opcion para continuar."});
            }
        } else {
            setNotificacion({
                open: true,
                message: "La bodega pertenece a una hacienda diferente a la del origen de datos.."
            });
        }
    };

    const onCloseDialogGrupo = () => {
        if (articuloGrupo) {
            setOpenDialogGrupo(false);
            addArticle();
        } else {
            setNotificacion({open: true, message: "Seleccione una opcion para continuar."});
        }
    };

    const addArticle = () => {
        //Aqui el codigo para añadir datos al array
        const item = {
            codigo: articulo.codigo,
            nombre: articulo.nombre,
            bodega: articuloBodega,
            grupo: articuloGrupo,
            stock: articulo.stock
        };
        if (existsMaterial(item).length === 0) {
            setNewArticulo(item);
        } else {
            setNotificacion({open: true, message: "Este item ya ha sido agregado a la lista"});
        }
    };

    const existsMaterial = (articulo) => {
        if (articulo)
            return arrayArticulosNew.filter((item) =>
                articulo.codigo === item.codigo && articulo.bodega[0].id === item.bodega[0].id && articulo.grupo[0].id === item.grupo[0].id);

        return false;
    };

    const deleteMaterial = articulo => {
        if (articulo) {
            const nuevosItems = arrayArticulosNew.filter((item) =>
                articulo.codigo !== item.codigo || articulo.bodega[0].id !== item.bodega[0].id || articulo.grupo[0].id !== item.grupo[0].id);
            setArrayArticulosNew(nuevosItems);
            setNotificacion({open: true, message: "Item eliminado correctamente!"});
        } else {
            setNotificacion({open: true, message: "No se puede eliminar el registro"});
        }
    };

    const onNewTransaction = () => {
        setErrorsStoreArticles([]);
        setArrayArticulosNew([]);
        setArticulo(null);
        setBodega(null);
        setGrupo(null);
        setGrupoPadre(null);
        setDisabledSelectGrupoChildren(true);
    };

    const onSaveTransaction = () => {
        if (arrayArticulosNew.length > 0) {
            (async () => {
                try {
                    await progressbarStatus(true);
                    const url = `${API_LINK}/bansis-app/index.php/materiales`;
                    const data = qs.stringify({
                        json:
                            JSON.stringify({articles: arrayArticulosNew})
                    });
                    const configuracion = _configStoreApi('POST', url, data, progressbarStatus, authentication);
                    const request = await _saveApi(configuracion);
                    if (request.code === 200) {
                        await setNotificacion({
                            open: true,
                            message: request.message
                        });
                        //Eliminamos la lista de articulos
                        setArrayArticulosNew([]);
                        if (request.status_error) {
                            await setArrayArticulosNew(request.error_objects);
                            await setErrorsStoreArticles(request.errors);
                        }
                    }
                } catch (e) {
                    console.error(e)
                }
            })();
        } else {
            setNotificacion({
                open: true,
                message: "No hay elementos en lista para guardar, por favor agregue uno o mas elementos a la lista."
            })
        }
    };

    return (
        <Container className="mb-3" fluid style={{marginTop: "4rem"}}>
            <SnackbarComponent
                notificacion={notificacion}
                setNotificacion={setNotificacion}
            />
            <ConfirmationDialog
                title="Seleccione bodega a transferir"
                api={`${API_LINK}/bansis-app/custom.php/bodegas/option`}
                setValue={setArticuloBodega}
                open={openDialogBodega}
                onClose={onCloseDialogBodega}
                cancelDialog={cancelDialog}
            />
            <ConfirmationDialog
                title="Seleccione un grupo"
                api={`${API_LINK}/bansis-app/custom.php/bodegas/grupos/option`}
                setValue={setArticuloGrupo}
                open={openDialogGrupo}
                onClose={onCloseDialogGrupo}
                cancelDialog={cancelDialog}
            />
            <Card>
                <Card.Header>
                    <ListIcon/> Formulario de registro de materiales
                </Card.Header>
                <Card.Body>
                    <Row className="mb-2">
                        <Col md={12}>
                            <Row className="align-content-between">
                                <Col className="mb-3" md={4}>
                                    <GrupoPadre
                                        setChangeSelect={setChangeSelect}
                                        grupoPadre={grupoPadre}
                                        setGrupoPadre={setGrupoPadre}
                                        setGrupo={setGrupo} setGroup={setGroup} setArticulo={setArticulo}
                                        setApi_GrupoChildren={setApi_GrupoChildren}
                                        setDisabledSelectGrupoChildren={setDisabledSelectGrupoChildren}
                                        api_busquedaPrincipal={api_busquedaPrincipal}
                                    />
                                </Col>
                                <Col className="mb-3" md={3}>
                                    <GrupoHijo
                                        setChangeSelect={setChangeSelect}
                                        grupo={grupo} setGrupo={setGrupo} setGroup={setGroup} setArticulo={setArticulo}
                                        api_grupoChildren={api_grupoChildren}
                                        disabledSelectGrupoChildren={disabledSelectGrupoChildren}
                                    />
                                </Col>
                                <Col className="mb-3" md={5}>
                                    <BodegaAutocomplete
                                        bodega={bodega}
                                        setArticulo={setArticulo}
                                        setBodega={setBodega}
                                        setCellar={setCellar}
                                        setChangeSelect={setChangeSelect}
                                        api_busquedaPrincipal={api_busquedaPrincipal}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={10}>
                                    <InputSearch
                                        id="asynchronous-articulo"
                                        label="Buscar articulo"
                                        api_url={api_url}
                                        setSearch={setSearch}
                                        onChangeValue={onChangeValueArticulo}
                                        disabled={false}
                                        setChangeURL={setChangeSelect}
                                        value={articulo}
                                    />
                                    <small>Buscar un articulo del inventario de XASS para agregar a las bodegas.</small>
                                </Col>
                                <Col>
                                    <Button type="button" className="" block
                                            variant="primary"
                                            onClick={() => addItemtoList()}>
                                        <PlaylistAddIcon/> Agregar
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={12}>
                            <Row>
                                {errorsStoreArticles.length > 0 &&
                                <Col md={12}>
                                    <hr/>
                                    <Alert variant="warning">
                                        <WarningIcon/> Se encontraron algunos errores:
                                        <ul className="m-0">
                                            {errorsStoreArticles.map((error, i) => <li key={i}>{error.message}</li>)}
                                        </ul>
                                    </Alert>
                                </Col>
                                }
                                <Col md={12}>
                                    <SimpleTableUI
                                        columns={['Nombre', 'Bodega', 'Grupo', 'Stock', 'Accion']}
                                    >
                                        {arrayArticulosNew &&
                                        arrayArticulosNew.map((row, index) => (
                                            <TableRow key={index} style={{whiteSpace: "nowrap", overflow: "scroll"}}>
                                                <TableCell>
                                                    {row.nombre}
                                                </TableCell>
                                                <TableCell align="center"><b>{row.bodega[0].descripcion}</b></TableCell>
                                                <TableCell align="center"><b>{row.grupo[0].descripcion}</b></TableCell>
                                                <TableCell align="center">{row.stock}</TableCell>
                                                <TableCell align="center" className="p-0">
                                                    <Button size={"sm"} variant={"danger"}
                                                            onClick={() => deleteMaterial(row)}>
                                                        <DeleteForeverIcon/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        }
                                    </SimpleTableUI>
                                    <small>Total de items agregados a la lista: {arrayArticulosNew.length}</small>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col md={6}/>
                        <Col md={6} className="">
                            <ButtonGroup size={"xs"} className="col-md-12 p-0">
                                <Button type="button" variant="primary" onClick={() => onNewTransaction()}>
                                    <AutorenewIcon/> Nuevo
                                </Button>
                                <Button type="button" variant="success" onClick={() => onSaveTransaction()}>
                                    <SaveAltIcon/> Guardar
                                </Button>
                                <Button as={Link} to={`/bodega/material/${idmodulo}`} variant="danger">
                                    <AssignmentReturnIcon/> Cancelar
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer/>
            </Card>
        </Container>
    );
}

function BodegaAutocomplete(props) {
    const {setChangeSelect, bodega, setBodega, setCellar, setArticulo, api_busquedaPrincipal} = props;
    const api_bodega = `${api_busquedaPrincipal}/bodegas`;

    const onChangeValueBodega = (e, value) => {
        if (value) {
            setBodega(value);
            setCellar(value.Id_Fila);
        } else {
            setBodega(null);
            setCellar(0);
        }
        setArticulo(null);
        setChangeSelect(true);
    };

    return (
        <InputSearch
            id="asynchronous-bodega"
            label="Filtrar por Bodega"
            api_url={api_bodega}
            onChangeValue={onChangeValueBodega}
            disabled={false}
            value={bodega}
        />
    );
}

function GrupoPadre(props) {
    //Cuando cambia el grupo padre se cargan los datos para el componente hijo
    const {
        setChangeSelect, grupoPadre,
        setGrupoPadre, setGrupo, setGroup, setArticulo,
        setApi_GrupoChildren, setDisabledSelectGrupoChildren,
        api_busquedaPrincipal
    } = props;
    const api_grupo = `${api_busquedaPrincipal}/grupo/padre`;

    const onChangeValueGrupo = (e, value) => {
        if (value) {
            setGrupoPadre(value);
            setApi_GrupoChildren(`${api_busquedaPrincipal}/grupo/hijo/${value.Codigo}`);
            setDisabledSelectGrupoChildren(false);
        } else {
            setApi_GrupoChildren('');
            setDisabledSelectGrupoChildren(true);
            setGrupoPadre(null);
            setGrupo(null);
            setGroup(0);
        }
        setArticulo(null);
        setChangeSelect(true);
    };

    return (
        <InputSearch
            id="asynchronous-group"
            label="Filtrar por Padre"
            api_url={api_grupo}
            onChangeValue={onChangeValueGrupo}
            disabled={false}
            value={grupoPadre}
        />
    );
}

function GrupoHijo(props) {
    const {
        setChangeSelect,
        grupo, setGrupo, setGroup, setArticulo,
        api_grupoChildren, disabledSelectGrupoChildren
    } = props;
    const onChangeValueGrupoChildren = (e, value) => {
        if (value) {
            setGrupo(value);
            setGroup(value.Codigo);
        } else {
            setGrupo(null);
            setGroup(0);
        }
        setArticulo(null);
        setChangeSelect(true);
    };

    return (
        <InputSearch
            id="asynchronous-group-children"
            label="Filtrar por Grupo Hijo"
            api_url={api_grupoChildren}
            onChangeValue={onChangeValueGrupoChildren}
            disabled={disabledSelectGrupoChildren}
            value={grupo}
        />
    );
}
