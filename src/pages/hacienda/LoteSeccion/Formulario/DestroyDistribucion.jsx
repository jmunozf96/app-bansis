import React, {useState} from "react";
import InputDialog from "../../../../components/InputDialog";

export default function DestroyDistribucion({id, has, metodo}) {
    //Estados para el dialogo
    const [openDialog, setOpenDialog] = useState(false);
    const dialog = {
        title: 'Eliminar Registro',
        message: 'Desea Eliminar el registro'
    };

    const destroyDetalle = () => {
        metodo(id, has);
        setOpenDialog(false);
    };

    return (
        <>
            <InputDialog
                open={openDialog}
                setOpen={setOpenDialog}
                title={dialog.title}
                message={dialog.message}
                afirmacion={destroyDetalle}
            />
            <button className="btn btn-danger"
                    onClick={() => setOpenDialog(true)}>
                <i className="fas fa-minus fa-1x"/>
            </button>
        </>
    )
}
