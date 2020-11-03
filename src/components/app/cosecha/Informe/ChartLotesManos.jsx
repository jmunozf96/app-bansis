import React from "react";
import ApexChart from "../../../Tools/ApexChart/ApexChart";

export default function ChartLotesManos({data}) {

    return (
        <ApexChart
            data={data}
            type="bar"
            height={800}
        />
    )
}
