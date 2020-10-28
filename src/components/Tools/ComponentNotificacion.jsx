import React from "react";
import {Button, IconButton, Snackbar} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

export default function ComponentNotificacion({notificacion, closeNotificacion}) {

    return (
        <Snackbar
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            open={notificacion.open}
            message={notificacion.message}
            onClose={() => closeNotificacion()}
            action={
                <React.Fragment>
                    <Button color="secondary" size="small"
                            onClick={() => closeNotificacion()}>
                        ALERTA
                    </Button>
                    <IconButton size="small" aria-label="close" color="inherit"
                                onClick={() => closeNotificacion()}>
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                </React.Fragment>
            }
        />
    );
}
