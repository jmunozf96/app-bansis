import React, {useEffect} from "react"
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function InformeEnfundeSemanal(props) {
    const {data, cabeceraTabla, api, setData, children, loadData, setLoadData} = props;

    useEffect(() => {
        if (loadData) {
            (async () => {
                try {
                    const request = await fetch(api);
                    const response = await request.json();
                    setData(response);
                } catch (e) {
                    console.error(e);
                }
            })();
            setLoadData(false);
        }
    }, [loadData, api, setData, setLoadData]);

    if (data === null) {
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        );
    }

    return (
        <table className="table table-bordered table-hover">
            <thead>
            <tr className="text-center">
                {cabeceraTabla.length > 0 && cabeceraTabla.map((header, i) => (
                    <th key={i}>{header}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {children}
            </tbody>
        </table>
    )
}

