import React, {useEffect} from "react"
import {useDispatch} from "react-redux";
import axios from "axios";
import {progressActions} from "../../../../../actions/progressActions";
/*import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";*/

export default function InformeEnfundeSemanal(props) {
    const {cabeceraTabla, api, setData, children, loadData, setLoadData} = props;
    const dispatch = useDispatch();

    useEffect(() => {
        if (loadData) {
            dispatch(progressActions(true));
            (async () => {
                try {
                    const request = await axios.get(api, {
                        onDownloadProgress: () => {
                            dispatch(progressActions(false));
                        }
                    });
                    const response = request.data;
                    setData(response);
                } catch (e) {
                    console.error(e);
                }
            })();
            setLoadData(false);
        }
    }, [dispatch, loadData, api, setData, setLoadData]);

    /*if (data === null) {
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        );
    }*/

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

