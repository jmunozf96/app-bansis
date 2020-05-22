import React, {useState} from "react";
import MapaBase from "../../../../components/MapaBase";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../../../actions/progressActions";
import InputDialog from "../../../../components/InputDialog";

export default function FormMapa(props) {
    const {
        has, progressStatus,
        lote, distribucion, addCoordenadas,
        setAddCoordenadas, clearDataDistribucion,
        setDisabledFormAdd, setEditDistribucion,
        distribuciones, edit, setEdit,
        coordenadas, setCoordenadas,
        zoom, setZoom,
        reload, setReload,
        setDisabledBtn, disabledBtn
    } = props;

    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));
    const progressbar = useSelector((state) => state.progressbar.loading);

    const [openDialog, setOpenDialog] = useState(false);
    const dialog = {
        title: 'Agregar Registro',
        message: `Desea ${!edit ? "agregar" : "editar"} la distribucion ${distribucion.lote}${distribucion.descripcion} con ${parseFloat(distribucion.has).toFixed(2)} has.`
    };

    const addDistribucionCoordenadas = () => {
        if (coordenadas.latitud !== 0 && coordenadas.longitud !== 0) {
            let object_distribu = {
                ...distribucion,
                latitud: coordenadas.latitud,
                longitud: coordenadas.longitud
            };

            if (setEditDistribucion(object_distribu)) {
                setCoordenadas({
                    latitud: lote.latitud,
                    longitud: lote.longitud
                });
                setZoom(17);
                setReload(true);

                setAddCoordenadas({
                    status: false,
                    id: ''
                });

                if (progressbar) {
                    progessbarStatus(false);
                }

                clearDataDistribucion();
                setDisabledFormAdd(false);
                setOpenDialog(false);
                setEdit(false);
                setDisabledBtn({...disabledBtn, btnSave: false});
            }
        }
    };

    return (
        <>
            <InputDialog
                open={openDialog}
                setOpen={setOpenDialog}
                title={dialog.title}
                message={dialog.message}
                afirmacion={addDistribucionCoordenadas}
            />
            <div className="row">
                <div className="col-12">
                    <ul className="list-group">
                        <li className="list-group-item">
                                <span className="lead">
                                    Hectareas a distribuir: {has.toFixed(2)}
                                </span>
                            <div className="progress mt-2">
                                <div className={`progress-bar ${progressStatus.color}`} role="progressbar"
                                     id="id-lote-cupo"
                                     aria-valuenow="0"
                                     aria-valuemin="0"
                                     aria-valuemax="100"/>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="col-12 p-3">
                    {addCoordenadas.status &&
                    <div className="row">
                        <div className="col-md-8">
                            <div className="alert alert-info" role="alert">
                                <i className="fas fa-cog fa-spin"/> Ubique la distribucion en el mapa...
                            </div>
                        </div>
                        <div className="col-md-4">
                            <button
                                type="button"
                                className="btn btn-primary btn-lg btn-block"
                                onClick={() => setOpenDialog(true)}
                            >
                                <i className="fas fa-location-arrow"/> {!edit ? "Agregar" : "Editar"}
                            </button>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Longitud - Coordenadas (X)</label>
                                <input type="text" className="form-control bg-white"
                                       value={coordenadas.longitud}
                                       disabled/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Latitud - Coordenadas (Y)</label>
                                <input type="text" className="form-control bg-white" value={coordenadas.latitud}
                                       disabled/>
                            </div>
                        </div>
                    </div>
                    }
                    <MapaBase
                        size={450}
                        reload={reload}
                        setReload={setReload}
                        maxZoom={zoom}
                        coordenadas={coordenadas}
                        setCoordenadas={setCoordenadas}
                        addCoordenadas={addCoordenadas.status}
                        datos={distribuciones}
                    />
                </div>
            </div>
        </>
    )
}
