import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {cintaSelect} from "../../reducers/cosecha/cosechaDucks";
import {loadDataChart} from "../../reducers/cosecha/cosechaChartDucks";

export default function CosechaCintasSelect({data}) {
    const dispatch = useDispatch();
    const cinta = useSelector(state => state.cosecha.cinta_select);

    const changeCintaSemana = (cinta) => {
        dispatch(cintaSelect(cinta));
        dispatch(loadDataChart(cinta));
    };

    return (
        <div className="input-group mb-1">
            <div className="input-group-prepend">
                <div className="input-group-text">
                    <input
                        type="radio"
                        name="colorSemana"
                        value={data && data.codigo}
                        style={{width: 20, height: 20}}
                        checked={data.codigo === cinta}
                        onChange={(e) => changeCintaSemana(data.codigo)}
                    />
                </div>
            </div>
            <input
                type="text"
                className="form-control"
                name={`${data.color}-CALENDARIO`}
                disabled
            />
        </div>
    )
}
