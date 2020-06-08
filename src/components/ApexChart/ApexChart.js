import React from "react";
import ReactApexChart from 'react-apexcharts'

export default function ApexChart({data, type = "bar", height=350}) {
    return (
        <ReactApexChart
            options={data.options}
            series={data.series}
            type={type}
            height={height}/>
    );
}
