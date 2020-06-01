import React, {useState, useEffect} from "react";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import {InputAdornment} from "@material-ui/core";
import YoutubeSearchedForIcon from '@material-ui/icons/YoutubeSearchedFor';

import "./InputSearch.scss";

export default function InputSearch(props) {
    const {id, label, api_url, setSearch, onChangeValue, disabled, value = null, setChangeURL} = props;
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setLoading(true);
        }
    }, [open]);

    useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }
        (async () => {
            try {
                const response = await axios.get(api_url,
                    {headers: {'content-type': 'application/json'}})
                    .then((response) => {
                        return response.data;
                    });
                if (active) {
                    if (response.length > 0)
                        setOptions(response);

                    if (response.dataArray)
                        setOptions(response.dataArray.map((data) => data));
                    await setLoading(false);
                }
            } catch (e) {
                setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, [loading, api_url]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
            setLoading(false);
        }
    }, [open]);

    const onChange = (e) => {
        //setLoading(true);
        setSearch(e.target.value);
        setChangeURL(true);
        setLoading(true);
    };

    //Para que esto funcione en la API siempre debe devolver un dato descripcion

    return (
        <Autocomplete
            className="form-autocomplete"
            id={id}
            disabled={disabled}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            getOptionSelected={(option, value) => option.descripcion === value.descripcion}
            getOptionLabel={(option) => option.descripcion}
            options={options}
            loading={loading}
            value={value}
            loadingText="Cargando datos..."
            noOptionsText="No se encontraron datos para la busqueda..."
            onChange={(e, value) => onChangeValue(e, value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <YoutubeSearchedForIcon/>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                    onChange={onChange}
                />
            )}
        />
    );
}
