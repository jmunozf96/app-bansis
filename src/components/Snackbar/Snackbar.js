import React from "react";
import {Button, IconButton, Snackbar} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

export default function SnackbarComponent(props) {
    const {notificacion, setNotificacion} = props;
    return (
        <Snackbar
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            open={notificacion.open}
            message={notificacion.message}
            onClose={() => setNotificacion({...notificacion, open: false})}
            action={
                <React.Fragment>
                    <Button color="secondary" size="small"
                            onClick={() => setNotificacion({...notificacion, open: false})}>
                        ALERTA
                    </Button>
                    <IconButton size="small" aria-label="close" color="inherit"
                                onClick={() => setNotificacion({...notificacion, open: false})}>
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                </React.Fragment>
            }
        />
    );
}