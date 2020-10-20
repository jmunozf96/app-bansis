import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, Card, Container} from "react-bootstrap";
import FormularioRegistro from "./formulario";

import AssignmentReturnIcon from "@material-ui/icons/AssignmentReturn";
import SaveIcon from "@material-ui/icons/Save";
import CreateIcon from '@material-ui/icons/Create';
import {Link, useHistory, useParams} from "react-router-dom";
import {_configStoreApi, _saveApi, API_LINK, focuselement} from "../../../../utils/constants";

import q from "qs";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../../../actions/progressActions";
import SnackbarComponent from "../../../../components/Snackbar/Snackbar";

export default function FormularioLote() {
    const {id, idmodulo} = useParams();
    const [loadLoteEdit, setLoadLoteEdit] = useState({
        load: id !== undefined,
        id
    });
    const [edit, setEdit] = useState(false);

    const [lote, setLote] = useState({
        hacienda: null,
        lote: '',
        has: 0,
        detalle: '',
        latitud: 0,
        longitud: 0
    });
    const [notificacion, setNotificacion] = useState({
        open: false,
        message: ''
    });
    const [reload, setReload] = useState(false);
    const [reloadMapa, setReloadMapa] = useState(false);

    const history = useHistory();
    const dispatch = useDispatch();
    const progressBarStatus = (state) => dispatch(progressActions(state));
    const authentication = useSelector((state) => state.login.token);

    useEffect(() => {
        if (loadLoteEdit.load) {
            (async () => {
                const api = `${API_LINK}/bansis-app/index.php/lote/${loadLoteEdit.id}`;
                const request = await fetch(api).then(
                    (response) => response.json()
                );
                const {code} = request;
                if (code === 200) {
                    const {lote: {hacienda, identificacion, has, descripcion, latitud, longitud}} = request;
                    setLote({
                        ...lote,
                        hacienda,
                        lote: identificacion,
                        has: parseFloat(has),
                        detalle: descripcion,
                        latitud,
                        longitud
                    });
                    setReloadMapa(true);
                    setEdit(true);
                }
            })();
            setLoadLoteEdit({...loadLoteEdit, load: false});
        }
    }, [loadLoteEdit, notificacion, lote]);

    useEffect(() => {
        if (reload) {
            if (!edit) {
                setLote({
                    ...lote,
                    lote: '',
                    has: 0,
                    detalle: '',
                    latitud: -2.2590146590619145,
                    longitud: -79.49522495269775
                });
                focuselement('id-lote');
            }
            setReload(false);
            setReloadMapa(true);
        }
    }, [reload, lote, edit]);

    const onSave = () => {
        if (lote.hacienda && lote.lote !== '' && parseInt(lote.has) > 0) {
            (async () => {
                progressBarStatus(true);
                const url = `${API_LINK}/bansis-app/index.php/lote`;
                const datos = q.stringify({json: JSON.stringify(lote)});
                const configuracion = _configStoreApi('POST', url, datos, progressBarStatus, authentication);
                const response = await _saveApi(configuracion);
                const {code, message} = response;
                if (code === 200) {
                    setReload(true);
                }
                setNotificacion({
                    open: true,
                    message
                });
            })();
        } else {
            setNotificacion({
                open: true,
                message: 'No se han enviado datos'
            });
        }
        return false;
    };

    const onNew = () => {
        setReload(true);
    };

    return (
        <Container fluid  style={{marginTop: "4rem"}}>
            <SnackbarComponent
                notificacion={notificacion}
                setNotificacion={setNotificacion}
            />
            <Card className="mt-3 mb-5">
                <Card.Header>
                    <i className="fas fa-map-marker-alt fa-1x"/> Formulario para registro de Lote
                </Card.Header>
                <Card.Body>
                    {/*Formulario de Registro*/}
                    <FormularioRegistro
                        lote={lote}
                        setLote={setLote}
                        reload={reloadMapa}
                        setReload={setReloadMapa}
                    />
                </Card.Body>
                <Card.Footer>
                    <ButtonGroup className="col-md-4 offset-8 p-0">
                        <Button
                            variant="primary"
                            type="button"
                            onClick={() => onNew()}
                        >
                            <CreateIcon/> Nuevo
                        </Button>
                        <Button
                            onClick={() => onSave()}
                            variant="success"
                        >
                            <SaveIcon/> Guardar
                        </Button>
                        <Button
                            as={Link}
                            to={`/hacienda/lote/${idmodulo}`}
                            variant="danger"
                            onClick={() => history.push(`/hacienda/lote/${idmodulo}`)}
                        >
                            <AssignmentReturnIcon/> Cancelar
                        </Button>
                    </ButtonGroup>
                </Card.Footer>
            </Card>
        </Container>
    );
}
