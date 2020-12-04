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
import ChartDanos from "../../../components/app/cosecha/Informe/ChartDanos";
import {useDispatch, useSelector} from "react-redux";
import {setDesde, setHacienda, setHasta} from "../../../reducers/cosecha/manosRecusadasDucks";
import OptionsHaciendas from "../../../components/Global/OptionsHaciendas";

export default function () {
    const [danos, setDanos] = useState([]);
    const [data, setData] = useState([]);
    const [viewMap, setViewMap] = useState(true);
    const [viewChartLotes, setViewChartLotes] = useState(false);
    const [viewChartDanos, setViewChartDanos] = useState(false);
    const [view, setView] = useState('');

    const dispatch = useDispatch();
    const credential = useSelector(state => state.login.credential);
    const hacienda = useSelector(state => state.manosRecusadas.hacienda);
    const [disabledHacienda, setDisabledHacienda] = useState(false);
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
        localStorage.removeItem('_dataManos');
        return () => {
            localStorage.removeItem('_dataManos');
        }
    }, []);

    useEffect(() => {
        if (credential.idhacienda) {
            setDisabledHacienda(true);
            dispatch(setHacienda(credential.idhacienda))
        }
    }, [credential, dispatch]);

    //Efecto para cambio de Fechas en Redux
    useEffect(() => {
        dispatch(setDesde(startDate));
        dispatch(setHasta(endDate));
    }, [dispatch, startDate, endDate]);

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
        setError({status: false, messagge: `Buscando registros entre: <b>${startDate} - ${endDate}</b>...`});
        if (!hacienda) {
            setData([]); //Limpiamos
            removeLocalStorage('_dataManos');
            setLoadDanos(false);
        } else {
            setLoadData(true);
        }
    }, [hacienda, startDate, endDate]);

    useEffect(() => {
        if (loadData && hacienda) {
            setLoadDanos(false); //Seteamos para actualizar cada que se realiza una busqueda
            (async () => {
                try {
                    const respuesta = await axios.get(`${API_LINK}/bansis-app/index.php/cosecha/informe/manos-recusadas/${hacienda.id}?desde=${startDate}&hasta=${endDate}`);
                    const {code} = respuesta.data;

                    if (code === 200) {
                        //console.log('Respuesta Http Data: ', respuesta.data.datos);
                        if (respuesta.data.datos.length > 0) {
                            localStorage.setItem('_dataManos', JSON.stringify(respuesta.data.datos));
                            let data = convertDataHttp_ConsolidarDanos(respuesta.data.datos);
                            setData(data);
                            setLoadDanos(true);
                            setError({...error, status: false});

                            setViewMap(true);
                            setViewChartLotes(false);
                            setViewChartDanos(false);
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
    }, [hacienda, loadData, startDate, endDate, error, error_emptyData]);

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
        if (!viewChartLotes && !viewChartDanos) {
            //Mapa update
            setView(<MapaLotesManos lotes={data}/>);
        } else if (!viewChartDanos) {
            //Lote Update
            setView(<ChartLotesManos data={transformarDataLotes(data, changeStatusModal)}/>);
        } else {
            //Danos Update
            setView(<ChartDanos danos={danos.filter(item => item.selected)} danosLotes={data}/>);
        }
    }, [danos, data, viewChartLotes, viewChartDanos, changeStatusModal]);

    const selectMapa = useCallback(() => {
        setView(<MapaLotesManos lotes={data}/>);
        if (viewChartLotes) setViewChartLotes(false);
        if (viewChartDanos) setViewChartDanos(false);
        setViewMap(true);
    }, [viewChartLotes, viewChartDanos, data]);

    const selectChartLotes = useCallback(() => {
        if (viewChartLotes) {
            setView('');
            setViewMap(true);
        } else {
            //setView(<ChartLotesManos data={transformarDataLotes(data, changeStatusModal)}/>);
            setViewMap(false);
        }
        if (viewChartDanos) setViewChartDanos(false);
        setViewChartLotes(!viewChartLotes);
    }, [viewChartLotes, viewChartDanos]);

    const selectChartDanos = useCallback(() => {
        if (viewChartDanos) {
            setView('');
            setViewMap(true);
        } else {
            //setView(<ChartDanos danos={danos.filter(item => item.selected)} danosLotes={data}/>);
            setViewMap(false);
        }
        if (viewChartLotes) setViewChartLotes(false);
        setViewChartDanos(!viewChartDanos);
    }, [viewChartDanos, viewChartLotes]);

    const changeOption = (e, data) => {
        const data_option = data['data-json'] !== undefined ? data['data-json'] : null;
        dispatch(setHacienda(data_option));
    };

    return (
        <React.Fragment>
            <div className="container-fluid mb-3" style={{marginTop: "4rem"}}>
                <div className="row">
                    <div className={`col-md-4`}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <OptionsHaciendas
                                            hacienda={hacienda}
                                            changeOption={changeOption}
                                            disabled={disabledHacienda}
                                        />
                                    </div>
                                    {hacienda &&
                                    <React.Fragment>
                                        <div className={`col-12 mt-3`}>
                                            <DateRangePicker
                                                start={setStartDate}
                                                end={setEndDate}
                                            />
                                        </div>
                                    </React.Fragment>
                                    }
                                </div>
                                <hr/>
                                {hacienda &&
                                <div className="row">
                                    {(!error.status && loadDanos) || data.length > 0 ?
                                        <DanosHacienda
                                            danos={danos}
                                            setDanos={setDanos}
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
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className={`col-md-8`}>
                        <div className="row">
                            {data.length > 0 ?
                                <React.Fragment>
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
                                                        <button
                                                            className={`btn btn-primary ${viewChartLotes ? 'active' : ''}`}
                                                            onClick={() => selectChartLotes()}
                                                        >
                                                            <i className="fas fa-chart-bar"/> Lotes
                                                        </button>
                                                        <button
                                                            className={`btn btn-danger ${viewChartDanos ? 'active' : ''}`}
                                                            onClick={() => selectChartDanos()}
                                                        >
                                                            <i className="fas fa-exclamation-circle"/> Danos
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
                                    <div className="col-12 mt-2">
                                        <ListadoLotes
                                            data={data}
                                            danosSelect={danos.filter(item => item.selected)}
                                        />
                                    </div>
                                </React.Fragment>
                                :
                                <div className="col-12 mt-5">
                                    <p className="text-center">
                                        <img src={emptyData} alt="not-found" width={450}/>
                                    </p>
                                    <hr/>
                                    <p className="text-center">
                                        <em><b>No se han encontrado datos.</b></em>
                                    </p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
