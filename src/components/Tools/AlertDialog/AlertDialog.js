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
import {progressActions} from "../../../actions/progressActions";

export default function AlertDialog(props) {
    const {title, content, open, setOpen, actionDestroy, id} = props;

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
        <div>
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
                    <Button onClick={() => actionDestroy(id)} color="primary">
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
