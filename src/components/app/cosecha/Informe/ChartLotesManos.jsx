import React, {useCallback, useEffect, useState} from "react";
import ApexChart from "../../../Tools/ApexChart/ApexChart";

export default function ChartLotesManos({data}) {
    const [dataChart, setDatahart] = useState(data);
    const [load, setLoad] = useState(true);
    const [view, setView] = useState('');

    const viewChart = useCallback(() => {
        return (<ApexChart
            data={dataChart}
            type="bar"
            height={350}
        />)
    }, [dataChart]);

    useEffect(() => {
        setLoad(false);
        setDatahart(data);
    }, [data]);

    useEffect(() => {
        setView(viewChart);
        setLoad(true);
    }, [dataChart, viewChart]);

    return (
        <React.Fragment>
            {load && view}
        </React.Fragment>
    )
}
