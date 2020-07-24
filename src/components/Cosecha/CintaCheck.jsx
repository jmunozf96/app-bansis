import React from "react";
import {useDispatch} from "react-redux";
import {enabledLotesCortados, enabledLotesRecobroAction} from "../../actions/cosecha/cosechaActions";

export default function CintaCheck({color, setColor, setLotes, data, setSearchRecobroCintaSemana}) {
    const dispatch = useDispatch();

    const changeCintaSemana = (e) => {
        setColor(+e.target.value);
        setLotes([]);
        dispatch(enabledLotesCortados(true));
        dispatch(enabledLotesRecobroAction(true));
        setSearchRecobroCintaSemana(true);
    };

    return (
        <div className="input-group mb-1">
            <div className="input-group-prepend">
                <div className="input-group-text">
                    <input
                        type="radio"
                        name="colorSemana"
                        value={data && data.idcalendar}
                        style={{width: 20, height: 20}}
                        checked={(color !== 0 && data !== null && color === +data.idcalendar)}
                        onChange={(e) => changeCintaSemana(e)}
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
    );
}
