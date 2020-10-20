import React, {useEffect, useState} from "react";
import Buscador from "../../../components/Buscador";
import {API_LINK} from "../../../utils/constants";
import {useSelector} from "react-redux";
import ApexChart from "../../../components/ApexChart/ApexChart";
import ModalForm from "../../../components/ModalForm";
//import {Modal} from "react-bootstrap";
//import login from "../../login";

export default function DashboardEnfunde() {
    const credential = useSelector((state) => state.login.credential);

    //Filttros
    const [periodo, setPeriodo] = useState(0);
    const [semanas, setSemanas] = useState([]);

    const [hacienda, setHacienda] = useState(null);
    const [load, setLoad] = useState(true);

    //const [apiLoteSeccion, setApiLoteSeccion] = useState('');
    const [haciendasCard, setHaciendasCard] = useState([]);

    const [configModal, setConfigModal] = useState(configuracionModal);

    const onHideModal = () => {
        setConfigModal({
            ...configModal,
            show: false
        });
    };

    return (
        <ContainerPrincipal>
            <Titulo periodo={periodo}/>
            <div className="col-12 mt-2 mb-3">
                <div className="row">
                    <div className="col-12">
                        <ModalData
                            configuracion={configModal}
                            onHide={onHideModal}
                        >
                            <p>Hola mundo</p>
                        </ModalData>
                    </div>
                    <div className="col-md-5 col-12">
                        <div className="row">
                            <MenuPeriodo
                                col={12}
                                credential={credential}
                                //hacienda={hacienda}
                                setHacienda={setHacienda}
                                //apiLoteSeccion={apiLoteSeccion}
                                //setApiLoteSeccion={setApiLoteSeccion}
                                setLoad={setLoad}
                                periodo={periodo}
                                setPeriodo={setPeriodo}
                                setSemanas={setSemanas}
                            />
                            <div className="col-12">
                                <div className="row">
                                    {haciendasCard.length > 0 && haciendasCard.map((data, i) =>
                                        <CardData key={i} xl={12} lg={12} data={data}/>
                                    )}
                                    {/*<CardData xl={6} lg={12} data={hacienda1}/>
                                    <CardData xl={6} lg={12} data={hacienda2}/>*/}
                                </div>
                            </div>
                            <div className="m-1"/>
                            <MenuGrafico
                                icon="fas fa-chart-pie"
                                col={12}
                                label="Enfunde Hacienda %"
                            >
                                <AlertInfo
                                    icon='fas fa-check-circle'
                                    type='primary'
                                    title="Información: "
                                    message="Porcentaje (%) de Enfunde por Hacienda."
                                    padding="pt-2 pr-2 pl-2"
                                />
                                <GraficoPastelEnfundeHacienda
                                    hacienda={hacienda}
                                    load={load}
                                    setLoad={setLoad}
                                    setHaciendas={setHaciendasCard}
                                />
                            </MenuGrafico>
                            <div className="m-1"/>
                            <MenuGrafico
                                icon="fas fa-chart-bar"
                                col={12}
                                label="Enfunde Anual"
                            >
                                <GraficoBarrasAnual
                                    hacienda={hacienda}
                                    load={load}
                                    setLoad={setLoad}
                                />
                            </MenuGrafico>
                            <div className="m-1"/>
                            <MenuGrafico
                                icon="fas fa-chart-bar"
                                col={12}
                                label="Enfunde vs Has / Semanal"
                            >
                                <HaciendaStatus hacienda={hacienda}>
                                    <AlertInfo
                                        icon='fas fa-check-circle'
                                        type='primary'
                                        title="Información "
                                        message="Comparación de variables: Se mide la mayor cantidad de (enfunde/hectarea),
                                    contra las hectareas totales de los lotes donde se ha enfundado."
                                        padding="pt-2 pr-2 pl-2"
                                    />
                                    <GraficoVariables
                                        hacienda={hacienda}
                                        modal={configModal}
                                        setModal={setConfigModal}
                                        load={load}
                                        setLoad={setLoad}
                                        periodo={periodo}
                                        semanas={semanas}
                                    />
                                    <AlertInfo
                                        icon='fas fa-info-circle'
                                        type='warning'
                                        title="Información: "
                                        message="Dar click en algún valor, para visualizar información del lote."
                                        padding="pl-2 pr-2"
                                    />
                                </HaciendaStatus>
                            </MenuGrafico>
                        </div>
                    </div>
                    <div className="col-md-7 col-12">
                        <div className="row">
                            <MenuGrafico
                                icon="fas fa-chart-bar"
                                col={12}
                                label="Enfunde Periodal"
                            >
                                <AlertInfo
                                    icon='fas fa-check-circle'
                                    type='info'
                                    title="Información: "
                                    message="Comparación de enfunde por periodo entre fincas registradas."
                                    padding="p-2"
                                />
                                <GraficoBarrasPeriodo
                                    hacienda={hacienda}
                                    load={load}
                                    setLoad={setLoad}
                                    periodo={periodo}
                                />
                            </MenuGrafico>
                            <div className="m-1"/>
                            <MenuGrafico
                                icon="fas fa-chart-bar"
                                col={12}
                                label="Enfunde Lote"
                            >
                                <HaciendaStatus hacienda={hacienda}>
                                    <AlertInfo
                                        icon='fas fa-info-circle'
                                        type='warning'
                                        title="Información: "
                                        message="Dar click en la barra del lote para visualizar los loteros que han trabajado ahí."
                                        padding="p-2"
                                    />
                                    <GraficoBarrasLote
                                        modal={configModal}
                                        setModal={setConfigModal}
                                        hacienda={hacienda}
                                        load={load}
                                        setLoad={setLoad}
                                        periodo={periodo}
                                        semanas={semanas}
                                    />
                                </HaciendaStatus>
                            </MenuGrafico>
                            <div className="m-1"/>
                            <MenuGrafico
                                icon="fas fa-chart-bar"
                                col={12}
                                label="Enfunde Lotero"
                            >
                                <HaciendaStatus hacienda={hacienda}>
                                    <AlertInfo
                                        icon='fas fa-info-circle'
                                        type='warning'
                                        title="Información: "
                                        message="Dar click en la barra del lotero para visualizar los lotes donde ha enfundado."
                                        padding="p-2"
                                    />
                                    <GraficoBarrasLoteros
                                        modal={configModal}
                                        setModal={setConfigModal}
                                        hacienda={hacienda}
                                        load={load}
                                        setLoad={setLoad}
                                        periodo={periodo}
                                        semanas={semanas}
                                    />
                                </HaciendaStatus>
                            </MenuGrafico>
                        </div>
                    </div>
                </div>
            </div>
        </ContainerPrincipal>
    )
}

function HaciendaStatus({hacienda, children}) {
    if (hacienda === null) {
        return (
            <div className="col-12">
                <div className="jumbotron jumbotron-fluid m-0">
                    <div className="container">
                        <React.Fragment>
                            <h1 className="display-5">
                                <i className="fas fa-info"/> Seleccionar una Hacienda.
                            </h1>
                            <p className="lead">El grafico muestra la información de cada hacienda, se debe
                                seleccionar cualquier hacienda a la que desee realizar un analisis.</p>
                        </React.Fragment>
                    </div>
                </div>
            </div>
        )
    }

    return children
}

function ContainerPrincipal({children}) {
    return (
        <div className="container-fluid">
            <div className="row">
                {children}
            </div>
        </div>
    )
}

function Titulo({periodo}) {
    return (
        <div className="col-12 mt-3">
            <div className="card">
                <div className="card-header">
                    <h5 className="m-0"><i className="fas fa-chart-bar"/> INFORME DE
                        ENFUNDE {periodo > 0 && ` | PERIODO : ${periodo}`}</h5>
                </div>
            </div>
        </div>
    )
}

function MenuPeriodo({col, credential, setHacienda, setLoad, periodo, setPeriodo, setSemanas}) {
    return (
        <div className={`col-md-${col} col-12`}>
            <div className="card">
                <div className="card-header p-2">
                    <h6 className="m-0"><i className="fas fa-filter"/> Filtrar datos</h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12 mb-2">
                            <HaciendaSelect
                                credential={credential}
                                setHacienda={setHacienda}
                                setLoad={setLoad}
                            />
                        </div>
                        {/*<div className="col-12">
                            <LotesSelect
                                hacienda={hacienda}
                                apiLoteSeccion={apiLoteSeccion}
                            />
                        </div>*/}
                        <Periodos
                            periodo={periodo}
                            setPeriodo={setPeriodo}
                            setLoad={setLoad}
                            setSemanas={setSemanas}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function HaciendaSelect({credential, setHacienda, setLoad}) {
    const api_buscador = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const [haciendaSelect, setHaciendaSelect] = useState(credential.idhacienda ? credential.idhacienda : null);

    const changeHacienda = (e, value) => {
        setHaciendaSelect(value);
        if (value) {
            setHacienda(value);
            //setApiLoteSeccion(`${API_LINK}/bansis-app/index.php/lotes-seccion-select?hacienda=${value.id}`)
        } else {
            setHacienda(null);
            //setApiLoteSeccion("");
        }
        setLoad(true);
    };

    return (
        <Buscador
            api={api_buscador}
            change={changeHacienda}
            disabled={!!(credential && credential.idhacienda)}
            id="id-hacienda-search"
            label="Hacienda"
            setData={setHaciendaSelect}
            variant="outlined"
            value={haciendaSelect}
        />
    )
}

/*function LotesSelect({hacienda, apiLoteSeccion}) {
    const [loteSeccion, setLoteSeccion] = useState(null);

    const changeLoteSeccion = (e, value) => {
        setLoteSeccion(value);
    };

    return (
        <Buscador
            api={apiLoteSeccion}
            value={loteSeccion}
            change={changeLoteSeccion}
            disabled={(hacienda === null)}
            id="id-seccion-search"
            label="Seleccione una Seccion"
            setData={setLoteSeccion}
            variant="outlined"
        />
    )
}*/

function MenuGrafico({col, children, icon, label}) {
    return (
        <div className={`col-md-${col} col-12`}>
            <div className="card">
                <div className="card-header p-2">
                    <h6 className="m-0"><i className={icon}/> {label} </h6>
                </div>
                <div className="card-body p-1">
                    <div className="row">
                        {/*Componentes gráficos*/}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

function GraficoBarrasPeriodo({hacienda, load, setLoad, periodo}) {
    const [data, setData] = useState({
        series: [],
        options: {
            chart: {
                type: 'line',
                height: 500,
            },
            stroke: {
                show: true,
                curve: 'straight',
            },
            fill: {
                opacity: 5,
            },
            dataLabels: {
                enabled: false
            },
        }
    });

    useEffect(() => {
        if (load) {
            (async () => {
                try {
                    let url = `${API_LINK}/bansis-app/index.php/dashboard/enfunde/enfunde-periodo`;
                    let str_hacienda = '';
                    let str_periodo = '';

                    if (hacienda) str_hacienda = `?idhacienda=${hacienda.id}`;
                    if (periodo > 0) str_periodo = str_hacienda !== '' ? `&periodo=${periodo}` : `?periodo=${periodo}`;

                    url += str_hacienda + str_periodo;

                    const request = await fetch(url);
                    const response = await request.json();
                    const {code} = response;

                    if (code === 200) {
                        const {dataChartBarPrimo, dataChartBarSofca, dataOptions} = response;
                        let data = [];
                        if (dataChartBarPrimo) {
                            data.push(dataChartBarPrimo)
                        }
                        if (dataChartBarSofca) {
                            data.push(dataChartBarSofca)
                        }
                        setData({
                            ...data,
                            series: data,
                            options: {
                                ...data.options,
                                xaxis: {
                                    categories: dataOptions,
                                },
                            }
                        })
                    }

                } catch (e) {
                    console.error(e)
                }
            })();
            setLoad(false);
        }
    }, [data, hacienda, load, setLoad, periodo]);

    return (
        <React.Fragment>
            <div className="col-12">
                <ApexChart
                    data={data}
                    type="line"
                    height={300}
                />
            </div>
        </React.Fragment>
    )
}

function GraficoBarrasLote({modal, setModal, hacienda, load, setLoad, periodo, semanas}) {
    const [data, setData] = useState({
        series: [],
        options: {
            chart: {
                type: 'bar',
                height: 500,
                events: {
                    dataPointSelection: (event, chartContext, config) => {
                        const id = config.w.config.dataId[config.dataPointIndex];
                        if (config.selectedDataPoints[0].length > 0) {
                            const periodo = config.w.config.dataPeriodo;
                            const semana = config.w.config.dataSemana;
                            let url = `${API_LINK}/bansis-app/index.php/dashboard/enfunde/enfunde-lote-data?idlote=${id}`;

                            let str_periodo = '', str_semana = '';
                            str_periodo = +periodo > 0 ? `&periodo=${periodo}` : '';
                            str_semana = +semana > 0 ? `&semana=${semana}` : '';
                            url += str_periodo + str_semana;

                            const data = peticionHttp(url);
                            data.then(
                                response => {
                                    if (response.code === 200) {
                                        setModal({
                                            ...modal,
                                            show: true,
                                            icon: 'fas fa-bars',
                                            title: 'Detalle de Loteros en lote: ' + config.w.config.xaxis.categories[config.dataPointIndex],
                                            view: View(response.data)
                                        });
                                    } else {
                                        alert(response.errors);
                                        console.error(response.errors);
                                    }
                                },
                                error => {
                                    console.error(error)
                                }
                            );

                        }
                    }
                }
            },
            fill: {
                opacity: 5,
            },
            dataLabels: {
                enabled: false
            },
        }
    });
    const [semana, setSemana] = useState(0);
    const [loadComponent, setLoadComponent] = useState(false);

    useEffect(() => {
        if (load || loadComponent) {
            (async () => {
                try {
                    let url = `${API_LINK}/bansis-app/index.php/dashboard/enfunde/enfunde-lote?idhacienda=${hacienda.id}`;
                    let str_periodo = '';
                    let str_semana = '';
                    if (periodo > 0) str_periodo = `&periodo=${periodo}`;
                    if (semana > 0) str_semana = `&semana=${semana}`;

                    url += str_periodo + str_semana;
                    const request = await fetch(url);
                    const response = await request.json();
                    const {code} = response;

                    if (code === 200) {
                        const {valueLotes, dataOptions, dataId} = response;
                        setData({
                            ...data,
                            series: [valueLotes],
                            options: {
                                ...data.options,
                                xaxis: {
                                    categories: dataOptions,
                                },
                                dataId: dataId,
                                dataPeriodo: periodo,
                                dataSemana: semana
                            }
                        })
                    }
                    //await setLoading(false);
                } catch (e) {
                    console.error(e)
                }
            })();
            setLoad(false);
            setLoadComponent(false);
        }
    }, [load, setLoad, loadComponent, setLoadComponent, hacienda, periodo, data, setData, semana]);

    function View(data) {
        const totalizar = (dataIndex, sum = true) => {
            let total = data.reduce((total, item) => +total + +item[dataIndex], 0);
            if (!sum) /*Calcular el promedio*/ total = total / data.length;
            return total;
        };

        return (
            <div className="row">
                <div className="col-12">
                    <div className="alert alert-info">
                        <b><i className="fas fa-info-circle"/> Información:</b> Loteros que han enfundado en este lote,
                        se detalla:
                        <div className="mt-2"/>
                        <ul>
                            <div className="row">
                                <div className="col-md-6">
                                    <li>Semana de inicio hasta la semana que ha enfundado.</li>
                                    <li>Semanas total enfundadas.</li>
                                    <li>Hectareas (Has.) promedio asignadas.</li>
                                </div>
                                <div className="col-md-6">
                                    <li>Total enfundado en todas las semanas.</li>
                                    <li>Enfunde por Has.</li>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
                <div className="col-12 table-responsive">
                    <table className="table table-bordered table-hovered">
                        <thead className="text-center">
                        <tr>
                            <th>Empleado</th>
                            <th>Sem.Ini</th>
                            <th>Sem.Fin.</th>
                            <th>Sem.Total</th>
                            <th>Has. PromSem.</th>
                            <th>Enfunde</th>
                            <th>Enf./Has.</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.length > 0 && data.map((item, i) =>
                            <tr key={i}>
                                <td>{item.nombres}</td>
                                <td className="text-center">{item.SemanaInicio}</td>
                                <td className="text-center">{item.SemanaFin}</td>
                                <td className="text-center">{item.semanasLaboradas}</td>
                                <td className="text-center">{parseFloat(item.HasProm).toFixed(2)}</td>
                                <td className="text-center">{item.total}</td>
                                <td className="text-center">{item.totalHas}</td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan={3} className="text-center"><b>TOTAL:</b></td>
                            {/*<td className="text-center"><b>{parseInt(totalizar('SemanaInicio', false))}</b></td>
                            <td className="text-center"><b>{parseInt(totalizar('SemanaFin', false))}</b></td>*/}
                            <td className="text-center"><b>{parseInt(totalizar('semanasLaboradas', false))}</b></td>
                            <td className="text-center"><b>{(totalizar('HasProm', false)).toFixed(2)}</b></td>
                            <td className="text-center"><b>{parseInt(totalizar('total', true))}</b></td>
                            <td className="text-center"><b>{(totalizar('totalHas', false)).toFixed(2)}</b></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="col-12">
                <Semanas
                    periodo={periodo}
                    semana={semana}
                    setSemana={setSemana}
                    setLoadData={setLoadComponent}
                    semanas={semanas}
                />
            </div>
            <div className="col-12">
                <ApexChart
                    data={data}
                    type="bar"
                    height={300}
                />
            </div>
        </React.Fragment>
    )
}

function GraficoBarrasLoteros({modal, setModal, hacienda, load, setLoad, periodo, semanas}) {
    const [data, setData] = useState({
        series: [],
        options: {
            chart: {
                type: 'bar',
                events: {
                    dataPointSelection: (event, chartContext, config) => {
                        //console.log(chartContext, config);
                        const id = config.w.config.dataId[config.dataPointIndex];
                        if (config.selectedDataPoints[0].length > 0) {
                            const periodo = config.w.config.dataPeriodo;
                            const semana = config.w.config.dataSemana;
                            let url = `${API_LINK}/bansis-app/index.php/dashboard/enfunde/enfunde-lotero-data?idlotero=${id}`;

                            let str_periodo = '', str_semana = '';
                            str_periodo = +periodo > 0 ? `&periodo=${periodo}` : '';
                            str_semana = +semana > 0 ? `&semana=${semana}` : '';
                            url += str_periodo + str_semana;

                            const data = peticionHttp(url);
                            data.then(
                                response => {
                                    if (response.code === 200) {
                                        setModal({
                                            ...modal,
                                            show: true,
                                            icon: 'fas fa-bars',
                                            title: 'Detalle de Lotes de ' + config.w.config.xaxis.categories[config.dataPointIndex],
                                            view: View(response.data)
                                        });
                                    } else {
                                        alert(response.errors);
                                        console.error(response.errors);
                                    }
                                },
                                error => {
                                    console.error(error)
                                }
                            );

                        }
                    },
                }
            },
            stroke: {
                show: true,
                curve: 'straight',
            },
            fill: {
                opacity: 5,
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: false
            },
        }
    });
    const [semana, setSemana] = useState(0);
    const [loadComponent, setLoadComponent] = useState(false);

    useEffect(() => {
        if (load || loadComponent) {
            (async () => {
                try {
                    let url = `${API_LINK}/bansis-app/index.php/dashboard/enfunde/enfunde-lotero?idhacienda=${hacienda.id}`;
                    let str_periodo = '';
                    let str_semana = '';
                    if (periodo > 0) str_periodo = `&periodo=${periodo}`;
                    if (semana > 0) str_semana = `&semana=${semana}`;

                    url += str_periodo + str_semana;
                    const request = await fetch(url);
                    const response = await request.json();
                    const {code} = response;

                    if (code === 200) {
                        const {values, options, dataId} = response;

                        setData({
                            ...data,
                            series: [values],
                            options: {
                                ...data.options,
                                xaxis: {
                                    categories: options,
                                },
                                dataId: dataId,
                                dataPeriodo: periodo,
                                dataSemana: semana
                            },
                        })
                    }

                } catch (e) {
                    console.error(e)
                }
            })();
            setLoad(false);
            setLoadComponent(false);
        }
    }, [load, setLoad, loadComponent, setLoadComponent, data, setData, hacienda, periodo, semana]);

    function View(data) {
        const totalizar = (dataIndex, sum = true) => {
            let total = data.reduce((total, item) => +total + +item[dataIndex], 0);
            if (!sum) /*Calcular el promedio*/ total = total / data.length;
            return total;
        };

        return (
            <div className="row">
                <div className="col-12">
                    <div className="alert alert-info">
                        <b><i className="fas fa-info-circle"/> Información:</b> Lotes donde ha enfundado, se detalla:
                        <div className="mt-2"/>
                        <ul>
                            <div className="row">
                                <div className="col-md-6">
                                    <li>Semana de inicio hasta la semana que ha enfundado.</li>
                                    <li>Semanas total enfundadas.</li>
                                    <li>Hectareas (Has.) promedio asignadas.</li>
                                </div>
                                <div className="col-md-6">
                                    <li>Total enfundado en todas las semanas.</li>
                                    <li>Enfunde por Has.</li>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
                <div className="col-12 table-responsive">
                    <table className="table table-bordered table-hovered">
                        <thead className="text-center">
                        <tr>
                            <th>Lote</th>
                            <th>Sem.Ini</th>
                            <th>Sem.Fin.</th>
                            <th>Sem.Total</th>
                            <th>Has. PromSem.</th>
                            <th>Enfunde</th>
                            <th>Enf./Has.</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.length > 0 && data.map((item, i) =>
                            <tr key={i}>
                                <td className="text-center">{item.alias}</td>
                                <td className="text-center">{item.SemanaInicio}</td>
                                <td className="text-center">{item.SemanaFin}</td>
                                <td className="text-center">{item.semanasLaboradas}</td>
                                <td className="text-center">{parseFloat(item.HasProm).toFixed(2)}</td>
                                <td className="text-center">{item.total}</td>
                                <td className="text-center">{item.totalHas}</td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan={3} className="text-center"><b>TOTAL:</b></td>
                            {/*<td className="text-center"><b>{parseInt(totalizar('SemanaInicio', false))}</b></td>
                            <td className="text-center"><b>{parseInt(totalizar('SemanaFin', false))}</b></td>*/}
                            <td className="text-center"><b>{parseInt(totalizar('semanasLaboradas', false))}</b></td>
                            <td className="text-center"><b>{(totalizar('HasProm', false)).toFixed(2)}</b></td>
                            <td className="text-center"><b>{parseInt(totalizar('total', true))}</b></td>
                            <td className="text-center"><b>{(totalizar('totalHas', false)).toFixed(2)}</b></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="col-12">
                <Semanas
                    periodo={periodo}
                    semana={semana}
                    setSemana={setSemana}
                    setLoadData={setLoadComponent}
                    semanas={semanas}
                />
            </div>
            <div className="col-12">
                <ApexChart
                    data={data}
                    type="bar"
                    style={{marginLeft: 25, marginRight: 15}}
                    height=""
                />
            </div>
        </React.Fragment>
    )
}

function GraficoBarrasAnual({hacienda, load, setLoad}) {
    const [data, setData] = useState({
        series: [],
        options: {
            chart: {
                type: 'bar',
                height: 500,
            },
            stroke: {
                show: true,
                curve: 'straight',
            },
            fill: {
                opacity: 5,
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: false
            },
        }
    });

    useEffect(() => {
        if (load) {
            (async () => {
                try {
                    let url = `${API_LINK}/bansis-app/index.php/dashboard/enfunde/enfunde-historico`;
                    let str_hacienda = '';
                    if (hacienda) str_hacienda = `?idhacienda=${hacienda.id}`;
                    url += str_hacienda;

                    const request = await fetch(url);
                    const response = await request.json();
                    const {code} = response;

                    if (code === 200) {
                        const {series, categories} = response;
                        setData({
                            ...data,
                            series: series,
                            options: {
                                ...data.options,
                                xaxis: {
                                    categories: categories,
                                },
                            }
                        })
                    }

                } catch (e) {
                    console.error(e)
                }
            })();
            setLoad(false);
        }
    }, [load, setLoad, data, hacienda]);

    return (
        <React.Fragment>
            <div className="col-12">
                <ApexChart
                    data={data}
                    type="bar"
                    height={300}
                />
            </div>
        </React.Fragment>
    )
}

function GraficoPastelEnfundeHacienda({hacienda, load, setLoad, setHaciendas}) {
    const [data, setData] = useState({
        series: [],
        options: {
            chart: {
                type: 'pie',
                height: 500,
                events: {
                    dataPointSelection: (event, chartContext, config) => {
                        //console.log(chartContext, config);
                        /*console.log(config.w.config.dataId[config.dataPointIndex]);
                        console.log(config.w.config.series[config.dataPointIndex]);
                        console.log(config.w.config.labels[config.dataPointIndex]);*/
                    },
                }
            },
            fill: {
                opacity: 5,
            },
            dataLabels: {
                enabled: true
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        show: false
                    }
                },
            }],
            legend: {
                position: 'bottom',
            }
        }
    });

    useEffect(() => {
        if (load) {
            (async () => {
                try {
                    let url = '';
                    if (hacienda) {
                        url = `${API_LINK}/bansis-app/index.php/dashboard/enfunde/enfunde-hacienda?idhacienda=${hacienda.id}`;
                    } else {
                        url = `${API_LINK}/bansis-app/index.php/dashboard/enfunde/enfunde-hacienda`;
                    }
                    const request = await fetch(url);
                    const response = await request.json();
                    const {code} = response;

                    if (code === 200) {
                        const {values, options, dataHaciendas, dataId} = response;
                        setData({
                            ...data,
                            series: values,
                            options: {
                                ...data.options,
                                labels: options,
                                dataId: dataId
                            }
                        });

                        setHaciendas(dataHaciendas);
                    }

                } catch (e) {
                    console.error(e)
                }
            })();
            setLoad(false)
        }
    }, [load, setLoad, data, hacienda, setHaciendas]);

    return (
        <React.Fragment>
            <div className="col-12">
                <ApexChart
                    data={data}
                    type="pie"
                    height={500}
                />
            </div>
        </React.Fragment>
    )
}

function GraficoVariables({hacienda, modal, setModal, load, setLoad, periodo, semanas}) {
    const [data, setData] = useState({
        series: [],
        options: {
            chart: {
                height: 400,
                type: 'scatter',
                zoom: {
                    enabled: true,
                    type: 'xy'
                },
                events: {
                    dataPointSelection: (event, chartContext, config) => {
                        const lote = {
                            id: config.w.config.dataId[config.dataPointIndex]
                        };
                        if (config.selectedDataPoints[0].length > 0) {
                            const periodo = config.w.config.dataPeriodo;
                            const semana = config.w.config.dataSemana;
                            let url = `${API_LINK}/bansis-app/index.php/dashboard/enfunde/enfunde-has-dataLote?idseccion=${lote.id}`;

                            let str_periodo = '', str_semana = '';
                            str_periodo = +periodo > 0 ? `&periodo=${periodo}` : '';
                            str_semana = +semana > 0 ? `&semana=${semana}` : '';
                            url += str_periodo + str_semana;

                            const data = peticionHttp(url);
                            data.then(
                                response => {
                                    if (response.code === 200) {
                                        setModal({
                                            ...modal,
                                            show: true,
                                            icon: 'fas fa-bars',
                                            title: 'Detalle de enfunde semanal Lote: ' + response.seccion['alias'] + ' - Has.: ' + parseFloat(response.seccion['has']).toFixed(2),
                                            view: View(response)
                                        });
                                    } else {
                                        alert(response.errors);
                                        console.error(response.errors);
                                    }
                                },
                                error => {
                                    console.error(error)
                                }
                            );

                        }
                    },
                }
            },
            dataLabels: {
                enabled: false
            },
        }
    });
    const [semana, setSemana] = useState(0);
    const [loadComponent, setLoadComponent] = useState(false);

    useEffect(() => {
        if (load || loadComponent) {
            (async () => {
                try {
                    let url = `${API_LINK}/bansis-app/index.php/dashboard/enfunde/enfunde-has?idhacienda=${hacienda.id}`;
                    let str_periodo = '';
                    let str_semana = '';
                    if (periodo > 0) str_periodo = `&periodo=${periodo}`;
                    if (semana > 0) str_semana = `&semana=${semana}`;

                    url += str_periodo + str_semana;
                    const request = await fetch(url);
                    const response = await request.json();
                    const {code} = response;

                    if (code === 200) {
                        const {series, dataId} = response;
                        setData({
                            ...data,
                            series: series,
                            options: {
                                ...data.options,
                                xaxis: {
                                    tickAmount: 5,
                                    labels: {
                                        formatter: function (val) {
                                            return parseFloat(val).toFixed(0)
                                        }
                                    }
                                },
                                yaxis: {
                                    tickAmount: 5
                                },
                                dataId: dataId,
                                dataPeriodo: periodo,
                                dataSemana: semana
                            }
                        })
                    }

                } catch (e) {
                    console.error(e)
                }
            })();
            setLoad(false);
            setLoadComponent(false);
        }
    }, [load, setLoad, loadComponent, setLoadComponent, data, setData, hacienda, periodo, semana]);

    function View({series, categories}) {
        const data = {
            series: [series],
            options: {
                chart: {
                    type: 'line',
                    height: 500,
                },
                fill: {
                    opacity: 5,
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories,
                },
            }
        };
        return (
            <ApexChart
                data={data}
                type="line"
                height={300}
            />
        )
    }

    return (
        <React.Fragment>
            <div className="col-12">
                <Semanas
                    periodo={periodo}
                    semana={semana}
                    setSemana={setSemana}
                    setLoadData={setLoadComponent}
                    semanas={semanas}
                />
            </div>
            <div className="col-12">
                <ApexChart
                    data={data}
                    type="scatter"
                    height={300}
                />
            </div>
        </React.Fragment>
    )
}

function CardData({xl, lg, data}) {
    return (
        <div className={`col-xl-${xl} col-lg-${lg} col-md-12 col-sm-12 col-12 mt-2`}>
            <div className="card">
                <div className="card-body p-0">
                    <div className="row">
                        <div className="col-12 m-0 text-left">
                            <ul className="list-group list-group-flush">
                                <CardDataItem data={data}/>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ModalData({configuracion, onHide}) {
    return (
        <ModalForm
            show={configuracion.show}
            icon={configuracion.icon}
            title={configuracion.title}
            animation={configuracion.animation}
            backdrop={configuracion.backdrop}
            size={configuracion.size}
            centered={configuracion.centered}
            scrollable={configuracion.scrollable}
            dialogSize={'65'}
            cancel={onHide}
            save={onHide}
        >
            {configuracion.view}
        </ModalForm>
    )
}

function configuracionModal() {
    return {
        show: false,
        icon: '',
        title: '',
        animation: true,
        backdrop: true,
        size: 'lg',
        centered: true,
        scrollable: true,
        view: null
    }
}

function AlertInfo({icon, type, title, message, ...data}) {
    return (
        <div className="col-12">
            <div className={`row ${data.padding}`}>
                <div className="col-12">
                    <div className={`alert alert-${type}`}>
                        <b><i className={icon}/> {title}</b> {message}
                    </div>
                </div>
            </div>
        </div>
    )
};

function CardDataItem({data}) {
    return (
        <li className="list-group-item">
            {data.detalle} <h2 className="m-0"><i
            className="fas fa-sort-numeric-up-alt"/> {parseInt(data.enfunde).toLocaleString()}
        </h2>
        </li>
    )
}

function ListCardLoteros() {
    return (
        <React.Fragment>
            <div className="row p-3">
                <div className="col-12" style={{height: "calc(42vh - 100px)", overflowY: "auto"}}>
                    <div className="row">
                        {[Array(20).fill(1).map((x, i) =>
                            <React.Fragment key={i}>
                                <div className="col-md-3">
                                    <CardLotero/>
                                </div>
                            </React.Fragment>
                        )]}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

function CardLotero() {
    //En observacion, tarjeta de loteros, si la necesito la usare en un futuro
    const card_style = {
        card: {
            borderRadius: 6,
            boxShadow: "0 1px 5px rgba(0,0,0,.08), 0 0 4px rgba(0,0,0,.05)",
        }
    };

    return (
        <div className="card mb-2" style={card_style.card}>
            <div className="card-header text-center pt-2 pb-2 bg-warning text-white">
                <i className="fas fa-exclamation-circle fa-2x"/>
            </div>
            <div className="card-header text-center p-1">
                <p className="m-0">
                    LEODAN ZAMBRANO <small className="m-0"> <b>ROCAFUERTE</b></small>
                </p>

            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">Dapibus ac facilisis in</li>
            </ul>
            <div className="card-footer">
                <button className="btn btn-primary btn-block">
                    Detalles
                </button>
            </div>
        </div>
    );
}

function Periodos({periodo, setPeriodo, setLoad, setSemanas}) {
    const [periodo1, setPeriodo1] = useState([
        {value: 1, status: false}, {value: 2, status: false}, {value: 3, status: false},
        {value: 4, status: false}, {value: 5, status: false}, {value: 6, status: false}]);
    const [periodo2, setPeriodo2] = useState([
        {value: 7, status: false}, {value: 8, status: false}, {value: 9, status: false},
        {value: 10, status: false}, {value: 11, status: false}, {value: 12, status: false},
        {value: 13, status: false}]);

    const changeStatus = (value, status) => {
        let items1 = [...periodo1];
        let items2 = [...periodo2];

        for (const x of items1) x.status = false;
        for (const x of items2) x.status = false;

        for (const item of items1) {
            if (item.value === value) {
                item.status = !status;
                break;
            }
        }

        for (const item of items2) {
            if (item.value === value) {
                item.status = !status;
                break;
            }
        }

        if (periodo !== value) {
            setPeriodo(value);
            /*Cargar las semanas con las que se van a filtrar en todo el dashboard*/
            loadSemanas(value).then(
                response => setSemanas(response),
                error => console.error(error)
            );
        } else {
            setPeriodo(0);
            setSemanas([]);
        }

        setLoad(true);

        setPeriodo1(items1);
        setPeriodo2(items2);
    };

    return (
        <div className="col-12 mb-n3">
            <small className="">
                <em>Periodos Anual (Para visualizar la información por periodo, debe seleccionar uno de ellos)</em>
            </small>
            <div className="row mt-2">
                <div className="btn-group col-xl-6 mb-3" role="group" aria-label="button group" data-toggle="button">
                    {periodo1.map(({status, value}, i) =>
                        <button key={i} className={`btn btn-outline-secondary ${status && 'active'}`}
                                onClick={() => changeStatus(value, status)}>{value}</button>
                    )}
                </div>
                <div className="btn-group col-xl-6 mb-3" role="group" aria-label="button group" data-toggle="button">
                    {periodo2.map(({status, value}, i) =>
                        <button key={i} className={`btn btn-outline-secondary ${status && 'active'}`}
                                onClick={() => changeStatus(value, status)}>{value}</button>
                    )}
                </div>
            </div>
        </div>
    )
}

const loadSemanas = async (periodo) => {
    try {
        const url = `${API_LINK}/bansis-app/calendario.php/semanasPeriodo?periodo=${periodo}&year=${yearNumber()}`;
        const request = await fetch(url);
        const response = await request.json();
        const {code} = response;
        if (code === 200) {
            //Retornan 4 items por periodo
            let list = [];
            for (const i of response.semanas) {
                list.push({value: +i, status: false})
            }
            return list;
        }
    } catch (e) {
        return e;
    }
};

function Semanas({periodo, semana, setSemana, setLoadData, semanas}) {
    const [semanasList, setSemanasList] = useState([]);

    useEffect(() => {
        setSemanasList(semanas);
    }, [semanas]);

    const changeStatus = (value, status) => {
        let semanas = [...semanasList];

        for (const x of semanas) x.status = false;
        for (const item of semanas) {
            if (+item.value === +value) {
                item.status = !status;
                break;
            }
        }

        if (semana !== value) {
            setSemana(value);
        } else {
            setSemana(0);
        }

        setLoadData(true);
        setSemanasList(semanas);
    };

    if (periodo === 0) {
        return <React.Fragment/>;
    }


    return (
        <div className="row mb-3">
            <div className="col-12">
                <div className="btn-group col-12" role="group" aria-label="button group" data-toggle="button">
                    {(setSemanasList.length > 0) && semanasList.map(({value, status}, i) =>
                        <button
                            key={i}
                            className={`btn btn-outline-secondary ${status && 'active'}`}
                            onClick={() => changeStatus(value, status)}>{status &&
                        <i className="fas fa-filter"/>} Semana {value}</button>
                    )}
                </div>
            </div>
        </div>
    )
}

const peticionHttp = async (url) => {
    try {
        const request = await fetch(url);
        return await request.json();
    } catch (e) {
        return e;
    }
};

const yearNumber = () => {
    return 2020;
};
