import React, {useEffect, useState} from "react";
import InformeComponent from "../../../../components/Tools/InformesComponent";
import InformeEnfundeSemanal
    from "../../../../components/app/hacienda_labor_avances/enfunde/Informes/InformeEnfundeSemanal";
import {API_LINK} from "../../../../constants/helpers";
import PaginationForm from "../../../../components/Tools/Pagination/Pagination";
import ModalForm from "../../../../components/Tools/ModalForm";
import useFetch from "../../../../hooks/useFetch";
import Spinner1 from "../../../../components/Tools/Loadings/Spinner1";
import {Col, Dropdown, Row} from "react-bootstrap";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {progressActions} from "../../../../actions/progressActions";

export default function ReporteEnfunde() {
    const history = useHistory();
    const dispatch = useDispatch();

    const [enfunde, setEnfunde] = useState(null);
    const [loadData, setLoadData] = useState(enfunde === null);
    const [page, setPage] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [configModal, setConfigModal] = useState(configuracionModal);
    const [showMaterial, setShowMaterial] = useState(false);
    const [showEmpleados, setShowEmpleados] = useState(false);

    const credential = useSelector((state) => state.login.credential);
    const [hacienda, setHacienda] = useState(credential.idhacienda ? credential.idhacienda : null);

    const onChangePage = (page) => {
        setPage(page);
        setLoadData(true);
    };

    const onClickMaterial = (idEnfunde) => {
        setConfigModal({
            ...configModal,
            dataId: idEnfunde,
            icon: 'fas fa-bars',
            size: 'xl',
            title: 'Materiales usados',
        });
        setShowModal(true);
        setShowMaterial(true);
    };

    const onClickEmpleados = (idEnfunde) => {
        setConfigModal({
            ...configModal,
            dataId: idEnfunde,
            icon: 'fas fa-bars',
            size: 'xl',
            title: 'Empleados laborando',
        });
        setShowModal(true);
        setShowEmpleados(true);
    };

    const onHideModal = () => {
        setShowModal(false);
        showMaterial && setShowMaterial(false);
        showEmpleados && setShowEmpleados(false);
        setConfigModal(configuracionModal);
    };

    const downloadPDF = (id, semana, informe = 'lotes', extension = 'pdf') => {
        let url = `${API_LINK}/bansis-app/index.php/informe/enfunde-pdf/semanal-empleados/${id}?extension=${extension}&${informe}=true`;
        (async () => {
            try {
                dispatch(progressActions(true));
                axios({
                    url: `${url}`,
                    method: 'GET',
                    responseType: 'blob', // important
                    onDownloadProgress: () => {
                        dispatch(progressActions(false));
                    }
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;

                    let value = `Enfunde_Loteros_Semana ${semana}.pdf`;
                    if (informe !== 'lotes') {
                        value = `Saldos_Finales_Semana-${semana}.pdf`;
                    }

                    link.setAttribute('download', `${value}`);
                    document.body.appendChild(link);
                    link.click();
                });
            } catch (e) {
                console.error(e)
            }
        })();
    };

    return (
        <InformeComponent>
            <Row>
                <Col className="mt-n2 mb-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" to="/">
                            Hacienda
                        </Link>
                        <Typography color="textPrimary">Informe</Typography>
                        <Typography color="textPrimary">Enfunde</Typography>
                        <Typography color="textPrimary">Semana</Typography>
                    </Breadcrumbs>
                </Col>
            </Row>
            <div className="row">
                <div className="col-3">
                    <button className="btn btn-primary btn-block"
                            onClick={() => history.push(`${history.location.pathname}/dashboard-enfunde`)}
                    >
                        <i className="fas fa-chart-bar"/> Dashboard - Enfunde
                    </button>
                </div>
            </div>
            <hr/>
            <InformeEnfundeSemanal
                //data={enfunde}
                setData={setEnfunde}
                loadData={loadData}
                setLoadData={setLoadData}
                api={`${API_LINK}/bansis-app/index.php/informe/enfunde/semanal?page=${page}${hacienda !== null ? `&hacienda=${hacienda.id}` : ''}`}
                cabeceraTabla={['...', 'Hacienda', 'Calend.', 'Sem.', 'Per.', 'Materiales', 'Empleados', 'C_Pre', 'Cant_Pre', 'C_Fut', 'Cant_fut', 'Total']}
            >
                {enfunde && enfunde.data.length > 0 && enfunde.data.map((body, i) => (
                    <tr key={i} className="text-center table-sm">
                        <td width="5%">
                            <div className="btn-group">
                                <Dropdown size="sm" drop="right">
                                    <Dropdown.Toggle variant="success" id="dropdown-basic" style={{margin: 0}}>
                                        <i className="far fa-file-alt"/>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{margin: 0}}>
                                        <Dropdown.Item onClick={() => downloadPDF(body.id, body.semana)}>
                                            <i className="fas fa-file-pdf"/> Enfunde_Lotero_Semana-{body.semana}.pdf
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => downloadPDF(body.id, body.semana, 'saldos')}>
                                            <i className="fas fa-file-pdf"/> Saldos_Finales_Semana-{body.semana}.pdf
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </td>
                        <td style={style.table.textCenter}>{body.hacienda.detalle}</td>
                        <td style={style.table.textCenter} width="5%">{body.idcalendar}</td>
                        <td style={style.table.textCenter} width="5%">{body.semana}</td>
                        <td style={style.table.textCenter} width="5%">{body.periodo}</td>
                        <td width="8%">
                            <button className="btn btn-warning" onClick={() => onClickMaterial(body.id)}>
                                <i className="fas fa-bars"/>
                            </button>
                        </td>
                        <td width="8%">
                            <button className="btn btn-warning" onClick={() => onClickEmpleados(body.id)}>
                                <i className="fas fa-bars"/>
                            </button>
                        </td>
                        <td width="2%">
                            <div className="input-group">
                                <input className="form-control" name={`${body.colPresente}-CALENDARIO`}
                                       type="text"
                                       disabled={true}/>
                            </div>
                        </td>
                        <td style={style.table.textCenter}>{body.presente}</td>
                        <td width="2%">
                            <div className="input-group">
                                <input className="form-control" name={`${body.colFuturo}-CALENDARIO`}
                                       type="text"
                                       disabled={true}/>
                            </div>
                        </td>
                        <td style={style.table.textCenter}>{body.futuro}</td>
                        <td style={style.table.textCenter}>
                            <b>{parseInt(body.presente) + parseInt(body.futuro)}</b>
                        </td>
                    </tr>
                ))}
            </InformeEnfundeSemanal>
            {enfunde &&
            <>
                <hr/>
                <div className="col-12 align-content-center">
                    <PaginationForm
                        current_page={enfunde.current_page}
                        total={enfunde.total}
                        pageSize={10}
                        onChangePage={onChangePage}
                    />
                </div>
            </>
            }
            <ModalForm
                show={showModal}
                icon={configModal.icon}
                title={configModal.title}
                animation={configModal.animation}
                backdrop={configModal.backdrop}
                size={configModal.size}
                centered={configModal.centered}
                scrollable={configModal.scrollable}
                dialogSize={'80'}
                cancel={onHideModal}
            >
                {(showMaterial && !showEmpleados) && <SwhowMaterial id={configModal.dataId}/>}
                {(!showMaterial && showEmpleados) && <ShowEmpleados id={configModal.dataId}/>}
            </ModalForm>
        </InformeComponent>
    )
}

function configuracionModal() {
    return {
        dataId: '',
        icon: '',
        title: '',
        animation: true,
        backdrop: true,
        size: 'lg',
        centered: true,
        scrollable: true
    }
}

function SwhowMaterial(props) {
    const {id} = props;
    const url = `${API_LINK}/bansis-app/index.php/informe/enfunde/semanal-material?id=${id}`;
    const response = useFetch(url);

    const {loading, result, error} = response;

    const total = (data, tipo) => {
        return data.reduce((total, item) => total + +item[tipo], 0);
    };

    if (loading) {
        return (<Spinner1/>)
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12 table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead>
                        <tr className="text-center">
                            <th>Material</th>
                            <th width="8%" style={{color: "red"}}>SInicial</th>
                            <th width="8%" style={{color: "red"}}>Despacho</th>
                            <th width="8%">Presente</th>
                            <th width="8%">Futuro</th>
                            <th width="8%">Total</th>
                            <th width="8%" style={{color: "red"}}>SFinal</th>
                        </tr>
                        </thead>
                        <tbody>
                        {result.length > 0 &&
                        <>
                            {!error && result.map((body, i) => (
                                <tr className="text-center" key={i}>
                                    <td className="text-left">{body.descripcion}</td>
                                    <td><b>{body.inicial}</b></td>
                                    <td><b>{body.despacho}</b></td>
                                    <td>{body.presente}</td>
                                    <td>{body.futuro}</td>
                                    <td><b>{+body.presente + +body.futuro}</b></td>
                                    <td style={{color: "red"}}><b>{body.final}</b></td>
                                </tr>
                            ))}
                            <tr className="text-center" style={{backgroundColor: "#E6ECF5"}}>
                                <td/>
                                <td><b>{total(result, 'inicial')}</b></td>
                                <td><b>{total(result, 'despacho')}</b></td>
                                <td><b>{total(result, 'presente')}</b></td>
                                <td><b>{total(result, 'futuro')}</b></td>
                                <td><b>{total(result, 'presente') + total(result, 'futuro')}</b></td>
                                <td><b>{total(result, 'final')}</b></td>
                            </tr>
                        </>
                        }
                        </tbody>
                    </table>
                </div>
                <div className="col-12">
                    <div className="shadow-none p-3 bg-light rounded">
                        <div className="row">
                            <div className="col-6">
                                <b>SInicial: </b>Saldo del material con el que se inicia la semana.<br/>
                                <b>Despacho: </b>Despacho total del material en la semana.<br/>
                                <b>SFinal: </b>Saldo del material con el que cierra la semana.<br/>
                            </div>
                            <div className="col-6">
                                <b>Presente: </b>Total enfunde Presente.<br/>
                                <b>Futuro: </b>Total enfunde Futuro.<br/>
                                <b>Total: </b>Enfunde Total.<br/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ShowEmpleados(props) {
    const {id} = props;
    const url = `${API_LINK}/bansis-app/index.php/informe/enfunde/semanal-empleados?id=${id}`;
    const response = useFetch(url);
    const {loading, result, error} = response;

    const [dataEmpleado, setDataEmpleado] = useState(null);

    const [loadingData, setLoadingData] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [material, setMaterial] = useState(false);
    const [reelevo, setReelevo] = useState(false);
    const [dataMaterial, setDataMaterial] = useState([]);
    const [dataReelevo, setDataReelevo] = useState([]);

    const [empleadosArray, setEmpleadosArray] = useState([]);

    useEffect(() => {
        if (empleadosArray.length === 0 && !loading) {
            setEmpleadosArray(result);
        }
    }, [empleadosArray, loading, result]);

    const onShowMateriales = (data) => {
        setMaterial(true);
        setShowModal(true);
        setLoadingData(true);
        (async () => {
            const url = `${API_LINK}/bansis-app/index.php/informe/enfunde/semanal-empleados/detalle?id=${id}&calendario=${data.idcalendar}&empleado=${data.idempleado}`;
            const request = await fetch(url);
            const response = await request.json();
            setDataEmpleado(data);
            setDataMaterial(response);
            setLoadingData(false);
        })();
    };

    const onShowReelevos = (data) => {
        setReelevo(true);
        setShowModal(true);
        setLoadingData(true);
        (async () => {
            const url = `${API_LINK}/bansis-app/index.php/informe/enfunde/semanal-empleados/detalle?id=${id}&calendario=${data.idcalendar}&empleado=${data.idempleado}&reelevo=true`;
            const request = await fetch(url);
            const response = await request.json();
            setDataEmpleado(data);
            setDataReelevo(response);
            setLoadingData(false);
        })();
    };

    const onHideModal = () => {
        setShowModal(false);
        setDataEmpleado(null);
        setDataMaterial([]);
        setDataReelevo([]);
        setMaterial(false);
        setReelevo(false);
    };

    const checkSaldoFinal = (material) => {
        const saldoCalculate = (+material.inventario.sld_inicial + +material.despacho) - (+material.presente + +material.futuro);
        return {
            result: +saldoCalculate,
            status: +material.inventario.sld_final === +saldoCalculate
        }
    };

    const total = (empleados, tipo) => {
        return empleados.reduce((total, empleado) => total + +empleado[tipo], 0)
    };

    const filterEmpleado = (e) => {
        const arrayFilter = result;
        const empleado = e.target.value;
        if (empleado.trim()) {
            const empleados_search = arrayFilter.filter(item => item.nombres.toLowerCase().indexOf(empleado) > -1);
            setEmpleadosArray(empleados_search);
        } else {
            setEmpleadosArray(result);
        }
    };

    if (loading) {
        return (<Spinner1/>)
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <ModalForm
                    show={showModal}
                    icon={'fas fa-arrow-right'}
                    title={`${dataEmpleado ? dataEmpleado.nombres : ''}`}
                    animation={true}
                    backdrop={false}
                    size="lg"
                    centered={true}
                    scrollable={true}
                    dialogSize={'65'}
                    cancel={onHideModal}
                >
                    <div className="container-fluid">
                        <div className="row">
                            {material && !reelevo && <MaterialesEmpleado/>}
                            {!material && reelevo && <ReelevosEmpleado/>}
                            {(dataMaterial.length > 0 || dataReelevo.length > 0) &&
                            <div className="col-12">
                                <div className="shadow-none p-3 bg-light rounded">
                                    <div className="row">
                                        <div className="col-12">
                                            <b>SInicial: </b>Saldo del material con el que se inicia la semana.<br/>
                                            <b>Egreso: </b>Despacho total del material en la semana.<br/>
                                            <b>Ocupado: </b>Total de material ocupado para enfunde.<br/>
                                            <b>SFinal: </b>Saldo del material con el que cierra la semana.<br/>
                                            <b>Status: </b>Estado de la transaccion.<br/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </ModalForm>
                <div className="col-12 mb-3">
                    <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Filtrar empleado por nombre"
                        onKeyUp={(e) => filterEmpleado(e)}
                    />
                </div>
                <div className="col-md-12 table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead>
                        <tr className="text-center">
                            <th>Codigo</th>
                            <th>Empleado</th>
                            <th>Material</th>
                            <th>Reelevo</th>
                            <th>Presente</th>
                            <th>Futuro</th>
                            <th>Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {empleadosArray.length > 0 && !error &&
                        <>
                            {empleadosArray.map((body, i) => (
                                <tr className="text-center table-sm" key={i}>
                                    <td style={style.table.textCenter}>{body.codigo}</td>
                                    <td style={style.table.textCenter}>{body.nombres}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => onShowMateriales(body)}>
                                            <i className="fas fa-bars"/>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-info" onClick={() => onShowReelevos(body)}>
                                            <i className="fas fa-user-plus"/>
                                        </button>
                                    </td>
                                    <td style={style.table.textCenter}>{body.presente}</td>
                                    <td style={style.table.textCenter}>{body.futuro}</td>
                                    <td style={style.table.textCenter}><b>{+body.presente + +body.futuro}</b></td>
                                </tr>
                            ))}
                            <tr className="text-center" style={{backgroundColor: "#E6ECF5"}}>
                                <td colSpan={4}/>
                                <td><b>{total(empleadosArray, 'presente')}</b></td>
                                <td><b>{total(empleadosArray, 'futuro')}</b></td>
                                <td><b>{total(empleadosArray, 'presente') + total(result, 'futuro')}</b></td>
                            </tr>
                        </>
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    function MaterialesEmpleado() {

        const total = (data, tipo) => {
            return data.reduce((total, item) => total + +item[tipo], 0);
        };

        const totalInventario = (data, tipo) => {
            return data.reduce((total, item) => total + +item.inventario[tipo], 0);
        };

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 table-responsive">
                        {dataMaterial.length === 0 ? loadingData ? <Spinner1/> :
                            <EmptyData mensaje="No se han encontrado Materiales"/> :
                            <table className="table table-bordered table-hover">
                                <thead>
                                <tr className="text-center">
                                    <th>Material</th>
                                    <th>SInicial</th>
                                    <th>Egreso</th>
                                    <th>Ocupado</th>
                                    <th>SFinal</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {dataMaterial.length > 0 &&
                                <>
                                    {dataMaterial.map((material, i) => (
                                        <tr className="text-center" key={i}>
                                            <td className="text-left"
                                                style={style.table.textCenter}>{material.descripcion}</td>
                                            <td style={style.table.textCenter}>{material.inventario.sld_inicial}</td>
                                            <td style={style.table.textCenter}>{material.despacho}</td>
                                            <td style={style.table.textCenter}>{+material.presente + +material.futuro}</td>
                                            <td style={style.table.textCenter}>{checkSaldoFinal(material).result}</td>
                                            <td style={style.table.textCenter}>
                                                <i className={`fas ${checkSaldoFinal(material).status ? "fa-check-circle" : "fa-exclamation-circle"} fa-lg`}
                                                   style={{color: `${checkSaldoFinal(material).status ? "green" : "red"}`}}/>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="text-center" style={{backgroundColor: "#E6ECF5"}}>
                                        <td/>
                                        <td><b>{totalInventario(dataMaterial, ['sld_inicial'])}</b></td>
                                        <td><b>{total(dataMaterial, 'despacho')}</b></td>
                                        <td><b>{total(dataMaterial, 'presente') + total(dataMaterial, 'futuro')}</b>
                                        </td>
                                        <td><b>{totalInventario(dataMaterial, ['sld_final'])}</b></td>
                                        <td/>
                                    </tr>
                                </>
                                }
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </div>
        );
    }

    function ReelevosEmpleado() {
        const total = (data, tipo) => {
            return data.reduce((total, item) => total + +item[tipo], 0);
        };

        const totalInventario = (data, tipo) => {
            return data.reduce((total, item) => total + +item.inventario[tipo], 0);
        };
        return (
            <div className="col-12 table-responsive">
                {dataReelevo.length === 0 ? loadingData ? <Spinner1/> :
                    <EmptyData mensaje="No se han encontrado Loteros Reelevo"/> :
                    <table className="table table-bordered table-hover">
                        <thead>
                        <tr className="text-center">
                            <th>Nombres</th>
                            <th>Material</th>
                            <th>SInicial</th>
                            <th>Egreso</th>
                            <th>Ocupado</th>
                            <th>SFinal</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dataReelevo.length > 0 &&
                        <>
                            {dataReelevo.map((reelevo, i) => (
                                <tr className="text-center" key={i}>
                                    <td className="text-left"
                                        style={style.table.textCenter}>{reelevo.nombres}</td>
                                    <td className="text-left"
                                        style={style.table.textCenter}>{reelevo.descripcion}</td>
                                    <td style={style.table.textCenter}>{reelevo.inventario.sld_inicial}</td>
                                    <td style={style.table.textCenter}>{reelevo.despacho}</td>
                                    <td style={style.table.textCenter}>{+reelevo.presente + +reelevo.futuro}</td>
                                    <td style={style.table.textCenter}>{checkSaldoFinal(reelevo).result}</td>
                                    <td style={style.table.textCenter}>
                                        <i className={`fas ${checkSaldoFinal(reelevo).status ? "fa-check-circle" : "fa-exclamation-circle"} fa-lg`}
                                           style={{color: `${checkSaldoFinal(reelevo).status ? "green" : "red"}`}}/>
                                    </td>
                                </tr>
                            ))}
                            <tr className="text-center" style={{backgroundColor: "#E6ECF5"}}>
                                <td/>
                                <td/>
                                <td><b>{totalInventario(dataReelevo, ['sld_inicial'])}</b></td>
                                <td><b>{total(dataReelevo, 'despacho')}</b></td>
                                <td><b>{total(dataReelevo, 'presente') + total(dataMaterial, 'presente')}</b>
                                </td>
                                <td><b>{totalInventario(dataReelevo, ['sld_final'])}</b></td>
                                <td/>
                            </tr>
                        </>
                        }
                        </tbody>
                    </table>
                }
            </div>
        );
    }

    function EmptyData({mensaje}) {
        return (
            <div className="col-12">
                <div className="alert alert-info">
                    <i className="fas fa-exclamation-triangle"/> {mensaje}
                </div>
            </div>
        )
    }
}

const style = {
    table: {
        textCenter: {
            textAlign: "center",
            verticalAlign: "middle"
        }
    }
};
