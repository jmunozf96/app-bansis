import React, {useCallback, useEffect, useState} from "react";
import ApexChart from "../../../Tools/ApexChart/ApexChart";
import {getDanosTotal} from "./ChartPrepareData";

export default function ChartDanos({danos, danosLotes}) {
    const [data, setData] = useState(getDanosTotal(danos, danosLotes));
    const [load, setLoad] = useState(true);
    const [view, setView] = useState('');

    const viewChart = useCallback(() => {
        return (<ApexChart
            data={data}
            type="bar"
            height={635}
        />)
    }, [data]);

    useEffect(() => {
        setLoad(false);
        setData(getDanosTotal(danos, danosLotes));
    }, [danos, danosLotes]);

    useEffect(() => {
        setView(viewChart);
        setLoad(true);
    }, [data, viewChart]);

    return (
        <React.Fragment>
            {load && view}
        </React.Fragment>
    );
}
