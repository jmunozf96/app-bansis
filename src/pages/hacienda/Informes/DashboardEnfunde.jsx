import React, {useState} from "react";
import Buscador from "../../../components/Buscador";
import {API_LINK} from "../../../utils/constants";
import {useSelector} from "react-redux";
import ApexChart from "../../../components/ApexChart/ApexChart";

export default function DashboardEnfunde() {
    const credential = useSelector((state) => state.credential);
    const [hacienda, setHacienda] = useState(null);

    const [apiLoteSeccion, setApiLoteSeccion] = useState('');

    return (
        <ContainerPrincipal>
            <Titulo/>
            <div className="col-12 mt-2 mb-3">
                <div className="row">
                    <div className="col-md-4 col-12">
                        <div className="row">
                            <MenuPeriodo
                                col={12}
                                credential={credential}
                                hacienda={hacienda}
                                setHacienda={setHacienda}
                                apiLoteSeccion={apiLoteSeccion}
                                setApiLoteSeccion={setApiLoteSeccion}
                            />
                            <div className="col-12">
                                <div className="row">
                                    <CardData xl={6} lg={12}/>
                                    <CardData xl={6} lg={12}/>
                                    <CardData xl={6} lg={12}/>
                                </div>
                            </div>
                            <div className="m-1"/>
                            <MenuGrafico
                                icon="fas fa-chart-pie"
                                col={12}
                                label="Enfunde Hacienda %"
                            >
                                <GraficoPastelEnfundeHacienda/>
                            </MenuGrafico>
                            <div className="m-1"/>
                            <MenuGrafico
                                icon="fas fa-chart-bar"
                                col={12}
                                label="Enfunde Anual"
                            >
                                <GraficoBarrasAnual/>
                            </MenuGrafico>
                            <div className="m-1"/>
                            <MenuGrafico
                                icon="fas fa-chart-bar"
                                col={12}
                                label="Enfunde vs Has"
                            >
                                <GraficoVariables/>
                            </MenuGrafico>
                        </div>
                    </div>
                    <div className="col-md-8 col-12">
                        <div className="row">
                            <MenuGrafico
                                icon="fas fa-chart-bar"
                                col={12}
                                label="Enfunde Periodal"
                            >
                                <GraficoBarrasPeriodo/>
                            </MenuGrafico>
                            <div className="m-1"/>
                            <MenuGrafico
                                icon="fas fa-chart-bar"
                                col={12}
                                label="Enfunde Lote"
                            >
                                <GraficoBarrasLote/>
                            </MenuGrafico>
                            <div className="m-1"/>
                            <MenuGrafico
                                icon="fas fa-chart-bar"
                                col={12}
                                label="Enfunde Lotero"
                            >
                                <GraficoBarrasLoteros/>
                            </MenuGrafico>
                        </div>
                    </div>
                </div>
            </div>
        </ContainerPrincipal>
    )
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

function Titulo() {
    return (
        <div className="col-12 mt-3">
            <div className="card">
                <div className="card-header">
                    <h5 className="m-0"><i className="fas fa-chart-bar"/> INFORME DE ENFUNDE</h5>
                </div>
            </div>
        </div>
    )
}

function MenuPeriodo({col, credential, hacienda, setHacienda, apiLoteSeccion, setApiLoteSeccion}) {
    return (
        <div className={`col-md-${col} col-12`}>
            <div className="card">
                <div className="card-header p-2">
                    <h6 className="m-0"><i className="fas fa-filter"/> Filtrar datos</h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12 mb-3">
                            <HaciendaSelect
                                credential={credential}
                                setHacienda={setHacienda}
                                setApiLoteSeccion={setApiLoteSeccion}/>
                        </div>
                        <div className="col-12">
                            <LotesSelect
                                hacienda={hacienda}
                                apiLoteSeccion={apiLoteSeccion}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function HaciendaSelect({credential, setHacienda, setApiLoteSeccion}) {
    const api_buscador = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const [haciendaSelect, setHaciendaSelect] = useState(credential.idhacienda ? credential.idhacienda : null);

    const changeHacienda = (e, value) => {
        setHaciendaSelect(value);
        if (value) {
            setHacienda(value);
            setApiLoteSeccion(`${API_LINK}/bansis-app/index.php/lotes-seccion-select?hacienda=${value.id}`)
        } else {
            setHacienda(null);
            setApiLoteSeccion("");
        }
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

function LotesSelect({hacienda, apiLoteSeccion}) {
    const [loteSeccion, setLoteSeccion] = useState(null);

    const changeLoteSeccion = (e, value) => {
        setLoteSeccion(value);
    };

    return (
        <Buscador
            api={apiLoteSeccion}
            change={changeLoteSeccion}
            disabled={(hacienda === null)}
            id="id-seccion-search"
            label="Seleccione una Seccion"
            setData={setLoteSeccion}
            variant="outlined"
            value={loteSeccion}
        />
    )
}

function MenuGrafico({col, children, icon, label}) {
    return (
        <div className={`col-md-${col} col-12`}>
            <div className="card">
                <div className="card-header p-2">
                    <h6 className="m-0"><i className={icon}/> {label} </h6>
                </div>
                <div className="card-body p-1">
                    <div className="row">
                        <div className="col-12">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function GraficoBarrasPeriodo() {
    const [data, setData] = useState({
        series: [
            {
                name: "Enfunde Primo",
                data: [500, 600, 700, 500, 800, 455, 874, 896, 854, 145, 145, 136]
            },
            {
                name: "Enfunde Sofca",
                data: [450, 900, 620, 320, 745, 632, 258, 314, 148, 236, 485, 910]
            }
        ],
        options: {
            chart: {
                type: 'line',
                height: 500,
            },
            stroke: {
                show: true,
                curve: 'straight',
            },
            xaxis: {
                categories: ['Per1', 'Per2', 'Per3', 'Per4', 'Per5', 'Per6', 'Per8', 'Per9', 'Per10', 'Per11', 'Per12', 'Per13'],
            },
            fill: {
                opacity: 5,
            },
            dataLabels: {
                enabled: false
            },
        }
    });
    return (
        <ApexChart
            data={data}
            type="line"
            height={300}
        />
    )
}

function GraficoBarrasLote() {
    const [data, setData] = useState({
        series: [
            {
                name: "Enfunde Primo",
                data: [
                    500, 600, 700, 500, 800, 455, 874, 896, 854, 145, 145, 136,
                    500, 600, 700, 500, 800, 455, 874, 896, 854, 145, 145, 136,
                    500, 600, 700, 500, 800, 455, 874, 896, 854, 145
                ]
            },
        ],
        options: {
            chart: {
                type: 'bar',
                height: 500,
            },
            xaxis: {
                categories: [
                    '01A', '01B', '02A', '02B', '02C', '03A', '03C', '03D', '04A', '04B', '05A', '06A',
                    '06B', '07A', '07B', '08A', '08B', '09A', '09B', '10A', '11A', '12A', '13A', '14A',
                    '15A', '16A', '17A', '18A', '18B', '19A', '19B', '20A', '20B', '20C'
                ],
            },
            fill: {
                opacity: 5,
            },
            dataLabels: {
                enabled: false
            },
        }
    });
    return (
        <ApexChart
            data={data}
            type="bar"
            height={300}
        />
    )
}

function GraficoBarrasAnual() {
    const [data, setData] = useState({
        series: [
            {
                name: "Enfunde Primo",
                data: [500, 600, 700]
            },
            {
                name: "Enfunde Sofca",
                data: [450, 900, 620]
            }
        ],
        options: {
            chart: {
                type: 'bar',
                height: 500,
            },
            stroke: {
                show: true,
                curve: 'straight',
            },
            xaxis: {
                categories: ['2018', '2019', '2020'],
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
    return (
        <ApexChart
            data={data}
            type="bar"
            height={300}
        />
    )
}

function GraficoBarrasLoteros() {
    const [data, setData] = useState({
        series: [{
            data: [
                500, 250, 350, 950, 650, 450, 850,
                500, 250, 350, 950, 650, 450, 850,
                500, 250, 350, 950, 650, 450, 850,
                500, 250, 350, 950, 650, 450, 850,
            ]
        }],
        options: {
            chart: {
                type: 'bar',
            },
            stroke: {
                show: true,
                curve: 'straight',
            },
            xaxis: {
                categories: [
                    "LEODAN ZAMBRANO", "MARCELO REYES", "ALFREDO CUEICAL", "FELIX ASEICHA",
                    "HENRY PILAY", "GUSTAVO SANCHEZ", "JUAN LEOPOLDO IRRAZABAL",
                    "LEODAN ZAMBRANO", "MARCELO REYES", "ALFREDO CUEICAL", "FELIX ASEICHA",
                    "HENRY PILAY", "GUSTAVO SANCHEZ", "JUAN LEOPOLDO IRRAZABAL",
                    "LEODAN ZAMBRANO", "MARCELO REYES", "ALFREDO CUEICAL", "FELIX ASEICHA",
                    "HENRY PILAY", "GUSTAVO SANCHEZ", "JUAN LEOPOLDO IRRAZABAL",
                    "LEODAN ZAMBRANO", "MARCELO REYES", "ALFREDO CUEICAL", "FELIX ASEICHA",
                    "HENRY PILAY", "GUSTAVO SANCHEZ", "JUAN LEOPOLDO IRRAZABAL",
                ],
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
    return (
        <ApexChart
            data={data}
            type="bar"
            height=""
        />
    )
}

function GraficoPastelEnfundeHacienda() {
    const [data, setData] = useState({
        series: [44, 50],
        options: {
            chart: {
                type: 'pie',
                height: 400,
                events: {
                    dataPointSelection: (event, chartContext, config) => {
                        //console.log(chartContext, config);
                        console.log(config.w.config.series[config.dataPointIndex]);
                        console.log(config.w.config.labels[config.dataPointIndex]);
                    },
                }
            },
            labels: ['Primo', 'Sofca'],
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
                        position: 'bottom'
                    }
                },
                legend: {
                    position: 'bottom',
                }
            }]
        }
    });
    return (
        <ApexChart
            data={data}
            type="pie"
            height={300}
        />
    )
}

function GraficoVariables() {
    const [data, setData] = useState({
        series: [{
            name: "Enfunde Primo",
            data: [
                [16.4, 5.4], [21.7, 2], [25.4, 3], [19, 2], [10.9, 1], [13.6, 3.2],
                [10.9, 7.4], [10.9, 0], [10.9, 8.2], [16.4, 0], [16.4, 1.8], [13.6, 0.3],
                [13.6, 0], [29.9, 0], [27.1, 2.3], [16.4, 0], [13.6, 3.7], [10.9, 5.2],
                [16.4, 6.5], [10.9, 0], [24.5, 7.1], [10.9, 0], [8.1, 4.7], [19, 0],
                [21.7, 1.8], [27.1, 0], [24.5, 0], [27.1, 0], [29.9, 1.5], [27.1, 0.8], [22.1, 2]]
        }],
        options: {
            chart: {
                height: 400,
                type: 'scatter',
                zoom: {
                    enabled: true,
                    type: 'xy'
                },
            },
            xaxis: {
                tickAmount: 10,
                labels: {
                    formatter: function (val) {
                        return parseFloat(val).toFixed(1)
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
        }
    });
    return (
        <ApexChart
            data={data}
            type="scatter"
            height={300}
        />
    )
}

function CardData({xl, lg}) {
    return (
        <div className={`col-xl-${xl} col-lg-${lg} col-md-12 col-sm-12 col-12 mt-2`}>
            <div className="card">
                <div className="card-body p-0">
                    <div className="row">
                        <div className="col-12 m-0 text-left">
                            <ul className="list-group list-group-flush">
                                <CardDataItem/>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CardDataItem() {
    return (
        <li className="list-group-item">
            Enfunde: <h2 className="m-0"><i className="fas fa-sort-numeric-up-alt"/> 4.505 </h2>
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
