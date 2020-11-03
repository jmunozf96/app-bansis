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

export default function () {
    const [data, setData] = useState([]);
    const [viewMap, setViewMap] = useState(true);
    const [viewChart, setViewChart] = useState(false);
    const [view, setView] = useState('');

    const [startDate, setStartDate] = useState(moment().format("DD/MM/YYYY"));
    const [endDate, setEndDate] = useState(moment().add(1, "days").format("DD/MM/YYYY"));

    const [loadData, setLoadData] = useState(true);

    useEffect(() => {
        return () => {
            if (localStorage.getItem('_dataManos')) {
                localStorage.removeItem('_dataManos');
            }
        }
    }, []);

    useEffect(() => {
        setLoadData(true);
    }, [startDate, endDate]);

    useEffect(() => {
        if (loadData) {
            (async () => {
                try {
                    const respuesta = await axios.get(`${API_LINK}/bansis-app/index.php/cosecha/informe/manos-recusadas/1?fecha=${startDate}`);
                    const {code} = respuesta.data;

                    if (code === 200) {
                        if (!localStorage.getItem('_dataManos')) {
                            localStorage.setItem('_dataManos', JSON.stringify(respuesta.data.datos));
                        }
                        let data = [...respuesta.data.datos.map(item => ({
                            id: item.id,
                            alias: item.alias,
                            lat: item.latitud,
                            lng: item.longitud,
                            cantidad: respuesta.data.datos.filter(data => data.id === item.id)[0]['manos_recusadas']
                                .reduce((total, data) => total + +data.cantidad, 0)
                        }))];
                        setData(data);
                    }
                } catch (e) {
                    console.error(e);
                }
            })();
            setLoadData(false);
        }
    }, [loadData, startDate, endDate]);

    useEffect(() => {
        //Poner el mapa por defecto
        if (!viewChart) {
            setView(<MapaLotesManos lotes={data}/>);
        } else {
            setView(<ChartLotesManos data={transformarDataLotes(data)}/>);
        }
    }, [data, viewChart]);

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
            setView(<ChartLotesManos data={transformarDataLotes(data)}/>);
        }
        if (viewMap) setViewMap(false);
        setViewChart(!viewChart);
    }, [viewChart, viewMap, data]);

    return (
        <React.Fragment>
            <div className="container-fluid mb-3" style={{marginTop: "4rem"}}>
                <div className="row">
                    <div className="col-md-4">
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
                            <div className="col-12">
                                <DanosHacienda
                                    desde={startDate}
                                    hasta={endDate}
                                    load={loadData}
                                    dataFilter={setData}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="row">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
