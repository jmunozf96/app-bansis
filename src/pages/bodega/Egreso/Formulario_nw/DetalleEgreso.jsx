import React from "react";

import {useDispatch, useSelector} from "react-redux";
import FormDetalleEgreso from "./FormDetalleEgreso";
import TransferenciaSaldos from "./TransferenciaSaldos";
import FormTransferenciaSaldos from "./FormTransferenciaSaldos";
import {configTransferModal, showTransferModal} from "../../../../reducers/bodega/egresoBodegaDucks";
import TransferenciaDetail from "./TransferenciaDetail";

export default function DetalleEgreso() {
    const dispatch = useDispatch();
    const cabecera = useSelector(state => state.egresoBodega.cabecera);
    const despachos = useSelector(state => state.egresoBodega.detalle);
    const waiting = useSelector(state => state.egresoBodega.waiting);

    const configuracionModal = useSelector(state => state.egresoBodega.configuracionModalTransfer);
    const transferencias = useSelector(state => state.egresoBodega.transferencia.detalle);

    const showModalTransfer = () => {
        const title_modal = `Saldos a transferir a: ${cabecera.empleado.descripcion}`;
        dispatch(configTransferModal('fas fa-exchange-alt', title_modal));
        dispatch(showTransferModal(true, <FormTransferenciaSaldos/>));
    };

    return (
        <React.Fragment>
            <div className="row">
                {waiting &&
                <div className="col-12">
                    <div className="alert alert-info">
                        <i className="fas fa-spinner fa-pulse"/> <b>Espere unos segundos</b>, su solicitud esta siendo
                        procesada....
                    </div>
                </div>
                }
                <div className="col-12 table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="text-center">
                        <tr>
                            <th width="3%">...</th>
                            {/*<th>Codigo</th>*/}
                            <th width="10%">Fecha</th>
                            <th width="8%">Mvmto.</th>
                            <th>Material</th>
                            <th width="10%">Stock</th>
                            <th width="15%">Cantidad</th>
                            <th width="3%">...</th>
                        </tr>
                        </thead>
                        <tbody className="table-sm text-center">
                        {despachos.map((data, i) =>
                            !data.hasOwnProperty('delete') && <FormDetalleEgreso key={i} index={i} data={data}/>
                        )}
                        {transferencias.filter(item => item.procesado).length > 0 &&
                        <React.Fragment>
                            <tr>
                                <td colSpan={7} style={{verticalAlign: "middle"}}>
                                    <h5>TRANSFERENCIAS DE SALDO</h5>
                                </td>
                            </tr>
                            {transferencias.filter(item => item.procesado).map((item, i) =>
                                <TransferenciaDetail key={i} item={item}/>
                            )}
                        </React.Fragment>
                        }
                        </tbody>
                    </table>
                </div>
                {cabecera.empleado &&
                <React.Fragment>
                    <div className="col-12 d-flex justify-content-end">
                        <div className="btn-group btn-group-lg">
                            <button className="btn btn-outline-danger"
                                    onClick={() => (cabecera.empleado && cabecera.grupo) ? showModalTransfer() : alert('Se necesita el empleado y el grupo de materiales.')}>
                                <i className="fas fa-exchange-alt"/> Transferir saldos de otro empleado.
                            </button>
                            <button className="btn btn-danger">
                                <i className="fas fa-search"/>
                            </button>
                        </div>
                    </div>
                    {configuracionModal.show && <TransferenciaSaldos/>}
                </React.Fragment>
                }
            </div>
        </React.Fragment>
    )
}
