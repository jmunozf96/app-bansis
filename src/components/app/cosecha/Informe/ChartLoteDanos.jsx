import React from "react";
import ApexChart from "../../../Tools/ApexChart/ApexChart";
import {transformarDataDanosLote} from "./ChartPrepareData";

export default function CharLoteDanos({id, alias, danos}) {
    const data = transformarDataDanosLote(id, danos);

    return (
        <ApexChart
            data={data}
            type="bar"
            height={635}
        />
    )
}
