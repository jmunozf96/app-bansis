import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import MapaLotesManos from "../../../components/app/cosecha/Informe/MapaLotesManos";
import {API_LINK} from "../../../constants/helpers";
import DanosHacienda from "../../../components/app/cosecha/Informe/DanosHacienda";
import ChartLotesManos from "../../../components/app/cosecha/Informe/ChartLotesManos";
import {transformarDataLotes} from "../../../components/app/cosecha/Informe/ChartPrepareData";
import DateRangePicker from "../../../components/app/cosecha/Informe/DateRangePicker";
import moment from "moment";
import 'moment/locale/es';
import {
    convertDataHttp_ConsolidarDanos,
    removeLocalStorage
} from "../../../components/app/cosecha/Informe/HelpersInforme";
import ListadoLotes from "../../../components/app/cosecha/Informe/ListadoLotes";

import emptyData from "../../../assets/img/svg/notfound.svg"
import ModalBase from "../../../components/app/cosecha/Informe/ModalBase";
import ChartLoteDanos from "../../../components/app/cosecha/Informe/ChartLoteDanos";

export default function () {
    const [danos, setDanos] = useState([]);
    const [data, setData] = useState([]);
    const [viewMap, setViewMap] = useState(true);
    const [viewChart, setViewChart] = useState(false);
    const [view, setView] = useState('');

    const [startDate, setStartDate] = useState(moment().format("DD/MM/YYYY"));
    const [endDate, setEndDate] = useState(moment().format("DD/MM/YYYY"));

    const [loadData, setLoadData] = useState(true);
    const [loadDanos, setLoadDanos] = useState(false);

    const [showDanosLote, setShowDanosLote] = useState({
        status: false,
        id: '',
        alias: ''
    });
    const [dataModal, setDataModal] = useState({
        show: false,
        view: ''
    });

    const [error, setError] = useState({
        status: false,
        messagge: `Buscando registros entre: <b>${startDate} - ${endDate}</b>...`
    });

    useEffect(() => {
        setDataModal({show: false, view: ''});
        removeLocalStorage('_dataManos');
        return () => {
            setDataModal({show: false, view: ''});
            removeLocalStorage('_dataManos');
        }
    }, []);

    const error_emptyData = useCallback(() => {
        setError({
            status: true,
            messagge: `<b> Error!!</b>, No se encontraron registros entre: <b>${startDate} - ${endDate}</b>`
        });

        setData([]); //Limpiamos
        removeLocalStorage('_dataManos');
        setLoadDanos(false);

    }, [startDate, endDate]);

    useEffect(() => {
        setLoadData(true);
    }, [startDate, endDate]);

    useEffect(() => {
        if (loadData) {
            setLoadDanos(false); //Seteamos para actualizar cada que se realiza una busqueda
            (async () => {
                try {
                    const respuesta = await axios.get(`${API_LINK}/bansis-app/index.php/cosecha/informe/manos-recusadas/1?desde=${startDate}&hasta=${endDate}`);
                    const {code} = respuesta.data;

                    if (code === 200) {
                        console.log('Respuesta Http Data: ', respuesta.data.datos);
                        if (respuesta.data.datos.length > 0) {
                            localStorage.setItem('_dataManos', JSON.stringify(respuesta.data.datos));
                            let data = convertDataHttp_ConsolidarDanos(respuesta.data.datos);
                            setData(data);
                            setLoadDanos(true);
                            setError({...error, status: false});
                        } else {
                            error_emptyData();
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
            })();
            setLoadData(false);
        }
    }, [loadData, startDate, endDate, error, error_emptyData]);

    const changeStatusModal = useCallback((id, alias) => {
        setShowDanosLote({status: true, id, alias});
    }, []);

    useEffect(() => {
        if (showDanosLote.status) {
            setDataModal({
                show: true,
                view: <ChartLoteDanos
                    id={showDanosLote.id}
                    alias={showDanosLote.alias}
                    danos={danos.filter(item => item.selected)}/>
            });
            setShowDanosLote({status: false, id: '', alias: ''});
        }
    }, [showDanosLote, danos]);

    useEffect(() => {
        //Poner el mapa por defecto
        if (!viewChart) {
            setView(<MapaLotesManos lotes={data}/>);
        } else {
            setView(<ChartLotesManos data={transformarDataLotes(data, changeStatusModal)}/>);
        }
    }, [data, viewChart, changeStatusModal]);

    const selectMapa = useCallback(() => {
        if (viewMap) {
            setView('');
        } else {
            setView(<MapaLotesManos lotes={data}/>);
        }
        if (viewChart) setViewChart(false);
        setViewMap(!viewMap);
    }, [viewMap, viewChart, data]);

    const selectChart = useCallback(() => {
        if (viewChart) {
            setView('');
        } else {
            setView(<ChartLotesManos data={transformarDataLotes(data, changeStatusModal)}/>);
        }
        if (viewMap) setViewMap(false);
        setViewChart(!viewChart);
    }, [viewChart, viewMap, data, changeStatusModal]);

    return (
        <React.Fragment>
            <div className="container-fluid mb-3" style={{marginTop: "4rem"}}>
                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12">
                                        <DateRangePicker
                                            start={setStartDate}
                                            end={setEndDate}
                                        />
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    {(!error.status && loadDanos) || data.length > 0 ?
                                        <DanosHacienda
                                            danos={danos}
                                            setDanos={setDanos}
                                            desde={startDate}
                                            hasta={endDate}
                                            load={loadDanos}
                                            dataFilter={setData}
                                        />
                                        :
                                        <div className="col-12">
                                            <div
                                                className="alert alert-danger"
                                                dangerouslySetInnerHTML={{__html: error.messagge}}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                            {data.length > 0 ?
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body pl-0 pr-0">
                                            <div className="col-12 mb-2">
                                                <div className="btn-group">
                                                    <button className={`btn btn-primary ${viewMap ? 'active' : ''}`}
                                                            onClick={() => selectMapa()}
                                                    >
                                                        <i className="fas fa-map-marked-alt"/> Mapa Geografico
                                                    </button>
                                                    <button className={`btn btn-primary ${viewChart ? 'active' : ''}`}
                                                            onClick={() => selectChart()}
                                                    >
                                                        <i className="fas fa-chart-bar"/> Estadisticas
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                {view}
                                                {/*Modal para mostrar daños*/}
                                                {dataModal.show &&
                                                <ModalBase
                                                    iconTitle="fas fa-chart-line"
                                                    title="Daños"
                                                    size={"xl"}
                                                    dataModal={dataModal}
                                                    setDataModal={setDataModal}
                                                />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="col-12 mt-5">
                                    <p className="text-center mt-5">
                                        <img src={emptyData} alt="not-found" width={700}/>
                                    </p>
                                </div>
                            }
                        </div>
                    </div>

                </div>
                {data.length > 0 &&
                <React.Fragment>
                    <hr/>
                    <div className="row">
                        <div className="col-12">
                            <ListadoLotes
                                data={data}
                                danosSelect={danos.filter(item => item.selected)}
                            />
                        </div>
                    </div>
                </React.Fragment>
                }
            </div>
        </React.Fragment>
    )
}
