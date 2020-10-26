import React, {useEffect, useState} from "react";
import {API_LINK} from "../../../../constants/helpers";

import {
    setDataMaterial,
    setDataCantidad,
    setAddDespacho, changeStatusBtnsave
} from "../../../../reducers/bodega/egresoBodegaDucks";
import {useDispatch, useSelector} from "react-redux";

import InputSearch from "../../../../components/InputSearch/InputSearch";

export default function FormMaterial() {
    const dispatch = useDispatch();
    const cabecera = useSelector(state => state.egresoBodega.cabecera);
    const despacho = useSelector(state => state.egresoBodega.despacho);
    const detalle = useSelector(state => state.egresoBodega.detalle);
    const respaldos = useSelector(state => state.egresoBodega.cambiosCantidades);

    const [api_material, setApi_Material] = useState(`${API_LINK}/bansis-app/index.php/search/materiales?params=`);
    const [changeURL, setChangeURL] = useState(false);
    const [searchMaterial, setSearchMaterial] = useState('');

    useEffect(() => {
        if (changeURL) {
            setApi_Material(`${API_LINK}/bansis-app/index.php/search/materiales?params=${searchMaterial}`);
            setChangeURL(false);
        }
    }, [changeURL, searchMaterial, setApi_Material]);

    const changeMaterial = (e, value) => {
        dispatch(setDataMaterial(value));
        if (!value) {
            setSearchMaterial('');
            setChangeURL(true);
        }
    };

    const changeCantidad = (e) => {
        const value = e.target.value;
        if (value === "") {
            dispatch(setDataCantidad(""))
        } else {
            dispatch(setDataCantidad(+e.target.value))
        }
    };

    const stockReservado = (data) => {
        const respaldo = respaldos.filter((item) => item.idmaterial === data.material.id && item.fecha === data.fecha);
        return (respaldo.length > 0) ? respaldo.reduce((total, item) => +total + +item.diferencia, 0) : 0;
    };

    const stockMaterial = () => {
        let stock = 0;
        if (despacho.material) {
            const data_material_detalle = detalle.filter(data => data.material.id === despacho.material.id
                && (!data.hasOwnProperty('idSQL')));
            const consumo = data_material_detalle.reduce((total, data) => total + data.cantidad, 0);
            stock = (parseFloat(despacho.material.stock) + stockReservado(despacho)) - parseInt(consumo);
        }
        return stock.toFixed(2);
    };

    const addDespacho = () => {
        if (+stockMaterial() >= despacho.cantidad && despacho.cantidad > 0) {
            dispatch(setAddDespacho(despacho));
            dispatch(setDataCantidad(""));
            dispatch(changeStatusBtnsave(false));
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <div className="row">
                    <div className="col-12 mb-1">
                        <InputSearch
                            id="asynchronous-material"
                            label="Listado de Materiales"
                            api_url={cabecera.bodega !== null && cabecera.grupo !== null ? api_material + `&bodega=${cabecera.bodega.id}&grupo=${cabecera.grupo.id}` : api_material}
                            setSearch={setSearchMaterial}
                            onChangeValue={changeMaterial}
                            disabled={(cabecera.bodega == null || cabecera.grupo == null)}
                            value={despacho.material}
                            setChangeURL={setChangeURL}
                        />
                    </div>
                    <div className="col-12">
                        <form className="form-inline">
                            <div className="form-group mt-2">
                                <input type="number" className="form-control form-control-lg" value={stockMaterial()}
                                       readOnly/>
                            </div>
                            <div className="form-group mx-sm-2 mt-2">
                                <input
                                    type="number" className="form-control form-control-lg"
                                    value={despacho.cantidad}
                                    onFocus={(e) => e.target.select()}
                                    onKeyDown={e => (e.keyCode === 13 && (despacho.material && +despacho.cantidad > 0)) && addDespacho()}
                                    onChange={(e) => changeCantidad(e)}
                                />
                            </div>
                            <div className="form-group mt-2">
                                <button type="button" className="btn btn-primary btn-lg"
                                        onClick={(despacho.material && +despacho.cantidad > 0) ? () => addDespacho() : () => console.error('No puedes usar esta opcion')}>
                                    <i className="fas fa-cart-plus"/> Agregar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
