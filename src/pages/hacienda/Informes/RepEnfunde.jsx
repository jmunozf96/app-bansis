import React, {useState} from "react";
import InformeComponent from "../../../components/InformesComponent";
import InformeEnfundeSemanal from "../../../components/Informes/Enfunde/InformeEnfundeSemanal";
import {API_LINK} from "../../../utils/constants";
import PaginationForm from "../../../components/Pagination/Pagination";
import ModalForm from "../../../components/ModalForm";
import useFetch from "../../../hooks/useFetch";
import Spinner1 from "../../../components/Loadings/Spinner1";
import {Col, Row} from "react-bootstrap";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

export default function ReporteEnfunde() {
    const [enfunde, setEnfunde] = useState(null);
    const [loadData, setLoadData] = useState(enfunde === null);
    const [page, setPage] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [configModal, setConfigModal] = useState(configuracionModal);
    const [showMaterial, setShowMaterial] = useState(false);
    const [showEmpleados, setShowEmpleados] = useState(false);

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

    return (
        <InformeComponent>
            {enfunde !== null &&
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
            }
            <InformeEnfundeSemanal
                data={enfunde}
                setData={setEnfunde}
                loadData={loadData}
                setLoadData={setLoadData}
                api={`${API_LINK}/bansis-app/index.php/informe/enfunde/semanal?page=${page}`}
                cabeceraTabla={['Hacienda', 'Calend.', 'Sem.', 'Per.', 'Materiales', 'Empleados', 'Cinta_Pre', 'Cant_Pre', 'Cinta_Fut', 'Cant_fut', 'Accion']}
            >
                {enfunde && enfunde.data.length > 0 && enfunde.data.map((body, i) => (
                    <tr key={i} className="text-center table-sm">
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
                        <td width="5%">
                            <div className="input-group">
                                <input className="form-control" name={`${body.colPresente}-CALENDARIO`}
                                       type="text"
                                       disabled={true}/>
                            </div>
                        </td>
                        <td style={style.table.textCenter}>{body.presente}</td>
                        <td width="5%">
                            <div className="input-group">
                                <input className="form-control" name={`${body.colFuturo}-CALENDARIO`}
                                       type="text"
                                       disabled={true}/>
                            </div>
                        </td>
                        <td style={style.table.textCenter}>{body.futuro}</td>
                        <td/>
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
    console.log(response);
    const {loading, result, error} = response;

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
                        {result.length > 0 && !error && result.map((body, i) => (
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
                        {result.length > 0 && !error && result.map((body, i) => (
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    function MaterialesEmpleado() {
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
                                dataMaterial.map((material, i) => (
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
                                ))
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
                        dataReelevo.map((reelevo, i) => (
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
                        ))
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
