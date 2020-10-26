import React, {useEffect, useState} from "react";
import ComponentFormularioBase from "../../../../components/ComponentFormularioBase";
import {API_LINK, focuselement} from "../../../../constants/helpers";
import Buscador from "../../../../components/Buscador";

import InputSearch from "../../../../components/InputSearch/InputSearch";
import {FormHelperText, TextField} from "@material-ui/core";

import shortid from "shortid";
import moment from "moment";
import 'moment/locale/es';
import qs from "qs";

import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../../../actions/progressActions";
import SnackbarComponent from "../../../../components/Snackbar/Snackbar";
import InputDialog from "../../../../components/InputDialog";

export default function FormSeccionLabor() {
    const history = useHistory();
    const {id, idmodulo} = useParams();
    const [loadSeccionEdit, setLoadSeccionEdit] = useState({
        load: id !== undefined,
        id
    });
    const [editForm, setEditForm] = useState(false);
    //-----------------------------------------------------------------------
    const Regresar = `/hacienda/lote/seccion/labor/${idmodulo}`;
    const [disabledElements, setDisabledElements] = useState({
        hacienda: false,
        loteSeccion: true,
        labor: true,
        empleado: true,
        hasDistribucion: true
    });
    const [disabledBtn, setDisabledBtn] = useState({
        btnSave: true,
        btnNuevo: false
    });

    //Configuracion para buscador
    const api_buscador = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const [hacienda, setHacienda] = useState(null);
    const [apiLoteSeccion, setApiLoteSeccion] = useState('');
    const [loteSeccion, setLoteSeccion] = useState(null);
    const [apiLabor, setApiLabor] = useState('');
    const [labor, setLabor] = useState(null);
    const [searchEmpleado, setSearchEmpleado] = useState('');
    const [apiEmpleado, setApiEmpleado] = useState(`${API_LINK}/bansis-app/index.php/search/empleados`);
    const [empleado, setEmpleado] = useState(null);
    const [changeURL, setChangeURL] = useState(false);

    const [searchHasDisponibles, setSearchHasDisponibles] = useState(false);
    const [hasDistribuidas, setHasDistribuidas] = useState(0);
    const [has, setHas] = useState(0);
    const [hasDistribucion, setHasDistribucion] = useState(0);
    const [hasdisplay, setHasdisplay] = useState(0);

    const [progressStatus, setProgressStatus] = useState({
        update: true,
        color: ''
    });

    const [recalculate, setRecalculate] = useState(false);
    const [result, setResult] = useState(0);

    const [updateData, setUpdateData] = useState(false);
    const [distribucionLabor, setDistribucionLabor] = useState({
        id: '',
        fecha: moment().format("DD/MM/YYYY"),
        loteSeccion: null,
        hasDistribucion: 0
    });
    const [cabeceraDistribucion, setCabeceraDistribucion] = useState({
        hacienda: null,
        labor: null,
        empleado: null,
        hasTotal: 0
    });
    const [detalleDistribucion, setDetalleDistribucion] = useState([]);
    const [apiSearchDetalles, setApiSearchDetalles] = useState('');
    const [searchDetallesDistribucion, setSearchDetallesDistribucion] = useState(false);

    const [notificacion, setNotificacion] = useState({
        open: false,
        message: ''
    });

    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));

    const authentication = useSelector((state) => state.login.token);
    //const progressbar = useSelector((state) => state.progressbar.loading);

    useEffect(() => {
        if (loadSeccionEdit.load) {
            (async () => {
                try {
                    const url = `${API_LINK}/bansis-app/index.php/lote-seccion-labor/${id}`;
                    const request = await fetch(url);
                    const response = await request.json();

                    const {code} = response;
                    if (code === 200) {
                        const {laborSeccion: {labor, empleado}} = response;
                        setLabor(labor);
                        setEmpleado(empleado);
                        setHacienda(empleado['hacienda']);
                        setUpdateData(true);
                        setApiSearchDetalles(`${API_LINK}/bansis-app/index.php/get-data/lote-seccion-labor?labor=${labor.id}&empleado=${empleado.id}`);
                        setApiLoteSeccion(`${API_LINK}/bansis-app/index.php/lotes-seccion-select?hacienda=${empleado.hacienda.id}`);
                        setSearchDetallesDistribucion(true);

                        setDisabledElements({
                            ...disabledElements,
                            hacienda: true,
                            loteSeccion: false,
                        });

                        setDisabledBtn({
                            ...disabledBtn,
                            btnSave: false
                        });

                        setEditForm(true);
                    }
                } catch (e) {
                    console.log(e);
                }
            })();

            setLoadSeccionEdit({
                ...loadSeccionEdit,
                load: false
            })
        }
    }, [loadSeccionEdit, id, disabledBtn, disabledElements]);

    useEffect(() => {
        if (progressStatus.update) {
            setProgressStatus({...progressStatus, update: false});
        }
    }, [progressStatus]);

    useEffect(() => {
        if (recalculate) {
            setHasdisplay(result);
            const porcentaje = (result).toFixed(2) / parseFloat(loteSeccion.has).toFixed(2);
            let color = colorProgressCalculate(result, loteSeccion.has);
            document.getElementById('id-lote-cupo').style.width = `${porcentaje * 100}%`;
            setProgressStatus({...progressStatus, update: true, color});
            setRecalculate(false);
        }
    }, [recalculate, loteSeccion, progressStatus, result]);

    useEffect(() => {
        if (changeURL) {
            setApiEmpleado(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}&hacienda=${hacienda.id}`);
            setChangeURL(false);
        }
    }, [changeURL, searchEmpleado, hacienda, labor]);

    useEffect(() => {
        if (searchHasDisponibles && loteSeccion) {
            (async () => {
                try {
                    const url = `${API_LINK}/bansis-app/index.php/get-data/has-seccion?seccion=${loteSeccion.id}&empleado=${empleado.id}&labor=${labor.id}`;
                    const config = {
                        method: 'GET',
                        headers: {'Authorization': authentication}
                    };
                    const request = await fetch(url, config);
                    const response = await request.json();
                    const {hasDistribuidas} = response;
                    let has = 0;
                    if (detalleDistribucion.length > 0) {
                        const filterArray = detalleDistribucion.filter((item) => item.loteSeccion.id === loteSeccion.id && ((!item.hasOwnProperty('estado')) || (item.hasOwnProperty('estado') && item.estado)));
                        has = filterArray.reduce((total, item) => +total + +item.hasDistribucion, 0);
                    }
                    setHasDistribuidas(+hasDistribuidas);
                    setResult(+loteSeccion.has - has - +(hasDistribuidas).toFixed(2));
                    setHas(+loteSeccion.has - has - +(hasDistribuidas).toFixed(2));
                    setRecalculate(true);
                } catch (e) {
                    console.log(e)
                }
            })();
            setSearchHasDisponibles(false);
        }
    }, [searchHasDisponibles, authentication, loteSeccion, empleado, detalleDistribucion, labor]);

    useEffect(() => {
        if (searchDetallesDistribucion) {
            (async () => {
                const progessbarStatus = (state) => dispatch(progressActions(state));
                await progessbarStatus(true);
                const url = apiSearchDetalles;
                const config = {
                    method: 'GET',
                    headers: {'Authorization': authentication}
                };
                const request = await fetch(url, config);
                const response = await request.json();
                await progessbarStatus(false);
                const {secciones} = response;
                if (secciones && Object.entries(secciones).length > 0) {
                    const {secciones: {detalle_seccion_labor}} = response;

                    if (detalle_seccion_labor.length > 0) {
                        const detallesDB = [];
                        detalle_seccion_labor.map((detalle) => {
                            const distribucion = {
                                id: shortid.generate(),
                                idDB: detalle['id'],
                                idcabecera: detalle['idcabecera'],
                                fecha: moment(detalle['fecha']).format("DD/MM/YYYY"),
                                loteSeccion: detalle['seccion_lote'],
                                hasDistribucion: +(detalle['has']),
                                estado: detalle['estado'] === "1"
                            };
                            detallesDB.push(distribucion);
                            setDisabledBtn({
                                ...disabledBtn,
                                btnSave: false
                            });
                            return true;
                        });
                        setDetalleDistribucion(detallesDB);
                    } else {
                        setNotificacion({
                            open: true,
                            message: 'No se han encontrado distribuciones'
                        })
                    }
                }
            })();
            setSearchDetallesDistribucion(false);
        }
    }, [dispatch, searchDetallesDistribucion, authentication, cabeceraDistribucion, apiSearchDetalles, disabledBtn]);

    useEffect(() => {
        if (updateData) {
            setCabeceraDistribucion({
                ...cabeceraDistribucion,
                hacienda,
                labor,
                empleado
            });

            setDistribucionLabor({
                ...distribucionLabor,
                id: shortid.generate(),
                loteSeccion,
                hasDistribucion,
                estado: true
            });

            setUpdateData(false);
        }
    }, [updateData, distribucionLabor, hacienda, labor, empleado, cabeceraDistribucion, loteSeccion, hasDistribucion]);

    const changeHacienda = (e, value) => {
        setHacienda(value);
        if (value) {
            setDisabledElements({
                ...disabledElements,
                empleado: false
            });
            setApiEmpleado(`${API_LINK}/bansis-app/index.php/search/empleados?hacienda=${value.id}`);
            setApiLoteSeccion(`${API_LINK}/bansis-app/index.php/lotes-seccion-select?hacienda=${value.id}`)
        } else {
            setDisabledElements({
                ...disabledElements,
                empleado: true,
                labor: true,
                loteSeccion: true
            });
            setEmpleado(null);
            setLabor(null);
            setLoteSeccion(null);
            clearTransaccion();
        }
        setUpdateData(true);
    };

    const changeEmpleado = (e, value) => {
        setEmpleado(value);
        if (value) {
            setDisabledElements({
                ...disabledElements,
                labor: false
            });
            setApiLabor(`${API_LINK}/bansis-app/index.php/labores-select`);

            if (labor) {
                setApiSearchDetalles(`${API_LINK}/bansis-app/index.php/get-data/lote-seccion-labor?labor=${labor.id}&empleado=${value.id}`);
                setSearchDetallesDistribucion(true);
            }

        } else {
            setDisabledElements({
                ...disabledElements,
                labor: true,
                loteSeccion: true,
                hasDistribucion: true
            });
            setLabor(null);
            setLoteSeccion(null);
            clearHasDistribucion();
            clearTransaccion();

            setApiEmpleado(`${API_LINK}/bansis-app/index.php/search/empleados?hacienda=${hacienda.id}`);
        }
        setUpdateData(true);
    };

    const changeLabor = (e, value) => {
        setLabor(value);
        if (value) {
            setDisabledElements({
                ...disabledElements,
                loteSeccion: false
            });
            setApiSearchDetalles(`${API_LINK}/bansis-app/index.php/get-data/lote-seccion-labor?labor=${value.id}&empleado=${empleado.id}`);
            setSearchDetallesDistribucion(true);
        } else {
            setDisabledElements({
                ...disabledElements,
                loteSeccion: true,
                hasDistribucion: true,
            });
            setLoteSeccion(null);
            clearHasDistribucion();
            clearTransaccion();
        }
        setUpdateData(true);
    };

    const changeLoteSeccion = (e, value) => {
        setLoteSeccion(value);
        if (value) {
            focuselement('id-cantidad-distribucion');
            setDisabledElements({
                ...disabledElements,
                hasDistribucion: false
            });
            setSearchHasDisponibles(true);
        } else {
            setDisabledElements({
                ...disabledElements,
                hasDistribucion: true
            });
            clearHasDistribucion();
        }
        setUpdateData(true);
    };

    const changeHas = (e) => {
        if (e.target.value !== undefined) {
            const has_distribuir = parseFloat(e.target.value);
            if (has_distribuir > 0) {
                if (+(has_distribuir).toFixed(2) <= (has).toFixed(2)) {
                    setHasDistribucion(has_distribuir);
                    setResult(has - has_distribuir);
                } else {
                    setHasDistribucion(0);
                    setResult(+has.toFixed(2));
                    loadNotificacion("Se excede las hectareas");
                }
            } else {
                setHasDistribucion(0);
                setResult(+has.toFixed(2));
            }
            setRecalculate(true);
        }
        setUpdateData(true);
    };

    const loadNotificacion = (message) => {
        setNotificacion({
            open: true,
            message
        })
    };

    const recalculatehasLote = (idlote) => {
        let has = 0;
        if (detalleDistribucion.length > 0) {
            const filterArray = detalleDistribucion.filter((item) => item.loteSeccion.id === idlote && ((!item.hasOwnProperty('estado')) || (item.hasOwnProperty('estado') && item.estado)));
            has = filterArray.reduce((total, item) => +total + +item.hasDistribucion, 0);
        }
        return has;
    };

    const colorProgressCalculate = (value, has) => {
        let color;

        const rango2 = parseFloat(has) * 0.25;
        const rango3 = parseFloat(has) * 0.50;
        const rango4 = parseFloat(has) * 0.75;

        if ((value).toFixed(2) === parseFloat(has).toFixed(2)) {
            color = 'bg-success';
        } else if (value > rango4 && value < parseFloat(has).toFixed(2)) {
            color = 'bg-primary';
        } else if (value > rango3 && value < rango4) {
            color = 'bg-info';
        } else if (value > rango2 && value < rango3) {
            color = 'bg-warning';
        } else {
            color = 'bg-danger';
        }

        return color;
    };

    const calculateHasTotalDistribuidas = () => {
        let total = 0;
        if (detalleDistribucion.length > 0) {
            const arrayFilter = detalleDistribucion.filter((item) => (!item.hasOwnProperty('estado')) || (item.hasOwnProperty('estado') && item.estado));
            total = arrayFilter.reduce((total, item) => +total + +item.hasDistribucion, 0);
        }
        return (total).toFixed(2);
    };

    const clearHasDistribucion = () => {
        setHasDistribucion(0);
        document.getElementById('id-cantidad-distribucion').value = 0;
        setResult(0);
        setHas(0);
        setHasdisplay(0);
        document.getElementById('id-lote-cupo').style.width = `0%`;
    };

    const addSeccionLabor = () => {
        if (cabeceraDistribucion.hacienda && cabeceraDistribucion.labor && cabeceraDistribucion.empleado && +distribucionLabor.hasDistribucion > 0) {
            if (!existeDistribucionLaborHas(distribucionLabor.loteSeccion.id, cabeceraDistribucion.labor.id)) {
                setDetalleDistribucion([
                    ...detalleDistribucion,
                    distribucionLabor
                ]);
                loadNotificacion("Datos agregados correctamente");

                setHas(has - +distribucionLabor.hasDistribucion);
                setHasdisplay(has - +distribucionLabor.hasDistribucion);
                setResult(0);
            } else {
                //Edicion
                editDistribucionLabor(distribucionLabor);
                loadNotificacion("Datos editados correctamente")
            }
            setDisabledBtn({
                ...disabledBtn,
                btnSave: false
            });
            clearDistribucionLabor();
            setHasDistribucion(0);
            document.getElementById('id-cantidad-distribucion').value = 0;
            focuselement('id-cantidad-distribucion');
        }
    };

    const existeDistribucionLaborHas = (idlote) => {
        const arrayFilter = detalleDistribucion.filter((item) => item.loteSeccion.id === idlote && ((!item.hasOwnProperty('estado')) || (item.hasOwnProperty('estado') && item.estado)));
        return arrayFilter.length > 0;
    };

    const editDistribucionLabor = (distribucionLabor, directa = false) => {
        if (detalleDistribucion.length > 0) {
            if (+distribucionLabor.hasDistribucion > 0) {
                const {loteSeccion: {id}, hasDistribucion} = distribucionLabor;
                if (!directa) {
                    detalleDistribucion.map((item) => (item.loteSeccion.id === id && (!item.hasOwnProperty('estado') || (item.hasOwnProperty('estado') && item.estado)) ? item.hasDistribucion += +hasDistribucion : false));
                } else {
                    detalleDistribucion.map((item) => (item.loteSeccion.id === id && (!item.hasOwnProperty('estado') || (item.hasOwnProperty('estado') && item.estado)) ? item.hasDistribucion = +hasDistribucion : false));
                }

                if (loteSeccion && (loteSeccion.id === id)) {
                    setResult(+loteSeccion.has - +hasDistribuidas - recalculatehasLote(id));
                    setHas(+loteSeccion.has - +hasDistribuidas - recalculatehasLote(id));
                    setRecalculate(true);
                }

                return true;
            }
        }
        return false;
    };

    const deleteDistribucionLabor = (distribucion) => {
        if (distribucion.hasOwnProperty('idDB')) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/lote-seccion-labor-detalle/${distribucion.idDB}`;
                const config = {
                    method: 'DELETE',
                    headers: {'Authorization': authentication}
                };
                const request = await fetch(url, config);
                const response = await request.json();
                const {code, message, destroy} = response;
                if (code === 200) {
                    if (destroy) {
                        await deleteDetalle(distribucion);
                    }
                    await setSearchHasDisponibles(true);
                    await setSearchDetallesDistribucion(true);
                }
                loadNotificacion(message);
            })();
        } else {
            deleteDetalle(distribucion);
        }
    };

    const deleteDetalle = (distribucion) => {
        if (!distribucion.hasOwnProperty('estado') || (distribucion.hasOwnProperty('estado') && distribucion.estado)) {
            const arrayFilter = detalleDistribucion.filter((item) => item.id !== distribucion.id);
            setDetalleDistribucion(arrayFilter);
        }

        if (loteSeccion && (loteSeccion.id === distribucion.loteSeccion.id)) {
            setResult(+distribucion.loteSeccion.has - +hasDistribuidas);
            setHas(+distribucion.loteSeccion.has - +hasDistribuidas);
            setRecalculate(true);
        }
    };

    const clearDistribucionLabor = () => {
        setDistribucionLabor({
            id: '',
            fecha: moment().format("DD/MM/YYYY"),
            loteSeccion: null,
            hasDistribucion: 0
        })
    };

    const clearCabecera = () => {
        setHacienda(null);
        setLoteSeccion(null);
        setLabor(null);
        setEmpleado(null);
    };

    const clearTransaccion = () => {
        setDetalleDistribucion([]);
    };

    const nuevaSeccionLabor = () => {
        if (editForm) {
            history.push(`${history.location.pathname}/formulario`)
        }
        setDisabledElements({
            hacienda: false,
            loteSeccion: true,
            labor: true,
            empleado: true,
            hasDistribucion: true
        });
        setDisabledBtn({
            btnSave: true,
            btnNuevo: false
        });
        clearCabecera();
        clearTransaccion();
        clearDistribucionLabor();
        clearHasDistribucion();
        setUpdateData(true);
    };

    const saveSeccionLabor = () => {
        if (detalleDistribucion.length > 0) {
            if (cabeceraDistribucion.empleado && cabeceraDistribucion.labor && cabeceraDistribucion.hacienda && !disabledBtn.btnSave) {
                (async () => {
                    setDisabledBtn({
                        ...disabledBtn,
                        btnSave: true
                    });
                    progessbarStatus(true);
                    const url = `${API_LINK}/bansis-app/index.php/lote-seccion-labor`;
                    const data = qs.stringify({
                        json: JSON.stringify({
                            fecha: moment().format("DD/MM/YYYY"),
                            cabeceraDistribucion: {
                                hacienda: cabeceraDistribucion.hacienda,
                                labor: {id: cabeceraDistribucion.labor.id},
                                empleado: {id: cabeceraDistribucion.empleado.id},
                                hasTotal: calculateHasTotalDistribuidas()
                            },
                            detalleDistribucion
                        })
                    });
                    const configuracion = {
                        method: 'POST',
                        body: data,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': authentication,
                        }
                    };
                    const request = await fetch(url, configuracion);
                    const response = await request.json();
                    const {code, message} = response;

                    if (code === 200) {
                        setSearchDetallesDistribucion(true);
                    }
                    loadNotificacion(message);
                    await setDisabledBtn({
                        ...disabledBtn,
                        btnSave: false
                    });
                    await progessbarStatus(false);
                })();
            }
        } else {
            loadNotificacion('No se han registrado distribuciones');
        }
    };

    return (
        <ComponentFormularioBase
            icon='fas fa-location-arrow'
            title={'Formulario Secciones por Formulario'}
            nuevo={nuevaSeccionLabor}
            guardar={saveSeccionLabor}
            volver={Regresar}
            disabledElements={disabledBtn}
        >
            <SnackbarComponent
                notificacion={notificacion}
                setNotificacion={setNotificacion}
            />
            <div className="row">
                <div className="col-md-5">
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
                    <InputSearch
                        id="asynchronous-empleado"
                        label="Listado de empleados"
                        api_url={apiEmpleado}
                        setSearch={setSearchEmpleado}
                        onChangeValue={changeEmpleado}
                        disabled={disabledElements.empleado}
                        value={empleado}
                        setChangeURL={setChangeURL}
                    />
                    <FormHelperText id="outlined-weight-helper-text">
                        Puede filtrar los empleados por nombre o numero de cedula
                    </FormHelperText>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <Buscador
                            api={apiLabor}
                            change={changeLabor}
                            disabled={disabledElements.labor}
                            id="id-labor-search"
                            label="Seleccione una Labor"
                            setData={setLabor}
                            variant="outlined"
                            value={labor}
                        />
                    </div>
                </div>
            </div>
            <hr className="mt-0 mb-3"/>
            <div className="row">
                <div className="col-5">
                    <ul className="list-group">
                        <li className="list-group-item">
                                <span className="lead">
                                    Hectareas disponibles: {(hasdisplay).toFixed(2)}
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
                <div className="col-md-7">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-9">
                                    <div className="form-group">
                                        <Buscador
                                            api={apiLoteSeccion}
                                            change={changeLoteSeccion}
                                            disabled={disabledElements.loteSeccion}
                                            id="id-seccion-search"
                                            label="Seleccione una Seccion"
                                            setData={setLoteSeccion}
                                            variant="outlined"
                                            value={loteSeccion}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <TextField
                                        label="Hectareas"
                                        id="id-cantidad-distribucion"
                                        defaultValue={hasDistribucion}
                                        variant="outlined"
                                        type="number"
                                        disabled={disabledElements.hasDistribucion}
                                        onKeyUp={(e) => e.keyCode === 13 && addSeccionLabor()}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => changeHas(e)}
                                    />
                                    <FormHelperText id="outlined-weight-helper-text" style={{color: "red"}}>
                                        Has. a distribuir *
                                    </FormHelperText>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-md-12">
                            <button
                                className="btn btn-primary btn-block btn-lg"
                                onClick={() => addSeccionLabor()}
                            >
                                <i className="fas fa-plus-circle fa-1x"/> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col-md-12 table-responsive">
                    <TablaSeccionLaborCabecera>
                        <TableSeccionLaborDetalle
                            data={detalleDistribucion}
                            eventProgress={colorProgressCalculate}
                            eventEdit={editDistribucionLabor}
                            eventDelete={deleteDistribucionLabor}
                            loadNotificacion={loadNotificacion}
                        />
                    </TablaSeccionLaborCabecera>
                </div>
            </div>
            {empleado &&
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <blockquote className="blockquote mb-0">
                                <p><i
                                    className="fas fa-user-tag"/> {empleado.nombres} {labor && ` - Labor: ${labor.descripcion}`}
                                </p>
                                <footer className="blockquote-footer">
                                    Total Hectareas distribuidas:
                                    <cite title="Source Title">
                                        {" "}{calculateHasTotalDistribuidas()}
                                    </cite>
                                </footer>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
            }
        </ComponentFormularioBase>
    );
}

function TablaSeccionLaborCabecera(props) {
    const {children} = props;
    return (
        <table className="table table-hover table-bordered">
            <thead className="text-center">
            <tr>
                <th width="5%">#</th>
                <th width="20%">Seccion|Area</th>
                <th width="15%">Has.Seccion</th>
                <th width="15%">Has.Distrib.</th>
                <th width="25%">%</th>
                <th width="20%">Accion</th>
            </tr>
            </thead>
            <tbody>
            {children}
            </tbody>
        </table>
    )
}

function TableSeccionLaborDetalle(props) {
    const {data, eventProgress, eventEdit, eventDelete, loadNotificacion} = props;
    const [edit, setEdit] = useState(false);
    const [hasRespaldoEdit, setHasRespaldoEdit] = useState(0);
    const [distribucion, setDistribucion] = useState(null);
    const [updateData, setUpdateData] = useState(false);
    const [has, setHas] = useState(0);
    const authentication = useSelector((state) => state.auth._token);

    const [datosConsulta, setDatosConsulta] = useState(null);
    const [searchDatos, setSearchDatos] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialog, setDialog] = useState({
        title: 'Eliminar Registro',
        message: 'Desea Eliminar el registro'
    });

    useEffect(() => {
        if (searchDatos) {
            (async () => {
                let url = '';
                if (distribucion.hasOwnProperty('idcabecera')) {
                    url = `${API_LINK}/bansis-app/index.php/get-data/has-seccion?seccion=${distribucion.loteSeccion.id}&cabecera=${distribucion.idcabecera}`;
                } else {
                    url = `${API_LINK}/bansis-app/index.php/get-data/has-seccion?seccion=${distribucion.loteSeccion.id}&cabecera=`;
                }
                const config = {
                    method: 'GET',
                    headers: {'Authorization': authentication}
                };
                const request = await fetch(url, config);
                const saldoHas = await request.json();
                setDatosConsulta(saldoHas);
            })();
            setSearchDatos(false);
        }
    }, [searchDatos, distribucion, authentication]);

    useEffect(() => {
        if (updateData) {
            setDistribucion({
                ...distribucion,
                hasDistribucion: +has
            });
            setUpdateData(false);
        }
    }, [updateData, has, distribucion]);

    const onChangeHas = (e) => {
        setHas(+e.target.value);
        setUpdateData(true);
    };

    const activeEdit = (distribucion) => {
        setEdit(true);
        setSearchDatos(true);
        setDistribucion(distribucion);
        setHasRespaldoEdit(+(distribucion.hasDistribucion).toFixed(2));
        setHas(+distribucion.hasDistribucion);
        focuselement('id-has-edit');
    };

    const saveEdit = () => {
        //consultar saldo
        if (datosConsulta) {
            const {hasDistribuidas} = datosConsulta;
            if ((+distribucion.loteSeccion.has - +hasDistribuidas) >= +has) {
                eventEdit(distribucion, true);
                setEdit(false);
                setDistribucion(null);
                setHasRespaldoEdit(0);
            } else {
                loadNotificacion("No se puede procesar esta cantidad, sobrepasa las hectareas del lote.");
                document.getElementById('id-has-edit').value = +(hasRespaldoEdit).toFixed(2);
                setHas(+hasRespaldoEdit.toFixed(2));
                setUpdateData(true);
                focuselement('id-has-edit');
            }
        }
    };

    const dialogDestroyDistribucion = (item) => {
        setOpenDialog(true);
        setDistribucion(item);
        setDialog({
            ...dialog,
            message: '¿Estas seguro de eliminar esta distribucion?'
        })
    };

    const destroyDistribucion = () => {
        eventDelete(distribucion);
        setOpenDialog(false);
        setDistribucion(null);
    };

    return (
        <>
            <InputDialog
                open={openDialog}
                setOpen={setOpenDialog}
                title={dialog.title}
                message={dialog.message}
                afirmacion={destroyDistribucion}
            />
            {data.length > 0 &&
            data.map((item, index) => (
                <tr className="text-center table-sm" key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.loteSeccion.alias}</td>
                    <td>{(+item.loteSeccion.has).toFixed(2)}</td>
                    <td>
                        {(edit && distribucion) && distribucion.loteSeccion.id === item.loteSeccion.id && (!item.hasOwnProperty('estado') || (item.hasOwnProperty('estado') && item.estado)) ?
                            <input
                                id="id-has-edit"
                                className="text-center form-control"
                                type="number"
                                onFocus={(e) => e.target.select()}
                                defaultValue={has.toFixed(2)}
                                onChange={(e) => onChangeHas(e)}
                                onKeyDown={(e) => e.keyCode === 13 && saveEdit()}
                            />
                            :
                            <b>{(item.hasDistribucion).toFixed(2)}</b>
                        }
                    </td>
                    <td>
                        <div className="progress text-center mt-2 ml-2 mr-2">
                            <div
                                className={`progress-bar progress-bar-striped progress-bar-animated ${eventProgress(+item.hasDistribucion, +item.loteSeccion.has)}`}
                                role="progressbar"
                                style={{width: `${(+item.hasDistribucion / +item.loteSeccion.has) * 100}%`}}
                                aria-valuenow="0"
                                aria-valuemin="0"
                                aria-valuemax="100"/>
                        </div>
                    </td>
                    <td>
                        <div className="btn btn-group p-0 m-0">
                            {(edit && distribucion) && distribucion.loteSeccion.id === item.loteSeccion.id && (!item.hasOwnProperty('estado') || (item.hasOwnProperty('estado') && item.estado)) ?
                                <button
                                    className="btn btn-success"
                                    onClick={() => saveEdit()}
                                >
                                    <i className="fas fa-save"/>
                                </button>
                                :
                                <>
                                    {(!item.hasOwnProperty('estado') || (item.hasOwnProperty('estado') && item.estado)) ?
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => activeEdit(item)}
                                        >
                                            <i className="fas fa-edit"/>
                                        </button>
                                        :
                                        <button
                                            className="btn btn-dark"
                                        >
                                            <i className="fas fa-lock"/>
                                        </button>
                                    }
                                </>
                            }
                            <button
                                className="btn btn-danger"
                                onClick={() => dialogDestroyDistribucion(item)}
                            >
                                <i className="fas fa-trash-alt"/>
                            </button>
                        </div>
                    </td>
                </tr>
            ))
            }
        </>
    )
}
