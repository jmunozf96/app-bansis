import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {API_LINK} from "../../../../utils/constants";
import ApexChart from "../../../../components/ApexChart/ApexChart";
import {Col, Row} from "react-bootstrap";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import ModalForm from "../../../../components/ModalForm";

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
    const [secciones, setSecciones] = useState([]);
    const [cabeceraEnfunde, setCabeceraEnfunde] = useState(null);
    const history = useHistory();

    const [openModal, setOpenModal] = useState(false);
    const [dataSeccionEnfunde, setDataSeccionEnfunde] = useState(null);
    const [loadDataLote, setLoadDataLote] = useState(false);

    useEffect(() => {
        if (loadData) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/getEnfunde/semanal/detalle/${id}`;
                const request = await fetch(url);
                const response = await request.json();
                const {code} = response;
                if (code === 200) {
                    if (response.dataArray.length > 0) {
                        const {totalSemana, dataSemana, dataArray} = response;
                        setCabeceraEnfunde(dataSemana);
                        const datos = [];
                        dataArray.map((item) => {
                            const {cant_pre, cant_fut, alias} = item;
                            const seccion = {
                                series: [+(((+cant_pre + +cant_fut) / +totalSemana) * 100).toFixed(2)],
                                options: {
                                    chart: {
                                        height: 150,
                                        type: 'radialBar',
                                    },
                                    plotOptions: {
                                        radialBar: {
                                            hollow: {
                                                size: '60%',
                                            }
                                        },
                                    },
                                    labels: [`${alias}`],
                                }
                            };
                            const data = {
                                seccion,
                                item
                            };
                            datos.push(data);
                            return true;
                        });
                        setSecciones(datos);
                    }
                }

            })();
            setLoadData(false);
        }
    }, [loadData, id]);

    const openModalDetalle = (data) => {
        setOpenModal(true);
        setDataSeccionEnfunde({
            enfunde: cabeceraEnfunde,
            seccion: data
        });
        setLoadDataLote(true);
    };

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
                    <div className="col-md-2">
                        <label>Has. Total: </label>
                        <input className="form-control bg-white" disabled={true}
                               value={(+cabeceraEnfunde.has).toFixed(2)}/>
                    </div>
                    <div className="col-md-4">
                        <label>Hacienda: </label>
                        <input className="form-control bg-white" disabled={true}
                               value={cabeceraEnfunde.hacienda.detalle}/>
                    </div>
                    <div className="col-md-1">
                        <label>... </label>
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
                            {secciones.length > 0 &&
                            secciones.map((data, index) => (
                                <div className="col-md-2 col-6 text-center" key={index}>
                                    <ApexChart
                                        data={data.seccion}
                                        type="radialBar"
                                        height={200}
                                    />
                                    <button className="btn btn-primary mt-n4" onClick={() => openModalDetalle(data)}>
                                        <i className="fas fa-list"/> Detalles {data.item.alias}
                                    </button>
                                </div>
                            ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    );
}

function ModalDetalleEnfundeSeccionSemana(props) {
    const {open, setOpen, data, setData, loadDataLote, setLoadDataLote} = props;
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
                const url = `${API_LINK}/bansis-app/index.php/getEnfundeSeccion?calendario=${data.enfunde.codigo}&seccion=${data.seccion.item.idlote_sec}`;
                const request = await fetch(url);
                const response = await request.json();
                const {code} = response;
                if (code === 200) {
                    setEnfunde(response.dataArray);
                }
            })();
            setLoadDataLote(false);
        }
    }, [loadDataLote, data, setEnfunde, setLoadDataLote]);

    return (
        <>
            {data && data.seccion &&
            <ModalForm
                show={open}
                animation={true}
                icon="fas fa-map-pin"
                title={`Detalles de Enfunde en lote: ${data.seccion.item.alias} - Semana: ${data.enfunde.semana}`}
                backdrop="static"
                size="xl"
                centered={true}
                scrollable={true}
                save={() => null}
                cancel={cancelar}
            >
                <div className="row">
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-6">
                                <label>Presente</label>
                                <div className="input-group">
                                    <input type="text" className="form-control bg-white" disabled={true}
                                           defaultValue={data.seccion.item.cant_pre}/>
                                </div>
                            </div>
                            <div className="col-6">
                                <label>Futuro</label>
                                <div className="input-group">
                                    <input type="text" className="form-control bg-white" disabled={true}
                                           defaultValue={data.seccion.item.cant_fut}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                            {enfunde &&
                            <>
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
                                               defaultValue={`${enfunde.seccion.seccion_lote.fecha_siembra}`}/>
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
                            </>
                            }
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
                                <th width="13%">Has</th>
                                <th width="13%">Presente</th>
                                <th width="13%">Futuro</th>
                                <th width="13%">Total</th>
                                <th width="13%">...</th>
                            </tr>
                            </thead>
                            <tbody>
                            {enfunde && enfunde.detalleSemana.length > 0 &&
                            enfunde.detalleSemana.map((item, i) => (
                                <tr key={i} className="table-sm text-center">
                                    <td style={style.table.textCenter}>{item.seccion['cab_seccion_labor'].empleado.nombres}</td>
                                    <td style={style.table.textCenter}>{(+item.seccion.has).toFixed(2)}</td>
                                    <td style={style.table.textCenter}>{+item.cant_pre}</td>
                                    <td style={style.table.textCenter}>{+item.cant_fut}</td>
                                    <td style={style.table.textCenter}>{+item.cant_pre + +item.cant_fut}</td>
                                    <td>
                                        <button className="btn btn-info">
                                            Enfunde
                                        </button>
                                    </td>
                                </tr>
                            ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </ModalForm>
            }
        </>
    )
}
