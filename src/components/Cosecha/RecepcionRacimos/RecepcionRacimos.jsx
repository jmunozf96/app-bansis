import React, {useEffect, useState} from "react";
import ApexChart from "../../ApexChart";

import "./RecepcionRacimos.scss"

export default function RecepcionRacimos(props) {
    const {data, update, setUpdate} = props;
    const [seccionPeso, setSeccionPeso] = useState({
        series: [0],
        options: {
            colors: ["#00e633"],
            chart: {
                height: 100,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 15,
                        size: "70%"
                    },
                    endAngle: 360,
                    dataLabels: {
                        showOn: "always",
                        name: {
                            offsetY: -10,
                            show: true,
                            color: "#888",
                            fontSize: "40px"
                        },
                        value: {
                            offsetY: 50,
                            color: "#111",
                            fontSize: "50px",
                            show: true,
                            formatter: function (val) {
                                return val + ' lbs.'
                            }
                        },
                    }
                }
            },
            stroke: {
                lineCap: "round"
            },
            labels: [''],
        }
    });

    useEffect(() => {
        if (update && data) {
            //Parametros
            /*
            * > 80 - son Optimos
            * < 80 && > 60 son Aceptables
            * < 60 son en rojo
            * */
            let seccion = data['cs_seccion'];
            let value = +data['cs_peso'];
            let porcentaje = ((value / 80) * 100);
            let color = '#00e633';
            if (value < 80 && value >= 60) {
                color = '#e6e135';
            } else if (value < 60) {
                color = '#e6251b';
            }

            setSeccionPeso({
                ...seccionPeso,
                series: [+porcentaje.toFixed(2)],
                options: {
                    ...seccionPeso.options,
                    colors: [color],
                    plotOptions: {
                        ...seccionPeso.options.plotOptions,
                        radialBar: {
                            ...seccionPeso.options.plotOptions.radialBar,
                            dataLabels: {
                                ...seccionPeso.options.plotOptions.dataLabels,
                                value: {
                                    offsetY: 50,
                                    color: "#111",
                                    fontSize: "50px",
                                    show: true,
                                    formatter: function (val) {
                                        return ((((val) / 100) * 80).toFixed(2)).toString()  + ' lbs.'
                                    }
                                },
                            }
                        }
                    },
                    labels: [seccion],
                }
            });

            setUpdate(false);
        }
    }, [update, data, seccionPeso, setUpdate]);

    return (
        <ApexChart
            data={seccionPeso}
            type="radialBar"
            height={500}
        />
    );
}
