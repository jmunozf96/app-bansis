import React, {useCallback, useEffect, useState} from "react";
import {API_LINK} from "../../../../constants/helpers";
import axios from "axios";
import {Checkbox, FormControlLabel} from "@material-ui/core";

export default function DanosHacienda({desde, hasta, dataFilter, load}) {
    const [danos, setDanos] = useState([]);
    const [loadData, setLoadData] = useState(true);

    useEffect(() => {
        setLoadData(load);
    }, [load]);

    useEffect(() => {
        if (loadData) {
            (async () => {
                try {
                    const url = `${API_LINK}/bansis-app/index.php/cosecha/informe/manos-recusadas/danos?fecha=${desde}`;
                    const respuesta = await axios.get(url);
                    const {code} = respuesta.data;
                    if (code === 200)
                        setDanos(respuesta.data.datos);
                } catch (e) {
                    console.error(e);
                }
            })();
            setLoadData(false);
        }
    }, [loadData, desde, hasta]);

    const changeValue = useCallback((e, id) => {
        const status = (data) => (data.id === id);
        const data = [...danos.map(data => status(data) ? ({...data, selected: !data.selected}) : data)];
        setDanos(data);
    }, [danos]);

    useEffect(() => {
        if (localStorage.getItem('_dataManos')) {
            let nw_manos_recusadas = [];
            let data = JSON.parse(localStorage.getItem('_dataManos'));
            //Filtrar daños
            const danos_activos = danos.filter(item => item.selected).map(item => ({id: item.id}));
            data.forEach(item => {
                nw_manos_recusadas = [];
                item['manos_recusadas'].forEach(data => {
                    let encontro = danos_activos.filter(item => item.id === data.dano.id);
                    if (encontro.length > 0) nw_manos_recusadas.push(data);
                });
                item['manos_recusadas'] = nw_manos_recusadas;
            });

            dataFilter([...data.map(item => ({
                id: item.id,
                alias: item.alias,
                lat: item.latitud,
                lng: item.longitud,
                cantidad: data.filter(data => data.id === item.id)[0]['manos_recusadas']
                    .reduce((total, data) => total + +data.cantidad, 0)
            }))])
        }
    }, [danos, dataFilter]);

    if (loadData) {
        return <h1>Cargando danos...</h1>
    }

    return (
        <React.Fragment>
            <div className="row">
                {danos.length > 0 && danos.map((data, i) =>
                    <div className="col-6" key={i}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.selected}
                                    onChange={e => changeValue(e, data.id)}
                                    name={data.nombre}
                                    color="secondary"
                                />
                            }
                            label={data.nombre}
                        />
                    </div>
                )}
            </div>
        </React.Fragment>
    )
}
