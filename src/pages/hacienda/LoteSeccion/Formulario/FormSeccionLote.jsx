import React, {useEffect, useState} from "react";
import ComponentFormularioBase from "../../../../components/ComponentFormularioBase";
import Buscador from "../../../../components/Buscador";
import {API_LINK, focuselement} from "../../../../utils/constants";
import ExploreIcon from "@material-ui/icons/Explore";

import FormModalSeccion from "./FormModalSeccion";
import shortid from "shortid";
import moment from "moment";
import 'moment/locale/es';
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../../../actions/progressActions";
import FormDetallesDistribucion from "./FormDetallesDistribucion";
import FormMapa from "./FormMapa";

import qs from "qs";
import SnackbarComponent from "../../../../components/Snackbar/Snackbar";

const FormSeccionLote = () => {
    const history = useHistory();
    const {id, idmodulo} = useParams();
    const [loadLoteEdit, setLoadLoteEdit] = useState({
        load: id !== undefined,
        id
    });

    const [loadDataLote, setLoadDataLote] = useState(false);

    //-----------------------------------------------------------------------
    const Regresar = `/hacienda/lote/${idmodulo}`;
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
    const [recalculate, setRecalculate] = useState(false);
    const [result, setResult] = useState(0);

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
    /*------------------------------------------------------------------------*/
    const [distribuciones, setDistribuciones] = useState([]);
    const [edit, setEdit] = useState(false);

    const [disabledBtn, setDisabledBtn] = useState({
        btnSave: true,
        btnNuevo: false
    });
    const [notificacion, setNotificacion] = useState({
        open: false,
        message: ''
    });

    useEffect(() => {
        if (loadLoteEdit.load) {
            setDisabledBtn({
                btnNuevo: false,
                btnSave: false
            });
            setLote({
                id,
                descripcion: '',
                secciones: []
            });
            setLoadDataLote(true);
        }
    }, [loadLoteEdit, id]);

    useEffect(() => {
        if (progressStatus.update) {
            setProgressStatus({...progressStatus, update: false});
        }
    }, [progressStatus]);

    useEffect(() => {
        if (recalculate) {
            setHas(result);
            const porcentaje = result.toFixed(2) / parseFloat(lote.has).toFixed(2);
            const rango2 = lote.has * 0.25;
            const rango3 = lote.has * 0.75;
            let color;
            if (result.toFixed(2) === parseFloat(lote.has).toFixed(2)) {
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
            setRecalculate(false);
        }
    }, [recalculate, lote, progressStatus, result]);

    useEffect(() => {
        const progessbarStatus = (state) => dispatch(progressActions(state));
        if (loadDataLote && lote) {
            (async () => {
                progessbarStatus(true);
                const url = `${API_LINK}/bansis-app/index.php/lote/${lote.id}`;
                const request = await fetch(url);
                const response = await request.json();
                const {code} = response;
                await progessbarStatus(false);
                if (code === 200) {

                    if (loadLoteEdit.load) {
                        const {lote: {hacienda, latitud, longitud, has}} = response;
                        setDisabledElements({
                            hacienda: true,
                            lotes: true
                        });
                        setCoordenadas({
                            latitud: latitud,
                            longitud: longitud
                        });

                        setZoom(17);
                        setReload(true);
                        setHas(parseFloat(has));

                        setDisabledFormAdd(false);
                        setHacienda(hacienda);
                        setLote(response.lote);
                        setLoadLoteEdit({
                            ...loadLoteEdit,
                            load: false
                        });
                    }

                    const {lote: {id, identificacion, has, secciones}} = response;
                    if (secciones.length > 0) {
                        //Añadir las distribuciones
                        let array_data = [];
                        let sumHas = 0;
                        secciones.map((seccion) => {
                            const {idDistribucion, descripcion, has, fecha_siembra, tipo_variedad, variedad, tipo_suelo, latitud, longitud, estado} = seccion;
                            if (idDistribucion) {
                                const seccion_db = {
                                    idDistribucion,
                                    id: shortid.generate(),
                                    idlote: id,
                                    lote: identificacion,
                                    descripcion: descripcion,
                                    has: (parseFloat(has).toFixed(2)).toString(),
                                    fechaSiembra: moment(fecha_siembra).format('YYYY-MM-DD'),
                                    tipoVariedad: tipo_variedad,
                                    variedad: variedad,
                                    tipoSuelo: tipo_suelo,
                                    latitud,
                                    longitud,
                                    activo: estado === "1"
                                };
                                if (estado === "1") {
                                    sumHas += +has;
                                }
                                array_data.push(seccion_db);
                            }
                            return true;
                        });

                        setResult(+has - +sumHas.toFixed(2));
                        setRecalculate(true);
                        setDistribuciones(array_data);
                        setReload(true);
                    } else {
                        setProgressStatus({...progressStatus, update: true, color: 'bg-success'});
                        document.getElementById('id-lote-cupo').style.width = `100%`;
                        return true;
                    }
                } else {
                    if (loadLoteEdit.load) {
                        setLoadLoteEdit({
                            ...loadLoteEdit,
                            load: false
                        });
                        await history.push("/error");
                    }
                }
            })();
            setLoadDataLote(false);
        }
    }, [loadDataLote, lote, dispatch, progressStatus, loadLoteEdit, history]);

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
            setHas(parseFloat(value.has));


            setLoadDataLote(true);
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
            setDisabledElements({
                ...disabledElements,
                hacienda: false
            });
            clearFormulario();
        }
    };

    const calcularProgreso = (destroy = 0) => {
        let result;
        if (destroy === 0) {
            result = has.toFixed(2) - parseFloat(distribucion.has).toFixed(2);
        } else {
            result = +has.toFixed(2) + +destroy.toFixed(2);
        }
        if (result >= 0) {
            setResult(+result.toFixed(2));
            setRecalculate(true);
            return true;
        } else {
            return false;
        }
    };

    const addDatosDistribucion = () => {
        setDistribucion({...distribucion, id: shortid.generate(), idlote: lote.id, lote: lote.identificacion});
        if (!existeDistribucion(distribucion)) {
            if (parseFloat(distribucion.has) <= has.toFixed(2)) {
                if (!disabledFormAdd && parseFloat(distribucion.has) > 0) {
                    progessbarStatus(true);
                    setShowModal(true);
                }
            } else {
                setDistribucion({
                    ...distribucion,
                    has: (has.toFixed(2)).toString()
                });
                setNotificacion({
                    open: true,
                    message: 'Se excede las hectareas'
                });
            }
        } else {
            setNotificacion({
                open: true,
                message: 'Lote con la misma descripcion ya se encuentra registrado'
            });
        }
    };

    const addDistribucion = () => {
        if (distribucion.descripcion.trim() && parseFloat(distribucion.has) > 0) {
            if (!edit) {
                if (calcularProgreso()) {
                    //Una vez agregadas se ingresan las coordenadas
                    setAddCoordenadas({
                        status: true,
                        id: distribucion.id
                    });

                    setDisabledFormAdd(true);
                    setDistribuciones([
                        ...distribuciones,
                        distribucion
                    ]);

                    setDisabledBtn({...disabledBtn, btnSave: true});

                    document.getElementById('id-descripcion-distribucion').focus();
                } else {
                    setNotificacion({
                        open: true,
                        message: 'Se excede las hectareas.'
                    });
                    setDistribucion({
                        ...distribucion,
                        has: has.toString()
                    });
                    document.getElementById('id-has-distribucion').focus();
                }
            } else {
                setDisabledFormAdd(false);
                if (distribucion.hasOwnProperty('idDistribucion')) {
                    //Buscar si ya tengo las hectareas completas
                    const distribuciones_activas = distribuciones.filter((item) => item.idDistribucion !== distribucion.idDistribucion && item.activo);
                    const has_disponibles = distribuciones_activas.reduce((total, item) => +total + +item.has, 0);
                    if (+(+distribucion.has + +has_disponibles).toFixed(2) > +(+lote.has).toFixed(2)) {
                        //No se puede editar
                        setResult(+(+lote.has - +has_disponibles).toFixed(2));
                        setRecalculate(true);
                        setEdit(false);
                        clearDataDistribucion();
                        setNotificacion({
                            open: true,
                            message: 'No se puede realizar estos cambios.'
                        });
                    } else {
                        if (distribucion.activo) {
                            //Se puede editar
                            setResult(+(+lote.has - +(+distribucion.has + +has_disponibles).toFixed(2)).toFixed(2));
                            setRecalculate(true);
                            setEditDistribucion(distribucion);
                            setDisabledFormAdd(true);
                            setAddCoordenadas({
                                status: true,
                                id: distribucion.id
                            });
                            setNotificacion({
                                open: true,
                                message: 'Cambios registrados correctamente.'
                            });
                            setDisabledBtn({...disabledBtn, btnSave: true});
                        } else {
                            const distribuciones_activas_all = distribuciones.filter((item) => item.activo);
                            const has_disponibles_all = distribuciones_activas_all.reduce((total, item) => +total + +item.has, 0);
                            if (+has_disponibles < +has_disponibles_all) {
                                setHas((+has_disponibles + +distribucion.has) - +lote.has);
                                calcularProgreso(+distribucion.has);
                                setEditDistribucion(distribucion);
                                setNotificacion({
                                    open: true,
                                    message: 'Lote se ha dado de baja.'
                                });
                                setDisabledBtn({...disabledBtn, btnSave: false});
                            } else {
                                setNotificacion({
                                    open: true,
                                    message: 'No se realizo ningun cambio.'
                                });
                            }
                            clearDataDistribucion();
                            setEdit(false);
                        }
                    }
                } else {
                    setAddCoordenadas({
                        status: true,
                        id: distribucion.id
                    });
                    setEditDistribucion(distribucion);
                    setDisabledBtn({...disabledBtn, btnSave: false});
                }
                progessbarStatus(false);
            }
        }
    };

    const existeDistribucion = (distribucion) => {
        const existe = distribuciones.filter(item => item.descripcion.trim() === distribucion.descripcion.trim() && item.activo === true);
        return existe.length > 0;
    };

    const destroyDistribucion = (id, has_destroy, db = false, idDistribucion = '') => {
        const itemFiler = distribuciones.filter((item) => item.id === id);
        if (!itemFiler[0].activo) {
            calcularProgreso(0);
        } else {
            calcularProgreso(parseFloat(has_destroy));
        }

        const nw_distribucion = distribuciones.filter(item => item.id !== id);
        setDistribuciones(nw_distribucion);

        if (db) {
            (async () => {
                try {
                    const url = `${API_LINK}/bansis-app/index.php/lote-seccion/${idDistribucion}`;
                    const configuracion = {
                        method: 'DELETE',
                        headers: {authorization: authentication}
                    };
                    const request = await fetch(url, configuracion);
                    const response = await request.json();
                    console.log(response);
                    const {message} = response;
                    setNotificacion({
                        open: true,
                        message
                    });
                } catch (error) {
                    console.log(error)
                }
            })();
        }

    };

    const editDistribucion = (distribucion) => {
        progessbarStatus(true);
        //distribucion.fechaSiembra = moment(distribucion.fechaSiembra).format('0:yyyy-MM-dd');
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

    const setEditDistribucion = (distribucion_nw) => {
        distribuciones.map(distribucion => {
            if (distribucion.id === distribucion_nw.id) {
                distribucion.tipoVariedad = distribucion_nw.tipoVariedad;
                distribucion.tipoSuelo = distribucion_nw.tipoSuelo;
                distribucion.variedad = distribucion_nw.variedad;
                distribucion.fechaSiembra = distribucion_nw.fechaSiembra;
                distribucion.latitud = distribucion_nw.latitud;
                distribucion.longitud = distribucion_nw.longitud;
                distribucion.activo = distribucion_nw.activo;
                return true;
            }
            return false;
        });
        return true;
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
            id: '',
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
    };

    const clearFormulario = () => {
        setDisabledElements({
            hacienda: false,
            lotes: true
        });
        setHacienda(null);
        setLote(null);
        setDisabledBtn({
            btnSave: true,
            btnNuevo: false
        });
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
        setHas(0);

        setProgressStatus({
            ...progressStatus,
            value: 0,
            update: true,
            color: 'bg-success'
        });

        document.getElementById('id-lote-cupo').style.width = `0%`;

        clearDataDistribucion();

        if (progressbar)
            progessbarStatus(false);

        history.push(`hacienda/lote/${idmodulo}/seccion/formulario`);
    };

    const NuevaSeccion = () => {
        clearFormulario();
    };

    const saveDistribucionLote = async () => {
        if (distribuciones.length && lote && !disabledBtn.btnSave) {
            progessbarStatus(true);
            const data = qs.stringify({
                json: JSON.stringify({
                    lote: {
                        id: lote.id,
                        identificacion: lote.identificacion
                    },
                    distribucion_lote: distribuciones
                })
            });
            const api = `${API_LINK}/bansis-app/index.php/lote-seccion`;
            const config = {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': authentication,
                }
            };
            const request = await fetch(api, config);
            const response = await request.json();

            const {code, message} = response;

            if (code === 200) {
                setLoadDataLote(true);
                clearDataDistribucion();
            }
            await progessbarStatus(false);
            setNotificacion({
                open: true,
                message
            });
        } else {
            setNotificacion({
                open: true,
                message: 'No hay distribuciones por guardar.'
            });
        }
    };


    return (
        <ComponentFormularioBase
            icon='fas fa-location-arrow'
            title={'Formulario Secciones por Lote'}
            nuevo={NuevaSeccion}
            guardar={saveDistribucionLote}
            volver={Regresar}
            disabledElements={disabledBtn}
        >
            <SnackbarComponent
                notificacion={notificacion}
                setNotificacion={setNotificacion}
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
                    setNotificacion={setNotificacion}
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
                            value={hacienda}
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
                            value={lote}
                        />
                    </div>
                </div>
            </div>
            <hr className="mt-0"/>
            <div className="row">
                <div className="col-md-8">
                    <FormMapa
                        addCoordenadas={addCoordenadas}
                        clearDataDistribucion={clearDataDistribucion}
                        distribuciones={distribuciones}
                        distribucion={distribucion}
                        edit={edit}
                        setEdit={setEdit}
                        has={has}
                        lote={lote}
                        progressStatus={progressStatus}
                        setAddCoordenadas={setAddCoordenadas}
                        setDisabledFormAdd={setDisabledFormAdd}
                        setEditDistribucion={setEditDistribucion}
                        coordenadas={coordenadas}
                        setCoordenadas={setCoordenadas}
                        zoom={zoom}
                        setZoom={setZoom}
                        reload={reload}
                        setReload={setReload}
                        disabledBtn={disabledBtn}
                        setDisabledBtn={setDisabledBtn}
                    />
                </div>
                <div className="col-md-4">
                    {lote &&
                    <div className="alert alert-warning">
                        Lote: {lote.identificacion}{distribucion.descripcion}
                    </div>
                    }
                    {/*{error && <small style={{color: "red"}}>{error.message}</small>}*/}
                    <table className="table">
                        <thead>
                        <tr className="text-center">
                            <th>...</th>
                            <th>Descripcion</th>
                            <th>Has.</th>
                            <th>Accion</th>
                        </tr>
                        </thead>
                        <tbody className="table-hover table-bordered table-sm">
                        <tr>
                            <td colSpan={2}>
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
                            </td>
                            <td className="">
                                <input
                                    type="number"
                                    id="id-has-distribucion"
                                    value={distribucion.has}
                                    className="form-control text-center"
                                    autoComplete="off"
                                    onKeyPress={(e) => e.key === 'Enter' ? addDatosDistribucion() : null}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => {
                                        setDistribucion({
                                            ...distribucion,
                                            has: e.target.value
                                        })
                                    }}
                                    placeholder="Has."
                                    disabled={disabledFormAdd}
                                />
                            </td>
                            <td className="justify-content-center align-items-center">
                                <button
                                    className="btn btn-success btn-block"
                                    disabled={disabledFormAdd}
                                    onClick={() => addDatosDistribucion()}
                                >
                                    <i className="fas fa-plus fa-1x"/>
                                </button>
                            </td>
                        </tr>
                        {distribuciones.length > 0 && distribuciones.map((data) =>
                            <FormDetallesDistribucion
                                key={data.id}
                                data={data}
                                addCoordenadas={addCoordenadas}
                                edit={editDistribucion}
                                destroy={destroyDistribucion}
                            />
                        )}
                        </tbody>
                        <tfoot>
                        </tfoot>
                    </table>
                </div>
            </div>
        </ComponentFormularioBase>
    );
};

export default FormSeccionLote;
