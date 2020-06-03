import React, {useEffect, useState} from "react";
import SnackbarComponent from "../../../../components/Snackbar/Snackbar";
import Buscador from "../../../../components/Buscador";
import InputSearch from "../../../../components/InputSearch/InputSearch";
import FormularioBase from "../../../../components/FormularioBase";
import {API_LINK} from "../../../../utils/constants";
import {FormHelperText} from "@material-ui/core";
import {progressActions} from "../../../../actions/progressActions";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import FullScreen from "../../../../components/FullScreen/FullScreen";
import FormLaborEnfunde from "./Labor/FormLaborEnfunde";

import shortid from "shortid";
import moment from "moment";
import 'moment/locale/es';
import qs from "qs";

export default function FormAvanceLabor() {
    //-----------------------------------------------------------------------
    const Regresar = '/hacienda/lote/seccion/labor';
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

    const [cabeceraEnfunde, setCabeceraEnfunde] = useState({
        fecha: moment().format("DD/MM/YYYY"),
        hacienda: null,
        labor: null,
        empleado: null,
        codigoSemana: 0,
        semana: 0,
        periodo: 0,
        colorp: '',
        colorf: ''
    });

    /*const [detalleEnfunde, setDetalleEnfunde] = useState({
        empleado: null,
        seccion: [],
    });*/

    const [loadCalendar, setLoadCalendar] = useState(true);

    //Configuracion para buscador
    const api_buscador = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const [hacienda, setHacienda] = useState(null);
    const [searchEmpleado, setSearchEmpleado] = useState('');
    const [apiEmpleado, setApiEmpleado] = useState(`${API_LINK}/bansis-app/index.php/search/empleados`);
    const [empleado, setEmpleado] = useState(null);
    const [apiLabor, setApiLabor] = useState('');
    const [labor, setLabor] = useState(null);
    const [changeURL, setChangeURL] = useState(false);

    const [notificacion, setNotificacion] = useState({
        open: false,
        message: ''
    });

    //Estados de transaccion de enfunde
    const [openFullScreen, setOpenFullScreen] = useState(false);

    //const history = useHistory();
    const dispatch = useDispatch();
    //const progessbarStatus = (state) => dispatch(progressActions(state));

    const authentication = useSelector((state) => state.auth._token);
    //const progressbar = useSelector((state) => state.progressbar.loading);

    const [distribucionSelect, setDistribucionSelect] = useState(null); //Variable para ecpecificar el lote de registro de avance por labor
    const [detalleDistribucion, setDetalleDistribucion] = useState([]);
    const [apiSearchDetalles, setApiSearchDetalles] = useState('');
    const [searchDetallesDistribucion, setSearchDetallesDistribucion] = useState(false);

    useEffect(() => {
        if (loadCalendar) {
            (async () => {
                try {
                    const url = `${API_LINK}/bansis-app/calendario.php/semanaEnfunde?fecha=${cabeceraEnfunde.fecha}`;
                    const request = await fetch(url);
                    const response = await request.json();
                    const {code, calendario} = response;

                    if (code === 200) {
                        setCabeceraEnfunde({
                            ...cabeceraEnfunde,
                            codigoSemana: calendario.presente.codigo,
                            semana: calendario.presente.semana,
                            periodo: calendario.presente.periodo,
                            colorp: calendario.presente.color,
                            colorf: calendario.futuro.color,
                        });
                    }

                } catch (e) {
                    console.log(e);
                }
            })();
            setLoadCalendar(false);
        }
    }, [loadCalendar, cabeceraEnfunde]);

    useEffect(() => {
        if (changeURL) {
            setApiEmpleado(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}&hacienda=${hacienda.id}`);
            setChangeURL(false);
        }
    }, [changeURL, searchEmpleado, hacienda, labor]);

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
                                id: detalle['idDetalle'],
                                loteSeccion: detalle['seccion_lote'],
                                has: +(detalle['has'])
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
    }, [dispatch, searchDetallesDistribucion, authentication, apiSearchDetalles, disabledBtn]);

    const changeHacienda = (e, value) => {
        setHacienda(value);
        if (value) {
            setDisabledElements({
                ...disabledElements,
                labor: false
            });
            setApiLabor(`${API_LINK}/bansis-app/index.php/labores-select`)
        } else {
            setDisabledElements({
                ...disabledElements,
                empleado: true,
                labor: true
            });
            setEmpleado(null);
            setLabor(null);
        }
        setCabeceraEnfunde({
            ...cabeceraEnfunde,
            hacienda: value
        });
    };

    const changeLabor = (e, value) => {
        setLabor(value);
        if (value) {
            setDisabledElements({
                ...disabledElements,
                empleado: false
            });
            setApiEmpleado(`${API_LINK}/bansis-app/index.php/search/empleados?hacienda=${hacienda.id}`);
        } else {
            setDisabledElements({
                ...disabledElements,
                empleado: true,
            });
        }
        setCabeceraEnfunde({
            ...cabeceraEnfunde,
            labor: value
        });
    };

    const changeEmpleado = (e, value) => {
        setEmpleado(value);
        if (value) {
            setDisabledElements({
                ...disabledElements,
                labor: false
            });
            setApiSearchDetalles(`${API_LINK}/bansis-app/index.php/get-data/lote-seccion-labor?labor=${labor.id}&empleado=${value.id}`);
            setSearchDetallesDistribucion(true);
        } else {
            setDisabledElements({
                ...disabledElements,
            });
            setDetalleDistribucion([]);
        }
        setCabeceraEnfunde({
            ...cabeceraEnfunde,
            empleado: value
        });
    };

    const openModal = (distribucion) => {
        setOpenFullScreen(true);
        setDistribucionSelect(distribucion);
    };

    const totalPresente = () => {
        const arrayFilter = detalleDistribucion.filter((item) => item.hasOwnProperty('total_presente'));
        const total = arrayFilter.reduce((total, item) => +total + +item.total_presente, 0);
        return total > 0 ? total : 0
    };

    const totalFuturo = () => {
        const arrayFilter = detalleDistribucion.filter((item) => item.hasOwnProperty('total_futuro'));
        const total = arrayFilter.reduce((total, item) => +total + +item.total_futuro, 0);
        return total > 0 ? total : 0
    };

    const totalDesbunche = () => {
        const arrayFilter = detalleDistribucion.filter((item) => item.hasOwnProperty('total_desbunchados'));
        const total = arrayFilter.reduce((total, item) => +total + +item.total_desbunchados, 0);
        return total > 0 ? total : 0
    };

    const saveDistribucionLabor = (distribucion, presente, futuro) => {
        const arrayFilter = detalleDistribucion.filter((item) => item.id === distribucion.id);
        arrayFilter.map((item) => {
            item.total_presente = presente.total;
            item.presente = presente.detalle;
            return true;
        });

        arrayFilter.map((item) => {
            item.total_futuro = futuro.total;
            item.total_desbunchados = futuro.desbunche;
            item.futuro = futuro.detalle;
            return true;
        });

        setOpenFullScreen(false);
    };

    const nuevoAvanceLabor = () => {

    };

    const saveAvanceLabor = () => {
        console.log(cabeceraEnfunde);
        console.log(detalleDistribucion);
        //Guardar enfunde
        (async () => {
            try {
                const url = `${API_LINK}/bansis-app/index.php/enfunde`;
                const data = qs.stringify({
                    json: JSON.stringify({
                        cabecera: cabeceraEnfunde,
                        detalle: detalleDistribucion
                    })
                });
                const configuracion = {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': authentication
                    }
                };
                const request = await fetch(url, configuracion);
                const response = await request.json();
                console.log(response);
            } catch (e) {
                console.log(e);
            }
        })();
    };

    return (
        <FormularioBase
            icon='fas fa-location-arrow'
            title={'Formulario Secciones por Labor'}
            nuevo={nuevoAvanceLabor}
            guardar={saveAvanceLabor}
            volver={Regresar}
            disabledElements={disabledBtn}
        >
            <SnackbarComponent
                notificacion={notificacion}
                setNotificacion={setNotificacion}
            />
            <div className="row">
                <div className="col-md-2">
                    <label>Fecha</label>
                    <div className="input-group">
                        <input className="form-control bg-white" type="text" disabled={true}
                               value={cabeceraEnfunde.fecha}/>
                    </div>
                </div>
                <div className="col-md-1">
                    <label>Sem.</label>
                    <div className="input-group">
                        <input className="form-control bg-white" type="text" disabled={true}
                               value={cabeceraEnfunde.semana}/>
                    </div>
                </div>
                <div className="col-md-1">
                    <label>Per.</label>
                    <div className="input-group">
                        <input className="form-control bg-white" type="text" disabled={true}
                               value={cabeceraEnfunde.periodo}/>
                    </div>
                </div>
                <div className="col-md-4">
                    <label>Detalle</label>
                    <div className="input-group">
                        <input className="form-control bg-white" type="text" disabled={true}
                               value="ENFUNDE SEMANAL POR EMPLEADO"/>
                    </div>
                </div>
                <div className="offset-md-2 col-md-1 col-6">
                    <label>PRE.</label>
                    <div className="input-group">
                        <input className="form-control" name={`${cabeceraEnfunde.colorp}-CALENDARIO`} type="text"
                               disabled={true}/>
                    </div>
                </div>
                <div className="col-md-1 col-6">
                    <label>FUT.</label>
                    <div className="input-group">
                        <input className="form-control" name={`${cabeceraEnfunde.colorf}-CALENDARIO`} type="text"
                               disabled={true}/>
                    </div>
                </div>
            </div>
            <hr className="mt-3 mb-3"/>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <Buscador
                                    api={api_buscador}
                                    change={changeHacienda}
                                    disabled={disabledElements.hacienda}
                                    id="id-hacienda-search"
                                    label="Hacienda"
                                    setData={setHacienda}
                                    variant="outlined"
                                    value={hacienda}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <Buscador
                                    api={apiLabor}
                                    change={changeLabor}
                                    disabled={disabledElements.labor}
                                    id="id-labor-search"
                                    label="Avance Labor"
                                    setData={setLabor}
                                    variant="outlined"
                                    value={labor}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
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
                    </div>
                </div>
                <div className="col-md-6 table-responsive">
                    <FullScreen
                        open={openFullScreen}
                        setOpen={setOpenFullScreen}
                    >
                        <FormLaborEnfunde
                            cabecera={cabeceraEnfunde}
                            hacienda={hacienda}
                            empleado={empleado}
                            labor={labor}
                            distribucion={distribucionSelect}
                            detalles={detalleDistribucion}
                            save={saveDistribucionLabor}
                        />
                    </FullScreen>
                    <table className="table table-hover table-bordered">
                        <thead>
                        <tr className="text-center">
                            <th>Lote</th>
                            <th>Has</th>
                            <th width="15%">Presente</th>
                            <th width="15%">Futuro</th>
                            <th width="15%">Desbunche</th>
                            <th width="10%">Accion</th>
                        </tr>
                        </thead>
                        <tbody>
                        {detalleDistribucion.length > 0 &&
                        <>
                            {detalleDistribucion.map((item) => (
                                <tr key={item.id} className="text-center table-sm">
                                    <td>{item.loteSeccion.alias}</td>
                                    <td><small><b>{(item.has).toFixed(2)}</b></small></td>
                                    <td>{item.hasOwnProperty('total_presente') ? item.total_presente : '0'}</td>
                                    <td>{item.hasOwnProperty('total_futuro') ? item.total_futuro : '0'}</td>
                                    <td>{item.hasOwnProperty('total_desbunchados') ? item.total_desbunchados : '0'}</td>
                                    <td>
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => openModal(item)}
                                            >
                                                <i className="fas fa-external-link-square-alt"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            <tr className="text-center">
                                <td className="text-left"
                                    colSpan={2}>{`TOTAL ENFUNDE SEMANA ${cabeceraEnfunde.semana}`}</td>
                                <td><b>{totalPresente()}</b></td>
                                <td><b>{totalFuturo()}</b></td>
                                <td><b>{totalDesbunche()}</b></td>
                                <td>{" "}</td>
                            </tr>
                        </>
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </FormularioBase>
    );
}
