import React, {useEffect, useState} from "react";
import {API_LINK} from "../../../../utils/constants";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import PaginationForm from "../../../../components/Pagination/Pagination";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";

const style = {
    table: {
        textCenter: {
            textAlign: "center",
            verticalAlign: "middle"
        }
    }
};

export default function ListAvances() {
    const [enfundes, setEnfundes] = useState(null);
    const [page, setPage] = useState(1);
    const history = useHistory();
    const authentication = useSelector((state) => state.auth._token);

    const [reload, setReload] = useState(true);

    useEffect(() => {
        if (reload) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/getEnfunde/semanal?page=${page}`;
                const request = await fetch(url);
                const response = await request.json();
                setEnfundes(response);
            })();
            setReload(false);
        }
    }, [reload, page]);

    const onChangePage = (page) => {
        setPage(page);
        setReload(true);
    };

    const cerrarEnfunde = (id) => {
        if (id !== undefined) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/endunde/cerrar/semana/${id}`;
                const configuracion = {method: 'POST', headers: {'Authorization': authentication}};
                const request = await fetch(url, configuracion);
                const response = await request.json();
                console.log(response);
                if (response.code === 200) {
                    setReload(true);
                }
                setPage(1);
            })();
        }
    };

    if (!enfundes || reload) {
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        );
    }

    return (
        <>
            {!reload &&
            <div className="container-fluid mt-3 mb-5">
                <div className="row">
                    <div className="btn-group col-5">
                        <button
                            className="btn btn-danger col-1 text-center"
                            onClick={() => history.push(`/hacienda/avances/labor/empleado`)}
                        >
                            <i className="fas fa-arrow-circle-left"/>
                        </button>
                        <button
                            className="btn btn-success col-auto"
                            onClick={() => history.push(`/hacienda/avances/labor/empleado/formulario`)}
                        >
                            <i className="fab fa-buffer"/> Registrar Enfunde Semanal
                        </button>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-12 table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead>
                            <tr className="text-center">
                                <th>...</th>
                                <th>Año</th>
                                <th>Color</th>
                                <th>Semana</th>
                                <th>Periodo</th>
                                <th>Hacienda</th>
                                <th>Has.</th>
                                <th>Total</th>
                                <th>Desbunche</th>
                                <th>Accion</th>
                            </tr>
                            </thead>
                            <tbody>
                            {enfundes.hasOwnProperty('dataArray') && enfundes.dataArray.data.length > 0 &&
                            enfundes.dataArray.data.map((item, index) => (
                                <tr key={index} className="text-center table-sm">
                                    <td style={style.table.textCenter}>
                                        <i className="fas fa-align-left"/>
                                    </td>
                                    <td style={style.table.textCenter}>
                                        <b>{item.year}</b>
                                    </td>
                                    <td width="8%" style={style.table.textCenter}>
                                        <div className="input-group">
                                            <input className="form-control" name={`${item.color}-CALENDARIO`}
                                                   type="text"
                                                   disabled={true}/>
                                        </div>
                                    </td>
                                    <td style={style.table.textCenter}>{item.semana}</td>
                                    <td style={style.table.textCenter}>{item.periodo}</td>
                                    <td style={style.table.textCenter}>
                                        <small>{item.hacienda.detalle}</small>
                                    </td>
                                    <td style={style.table.textCenter}>
                                        <b>{(+item.has).toFixed(2)}</b>
                                    </td>
                                    <td style={style.table.textCenter}>{item.total}</td>
                                    <td width="8%" style={style.table.textCenter}>{item.desbunche}</td>
                                    <td>
                                        <div className="btn-group">
                                            {item.cerrado !== "0" ?
                                                <button className="btn btn-danger">
                                                    <i className="fas fa-lock"/>
                                                </button>
                                                :
                                                <button className="btn btn-success"
                                                        onClick={() => cerrarEnfunde(item.id)}>
                                                    <i className="fas fa-lock-open"/>
                                                </button>
                                            }
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => history.push(`/hacienda/avances/labor/empleado/list/detalle/${item.id}`)}
                                            >
                                                <i className="fas fa-archive"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className="col-12 align-content-center">
                        <PaginationForm
                            current_page={enfundes.dataArray.current_page}
                            total={enfundes.dataArray.total}
                            pageSize={7}
                            onChangePage={onChangePage}
                        />
                    </div>
                </div>
            </div>
            }
        </>
    )
}