import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {deleteTransfer, setAddSaldoToTransfer} from "../../../../reducers/bodega/egresoBodegaDucks";

const style = {
    table: {textCenter: {verticalAlign: "middle", fontSize: 18}}
};

export default function FormTransferenciaSaldosDetail({data}) {
    const [active, setActive] = useState(false);
    const [cantidad, setCantidad] = useState("0");

    const cabecera_transferencia = useSelector(state => state.egresoBodega.transferencia.cabecera);
    const detalle_transferencia = useSelector(state => state.egresoBodega.transferencia.detalle);

    const dispatch = useDispatch();

    const activeItem = () => {
        setActive(true);
    };

    const changeCantidad = (e) => {
        const valor = e.target.value;
        if (valor === "") {
            setCantidad("");
        } else {
            setCantidad(valor);
        }
    };

    const saldo = () => {
        let saldo = +data.sld_final;

        const filtro = detalle_transferencia.filter(item => item.empleado_solicitado.id === cabecera_transferencia.empleado.id
            && item.material.id === data.material.id);
        const total = filtro.reduce((total, item) => +total + +item.cantidad, 0);
        saldo -= +total;
        return saldo;
    };

    const addItem = () => {

        if (saldo() < +cantidad) {
            return;
        }

        setActive(false);

        if (cantidad === "" || parseInt(cantidad) === 0) {
            dispatch(deleteTransfer({material: data.material}));
            return;
        }

        dispatch(setAddSaldoToTransfer({
            idInv: data.id,
            material: data.material,
            cantidad
        }));
    };

    const removeItem = () => {
        dispatch(deleteTransfer({
            idInv: data.id,
            material: data.material,
        }));
        setCantidad("0");
    };

    return (
        <tr>
            <td style={style.table.textCenter}>{data.material.descripcion}</td>
            <td width="10%" className="text-center" style={style.table.textCenter}>{saldo()}</td>
            <td width="15%" className="text-center" style={style.table.textCenter}>
                <input
                    type="number"
                    className="form-control text-center form-control-lg"
                    disabled={!active}
                    value={cantidad}
                    onFocus={e => e.target.select()}
                    onKeyDown={e => e.keyCode === 13 && addItem()}
                    onChange={e => changeCantidad(e)}
                />
            </td>
            <td width="6%">
                <div className="btn-group">
                    {!active ?
                        <button className="btn btn-lg btn-primary" onClick={() => activeItem()}>
                            <i className="fas fa-plus"/>
                        </button>
                        :
                        <button className="btn btn-lg btn-success" onClick={() => addItem()}>
                            <i className="fas fa-save"/>
                        </button>
                    }
                    <button className="btn btn-lg btn-danger"
                            onClick={(cantidad !== "" || parseInt(cantidad) !== 0) ? () => removeItem() : console.error('No puedes usar esta opción.')}
                            disabled={cantidad === "" || parseInt(cantidad) === 0}>
                        <i className="fas fa-eraser">/</i>
                    </button>
                </div>

            </td>
        </tr>
    )
}