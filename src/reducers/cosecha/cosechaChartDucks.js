import {setDataCintas} from "./cosechaDucks";

const dataInicial = {
    data: {
        series: [],
        options: {
            chart: {
                type: 'line',
                height: 400,
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
            colors: ['#008FFB', "rgba(255,68,85,0.35)", "#00E396"],
            dataLabels: {
                enabled: false
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40,
                fontSize: '18px',
                fontFamily: 'Helvetica, Arial',
            }
        }
    }
};

const SET_DATA_CHART = 'SET_DATA_CHART';
const CLEAR_DATA_CHART = 'CLEAR_DATA_CHART';

export default function reducer(state = dataInicial, action) {
    switch (action.type) {
        case SET_DATA_CHART:
            return {...state, data: action.payload};
        case CLEAR_DATA_CHART:
            return {...state, data: action.payload};
        default:
            return state
    }
}

export const updateData = (data) => (dispatch, getState) => {
    const dataChart = getState().cosechaChart.data;
    dispatch({
        type: SET_DATA_CHART,
        payload: {
            ...dataChart,
            series: [data.saldos, data.cortados, data.enfunde],
            options: {
                ...dataChart.options,
                xaxis: {
                    categories: data.categories,
                },
                yaxis: [
                    {
                        seriesName: ['saldos', 'cortados', 'enfunde'],
                        axisBorder: {
                            show: true,
                        },
                        crosshairs: {show: false},
                        tooltip: {
                            enabled: true,
                            offsetX: 0,
                        },
                        max: Math.max(...data.enfunde.data) + 50
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
            }
        }
    });
};

export const clearDataChart = () => (dispatch, getState) => {
    const dataChart = getState().cosechaChart.data;
    dispatch({
        type: CLEAR_DATA_CHART,
        payload: {
            ...dataChart,
            series: [],
            options: {
                ...dataChart.options,
                xaxis: {
                    categories: [],
                },
                yaxis: [
                    {
                        seriesName: [],
                        axisBorder: {
                            show: true,
                        },
                        crosshairs: {show: false},
                        tooltip: {
                            enabled: true,
                            offsetX: 0,
                        },
                    },
                ],
            }
        }
    });
};

export const loadDataChart = (cinta) => (dispatch, getState) => {
    const cintas = getState().cosecha.cintas_data;
    if (cintas.length > 0) {
        let data = cintas.filter(item => item.recobro.codigo === cinta);

        if (data.length > 0) {
            data = data[0].data.chart;
            dispatch(updateData(data));
        }
    }
};

export const updateDataChart = (data) => (dispatch, getState) => {
    const cintas = getState().cosecha.cintas_data;
    const status = (item) => (item.recobro.codigo === data.cs_color);
    const cinta_filter = cintas.filter(item => status(item));

    if (cinta_filter.length > 0) {
        const cinta_data_chart = cinta_filter[0].data.chart; //Se tiene un item
        let index = null;
        let encontro = cinta_data_chart.categories.some((elemento, i) => {
            index = i;
            return elemento === data.cs_seccion
        });

        if (encontro) {
            cinta_data_chart.cortados.data[index] += parseInt(data.cs_cortados);

            const no_cero = (data1, data2) => ((parseInt(data1) - parseInt(data2)) >= 0);
            if (no_cero(cinta_data_chart.saldos.data[index], data.cs_cortados)){
                cinta_data_chart.saldos.data[index] -= parseInt(data.cs_cortados);
            }else{
                cinta_data_chart.saldos.data[index] = 0;
            }

            const nw_data = {
                ...cinta_filter[0],
                data: {
                    ...cinta_filter[0].data,
                    chart: {
                        ...cinta_filter[0].data.chart,
                        cortados: cinta_data_chart.cortados,
                        saldos: cinta_data_chart.saldos
                    }
                }
            };

            const nw_array_data = cintas.map(item => status(item) ? nw_data : item);
            dispatch(setDataCintas(nw_array_data));
            dispatch(updateData(nw_data.data.chart));
        }
    }
};


