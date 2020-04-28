import React, {useEffect, useState} from "react";
import TableForm from "../../components/Table";
import {API_LINK} from "../../utils/constants";
import {Link} from "react-router-dom";
import {Badge, Button, ButtonGroup, Col, Container, Row} from "react-bootstrap";
import {Breadcrumbs, Typography, Backdrop, CircularProgress} from "@material-ui/core";
import {
    AddCircle as AddCircleIcon, Update as UpdateIcon, Sync as SyncIcon, CloudOff as CloudOffIcon
} from "@material-ui/icons";

import {useHistory} from "react-router-dom";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../actions/progressActions";

import moment from "moment";
import 'moment/locale/es';
import SnackbarComponent from "../../components/Snackbar/Snackbar";
import AlertDialog from "../../components/AlertDialog/AlertDialog";
import qs from "qs";

export default function Material() {
    const [materialsList, setMaterialsList] = useState([]);
    const [load, setLoad] = useState(true);
    const [page, setPage] = useState(1);

    const url_api = `${API_LINK}/bansis-app/index.php/materiales?page=${page}`;

    const history = useHistory();
    const dispatch = useDispatch();
    const progressbarStatus = (state) => dispatch(progressActions(state));
    const authentication = useSelector((state) => state.auth._token);

    const [notificacion, setNotificacion] = useState({
        open: false,
        message: ''
    });

    const [openModalMaterialDestroy, setOpenModalMaterialDestroy] = useState(false);
    const [materialDestroy, setMaterialDestroy] = useState({
        title: "",
        content: "",
        id: 0
    });

    useEffect(() => {
        if (load) {
            (async () => {
                try {
                    const progressbarStatus = (state) => dispatch(progressActions(state));
                    const materials = await axios.get(url_api)
                        .then(
                            (response) => response.data,
                            (error) => error.response.data)
                        .catch((error) => console.log(error));
                    await setMaterialsList(materials);
                    progressbarStatus(false);
                } catch (e) {
                    console.error(e);
                }
                await setLoad(false);
            })();
        }
    }, [load, url_api, dispatch]);

    const onChangePage = (page) => {
        progressbarStatus(true);
        setLoad(true);
        setPage(page);
    };

    const toForm = () => {
        history.push("/bodega/material/formulario");
    };

    if (materialsList.length === 0) {
        progressbarStatus(false);
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        );
    }
    ;

    const updateStockMaterial = (codigo) => {
        (async () => {
            const url = `${API_LINK}/bansis-app/custom.php/materiales/updateStock`;
            const config = {
                method: 'PUT',
                url: url,
                data: qs.stringify({cod_material: codigo}),
                onDownloadProgress: () => progressbarStatus(true),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': authentication
                }
            };
            const request = await axios(config)
                .then(
                    (reponse) => reponse.data,
                    (error) => error.response.data)
                .catch((error) => {
                    console.log(error)
                });

            setNotificacion({
                open: true,
                message: request.message
            });

            if (request.code === 200) {
                await setLoad(true);
            } else {
                await progressbarStatus(false);
            }
        })();
    };

    const openModalDestroy = (material) => {
        setOpenModalMaterialDestroy(true);
        setMaterialDestroy({
            title: "Eliminar registro: " + material.codigo,
            content: "Dar de baja al material: " + material.descripcion + " de bodega " + material.get_bodega.nombre,
            id: material.id
        })
    };

    const destroyMaterial = (id) => {
        (async () => {
            const url = `${API_LINK}/bansis-app/index.php/materiales/${id}`;
            const config = {
                method: 'DELETE',
                url: url,
                onDownloadProgress: () => progressbarStatus(true),
                headers: {
                    Authorization: authentication
                }
            };
            const request = await axios(config)
                .then((response) => response.data,
                    (error) => error.response.data)
                .catch((error) => console.error(error));

            setNotificacion({
                open: true,
                message: request.message
            });

            if (request.code === 200) {
                await setLoad(true);
            } else {
                await progressbarStatus(false);
            }

        })();
        setOpenModalMaterialDestroy(false);
    };

    return (
        <Container fluid>
            <SnackbarComponent
                notificacion={notificacion}
                setNotificacion={setNotificacion}
            />
            <AlertDialog
                title={materialDestroy.title}
                content={materialDestroy.content}
                open={openModalMaterialDestroy}
                setOpen={setOpenModalMaterialDestroy}
                actionDestroy={destroyMaterial}
                id={materialDestroy.id}
            />
            <Row>
                <Col className="mt-3 mb-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" to="/">
                            Hacienda
                        </Link>
                        <Typography color="textPrimary">Material</Typography>
                    </Breadcrumbs>
                </Col>
            </Row>
            <Row className="justify-content-end">
                <Col className="">
                    <ButtonGroup>
                        <Button
                            variant="success"
                            className="align-self-end"
                            type="button"
                            onClick={() => toForm()}
                        >
                            <AddCircleIcon/> Agregar nuevo material
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <hr/>
            <TableForm
                dataAPI={materialsList}
                columns={['#', 'Codigo', 'Descripcion', 'Stock', 'Bodega', 'Grupo', 'Ult. Act.', 'Estado', 'Accion']}
                onChangePage={onChangePage}
            >
                {materialsList.dataArray.data.length > 0 ?
                    materialsList.dataArray.data.map((material, index) =>
                        <tr key={material.id}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">{material.codigo}</td>
                            <td>{material.descripcion}</td>
                            <td className="text-center"><Badge variant="light">{material.stock}</Badge></td>
                            <td className="text-center"><small>{material.get_bodega.nombre}</small></td>
                            <td className="text-center"><small>{material.get_grupo.descripcion}</small></td>
                            <td className="text-center">
                                <small><b><UpdateIcon/> {moment(material.updated_at).fromNow()}</b></small>
                            </td>
                            <td className="text-center"><Badge
                                variant={material.estado === "1" ? "success" : "danger"}> {material.estado === "1" ? "A" : "I"}</Badge>
                            </td>
                            <td className="text-center">
                                <ButtonGroup>
                                    <Button variant="primary" size="sm"
                                            onClick={() => updateStockMaterial(material.codigo)}>
                                        <SyncIcon/> Stock
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => openModalDestroy(material)}>
                                        <CloudOffIcon/>
                                    </Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    )
                    :
                    <tr>
                        <td colSpan={9}>No hay registros...</td>
                    </tr>
                }
            </TableForm>
        </Container>
    )
}
