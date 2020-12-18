import React, {useCallback, useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {API_LINK} from "../../../constants/helpers";
import ApexChart from "../../../components/Tools/ApexChart/ApexChart";
import {Col, Row} from "react-bootstrap";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import ModalForm from "../../../components/Tools/ModalForm";
import moment from "moment";

const style = {
    table: {
        textCenter: {
            textAlign: "center",
            verticalAlign: "middle"
        }
    }
};

export function EnfundeLoteDetalle() {
    const {id, idmodulo} = useParams();
    const [loadData, setLoadData] = useState(true);
    const [secciones, setSecciones] = useState(undefined);
    const [cabeceraEnfunde, setCabeceraEnfunde] = useState(null);
    const history = useHistory();

    const [openModal, setOpenModal] = useState(false);
    const [dataSeccionEnfunde, setDataSeccionEnfunde] = useState(undefined);
    const [loadDataLote, setLoadDataLote] = useState(false);

    const openModalDetalle = useCallback((data, dataSemana) => {
        setOpenModal(true);
        setDataSeccionEnfunde({
            seccion: data,
            enfunde: dataSemana,
        });
        setLoadDataLote(true);
    }, []);

    const detalleEnfundeLote = useCallback((data, dataSemana) => {
        openModalDetalle(data, dataSemana)
    }, [openModalDetalle]);

    useEffect(() => {
        if (loadData) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/getEnfunde/semanal/detalle/${id}`;
                const request = await fetch(url);
                const response = await request.json();
                const {code} = response;
                if (code === 200) {
                    if (response.dataArray.length > 0) {
                        const {dataSemana, dataArray} = response;
                        setCabeceraEnfunde(dataSemana);

                        setSecciones({
                            series: [{
                                name: 'Enfunde',
                                data: [...dataArray.map(item => parseInt(item['cant_pre']) + parseInt(item['cant_fut']))]
                            }],
                            options: {
                                chart: {
                                    height: 200,
                                    type: 'line',
                                    events: {
                                        dataPointSelection: (event, chartContext, config) => {
                                            //config.w.config.data[config.dataPointIndex];
                                            if (config.selectedDataPoints[0].length > 0) {
                                                const data = config.w.config.data[config.dataPointIndex];
                                                detalleEnfundeLote(data, dataSemana);
                                            }
                                        }
                                    }
                                },
                                xaxis: {
                                    categories: [...dataArray.map(item => item.alias)],
                                },
                                dataLabels: {
                                    enabled: false
                                },
                                data: dataArray
                            },
                        });
                    }
                }

            })();
            setLoadData(false);
        }
    }, [loadData, id, detalleEnfundeLote]);

    const cancelar = () => {
        setOpenModal(false);
        setDataSeccionEnfunde(null);
        setLoadDataLote(false);
    };

    return (
        <>
            {cabeceraEnfunde &&
            <div className="container-fluid mb-3" style={{marginTop: "4rem"}}>
                <ModalDetalleEnfundeSeccionSemana
                    open={openModal}
                    setOpen={setOpenModal}
                    data={dataSeccionEnfunde}
                    setData={setDataSeccionEnfunde}
                    cancelar={cancelar}
                    loadDataLote={loadDataLote}
                    setLoadDataLote={setLoadDataLote}
                    idenfunde={id}
                />
                <Row>
                    <Col className="mb-3">
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link color="inherit" to="/">
                                Hacienda
                            </Link>
                            <Typography color="textPrimary">Labor</Typography>
                            <Typography color="textPrimary">Enfunde</Typography>
                            <Typography color="textPrimary">Semana</Typography>
                            <Typography color="textPrimary">Detalle Seccion</Typography>
                        </Breadcrumbs>
                    </Col>
                </Row>
                <div className="row">
                    <div className="col-6">
                        <button
                            className="btn btn-danger text-center"
                            onClick={() => history.push(`/hacienda/avances/labor/enfunde/${idmodulo}`)}
                        >
                            <i className="fas fa-arrow-circle-left"/> Regresar
                        </button>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-2">
                        <label>Cinta: </label>
                        <input className="form-control" name={`${cabeceraEnfunde.color}-CALENDARIO`} type="text"
                               disabled={true}/>
                    </div>
                    <div className="col-md-3">
                        <label>Enfunde Total Semana {cabeceraEnfunde.semana}: </label>
                        <input className="form-control bg-white" disabled={true} value={cabeceraEnfunde.total}/>
                    </div>
                    <div className="col-md-4">
                        <label>Hacienda: </label>
                        <input className="form-control bg-white" disabled={true}
                               value={cabeceraEnfunde.hacienda.detalle}/>
                    </div>
                    <div className="offset-2 col-md-1">
                        <label>Estado </label>
                        <input
                            className={`form-control ${cabeceraEnfunde.cerrado !== "0" ? 'bg-danger' : 'bg-success'}`}
                            disabled={true}
                        />
                    </div>
                </div>
                <hr/>
                <div className="row p-0 m-0">
                    <div className="col-12">
                        <div className="row">
                            {secciones &&
                            <React.Fragment>
                                <div className="col-md-12">
                                    <div className="alert alert-info">
                                        <i className="fas fa-mouse-pointer"/> Al hacer click en la <b>barra de enfunde</b> se
                                        mostrara el detalle del mismo <em>(Lote, Loteros, Total Enfunde)</em>.
                                    </div>
                                </div>
                                <div className="col-md-12 col-12">
                                    <ApexChart
                                        data={secciones}
                                        type="bar"
                                        height={500}
                                    />
                                </div>
                            </React.Fragment>
                            }
                        </div>
                    </div>
                </div>
                <hr/>
            </div>
            }
        </>
    );
}

function ModalDetalleEnfundeSeccionSemana(props) {
    const {open, setOpen, data, setData, loadDataLote, setLoadDataLote, idenfunde} = props;
    const [enfunde, setEnfunde] = useState(null);

    const cancelar = () => {
        setOpen(false);
        setData(null);
        setLoadDataLote(false);
        setEnfunde(null);
    };

    useEffect(() => {
        if (loadDataLote) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/getEnfundeSeccion?calendario=${data.enfunde.codigo}&seccion=${data.seccion.idlote_sec}&idenfunde=${idenfunde}`;
                const request = await fetch(url);
                const response = await request.json();
                const {code} = response;
                if (code === 200) {
                    setEnfunde(response.dataArray);
                }
            })();
            setLoadDataLote(false);
        }
    }, [loadDataLote, data, setEnfunde, setLoadDataLote, idenfunde]);

    const sumPresente = () => {
        return enfunde.detalleSemana.reduce((total, item) => +total + +item.cant_pre, 0)
    };

    const sumFuturo = () => {
        return enfunde.detalleSemana.reduce((total, item) => +total + +item.cant_fut, 0)
    };

    return (
        <>
            {data && data.seccion &&
            <ModalForm
                show={open}
                animation={true}
                icon="fas fa-map-pin"
                title={`Detalles de Enfunde en lote: ${data.seccion.alias} - Semana: ${data.enfunde.semana}`}
                backdrop="static"
                size="xl"
                centered={true}
                scrollable={true}
                save={() => null}
                cancel={cancelar}
            >
                <>
                    {enfunde ?
                        <>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="row">
                                        <div className="col-6">
                                            <label>Presente</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control bg-white" disabled={true}
                                                       defaultValue={data.seccion.cant_pre}/>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <label>Futuro</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control bg-white" disabled={true}
                                                       defaultValue={data.seccion.cant_fut}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="row">
                                        <div className="col-3">
                                            <label>Variedad</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control bg-white" disabled={true}
                                                       defaultValue={`${enfunde.seccion.seccion_lote.variedad}`}/>
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <label>Edad</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control bg-white" disabled={true}
                                                       defaultValue={((moment().diff(moment(enfunde.seccion.seccion_lote.fecha_siembra), 'days')) / 352).toFixed(0)}/>
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <label>Suelo</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control bg-white" disabled={true}
                                                       defaultValue={`${enfunde.seccion.seccion_lote.tipo_suelo}`}/>
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <label>Has</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control bg-white" disabled={true}
                                                       defaultValue={`${(+enfunde.seccion.seccion_lote.has).toFixed(2)}`}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className="row p-0">
                                <div className="col-md-12 table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <thead className="text-center">
                                        <tr>
                                            <th>Empleado</th>
                                            <th>Reelevo</th>
                                            <th width="10%">Presente</th>
                                            <th width="10%">Futuro</th>
                                            <th width="10%">Total</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {enfunde && enfunde.detalleSemana.length > 0 &&
                                        enfunde.detalleSemana.map((item, i) => (
                                            <tr key={i} className="text-center"
                                                style={item.reelevo && {backgroundColor: 'rgba(67,255,179,0.35)'}}>
                                                <td style={style.table.textCenter}>{item.seccion['cab_seccion_labor'].empleado.nombre1
                                                    .concat(' ')
                                                    .concat(item.seccion['cab_seccion_labor'].empleado.nombre2)
                                                    .concat(' ')
                                                    .concat(item.seccion['cab_seccion_labor'].empleado.apellido1)}</td>
                                                <td style={style.table.textCenter}>
                                                    {item.reelevo && item.reelevo.nombre1
                                                        .concat(' ')
                                                        .concat(item.seccion['cab_seccion_labor'].empleado.apellido1)}
                                                </td>
                                                <td style={style.table.textCenter}>{+item.cant_pre}</td>
                                                <td style={style.table.textCenter}>{+item.cant_fut}</td>
                                                <td style={style.table.textCenter}>{+item.cant_pre + +item.cant_fut}</td>
                                            </tr>
                                        ))
                                        }
                                        <tr className="text-center" style={{backgroundColor: '#E6ECF5'}}>
                                            <td colSpan={2}><b>TOTAL SEMANA</b></td>
                                            <td><b>{sumPresente()}</b></td>
                                            <td><b>{sumFuturo()}</b></td>
                                            <td><b>{sumPresente() + sumFuturo()}</b></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                        :
                        <div className="row">
                            <div className="col-12 text-center">
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div>
                    }
                </>
            </ModalForm>
            }
        </>
    )
}
