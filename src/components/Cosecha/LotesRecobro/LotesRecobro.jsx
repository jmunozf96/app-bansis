import React, {useEffect, useState} from "react";
import ApexChart from "../../ApexChart/ApexChart";
import {API_LINK} from "../../../utils/constants";
import CircularProgress from '@material-ui/core/CircularProgress';
import {useDispatch, useSelector} from "react-redux";
import {enabledLotesCortados} from "../../../actions/cosecha/cosechaActions";

export default function LotesRecobro({color, load, setLoad, lotesDia, update, setUpdate, hacienda}) {
    const [loadingData, setLoadingData] = useState(false);
    const [data, setData] = useState({
        series: [],
        options: {
            chart: {
                type: 'line',
                height: 350,
                stacked: true,
            },
            plotOptions: {
                bar: {
                    columnWidth: '35%',
                    horizontal: false,
                    dataLabels: {
                        position: 'top',
                        hideOverflowingLabels: true,
                    },
                }
            },
            stroke: {
                show: true,
                curve: 'straight',
                width: [1, 1, 4],
            },
            xaxis: {
                categories: [],
            },
            fill: {
                opacity: 5,
            },
            dataLabels: {
                enabled: false
            },
        }
    });

    const [seriesEnfunde, setSeriesEnfunde] = useState(null);
    const [seriesRecobro, setSeriesRecobro] = useState(null);
    const [seriesSaldo, setSeriesSaldo] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadChart, setLoadChart] = useState(false);

    const [maxChartData, setMaxChartData] = useState(0);

    const dispatch = useDispatch();
    const getLotesCortados = useSelector((state) => state.cosecha.lotesCortados);

    useEffect(() => {
        if (getLotesCortados) {
            setSeriesEnfunde([]);
            setSeriesRecobro([]);
            setCategories([]);
            setData({
                ...data,
                series: [],
                options: {
                    ...data.options,
                    xaxis: {
                        categories: [],
                    },
                    colors: ['#008FFB', '#b81910', "#00E396"]
                    //colors : ['#b84644', '#4576b5'],
                },
            });
            dispatch(enabledLotesCortados(false));
        }
    }, [getLotesCortados, dispatch, data]);


    useEffect(() => {
        if (loadChart || update) {
            let array = seriesRecobro;
            let array_saldo = seriesSaldo;
            if (lotesDia.length > 0) {
                lotesDia.forEach((item) => {
                    let index = null;
                    let encontro = categories.some((elemento, i) => {
                        index = i;
                        return elemento === item['cs_seccion']
                    });
                    if (encontro) {
                        /*array.data[index] = (+item['enfunde'] - (+item['cortadosTotal'] + +item['caidas'] + +item['cortados'])) < 0 ? 0
                            : (+item['enfunde'] - (+item['cortadosTotal'] + +item['caidas'] + +item['cortados']));*/
                        array.data[index] = (+item['cortadosTotal'] + +item['caidas'] + +item['cortados']);
                        array_saldo.data[index] = (+item['enfunde'] - (+item['cortadosTotal'] + +item['caidas'] + +item['cortados'])) < 0 ? 0
                            : (+item['enfunde'] - (+item['cortadosTotal'] + +item['caidas'] + +item['cortados']));
                    }
                })
            }
            setData({
                ...data,
                series: [array_saldo, array, seriesEnfunde],
                options: {
                    ...data.options,
                    xaxis: {
                        categories: categories,
                    },
                    yaxis: [
                        {
                            seriesName: ['cortados', 'cortados', 'enfunde'],
                            axisBorder: {
                                show: true,
                            },
                            crosshairs: {show: false},
                            tooltip: {
                                enabled: true,
                                offsetX: 0,
                            },
                            max: maxChartData,
                        },
                    ],
                    tooltip: {
                        y: [
                            {
                                formatter: function (val) {
                                    return val + " racimos"
                                }
                            }
                        ]
                    },
                    colors: ['#008FFB', "rgba(255,68,85,0.35)", "#00E396"],
                    legend: {
                        position: 'top',
                        horizontalAlign: 'left',
                        offsetX: 40,
                        fontSize: '18px',
                        fontFamily: 'Helvetica, Arial',
                    }
                    //colors : ['#E91E63', '#4576b5', '#008ffb'],
                },
            });
            setLoadChart(false);
            setUpdate(false);
        }
    }, [loadChart, lotesDia, seriesEnfunde, seriesSaldo, seriesRecobro, categories, data, update, setUpdate, maxChartData]);

    useEffect(() => {
        if (load && hacienda !== '') {
            (async () => {
                await setLoadingData(true);
                const url = `${API_LINK}/bansis-app/index.php/recepcion/${hacienda}/lotesRecobro?cinta=${color}`;
                const request = await fetch(url);
                const response = await request.json();
                setSeriesRecobro(response.cortados);
                setSeriesEnfunde(response.enfunde);
                setSeriesSaldo(response.saldos);
                setCategories(response.categories);
                setMaxChartData(Math.max(...response.enfunde.data) + 10);
                await setLoadChart(true);
                await setLoadingData(false);
            })();
            setLoad(false);
        }
    }, [load, color, setLoad, hacienda]);

    return (
        <div className="row">
            <div className="col-12 text-center">
                {loadingData ?
                    <CircularProgress color={"secondary"} style={{marginTop: 140}}/>
                    :
                    <>
                        {data.series.length > 0 ?
                        <ApexChart
                            data={data}
                            type="line"
                            height={350}
                        /> :
                            <i className="fas fa-chart-bar fa-10x" style={{marginTop: 100}}/>
                        }
                    </>
                }
            </div>
        </div>
    );
}

/*
Funcion para diferenciar por color los lotes activos, llamar en los props a lotesDia y ubicarlo en el array de Color del serDataChart
function ({dataPointIndex}) {
    if (lotesDia.length > 0) {
        const existe = lotesDia.filter((item) => item['cs_seccion'] === categories[dataPointIndex]);
        if (existe.length === 1) {
            const item = existe[0];
            const pasado_enfunde = +item['enfunde'] - (+item['cortadosTotal'] + +item['caidas'] + +item['cortados']);
            if (pasado_enfunde < 0) {
                return '#b81e18'
            } else {
                return '#008ffb'
            }
        } else {
            return '#008ffb'
        }
    } else {
        return '#008ffb'
    }
}*/
