import React, {useEffect, useState} from "react";
import {API_LINK} from "../../../../utils/constants";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import PaginationForm from "../../../../components/Pagination/Pagination";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Col, Row} from "react-bootstrap";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import AlertDialog from "../../../../components/AlertDialog/AlertDialog";
import {progressActions} from "../../../../actions/progressActions";
//import EnfundePeriodo from "./EnfundePeriodo";

const style = {
    table: {
        textCenter: {
            textAlign: "center",
            verticalAlign: "middle"
        }
    }
};

export default function EnfundeSemanal() {
    const [enfundes, setEnfundes] = useState(null);
    const [page, setPage] = useState(1);
    const history = useHistory();
    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));
    const authentication = useSelector((state) => state.auth._token);
    const credential = useSelector((state) => state.credential.credential);

    //Variable para abrir y cerrar el modal para eliminar el registro
    const [openModal, setOpenModal] = useState(false);
    //Variable para enviar datos al modal
    const [dataModal, setDataModal] = useState(null);

    const [reload, setReload] = useState(true);

    useEffect(() => {
        if (reload) {
            (async () => {
                let url = `${API_LINK}/bansis-app/index.php/getEnfunde/semanal?page=${page}`;

                if (credential && credential.idhacienda) {
                    url = `${API_LINK}/bansis-app/index.php/getEnfunde/semanal?page=${page}&hacienda=${credential.idhacienda.id}`;
                }

                const request = await fetch(url);
                const response = await request.json();
                setEnfundes(response);
            })();
            setReload(false);
        }
    }, [reload, page, credential]);

    const onChangePage = (page) => {
        setPage(page);
        setReload(true);
    };

    const onCerrarEnfunde = (data) => {
        progessbarStatus(true);
        setOpenModal(true);
        setDataModal({
            title: `${data.hacienda.detalle}`,
            content: `¿Esta seguro de cerrar el enfunde de la Semana ${data.semana}?.`,
            id: data.id
        })
    };

    const cerrarEnfunde = (id) => {
        setOpenModal(false);
        if (id !== undefined) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/endunde/cerrar/semana/${id}`;
                const configuracion = {method: 'POST', headers: {'Authorization': authentication}};
                const request = await fetch(url, configuracion);
                const response = await request.json();
                await progessbarStatus(false);
                setPage(1);
                if (response.code === 200) {
                    setReload(true);
                }
            })();
        }
    };

    if (!enfundes || reload) {
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        );
    }

    return (
        <>
            {!reload &&
            <div className="container-fluid mt-3 mb-5">
                {dataModal &&
                <AlertDialog
                    title={dataModal.title}
                    content={dataModal.content}
                    open={openModal}
                    setOpen={setOpenModal}
                    actionDestroy={cerrarEnfunde}
                    id={dataModal.id}
                />
                }
                <Row>
                    <Col className="mt-3 mb-3">
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link color="inherit" to="/">
                                Hacienda
                            </Link>
                            <Typography color="textPrimary">Labor</Typography>
                            <Typography color="textPrimary">Enfunde</Typography>
                            <Typography color="textPrimary">Semana</Typography>
                        </Breadcrumbs>
                    </Col>
                </Row>
                <div className="row">
                    <div className="btn-group col-5">
                        <button
                            className="btn btn-success col-5"
                            onClick={() => history.push(`${history.location.pathname}/empleado`)}
                        >
                            <i className="fab fa-buffer"/> Registrar Enfunde
                        </button>
                    </div>
                </div>
                <hr/>
                {/*<div className="row">
                    //Enfunde grafico
                    <EnfundePeriodo/>
                </div>
                <hr/>*/}
                <div className="row">
                    <div className="col-12 table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead>
                            <tr className="text-center">
                                <th>...</th>
                                <th>Año</th>
                                <th>Color</th>
                                <th>Semana</th>
                                <th>Periodo</th>
                                <th>Hacienda</th>
                                <th>Has.</th>
                                <th>Total</th>
                                <th>Desbunche</th>
                                <th>Accion</th>
                            </tr>
                            </thead>
                            <tbody>
                            {enfundes.hasOwnProperty('dataArray') && enfundes.dataArray.data.length > 0 &&
                            enfundes.dataArray.data.map((item, index) => (
                                <tr key={index} className="text-center table-sm">
                                    <td style={style.table.textCenter}>
                                        <i className="fas fa-align-left"/>
                                    </td>
                                    <td style={style.table.textCenter}>
                                        <b>{item.year}</b>
                                    </td>
                                    <td width="8%" style={style.table.textCenter}>
                                        <div className="input-group">
                                            <input className="form-control" name={`${item.color}-CALENDARIO`}
                                                   type="text"
                                                   disabled={true}/>
                                        </div>
                                    </td>
                                    <td style={style.table.textCenter}>{item.semana}</td>
                                    <td style={style.table.textCenter}>{item.periodo}</td>
                                    <td style={style.table.textCenter}>
                                        <small>{item.hacienda.detalle}</small>
                                    </td>
                                    <td style={style.table.textCenter}>
                                        <b>{(+item.has).toFixed(2)}</b>
                                    </td>
                                    <td style={style.table.textCenter}>{item.total}</td>
                                    <td width="8%" style={style.table.textCenter}>{item.desbunche}</td>
                                    <td>
                                        <div className="btn-group">
                                            {item.cerrado === "3" ?
                                                <button className="btn btn-danger btn-lg">
                                                    <i className="fas fa-lock"/>
                                                </button>
                                                :
                                                <button className="btn btn-success btn-lg"
                                                        onClick={() => onCerrarEnfunde(item)}>
                                                    <i className="fas fa-lock-open"/>
                                                </button>
                                            }
                                            <button
                                                className="btn btn-primary btn-lg"
                                                onClick={() => history.push(`${history.location.pathname}/semana/detalle/${item.id}`)}
                                            >
                                                <i className="fas fa-archive"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className="col-12 align-content-center">
                        <PaginationForm
                            current_page={enfundes.dataArray.current_page}
                            total={enfundes.dataArray.total}
                            pageSize={7}
                            onChangePage={onChangePage}
                        />
                    </div>
                </div>
            </div>
            }
        </>
    )
}
