import React from "react";
import ApexChart from "../../components/ApexChart/ApexChart";
import {useSelector} from "react-redux";

export default function CosechaChart() {
    const data = useSelector(state => state.cosechaChart.data);

    return (
        <ApexChart
            data={data}
            type="line"
            height={400}
        />
    )
}
