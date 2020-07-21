import React, {useEffect, useState} from "react";
import ApexChart from "../../ApexChart/ApexChart";
import {API_LINK} from "../../../utils/constants";
import CircularProgress from '@material-ui/core/CircularProgress';

export default function LotesRecobro({color, load, setLoad, lotesDia, update, setUpdate, hacienda}) {
    const [loadingData, setLoadingData] = useState(false);
    const [data, setData] = useState({
        series: [],
        options: {
            chart: {
                type: 'line',
                height: 200,
            },
            plotOptions: {
                bar: {
                    columnWidth: '35%',
                    dataLabels: {
                        position: 'top',
                        hideOverflowingLabels: true,
                    },
                }
            },
            xaxis: {
                categories: [],
            },
            tooltip: {
                y: [
                    {
                        formatter: function (val) {
                            return val + " racimos"
                        }
                    }
                ]
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40
            },
            dataLabels: {
                enabled: false
            },
        }
    });

    const [seriesEnfunde, setSeriesEnfunde] = useState([]);
    const [seriesRecobro, setSeriesRecobro] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadChart, setLoadChart] = useState(false);

    useEffect(() => {
        if (loadChart || update) {
            let array = seriesRecobro;
            if (lotesDia.length > 0) {
                lotesDia.forEach((item) => {
                    let index = null;
                    let encontro = categories.some((elemento, i) => {
                        index = i;
                        return elemento === item['cs_seccion']
                    });
                    if (encontro) {
                        array.data[index] = (+item['enfunde'] - (+item['cortadosTotal'] + +item['caidas'] + +item['cortados'])) < 0 ? 0
                            : (+item['enfunde'] - (+item['cortadosTotal'] + +item['caidas'] + +item['cortados']));
                    }
                })
            }
            setData({
                ...data,
                series: [array, seriesEnfunde],
                options: {
                    ...data.options,
                    xaxis: {
                        categories: categories,
                    },
                    colors: [function ({dataPointIndex}) {
                        if (lotesDia.length > 0) {
                            const existe = lotesDia.filter((item) => item['cs_seccion'] === categories[dataPointIndex]);
                            if (existe.length > 0) {
                                return '#E91E63'
                            } else {
                                return '#008ffb'
                            }
                        } else {
                            return '#008ffb'
                        }
                    }, "#00e396"]
                    //colors : ['#b84644', '#4576b5'],
                },
            });
            setLoadChart(false);
            setUpdate(false);
        }
    }, [loadChart, lotesDia, seriesEnfunde, seriesRecobro, categories, data, update, setUpdate]);

    useEffect(() => {
        if (load && hacienda !== '') {
            (async () => {
                await setLoadingData(true);
                const url = `${API_LINK}/bansis-app/index.php/recepcion/${hacienda}/lotesRecobro?cinta=${color}`;
                const request = await fetch(url);
                const response = await request.json();
                setSeriesRecobro(response.cortados);
                setSeriesEnfunde(response.enfunde);
                setCategories(response.categories);
                setLoadChart(true);
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
                    <ApexChart
                        data={data}
                        type="line"
                        height={350}
                    />
                }
            </div>
        </div>
    );
}

