import React, {useEffect, useState} from "react";
import FormularioBase from "../../../../components/FormularioBase";
import Buscador from "../../../../components/Buscador";
import {API_LINK, focuselement} from "../../../../utils/constants";
import ExploreIcon from "@material-ui/icons/Explore";

import FormModalSeccion from "./FormModalSeccion";
import shortid from "shortid";
import moment from "moment";
import 'moment/locale/es';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../../../actions/progressActions";
import FormDetallesDistribucion from "./FormDetallesDistribucion";
import FormMapa from "./FormMapa";

import qs from "qs";

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
    /*------------------------------------------------------------------------*/
    const [distribuciones, setDistribuciones] = useState([]);
    const [edit, setEdit] = useState(false);

    const [disabledBtn, setDisabledBtn] = useState({
        btnSave: true,
        btnNuevo: false
    });
    const [error, setError] = useState(null);

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
        if (parseFloat(distribucion.has) <= has) {
            if (!disabledFormAdd && parseFloat(distribucion.has) > 0) {
                progessbarStatus(true);
                setShowModal(true);
                setError(null);
            }
        } else {
            setDistribucion({
                ...distribucion,
                has: (has.toFixed(2)).toString()
            });
            setError({message: 'Se excede las hectareas.'})
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

    const NuevaSeccion = () => {
        console.log('nuevo')
    };

    const InputGuardarSeccion = () => {

    };

    const saveDistribucionLote = async () => {
        const data = qs.stringify({json: JSON.stringify(distribuciones)});
        const api = `${API_LINK}/bansis-app/index.php/lote-seccion`;
        console.log(data)
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
        console.log(response)
    };


    return (
        <FormularioBase
            icon='fas fa-location-arrow'
            title={'Formulario Secciones por Lote'}
            nuevo={NuevaSeccion}
            guardar={saveDistribucionLote}
            volver={Regresar}
            disabledElements={disabledBtn}
        >
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
                    <FormMapa
                        addCoordenadas={addCoordenadas}
                        clearDataDistribucion={clearDataDistribucion}
                        distribuciones={distribuciones}
                        distribucion={distribucion}
                        edit={edit}
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
                    />
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
                                {error && <small style={{color: "red"}}>{error.message}</small>}
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
                            <FormDetallesDistribucion
                                key={data.id}
                                data={data}
                                addCoordenadas={addCoordenadas}
                                edit={editDistribucion}
                                destroy={destroyDistribucion}
                            />
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </FormularioBase>
    );
};

export default FormSeccionLote;
