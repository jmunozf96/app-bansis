import React from "react";
import ReactApexChart from 'react-apexcharts'

export default function ApexChart({data, type = "bar", height = 350, style = null}) {
    return (
        <ReactApexChart
            options={data.options}
            series={data.series}
            type={type}
            style={style}
            height={height}/>
    );
}
