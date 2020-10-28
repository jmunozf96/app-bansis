import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../actions/progressActions";

export default function ConfirmDialog(props) {
    const {title, content, data = null, open, setOpen, actionConfirm} = props;

    const progressStatus = useSelector(state => state.progressbar.loading);
    const dispatch = useDispatch();
    const setProgressStatus = (state) => dispatch(progressActions(state));

    const handleClose = () => {
        setOpen(false);
        if (progressStatus) {
            setProgressStatus(false);
        }
    };

    return (
        <Dialog
            open={open}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="customized-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={() => actionConfirm(data)} color="primary">
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
