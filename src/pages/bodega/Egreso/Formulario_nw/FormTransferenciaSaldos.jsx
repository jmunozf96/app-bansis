import React, {useEffect, useState} from "react";
import InputSearch from "../../../../components/InputSearch/InputSearch";
import {getSaldostoTransfer, setDataCabeceraTransferEmpleado} from "../../../../reducers/bodega/egresoBodegaDucks";
import {API_LINK} from "../../../../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import FormTransferenciaSaldosDetail from "./FormTransferenciaSaldosDetail";

export default function FormTransferenciaSaldos() {
    const [api_empleado, setApi_Empleado] = useState(`${API_LINK}/bansis-app/index.php/search/empleados?params=`);
    const [changeURL, setChangeURL] = useState(false);
    const [searchEmpleado, setSearchEmpleado] = useState('');

    const dispatch = useDispatch();
    const cabecera = useSelector(state => state.egresoBodega.cabecera);
    const cabecera_transferencia = useSelector(state => state.egresoBodega.transferencia.cabecera);
    const detalle_transferencia = useSelector(state => state.egresoBodega.transferencia.detalle);
    const error_transferencia = useSelector(state => state.egresoBodega.transferencia.error);

    useEffect(() => {
        if (changeURL) {
            setApi_Empleado(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}`);
            setChangeURL(false);
        }
    }, [changeURL, searchEmpleado, setApi_Empleado]);

    const changeEmpleado = (e, value) => {
        dispatch(setDataCabeceraTransferEmpleado(value));

        if (!value) {
            setSearchEmpleado('');
            setChangeURL(true);
            return;
        }

        dispatch(getSaldostoTransfer());
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {error_transferencia &&
                <div className="col-12 mb-2">
                    <div className="alert alert-danger">
                        <i className="fas fa-lock"/> {error_transferencia.message}
                    </div>
                </div>
                }
                <div className="col-12 mb-3">
                    <InputSearch
                        id="asynchronous-empleado"
                        label="Listado de empleados"
                        api_url={cabecera.hacienda !== null ? api_empleado + `&hacienda=${cabecera.hacienda.id}` : api_empleado}
                        setSearch={setSearchEmpleado}
                        onChangeValue={changeEmpleado}
                        disabled={cabecera.hacienda == null}
                        value={cabecera_transferencia.empleado}
                        setChangeURL={setChangeURL}
                    />
                </div>
                <div className="col-12">
                    {cabecera_transferencia.saldos.length > 0 &&
                    <DetalleSaldostoTransfer>
                        {cabecera_transferencia.saldos.map((item, i) =>
                            <React.Fragment key={i}>
                                <FormTransferenciaSaldosDetail data={item}/>
                            </React.Fragment>
                        )}
                    </DetalleSaldostoTransfer>
                    }
                </div>
                {cabecera_transferencia.empleado &&
                <div className="col-12 d-flex">
                    <button type="button" className="btn btn-primary">
                        <i className="fas fa-th-list"/> Total Solicitado
                        <span className="badge badge-light">
                            {detalle_transferencia.filter((item) => item.empleado_solicitado.id === cabecera_transferencia.empleado.id
                                && !item.procesado).length}
                        </span>
                    </button>
                </div>
                }
            </div>
        </div>
    )
}

function DetalleSaldostoTransfer({children}) {
    return (
        <table className="table table-bordered table-hover">
            <thead className="text-center">
            <tr>
                <th>Material</th>
                <th>Saldo</th>
                <th><i className="fas fa-exchange-alt"/></th>
                <th>...</th>
            </tr>
            </thead>
            <tbody className="table-sm">
            {children}
            </tbody>
        </table>
    )
}