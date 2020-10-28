import React from "react";
import {useDispatch} from "react-redux";
import {deleteTransferProcess} from "../../../../reducers/bodega/egresoBodegaDucks";

const style = {table: {textCenter: {textAlign: "center", verticalAlign: "middle", fontSize: 18}}};

export default function TransferenciaDetail({item}) {
    const dispatch = useDispatch();

    const deleteItem = () => {
        dispatch(deleteTransferProcess(item.id))
    };

    return (
        <tr>
            <td>
                <button className="btn btn-lg btn-danger btn-block"
                        onClick={() => deleteItem()}
                >
                    <i className="fas fa-minus"/>
                </button>
            </td>
            <td style={style.table.textCenter}>{item.material.codigo}</td>
            <td style={style.table.textCenter}>{item.fecha}</td>
            <td style={style.table.textCenter}>{item.material.descripcion}</td>
            <td style={style.table.textCenter}>-</td>
            <td style={style.table.textCenter}>{item.cantidad}</td>
            <td/>
        </tr>
    )
}
