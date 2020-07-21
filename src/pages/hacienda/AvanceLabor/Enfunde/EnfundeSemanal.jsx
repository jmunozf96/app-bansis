import React, {useEffect, useState} from "react";
import {API_LINK} from "../../../../utils/constants";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import PaginationForm from "../../../../components/Pagination/Pagination";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import {Col, Row} from "react-bootstrap";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
//import {progressActions} from "../../../../actions/progressActions";
import ModalForm from "../../../../components/ModalForm";
import Spinner1 from "../../../../components/Loadings/Spinner1/Spinner1";
import ConfirmDialog from "../../../../components/ConfirmDialog";
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
    //const dispatch = useDispatch();
    //const progessbarStatus = (state) => dispatch(progressActions(state));
    const authentication = useSelector((state) => state.auth._token);
    const credential = useSelector((state) => state.credential);

    const [openDialog, setOpenDialog] = useState(false);
    const [dataDialog, setDataDialog] = useState({
        title: '',
        content: '',
        data: null
    });
    const [showModal, setShowModal] = useState(false);
    const [traspasosSaldoEmpleados, setTraspasosSaldosEmpleados] = useState([]);
    const [enfundePresente, setEnfundePresente] = useState(null);

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

    const confirmDialog = (data) => {
        setOpenDialog(true);
        setDataDialog({
            title: 'Cerrar enfunde Semanal',
            content: '¿Esta seguro de cerrar el enfunde?',
            data
        })
    };

    const onCerrarEnfunde = (data) => {
        setOpenDialog(false);
        setShowModal(true);
        if (data.id !== undefined) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/endunde/cerrar/semana/${data.id}`;
                const configuracion = {method: 'POST', headers: {'Authorization': authentication}};
                const request = await fetch(url, configuracion);
                const response = await request.json();

                setPage(1);
                if (response.code === 200) {
                    if (response.hasOwnProperty('transfers')) {
                        setTraspasosSaldosEmpleados(response.transfers);
                    } else if (response.hasOwnProperty('enfundePresente')) {
                        setEnfundePresente(response['enfundePresente']);
                    }
                    //setReload(true);
                }
            })();
        }
    };

    const onHideModal = () => {
        setShowModal(false);
        setTraspasosSaldosEmpleados([]);
        setEnfundePresente(null);
        setReload(true);
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
                    <ModalForm
                        show={showModal}
                        icon={'fas fa-arrow-right'}
                        title={`Traspaso de saldos para la siguiente semana`}
                        animation={true}
                        backdrop={true}
                        size="lg"
                        centered={true}
                        scrollable={true}
                        dialogSize={'90'}
                        cancel={onHideModal}
                    >
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    {traspasosSaldoEmpleados.length === 0 && !enfundePresente ?
                                        <Spinner1/> :
                                        <>
                                            {enfundePresente ?
                                                <h3><i className="fas fa-check-circle"/> {enfundePresente.presente}</h3>
                                                :
                                                <div className="row">
                                                    <div className="col-12">
                                                        <table className="table table-bordered table-hover">
                                                            <thead>
                                                            <tr>
                                                                <th rowSpan={2}>Empleado</th>
                                                                <th>Material</th>
                                                                <th>Estado</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {traspasosSaldoEmpleados.map((item, index) => (
                                                                <React.Fragment key={index}>
                                                                    {item &&
                                                                    <tr>
                                                                        <td style={style.table.textCenter}>{item.nombres}</td>
                                                                        <td style={style.table.textCenter}>
                                                                            {item.inventario.length > 0 &&
                                                                            <table className="table table-bordered m-0">
                                                                                <tbody>
                                                                                {item.inventario.map((item, index) => (
                                                                                    <tr key={index}>
                                                                                        <td className="text-left">
                                                                                    <span className="badge badge-light">
                                                                                        {item.material.descripcion}
                                                                                    </span>
                                                                                        </td>
                                                                                        <td width="10%"><i
                                                                                            className="fas fa-exchange-alt"/>
                                                                                        </td>
                                                                                        <td width="10%">{item.sld_inicial}</td>
                                                                                    </tr>
                                                                                ))}
                                                                                </tbody>
                                                                            </table>
                                                                            }
                                                                        </td>
                                                                        <td style={style.table.textCenter}>
                                                                            <i className={`fas fa-check-circle fa-lg`}
                                                                               style={{color: "green"}}/>
                                                                        </td>
                                                                    </tr>
                                                                    }
                                                                </React.Fragment>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            }
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </ModalForm>
                    {dataDialog.data &&
                    <ConfirmDialog
                        title={dataDialog.title}
                        content={dataDialog.content}
                        open={openDialog}
                        setOpen={setOpenDialog}
                        data={dataDialog.data}
                        actionConfirm={onCerrarEnfunde}
                    />
                    }
                    <div className="col-12 table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead>
                            <tr className="text-center">
                                <th>...</th>
                                <th>Año</th>
                                <th>Color</th>
                                <th>Sem.</th>
                                <th>Per.</th>
                                <th>Hacienda</th>
                                <th>Enfunde</th>
                                <th>Pres.</th>
                                <th>Fut.</th>
                                <th>Desb.</th>
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
                                    <td width="7%" style={style.table.textCenter}>
                                        <div className="input-group">
                                            <input className="form-control" name={`${item.color}-CALENDARIO`}
                                                   type="text"
                                                   disabled={true}/>
                                        </div>
                                    </td>
                                    <td width="7%" style={style.table.textCenter}>{item.semana}</td>
                                    <td width="7%" style={style.table.textCenter}>{item.periodo}</td>
                                    <td style={style.table.textCenter}>
                                        {item.hacienda.detalle}
                                    </td>
                                    <td style={style.table.textCenter}><b>{item.total}</b></td>
                                    <td style={style.table.textCenter}>
                                        <i className={`fas ${+item.stPresente === 1 ? "fa-check-circle" : "fa-exclamation-circle"} fa-lg`}
                                           style={{color: `${+item.stPresente === 1 ? "green" : "red"}`}}/>
                                    </td>
                                    <td style={style.table.textCenter}>
                                        <i className={`fas ${+item.stFuturo === 1 ? "fa-check-circle" : "fa-exclamation-circle"} fa-lg`}
                                           style={{color: `${+item.stFuturo === 1 ? "green" : "red"}`}}/>
                                    </td>
                                    <td width="6%" style={style.table.textCenter}>{item.desbunche}</td>
                                    <td width="8%">
                                        <div className="btn-group">
                                            {+item.cerrado >= 2 ?
                                                <button className="btn btn-danger btn-lg">
                                                    <i className="fas fa-lock"/>
                                                </button>
                                                :
                                                <button className="btn btn-success btn-lg"
                                                        onClick={() => confirmDialog(item)}>
                                                    <i className="fas fa-lock-open"/>
                                                </button>
                                            }
                                            <button
                                                className="btn btn-primary btn-lg"
                                                onClick={() => history.push(`${history.location.pathname}/semana/detalle/${item.id}`)}
                                            >
                                                <i className="fas fa-map-marked-alt"/>
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
