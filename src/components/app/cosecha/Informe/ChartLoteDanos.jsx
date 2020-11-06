import React from "react";
import ApexChart from "../../../Tools/ApexChart/ApexChart";
import {transformarDataDanosLote} from "./ChartPrepareData";

export default function CharLoteDanos({id, alias, danos}) {
    const data = transformarDataDanosLote(id, danos);

    return (
        <div className="row">
            <div className="col-12">
                <div className="alert alert-danger">
                    <i className="fas fa-exclamation-triangle"/> Daños reportados en el lote <b>{alias.toUpperCase()}</b>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <ApexChart
                                    data={data}
                                    type="bar"
                                    height={500}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
