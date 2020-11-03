export const transformarDataLotes = (lotes, buildLote = true) => {
    let data_chart = {...model_data};
    data_chart.options.yaxis.title.text = 'Total Manos Recusadas';
    data_chart.options.chart.height = 500;

    if (buildLote) {
        let data = [...lotes.map(data => ({categories: data.alias, series: data.cantidad}))].sort((a, b) => {
            if (a.categories > b.categories) return 1;
            if (a.categories < b.categories) return -1;
            return 0;
        });
        data_chart.options.xaxis.categories = data.map(data => data.categories);
        data_chart.series = [{name: "Manos Recusadas", data: data.map(data => data.series)}];
        data_chart.options.chart.events = {
            dataPointSelection: (event, chartContext, config) => {
                console.log(config.w.config.xaxis.categories[config.dataPointIndex])
            }
        }
    }
    return data_chart;
};


const model_data = {
    series: [],
    options: {
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '40%',
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: [],
        },
        yaxis: {
            title: {
                text: 'Total Manos'
            }
        },
        fill: {
            opacity: 1
        },
        /*tooltip: {
            y: {
                formatter: function (val) {
                    return "$ " + val + " thousands"
                }
            }
        }*/
    },
};
