import React, {useState} from "react";
import InputDialog from "../../../components/Tools/InputDialog";

export default function DestroyDistribucion({id, has, db = false, idDistribucion = '', metodo, classBtn, classIcon}) {
    //Estados para el dialogo
    const [openDialog, setOpenDialog] = useState(false);
    const dialog = {
        title: 'Eliminar Registro',
        message: 'Desea Eliminar el registro'
    };

    const destroyDetalle = () => {
        metodo(id, has, db, idDistribucion);
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
            <button className={`btn btn-${classBtn}`}
                    onClick={() => setOpenDialog(true)}>
                <i className={classIcon}/>
            </button>
        </>
    )
}
