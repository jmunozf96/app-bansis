import React, {useEffect, useState} from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(0),
    },
}));

export default function CustomSelect(props) {
    const classes = useStyles();
    const {label, name, value, placeholder, api_url, disabled = false, loading, setLoading, changeValue} = props;
    const [dataSelect, setDataSelect] = useState([]);

    useEffect(() => {
        if (loading) {
            (async () => {
                const request = await fetch(api_url);
                const response = await request.json();
                setDataSelect(response.dataArray);
            })();
            setLoading(false);
        }
    }, [loading, api_url, setLoading]);

    return (
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">{label}</InputLabel>
            <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                name={name}
                value={dataSelect.length > 0 ? value : ""}
                onChange={(e) => changeValue(e)}
                disabled={disabled}
                label={label}
            >
                <MenuItem value="">
                    <em>{placeholder}</em>
                </MenuItem>
                {dataSelect.length > 0 && dataSelect.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                        {data.hasOwnProperty('descripcion') && data.descripcion}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
