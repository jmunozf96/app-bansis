import React, {useCallback, useEffect, useState} from "react";
import {API_LINK} from "../../../../constants/helpers";
import axios from "axios";
import {Checkbox, FormControlLabel} from "@material-ui/core";
import {convertDataHttp_ConsolidarDanos} from "./HelpersInforme";
import {useSelector} from "react-redux";


export default function DanosHacienda({danos, setDanos, dataFilter, load}) {
    const desde = useSelector(state => state.manosRecusadas.desde);
    const hasta = useSelector(state => state.manosRecusadas.hasta);
    const hacienda = useSelector(state => state.manosRecusadas.hacienda);

    const [loadData, setLoadData] = useState(true);
    const [selectAll, setSelectAll] = useState(true);

    useEffect(() => {
        setLoadData(load);
    }, [load]);

    useEffect(() => {
        setSelectAll(true);
        setDanos([]);
        return () => {
            setDanos([]);
        }
    }, [setDanos]);

    useEffect(() => {
        if (loadData && hacienda) {
            setSelectAll(true);
            (async () => {
                try {
                    const url = `${API_LINK}/bansis-app/index.php/cosecha/informe/manos-recusadas/${hacienda.id}/danos?desde=${desde}&hasta=${hasta}`;
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
    }, [loadData, hacienda, desde, hasta, setDanos]);

    const changeValue = useCallback((e, id) => {
        const status = (data) => (data.id === id);
        const data = danos.map((data) => status(data) ? ({...data, selected: !data.selected}) : data);
        setDanos(data);
    }, [danos, setDanos]);

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

            dataFilter(convertDataHttp_ConsolidarDanos(data))
        }
    }, [danos, dataFilter]);

    const unSelectAll = () => {
        setSelectAll(!selectAll);
        const data = danos.map((data) => !data.disabled ? {...data, selected: !selectAll} : data);
        setDanos(data);
    };

    if (loadData) {
        return (
            <div className="col-12 text-center">
                <i className="fas fa-spinner fa-spin fa-10x"/>
            </div>
        )
    }

    return (
        <div className="col-12">
            <div className="row">
                <div className="col-md-6 col-6">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectAll}
                                onChange={() => unSelectAll()}
                                name={'SELECCIONAR TODOS'}
                                color="secondary"
                            />
                        }
                        label={'SELECCIONAR TODOS'}
                    />
                </div>
                {danos.length > 0 && danos.map((data, i) =>
                    <div className="col-md-6 col-6" key={i}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.selected}
                                    onChange={e => changeValue(e, data.id)}
                                    name={data.nombre}
                                    color="primary"
                                    disabled={data.disabled}
                                />
                            }
                            label={data.nombre}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
