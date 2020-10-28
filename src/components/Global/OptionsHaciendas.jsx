import React from "react";
import ComponentOptions from "../Tools/ComponentOptions";
import {API_LINK} from "../../constants/helpers";

export default function OptionsHaciendas({hacienda, changeOption, disabled}) {
    const api_haciendas = `${API_LINK}/bansis-app/index.php/haciendas-select`;

    return (
        <ComponentOptions
            api={api_haciendas}
            label="Hacienda"
            name="hacienda"
            value={hacienda !== null ? hacienda.descripcion : ""}
            changeValue={changeOption}
            disabled={disabled}
        />
    )
}
