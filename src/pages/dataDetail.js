import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, Col, Container, Row} from "react-bootstrap";
import {Breadcrumbs, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../actions/progressActions";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import AlertDialog from "../components/AlertDialog/AlertDialog";
import SnackbarComponent from "../components/Snackbar/Snackbar";

export default function DataDetail(props) {
    const {
        title, setFormulario, children,
        page, setPage,
        openModal, setOpenModal, dataModal, setDataModal,
        url, url_delete, reload, setReload,
        data: {getData, setData},
    } = props;


    const [notificacion, setNotificacion] = useState({
        open: false,
        code: '',
        message: ''
    });

    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));
    const authentication = useSelector((state) => state.auth._token);

    useEffect(() => {
        if (reload) {
            const progessbarStatus = (state) => dispatch(progressActions(state));
            (async () => {
                const response = await fetch(url);
                const dataJson = await response.json();
                setData(dataJson);
                if (dataJson.code === 400) {
                    if (page > 1) {
                        setPage(page - 1);
                        setReload(true);
                    }
                } else {
                    setReload(false);
                }
                progessbarStatus(false);
            })();
        }
    }, [page, setPage, dispatch, url, setData, reload, setReload]);

    const destroyData = (id) => {
        progessbarStatus(true);
        (async () => {
            try {
                const config = {
                    method: 'delete',
                    url: `${url_delete}/${id}`,
                    timeout: 5000,
                    headers: {Authorization: authentication},
                    onDownloadProgress: function () {
                        progessbarStatus(false);
                    },
                };
                const deleteEmp = await axios(config)
                    .then(
                        (response) => {
                            return response.data;
                        },
                        (error) => {
                            return error.response.data;
                        });
                const {code, message} = deleteEmp;
                if (code === 200) {
                    setDataModal({});
                    setReload(true);
                }
                setNotificacion({
                    open: true,
                    code: code,
                    message: message
                });
                setOpenModal(false);
            } catch (e) {
                console.log(e)
            }
        })()
    };

    if (getData.length === 0) {
        progessbarStatus(false);
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        );
    }

    return (
        <Container fluid className="mb-4">
            <Row>
                <Col className="mt-3 mb-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" to="/">
                            Hacienda
                        </Link>
                        <Typography color="textPrimary">{title}</Typography>
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
                            onClick={setFormulario}
                        >
                            <AddCircleIcon/> Crear nuevo {title}
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <hr/>
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
            {children}
        </Container>
    );
}
