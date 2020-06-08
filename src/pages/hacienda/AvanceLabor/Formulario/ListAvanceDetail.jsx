import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {API_LINK} from "../../../../utils/constants";
import ApexChart from "../../../../components/ApexChart/ApexChart";

export function ListAvanceDetail() {
    const {id} = useParams();
    const [loadData, setLoadData] = useState(true);
    const [secciones, setSecciones] = useState([]);
    const [cabeceraEnfunde, setCabeceraEnfunde] = useState(null);
    const history = useHistory();

    useEffect(() => {
        if (loadData) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/getEnfunde/semanal/detalle/${id}`;
                const request = await fetch(url);
                const response = await request.json();
                const {code} = response;
                if (code === 200) {
                    if (response.dataArray.length > 0) {
                        const {totalSemana, dataSemana, dataArray} = response;
                        setCabeceraEnfunde(dataSemana);
                        const datos = [];
                        dataArray.map((item) => {
                            const {cant_pre, cant_fut, alias} = item;
                            const seccion = {
                                series: [+(((+cant_pre + +cant_fut) / +totalSemana) * 100).toFixed(2)],
                                options: {
                                    chart: {
                                        height: 150,
                                        type: 'radialBar',
                                    },
                                    plotOptions: {
                                        radialBar: {
                                            hollow: {
                                                size: '60%',
                                            }
                                        },
                                    },
                                    labels: [`${alias}`],
                                }
                            };
                            const data = {
                                seccion,
                                item
                            };
                            datos.push(data);
                            return true;
                        });
                        setSecciones(datos);
                    }
                }

            })();
            setLoadData(false);
        }
    }, [loadData, id]);

    return (
        <>
            {cabeceraEnfunde &&
            <div className="container-fluid mt-3 mb-5">
                <div className="row">
                    <div className="btn-group col-5">
                        <button
                            className="btn btn-danger col-4 text-center"
                            onClick={() => history.push(`/hacienda/avances/labor/empleado/list`)}
                        >
                            <i className="fas fa-arrow-circle-left"/> Regresar
                        </button>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-2">
                        <label>Cinta: </label>
                        <input className="form-control" name={`${cabeceraEnfunde.color}-CALENDARIO`} type="text"
                               disabled={true}/>
                    </div>
                    <div className="col-md-3">
                        <label>Enfunde Total Semana {cabeceraEnfunde.semana}: </label>
                        <input className="form-control bg-white" disabled={true} value={cabeceraEnfunde.total}/>
                    </div>
                    <div className="col-md-2">
                        <label>Has. Total: </label>
                        <input className="form-control bg-white" disabled={true}
                               value={(+cabeceraEnfunde.has).toFixed(2)}/>
                    </div>
                    <div className="col-md-4">
                        <label>Hacienda: </label>
                        <input className="form-control bg-white" disabled={true}
                               value={cabeceraEnfunde.hacienda.detalle}/>
                    </div>
                    <div className="col-md-1">
                        <label>... </label>
                        <input
                            className={`form-control ${cabeceraEnfunde.cerrado !== "0" ? 'bg-danger' : 'bg-success'}`}
                            disabled={true}
                        />
                    </div>
                </div>
                <hr/>
                <div className="row">
                    {secciones.length > 0 &&
                    secciones.map((data, index) => (
                        <div className="col-md-2 col-6 p-0 text-center" key={index}>
                            <ApexChart
                                data={data.seccion}
                                type="radialBar"
                                height={200}
                            />
                            <button className="btn btn-primary mt-n4">
                                <i className="fas fa-list"/> Detalles {data.item.alias}
                            </button>
                        </div>
                    ))
                    }
                </div>
            </div>
            }
        </>
    );
}