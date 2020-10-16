import React, {useEffect, useState} from "react";
import OptionsComponent from "../../../../components/OptionsComponent";

import {useDispatch, useSelector} from 'react-redux'
import {
    setDataCabeceraHacienda, setDataCabeceraEmpleado,
    setDataCabeceraBodega, setDataCabeceraGrupo, setDataCabeceraParcial, existEgreso
} from "../../../../reducers/bodega/egresoBodegaDucks"

import {API_LINK} from "../../../../utils/constants";
import InputSearch from "../../../../components/InputSearch/InputSearch";
import FormMaterial from "./FormMaterial";
import {Checkbox, FormControlLabel} from "@material-ui/core";

export default function CabeceraEgreso() {
    const dispatch = useDispatch();
    const cabecera = useSelector(state => state.egresoBodega.cabecera);

    const api_haciendas = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const api_bodegas = `${API_LINK}/bansis-app/index.php/bodegas-select`;
    const api_grupos_bodega = `${API_LINK}/bansis-app/index.php/bodegas-grupos-select`;

    const [api_empleado, setApi_Empleado] = useState(`${API_LINK}/bansis-app/index.php/search/empleados?params=`);
    const [changeURL, setChangeURL] = useState(false);
    const [searchEmpleado, setSearchEmpleado] = useState('');

    useEffect(() => {
        if (changeURL) {
            setApi_Empleado(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}`);
            setChangeURL(false);
        }
    }, [changeURL, searchEmpleado, setApi_Empleado]);

    const changeOption = (e) => {
        const value = e.target.value === "" ? null : e.target.value;
        switch (e.target.name) {
            case 'hacienda':
                dispatch(setDataCabeceraHacienda(value));
                //Borrar bodega y grupo
                dispatch(setDataCabeceraBodega(null));
                return;
            case 'bodega':
                dispatch(setDataCabeceraBodega(value));
                //Borrar grupo
                dispatch(setDataCabeceraGrupo(null));
                return;
            case 'grupo':
                dispatch(setDataCabeceraGrupo(value));
                return;
            default:
                return;
        }
    };

    const changeEmpleado = (e, value) => {
        dispatch(setDataCabeceraEmpleado(value));

        if (!value) {
            setSearchEmpleado('');
            setChangeURL(true);
            return;
        }

        dispatch(existEgreso(value.id, cabecera.fecha));
    };

    return (
        <React.Fragment>
            <div className="row mb-1">
                <div className="col-md-4">
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <OptionsComponent
                                api={api_haciendas}
                                label="Hacienda"
                                name="hacienda"
                                value={cabecera.hacienda !== null ? cabecera.hacienda : ""}
                                changeValue={changeOption}
                                disabled={false}
                            />
                        </div>
                        <div className="col-md-12 mb-3">
                            <OptionsComponent
                                api={cabecera.hacienda !== null ? api_bodegas + `?hacienda=${cabecera.hacienda.id}` : api_bodegas}
                                label="Bodega"
                                name="bodega"
                                value={cabecera.bodega !== null ? cabecera.bodega : ""}
                                changeValue={changeOption}
                                disabled={cabecera.hacienda == null}
                            />
                        </div>
                        <div className="col-md-12 mb-1">
                            <OptionsComponent
                                api={api_grupos_bodega}
                                label="Grupo"
                                name="grupo"
                                value={cabecera.grupo !== null ? cabecera.grupo : ""}
                                changeValue={changeOption}
                                disabled={cabecera.bodega == null}
                            />
                        </div>

                        <div className="col-md-12">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={cabecera.parcial}
                                        onChange={() => dispatch(setDataCabeceraParcial(!cabecera.parcial))}
                                        name="checkedB"
                                        color="secondary"
                                    />
                                }
                                label={cabecera.parcial ? "EGRESO PARCIAL" : "EGRESO FINAL"}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-12 mb-3">
                            <InputSearch
                                id="asynchronous-empleado"
                                label="Listado de empleados"
                                api_url={cabecera.hacienda !== null ? api_empleado + `&hacienda=${cabecera.hacienda.id}` : api_empleado}
                                setSearch={setSearchEmpleado}
                                onChangeValue={changeEmpleado}
                                disabled={cabecera.hacienda == null}
                                value={cabecera.empleado}
                                setChangeURL={setChangeURL}
                            />
                        </div>
                        <div className="col-12">
                            <FormMaterial/>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
        </React.Fragment>
    )
}
