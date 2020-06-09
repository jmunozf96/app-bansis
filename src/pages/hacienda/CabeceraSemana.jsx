import React, {useEffect} from "react";
import {API_LINK} from "../../utils/constants";

export default function CabeceraSemana(props) {
    const {title, loadCalendar, setLoadCalendar, changeSemana, setChangeSemana, data, setData} = props;
    useEffect(() => {
        if (loadCalendar) {
            (async () => {
                try {
                    const url = `${API_LINK}/bansis-app/calendario.php/semanaEnfunde?fecha=${data.fecha}`;
                    const request = await fetch(url);
                    const response = await request.json();
                    const {code, calendario} = response;

                    if (code === 200) {

                        if (changeSemana.status) {
                            setChangeSemana({
                                ...changeSemana,
                                codigo: calendario.presente.codigo
                            });
                        }

                        setData({
                            ...data,
                            codigoSemana: calendario.presente.codigo,
                            semana: calendario.presente.semana,
                            periodo: calendario.presente.periodo,
                            colorp: calendario.presente.color,
                            colorf: calendario.futuro.color,
                        });
                    }

                } catch (e) {
                    console.log(e);
                }
            })();
            setLoadCalendar(false);
        }
    }, [loadCalendar, setLoadCalendar, data, changeSemana, setChangeSemana, setData]);

    return (
        <div className="row">
            <div className="col-md-2">
                <label>Fecha</label>
                <div className="input-group">
                    <input className="form-control bg-white" type="text" disabled={true}
                           value={data.fecha}/>
                </div>
            </div>
            <div className="col-md-1">
                <label>Sem.</label>
                <div className="input-group">
                    <input className="form-control bg-white" type="text" disabled={true}
                           value={data.semana}/>
                </div>
            </div>
            <div className="col-md-1">
                <label>Per.</label>
                <div className="input-group">
                    <input className="form-control bg-white" type="text" disabled={true}
                           value={data.periodo}/>
                </div>
            </div>
            <div className="col-md-4">
                <label>Detalle</label>
                <div className="input-group">
                    <input className="form-control bg-white" type="text" disabled={true}
                           value={title}/>
                </div>
            </div>
            <div className="col-md-2 col-6">
                <label>PRE.</label>
                <div className="input-group">
                    <input className="form-control" name={`${data.colorp}-CALENDARIO`} type="text"
                           disabled={true}/>
                </div>
            </div>
            <div className="col-md-2 col-6">
                <label>FUT.</label>
                <div className="input-group">
                    <input className="form-control" name={`${data.colorf}-CALENDARIO`} type="text"
                           disabled={true}/>
                </div>
            </div>
        </div>
    )
}
