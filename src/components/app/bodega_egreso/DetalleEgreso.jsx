import React, {useState} from "react";

import {useDispatch, useSelector} from "react-redux";
import {
    changeItemDetalle,
    deleteItemDetalle, registerChangesItemsProcess
} from "../../../reducers/bodega/egresoBodegaDucks";

const style = {table: {textCenter: {textAlign: "center", verticalAlign: "middle", fontSize: 18}}};

export default function DetalleEgreso({index, data}) {
    const dispatch = useDispatch();
    const [edit, setEdit] = useState(false);
    const [editProcess, setEditProcess] = useState(false);
    const [cantidad, setCantidad] = useState("");

    const cabecera = useSelector(state => state.egresoBodega.cabecera);
    const detalle = useSelector(state => state.egresoBodega.detalle);
    const respaldos = useSelector(state => state.egresoBodega.cambiosCantidades);

    const editItem = () => {
        setEdit(!edit);
        setCantidad(data.cantidad);
    };

    const changeCantidad = (e) => {
        const valor = e.target.value;
        if (valor === "") {
            setCantidad("");
        } else {
            setCantidad(valor);
        }
    };

    const stockReservado = () => {
        const respaldo = respaldos.filter((item) => item.idmaterial === data.material.id && item.fecha === data.fecha);
        return (respaldo.length > 0) ? respaldo.reduce((total, item) => +total + +item.diferencia, 0) : 0;
    };

    const stockMaterial = () => {
        let stock = 0;
        if (data.material) {
            const data_material_detalle = detalle.filter(item => item.material.id === data.material.id &&
                (!item.hasOwnProperty('idSQL')));
            const consumo = data_material_detalle.reduce((total, item) => total + item.cantidad, 0);
            stock = (parseFloat(data.material.stock) + stockReservado(data)) - parseInt(consumo);
        }
        return stock.toFixed(2);
    };

    const saveItem = () => {
        if ((+stockMaterial() + data.cantidad) >= +cantidad && +cantidad > 0) {
            setEdit(false);
            dispatch(changeItemDetalle(index, +cantidad));
            return;
        }

        setCantidad(data.cantidad);
    };

    const editItemProcess = () => {
        setEditProcess(!editProcess);
        setCantidad(data.cantidad);
    };

    const saveItemProcess = () => {
        if ((+stockMaterial() + data.cantidad) >= +cantidad && +cantidad > 0) {
            dispatch(registerChangesItemsProcess(data, cantidad));
            setEditProcess(false);
            dispatch(changeItemDetalle(index, +cantidad));
            return;
        }
        setCantidad(data.cantidad);
    };

    const getColor = (movimiento) => {
        switch (movimiento) {
            case 'CREDIT-SLD':
                return 'warning';
            case 'DEBIT-SLD':
                return 'danger';
            default:
                return 'success'
        }
    };

    return (
        <tr>
            <td width="3%" style={style.table.textCenter}>
                {data.movimiento === 'EGRE-ART' ?
                    <React.Fragment>
                        {cabecera.fecha === data.fecha ?
                            <button className="btn btn-lg btn-danger btn-block"
                                    onClick={() => dispatch(deleteItemDetalle(data))}>
                                <i className="fas fa-minus"/>
                            </button>
                            :
                            <button className="btn btn-lg btn-success btn-block">
                                <i className="far fa-check-circle"/>
                            </button>
                        }
                    </React.Fragment>
                    :
                    <button className="btn btn-lg btn-danger btn-block">
                        <i className="fas fa-minus"/>
                    </button>
                }
            </td>
            {/*<td style={style.table.textCenter}>{data.material.codigo}</td>*/}
            <td width="10%" style={style.table.textCenter}>{data.fecha}</td>
            <td width="8%" style={style.table.textCenter}>
                <span className={`badge badge-${getColor(data.movimiento)}`}>{data.movimiento}</span>
            </td>
            <td style={style.table.textCenter}>{data.material.descripcion}</td>
            <td width="10%" style={style.table.textCenter}>{
                data.hasOwnProperty('idSQL') && data.fecha !== cabecera.fecha ? data.material.stock : stockMaterial()
            }</td>
            <td width="15%" style={style.table.textCenter}>
                {!edit && !editProcess ? data.cantidad : editProcess ? <input
                        type="number"
                        className="form-control form-control-lg text-center" value={cantidad}
                        onFocus={e => e.target.select()}
                        onKeyDown={e => e.keyCode === 13 && saveItemProcess()}
                        onChange={e => changeCantidad(e)}
                    /> :
                    <input
                        type="number"
                        className="form-control form-control-lg text-center" value={cantidad}
                        onFocus={e => e.target.select()}
                        onKeyDown={e => e.keyCode === 13 && saveItem()}
                        onChange={e => changeCantidad(e)}
                    />
                }
            </td>
            <td width="3%">
                {data.movimiento === 'EGRE-ART' ?
                    <React.Fragment>
                        {!data.hasOwnProperty('idSQL') ?
                            <React.Fragment>
                                {!edit ?
                                    <button className="btn btn-lg btn-primary btn-block" onClick={() => editItem()}>
                                        <i className="fas fa-edit"/>
                                    </button>
                                    :
                                    <button className="btn btn-lg btn-success btn-block" onClick={() => saveItem()}>
                                        <i className="fas fa-save"/>
                                    </button>
                                }
                            </React.Fragment>
                            :
                            <React.Fragment>
                                {cabecera.fecha === data.fecha ?
                                    <React.Fragment>
                                        {!editProcess ?
                                            <button className="btn btn-lg btn-primary btn-block"
                                                    onClick={() => editItemProcess()}>
                                                <i className="fas fa-edit"/>
                                            </button>
                                            :
                                            <button className="btn btn-lg btn-success btn-block"
                                                    onClick={() => saveItemProcess()}>
                                                <i className="fas fa-edit"/>
                                            </button>
                                        }
                                    </React.Fragment>
                                    :
                                    <button className="btn btn-lg btn-info btn-block">
                                        <i className="fas fa-lock"/>
                                    </button>
                                }
                            </React.Fragment>
                        }
                    </React.Fragment>
                    :
                    <button className="btn btn-lg btn-dark btn-block">
                        <i className="fas fa-eye"/>
                    </button>
                }
            </td>
        </tr>
    )
}
