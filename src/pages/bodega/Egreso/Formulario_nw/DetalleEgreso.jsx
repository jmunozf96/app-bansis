import React from "react";

import {useSelector} from "react-redux";
import FormDetalleEgreso from "./FormDetalleEgreso";

export default function DetalleEgreso() {
    const despachos = useSelector(state => state.egresoBodega.detalle);

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12 table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="text-center">
                        <tr>
                            <th width="3%">...</th>
                            <th>Codigo</th>
                            <th width="10%">Fecha</th>
                            <th>Material</th>
                            <th width="10%">Stock</th>
                            <th width="20%">Cantidad</th>
                            <th width="3%">...</th>
                        </tr>
                        </thead>
                        <tbody className="table-sm text-center">
                        {despachos.map((data, i) =>
                            !data.hasOwnProperty('delete') && <FormDetalleEgreso key={i} index={i} data={data}/>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>
    )
}
