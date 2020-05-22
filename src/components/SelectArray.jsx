import React from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";

export default function SelectArray({name, titulo, descripcion, datos, value, setValue, defaultValue, disabled = false}) {

    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
    };

    return (
        <FormControl variant="outlined" disabled={disabled}>
            <InputLabel id="demo-simple-select-outlined-label">{titulo}</InputLabel>
            <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                name={name}
                label={titulo}
                value={defaultValue}
                onChange={handleChange}
            >
                <MenuItem value="">
                    <em>Seleccione un/a {descripcion}</em>
                </MenuItem>
                {datos.length > 0 && datos.map((item, index) =>
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                )}
            </Select>
        </FormControl>
    )
}
