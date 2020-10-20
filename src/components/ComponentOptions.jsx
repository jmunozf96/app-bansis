import React from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import useFetch from "../hooks/useFetch";
import {useSelector} from "react-redux";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(0),
    },
}));

export default function ComponentOptions({api, label, name, value, changeValue, disabled}) {
    const classes = useStyles();
    let options = [];

    const respuesta = useFetch(api);
    const {loading, result} = respuesta;

    if (loading) {
        return <React.Fragment/>;
    }

    options = result.dataArray;

    return (
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">{label}</InputLabel>
            <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                name={name}
                value={options.length > 0 ? value : ""}
                onChange={e => changeValue(e)}
                label={label}
                disabled={disabled}
            >
                <MenuItem value="">
                    <em>{label}</em>
                </MenuItem>
                {options.length > 0 && options.map((data) => (
                    <MenuItem key={data.id} value={data}>
                        {data.hasOwnProperty('descripcion') && data.descripcion}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
