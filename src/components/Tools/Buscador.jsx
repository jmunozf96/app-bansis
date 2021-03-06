import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExploreIcon from '@material-ui/icons/Explore';

export default function Buscador(props) {
    const {api, value, ...moreParams} = props;
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (open) {
            setLoading(true);
        }
    }, [open]);

    React.useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }
        if (loading) {
            (async () => {
                try {
                    const response = await fetch(api);
                    const datos = await response.json();
                    if (active) {
                        //setOptions(Object.keys(datos).map((key) => datos[key].item[0]));
                        if (datos.hasOwnProperty('dataArray')) {
                            if (datos['dataArray'].length > 0) {
                                await setOptions(datos.dataArray);
                            }
                            setLoading(false);
                        }
                    }
                } catch (e) {
                    setLoading(false);
                }
            })();
            return () => {
                active = false;
            };
        }
    }, [loading, api]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <Autocomplete
            multiple={moreParams.multiple}
            id={moreParams.id}
            disabled={moreParams.disabled}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            value={value}
            onFocus={() => setLoading(true)}
            onChange={(e, value) => moreParams.change(e, value)}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.descripcion}
            options={options}
            loading={loading}
            loadingText="Cargando datos..."
            noOptionsText="No se encontraron datos para la busqueda..."
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={moreParams.label}
                    variant={moreParams.variant}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20}/> : moreParams.icon ?
                                    <ExploreIcon/> : null
                                }
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}
