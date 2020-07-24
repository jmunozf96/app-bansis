import React, {useEffect, useState} from "react";
import Caja from "./Caja";
import moment from "moment";
import {API_LINK} from "../../../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import {enabledCajasDiaAction} from "../../../actions/cosecha/cosechaActions";

export default function CajasFecha(props) {
    const {hacienda, cajasDay, setCajasDay} = props;
    const day = moment().format("DD/MM/YYYY");
    //const day = "18/07/2020";

    const dispatch = useDispatch();
    const getUpdateCajasDia = useSelector((state) => state.cosecha.updateCajasDia);

    useEffect(() => {
        if (hacienda !== '' && getUpdateCajasDia) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/recepcion/${hacienda}/cajas-dia?fecha=${day}`;
                const request = await fetch(url);
                const response = await request.json();
                const {code} = response;
                if (code === 200) {
                    setCajasDay(response.data);
                }
            })();
            dispatch(enabledCajasDiaAction(false));
        }

    }, [day, hacienda, getUpdateCajasDia, dispatch, setCajasDay]);

    useEffect(() => {
        if (!getUpdateCajasDia) {
            const interval = setInterval(() => {
                dispatch(enabledCajasDiaAction(true));
            }, (5 * 60 * 1000));
            return () => clearInterval(interval);
        }
    }, [getUpdateCajasDia, dispatch]);

    return (
        <>
            {cajasDay.length > 0 &&
            <div className="row">
                {cajasDay.map((caja, i) => (
                    <div className="col-md-6 col-12 mb-2" key={i}>
                        <Caja data={caja}/>
                    </div>
                ))}
            </div>
            }
        </>
    );
}
