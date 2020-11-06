export const transformarDataLotes = (lotes, setDataModal, buildLote = true) => {
    let data_chart = {...model_data};
    data_chart.options.yaxis.title.text = 'Total Manos Recusadas';
    data_chart.options.chart.height = 500;
    if (buildLote) {
        let data = [...lotes.map(data => ({
            id: data.id,
            categories: data.alias,
            series: data.cantidad
        }))].sort((a, b) => {
            if (a.series < b.series) return 1;
            if (a.series > b.series) return -1;
            return 0;
        });

        data_chart.options.dataId = data.map(data => data.id);
        data_chart.options.xaxis.categories = data.map(data => data.categories);
        data_chart.series = [{name: "Manos Recusadas", data: data.map(data => data.series)}];
        data_chart.options.colors = ['#c41800'];
        data_chart.options.chart.events = {
            dataPointSelection: (event, chartContext, config) => {
                if (config.selectedDataPoints[0].length > 0) {
                    const id = config.w.config.dataId[config.dataPointIndex];
                    const lote = config.w.config.xaxis.categories[config.dataPointIndex];
                    setDataModal(id, lote)
                }
            }
        }
    }
    return data_chart;
};

export const transformarDataDanosLote = (id, danos) => {
    let data_chart = {...model_data};
    data_chart.options.yaxis.title.text = 'Total Danos';
    data_chart.options.chart.height = 500;
    //Buscamos datos en el storage
    const data_storage = JSON.parse(localStorage.getItem('_dataManos'));
    if (data_storage.length > 0 && data_storage) {
        //Buscamos los datos almacenados del lote
        const busqueda = data_storage.filter((item) => item.id === id);
        let data_modal = [];
        busqueda[0]['manos_recusadas'].forEach(data => {
            const existe = danos.filter(item => item.id === data.dano.id);
            if (existe.length > 0) data_modal.push({
                id: data.dano.id,
                categories: data.dano.nombre,
                series: +data.cantidad
            });
        });

        data_modal = data_modal.sort((a, b) => {
            if (a.series < b.series) return 1;
            if (a.series > b.series) return -1;
            return 0;
        });

        data_chart.options.xaxis.categories = data_modal.map(data => data.categories);
        data_chart.series = [{name: "Danos", data: data_modal.map(data => data.series)}];
        data_chart.options.colors = ['#0066ae'];
        data_chart.options.chart.events = {};
    }

    return data_chart;
};

export const consolidarDanos = (danos, lotes) => {
    let consolidado = [];
    danos.forEach(data => {
        let total = 0;
        lotes.forEach(lote => {
            total += lote.danos.filter(item => item.dano.id === data.id).reduce((total, item) => total + +item.cantidad, 0)
        });
        consolidado.push({
            id: data.id, categories: data.nombre, series: total
        })
    });
    consolidado = consolidado.sort((a, b) => {
        if (a.series < b.series) return 1;
        if (a.series > b.series) return -1;
        return 0;
    });
    return consolidado;
};

export const getDanosTotal = (danos, lotes) => {
    let data_chart = {...model_data};
    data_chart.options.yaxis.title.text = 'Total Danos';
    data_chart.options.chart.height = 500;
    data_chart.options.chart.type = 'bar';
    const consolidado = consolidarDanos(danos, lotes);
    data_chart.options.xaxis.categories = consolidado.map(data => data.categories);
    data_chart.series = [{name: "Danos", data: consolidado.map(data => data.series)}];
    data_chart.options.colors = ['#c41800'];
    data_chart.options.chart.events = {};

    return data_chart;
};

const model_data = {
    series: [],
    options: {
        chart: {
            type: 'bar',
            height: 350,
            zoom: {
                enabled: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '60%',
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
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
        colors: ['#c41800'],
        /*tooltip: {
            y: {
                formatter: function (val) {
                    return "$ " + val + " thousands"
                }
            }
        }*/
    },
};
