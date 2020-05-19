import React, {useEffect, useState} from "react";
import FormularioBase from "../../../../components/FormularioBase";
import Buscador from "../../../../components/Buscador";
import {API_LINK, focuselement} from "../../../../utils/constants";
import ExploreIcon from "@material-ui/icons/Explore";

import FormModalSeccion from "./FormModalSeccion";
import MapaBase from "../../../../components/MapaBase";

import shortid from "shortid";
import moment from "moment";
import 'moment/locale/es';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../../../actions/progressActions";
import {addBodegaFormAction, clearBodegaFormAction} from "../../../../actions/bodega/bodegaActions";
import {editFormAction} from "../../../../actions/statusFormAction";
import InputDialog from "../../../../components/InputDialog";

const FormSeccionLote = () => {
    const Regresar = '/hacienda/lote';
    const [disabledElements, setDisabledElements] = useState({
        hacienda: false,
        lotes: true
    });
    //Configuracion para buscador
    const api_buscador = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const [hacienda, setHacienda] = useState(null);
    const [apiLote, setApiLote] = useState('');
    const [lote, setLote] = useState(null);

    const [has, setHas] = useState(0);
    const [progressStatus, setProgressStatus] = useState({
        update: true,
        value: 0,
        color: ''
    });

    const history = useHistory();
    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));

    const authentication = useSelector((state) => state.auth._token);
    const progressbar = useSelector((state) => state.progressbar.loading);

    const [distribucion, setDistribucion] = useState({
        idlote: '',
        lote: '',
        descripcion: '',
        has: '',
        fechaSiembra: moment().format('YYYY-MM-DD'),
        tipoVariedad: '',
        variedad: '',
        tipoSuelo: '',
        latitud: 0,
        longitud: 0,
        activo: true
    });

    const [disabledFormAdd, setDisabledFormAdd] = useState(true);
    /*Muestra el modal para agregar los datos de la distribucion y a su vez guardar en array de distribuciones*/
    const [showModal, setShowModal] = useState(false);

    /*Estados para las coordenadas*/
    const [addCoordenadas, setAddCoordenadas] = useState({
        status: false,
        id: ''
    });

    const latitud_base = -2.2590146590619145;
    const longitud_base = -79.49522495269775;

    const [coordenadas, setCoordenadas] = useState({
        latitud: latitud_base,
        longitud: longitud_base
    });
    const [zoom, setZoom] = useState(16);
    const [reload, setReload] = useState(false);

    const [distribuciones, setDistribuciones] = useState([]);
    const [edit, setEdit] = useState(false);

    //Estados para el dialogo
    const [openDialog, setOpenDialog] = useState(false);
    const [dialog, setDialog] = useState({
        title: '',
        message: ''
    });

    const [disabledBtn, setDisabledBtn] = useState({
        btnSave: true,
        btnNuevo: false
    });

    useEffect(() => {
        if (progressStatus.update) {
            setProgressStatus({...progressStatus, update: false});
        }
    }, [progressStatus]);

    const changeHacienda = (e, value) => {
        setHacienda(value);
        if (value) {
            setDisabledElements({
                ...disabledElements,
                lotes: false
            });
            setApiLote(`${API_LINK}/bansis-app/index.php/lotes-select?hacienda=${value.id}`)
        } else {
            setDisabledElements({
                ...disabledElements,
                lotes: true
            })
        }
    };

    const changeLote = (e, value) => {
        setLote(value);
        if (value) {
            setCoordenadas({
                latitud: value.latitud,
                longitud: value.longitud
            });
            setZoom(17);
            setReload(true);

            setDistribucion({...distribucion, idlote: value.id, lote: value.identificacion});
            setHas(parseFloat(value.has));

            setProgressStatus({...progressStatus, update: true, color: 'bg-success'});
            document.getElementById('id-lote-cupo').style.width = `100%`;
            setDisabledFormAdd(false);
            focuselement('id-descripcion-distribucion');

            setDisabledBtn({
                ...disabledBtn,
                btnSave: false
            });

            setDisabledElements({
                ...disabledElements,
                hacienda: true
            });
        } else {
            setCoordenadas({
                latitud: latitud_base,
                longitud: longitud_base
            });
            setZoom(16);
            setReload(true);

            setHas(0);
            setProgressStatus({...progressStatus, value: 0, update: true});
            setDisabledFormAdd(true);
            setDisabledElements({
                ...disabledElements,
                hacienda: false
            });

            if (progressbar)
                progessbarStatus(false);

            clearFormulario();
        }
    };

    const calcularProgreso = (destroy = 0) => {
        let result;
        if (destroy === 0) {
            result = has - parseFloat(distribucion.has).toFixed(2);
        } else {
            result = has + destroy;
        }
        if (result >= 0) {
            const porcentaje = parseFloat(result).toFixed(2) / parseFloat(lote.has).toFixed(2);
            setHas(result);

            const rango2 = lote.has * 0.25;
            const rango3 = lote.has * 0.75;
            let color;
            if (parseFloat(result).toFixed(2) === parseFloat(lote.has).toFixed(2)) {
                color = 'bg-success';
            } else if (result > rango3 && result < parseFloat(lote.has).toFixed(2)) {
                color = 'bg-info';
            } else if (result > rango2 && result < rango3) {
                color = 'bg-warning';
            } else {
                color = 'bg-danger';
            }
            document.getElementById('id-lote-cupo').style.width = `${porcentaje * 100}%`;
            setProgressStatus({...progressStatus, update: true, color});
            return true;
        } else {
            return false;
        }
    };

    const addDatosDistribucion = () => {
        if (parseFloat(distribucion.has) <= parseFloat(lote.has)) {
            if (!disabledFormAdd && parseFloat(distribucion.has) > 0) {
                progessbarStatus(true);
                setShowModal(true);
            }
        } else {
            alert("Se excede de las hectareas");
            setDistribucion({
                ...distribucion,
                has: (parseFloat(lote.has).toFixed(2)).toString()
            });
        }
    };

    const addDistribucion = () => {
        if (distribucion.descripcion.trim() && parseFloat(distribucion.has) > 0) {
            if (!edit) {
                if (calcularProgreso()) {
                    const id = shortid.generate();
                    setAddCoordenadas({
                        status: true,
                        id
                    });

                    setDisabledFormAdd(true);

                    setDistribuciones([
                        ...distribuciones,
                        {id, ...distribucion}
                    ]);

                    document.getElementById('id-descripcion-distribucion').focus();
                } else {
                    alert("Se excede");
                    setDistribucion({
                        ...distribucion,
                        has: has.toString()
                    });
                    document.getElementById('id-has-distribucion').focus();
                }
            } else {
                if (setEditDistribucion(distribucion)) {
                    setAddCoordenadas({
                        status: true,
                        id: distribucion.id
                    });
                }
            }

        }
    };

    const addDistribucionCoordenadas = () => {
        if (coordenadas.latitud !== 0 && coordenadas.longitud !== 0) {
            let object_distribu = {
                ...distribucion,
                id: addCoordenadas.id,
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
                alert("Distribucion agregada con exito");
            }
        }
    };

    const destroyDistribucion = (id, has_destroy) => {
        calcularProgreso(parseFloat(has_destroy));
        const nw_distribucion = distribuciones.filter(item => item.id !== id);
        setDistribuciones(nw_distribucion);
    };

    const editDistribucion = (distribucion) => {
        progessbarStatus(true);
        distribucion.fechaSiembra = moment(distribucion.fechaSiembra).format('YYYY-MM-DD');
        setDistribucion(distribucion);
        setCoordenadas({
            latitud: distribucion.latitud,
            longitud: distribucion.longitud
        });
        setZoom(17);
        setReload(true);

        //Se activa la edicion
        setEdit(true);
        setDisabledFormAdd(true);
        setShowModal(true);
    };

    const cancelarTransaccion = () => {
        clearDataDistribucion();
        setCoordenadas({
            latitud: lote.latitud,
            longitud: lote.longitud
        });
        setZoom(17);
        setReload(true);

        //Se activa la edicion
        if (edit) {
            setEdit(false);
            setDisabledFormAdd(false);
        }
        progessbarStatus(false);
    };

    const clearDataDistribucion = () => {
        setDistribucion({
            ...distribucion,
            descripcion: '',
            has: '',
            fechaSiembra: moment().format('YYYY-MM-DD'),
            tipoVariedad: '',
            variedad: '',
            tipoSuelo: '',
            latitud: 0,
            longitud: 0,
            activo: true
        });
    };

    const clearFormulario = () => {
        clearDataDistribucion();
        setDistribuciones([]);
        setDisabledFormAdd(true);
        setShowModal(false);
        setAddCoordenadas({
            ...addCoordenadas,
            status: false
        });
        setCoordenadas({
            latitud: latitud_base,
            longitud: longitud_base
        });
        setZoom(16);
        setReload(true);
        setEdit(false);
        setDisabledBtn({
            btnSave: true,
            btnNuevo: false
        });
        setProgressStatus({
            ...progressStatus,
            update: true,
            color: 'bg-success'
        });
        document.getElementById('id-lote-cupo').style.width = `100%`;
    };

    const setEditDistribucion = (distribucion_nw) => {
        distribuciones.map(distribucion => {
            if (distribucion.id === distribucion_nw.id) {
                distribucion.tipoVariedad = distribucion_nw.tipoVariedad;
                distribucion.tipoSuelo = distribucion_nw.tipoSuelo;
                distribucion.variedad = distribucion_nw.variedad;
                distribucion.fechaSiembra = distribucion_nw.fechaSiembra;
                distribucion.latitud = distribucion_nw.latitud;
                distribucion.longitud = distribucion_nw.longitud;
                return true;
            }
            return false;
        });
        return true;
    };

    const functionDialog = (title, message, ...funcion) => {
        setOpenDialog(true);
        setDialog({
            title,
            message,
            funcion: funcion
        })
    };

    const NuevaSeccion = () => {
        console.log('nuevo')
    };

    const InputGuardarSeccion = () => {
        setOpenDialog(true);
        setDialog({
            title: 'Guardar Registro',
            message: `Esta seguro de agregar esta distribucion al lote ${lote.identificacion}`
        })
    };


    return (
        <FormularioBase
            icon='fas fa-location-arrow'
            title={'Formulario Secciones por Lote'}
            nuevo={NuevaSeccion}
            guardar={InputGuardarSeccion}
            volver={Regresar}
            disabledElements={disabledBtn}
        >
            <InputDialog
                open={openDialog}
                setOpen={setOpenDialog}
                title={dialog.title}
                message={dialog.message}
            />
            <div className="row">
                {/*Formulario para añadir fecha de siembre, tipo de suelo, variedad, tipo de variedad.*/}
                <FormModalSeccion
                    show={showModal}
                    setShow={setShowModal}
                    data={distribucion}
                    setData={setDistribucion}
                    cancelar={cancelarTransaccion}
                    guardar={addDistribucion}
                />
                {/*-----------------------------------------------------------------------------------*/}
                <div className="col-md-8">
                    <div className="form-group">
                        <Buscador
                            api={api_buscador}
                            change={changeHacienda}
                            disabled={disabledElements.hacienda}
                            id="id-hacienda-search"
                            label="Seleccione una Hacienda"
                            setData={setHacienda}
                            variant="outlined"
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <Buscador
                            api={apiLote}
                            change={changeLote}
                            componentIcon={<ExploreIcon/>}
                            disabled={disabledElements.lotes}
                            icon={true}
                            id="id-lotes-search"
                            label="Seleccione un Lote"
                            setData={setLote}
                            variant="outlined"
                        />
                    </div>
                </div>
            </div>
            <hr className="mt-0"/>
            <div className="row">
                <div className="col-md-8">
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
                                        onClick={() => addDistribucionCoordenadas()}
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
                </div>
                <div className="col-md-4">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Descripcion</th>
                            <th>Has.</th>
                            <th>Accion</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    id="id-descripcion-distribucion"
                                    value={distribucion.descripcion}
                                    onChange={(e) => setDistribucion({
                                        ...distribucion,
                                        descripcion: e.target.value.toUpperCase()
                                    })}
                                    className="form-control text-center"
                                    placeholder="Descripcion"
                                    autoComplete="off"
                                    disabled={disabledFormAdd}
                                />
                                {lote && <small>Descripcion: {lote.identificacion}{distribucion.descripcion}</small>}
                            </td>
                            <td>
                                <input
                                    type="number"
                                    id="id-has-distribucion"
                                    value={distribucion.has}
                                    className="form-control text-center"
                                    onKeyPress={(e) => e.key === 'Enter' ? addDatosDistribucion() : null}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => {
                                        if (e.target.value > 0) {
                                            setDistribucion({
                                                ...distribucion,
                                                has: e.target.value
                                            })
                                        }
                                    }}
                                    placeholder="Has."
                                    disabled={disabledFormAdd}
                                />
                            </td>
                            <td>
                                <button
                                    className="btn btn-success btn-block"
                                    disabled={disabledFormAdd}
                                    onClick={() => addDatosDistribucion()}>
                                    <i className="fas fa-plus fa-1x"/>
                                </button>
                            </td>
                        </tr>
                        {distribuciones.length > 0 && distribuciones.map((data) =>
                            <tr key={data.id} className="">
                                <td className="text-center">{data.lote}{data.descripcion}</td>
                                <td className="text-center">
                                    <small><b>{data.has}</b></small>
                                </td>
                                <td className="text-center">
                                    {!addCoordenadas.status ?
                                        <div className="btn-group">
                                            <button className="btn btn-primary" onClick={() => editDistribucion(data)}>
                                                <i className="fas fa-edit fa-1x"/>
                                            </button>
                                            <button className="btn btn-danger"
                                                    onClick={() => destroyDistribucion(data.id, data.has)}>
                                                <i className="fas fa-minus fa-1x"/>
                                            </button>
                                        </div>
                                        :
                                        <>
                                            <i className="fas fa-location-arrow fa-spin"/>
                                        </>
                                    }
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </FormularioBase>
    );
};

export default FormSeccionLote;
