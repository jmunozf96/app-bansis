import React, {useEffect, useState} from "react";
import ApexChart from "../../../components/ApexChart";
import {useHistory} from "react-router-dom";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import {Col, Row} from "react-bootstrap";
import {API_LINK} from "../../../utils/constants";

export default function AvanceLabor() {
    const history = useHistory();
    const [enfunde, setEnfunde] = useState(null);
    const [loadData, setLoadData] = useState(true);

    useEffect(() => {
        if (loadData) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/enfunde`;
                const request = await fetch(url);
                const response = await request.json();
                const {series, categories} = response;
                setEnfunde({
                    series,
                    options: {
                        chart: {
                            height: 350,
                            type: 'bar',
                        },
                        plotOptions: {
                            bar: {
                                dataLabels: {
                                    position: 'top', // top, center, bottom
                                },
                            }
                        },
                        dataLabels: {
                            enabled: true,
                            formatter: function (val) {
                                return val;
                            },
                            offsetY: -20,
                            style: {
                                fontSize: '12px',
                                colors: ["#304758"]
                            }
                        },
                        xaxis: {
                            categories,
                            position: 'bottom',
                            axisBorder: {
                                show: false
                            },
                            axisTicks: {
                                show: false
                            },
                            crosshairs: {
                                fill: {
                                    type: 'gradient',
                                    gradient: {
                                        colorFrom: '#D8E3F0',
                                        colorTo: '#BED1E6',
                                        stops: [0, 100],
                                        opacityFrom: 0.4,
                                        opacityTo: 0.5,
                                    }
                                }
                            },
                            tooltip: {
                                enabled: true,
                            }
                        },
                        yaxis: {
                            axisBorder: {
                                show: true
                            },
                            axisTicks: {
                                show: true,
                            },
                            labels: {
                                show: true,
                                formatter: function (val) {
                                    return val + ' rac.';
                                }
                            }

                        },
                        /*title: {
                            text: 'Despachos registrados 2020',
                            floating: true,
                            align: 'center',
                            style: {
                                color: '#444'
                            }
                        }*/
                    },
                })
            })();
            setLoadData(false);
        }
    }, [loadData, enfunde]);

    return (
        <div className="container-fluid mt-3 mb-3">
            <Row>
                <Col className="mb-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" to="/">
                            Hacienda
                        </Link>
                        <Typography color="textPrimary">Labor</Typography>
                        <Typography color="textPrimary">Enfunde</Typography>
                    </Breadcrumbs>
                </Col>
            </Row>
            <div className="row">
                <div className="col-12">
                    <button
                        className="btn btn-success"
                        onClick={() => history.push(`/hacienda/avances/labor/empleado/list`)}
                    >
                        <i className="fab fa-buffer"/> Enfunde Semanal
                    </button>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col-12 p-4">
                    {enfunde && !loadData &&
                    <ApexChart
                        data={enfunde}
                    />
                    }
                </div>
            </div>
        </div>
    );
}
