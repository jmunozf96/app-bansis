import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';

import "./ConfirmationDialogRaw.scss"

export default function ConfirmationDialogRaw(props) {
    const {api, title, setValue, open, onClose, cancelDialog} = props;
    const [load, setLoad] = useState(false);
    const [value, setDefaultValue] = useState('');

    const [options, setOptions] = useState([]);
    const [data, setData] = useState([]);
    const [render, setRender] = useState(false);

    useEffect(() => {
        if (open) {
            setLoad(true);
        }
    }, [open, setLoad]);

    useEffect(() => {
        if (!open) {
            setLoad(false);
            setOptions([]);
            setData([]);
            setRender(false);
            setDefaultValue('');
        }
    }, [open, setLoad, setOptions, setData, setRender, setValue]);

    useEffect(() => {
        if (load) {
            (async () => {
                const response = await axios.get(api)
                    .then((response) => {
                        return response.data;
                    });
                if (response) {
                    await setData(response);
                    await setRender(true);
                }
            })();
            setLoad(false);
        }
    }, [load, data, options, api]);

    useEffect(() => {
        const items = [];
        if (render) {
            if (data.length > 0) {
                data.map((item) => items.push(item.descripcion));
                setOptions(items);
            }
            setRender(false);
        }
    }, [data, render]);

    const handleCancel = () => {
        cancelDialog();
    };

    const handleOk = () => {
        onClose();
    };

    const handleChange = (e) => {
        setDefaultValue(e.target.value);
        const newValue = data.filter(item => item.descripcion === e.target.value);
        setValue(newValue);
    };

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={open}
        >
            <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
            <DialogContent dividers>
                {options.length === 0 ?
                    <div style={{textAlign: 'center', margin: '0 auto'}}>
                        <CircularProgress/>
                    </div>
                    :
                    <RadioGroup
                        aria-label="bodega"
                        name="bodega"
                        value={value}
                        onChange={(e) => handleChange(e)}
                        style={{width: "80%", maxHeight: 435}}
                    >
                        {options.map((option, index) => (
                            <FormControlLabel
                                value={option}
                                key={option}
                                control={<Radio/>}
                                label={data[index].descripcion}/>
                        ))}
                    </RadioGroup>
                }
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleOk} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}

