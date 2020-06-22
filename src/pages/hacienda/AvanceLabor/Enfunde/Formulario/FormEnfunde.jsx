import React, {useEffect, useState} from "react";
import SnackbarComponent from "../../../../../components/Snackbar/Snackbar";
import Buscador from "../../../../../components/Buscador";
import InputSearch from "../../../../../components/InputSearch/InputSearch";
import FormularioBase from "../../../../../components/FormularioBase";
import {API_LINK, idGrupoMaterialEnfunde} from "../../../../../utils/constants";
import {FormHelperText} from "@material-ui/core";
import {progressActions} from "../../../../../actions/progressActions";
import {useDispatch, useSelector} from "react-redux";
import FullScreen from "../../../../../components/FullScreen/FullScreen";
import FormEnfundeDetalle from "./FormEnfundeDetalle";

import {useHistory, useParams} from "react-router-dom";
import moment from "moment";
import 'moment/locale/es';
import qs from "qs";
import CabeceraSemana from "../../../CabeceraSemana";
import Page404 from "../../../../../components/Error/404 Page/Page404";

export default function FormEnfunde() {
    const {idmodulo} = useParams();
    const history = useHistory();
    //console.log(history.location.state !== null);

    //-----------------------------------------------------------------------

    const Regresar = `/hacienda/avances/labor/enfunde/${idmodulo}/empleado`;
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
        fecha: history.location.state ? history.location.state.calendario.fecha : moment().format("DD/MM/YYYY"),
        hacienda: history.location.state ? history.location.state.hacienda : null,
        labor: {id: 3},
        empleado: history.location.state ? history.location.state.empleado : null,
        codigoSemana: history.location.state ? history.location.state.calendario.codigoSemana : 0,
        semana: history.location.state ? history.location.state.calendario.semana : 0,
        periodo: history.location.state ? history.location.state.calendario.periodo : 0,
        colorp: history.location.state ? history.location.state.calendario.colorp : '',
        colorf: history.location.state ? history.location.state.calendario.colorf : ''
    });

    /*const [detalleEnfunde, setDetalleEnfunde] = useState({
        empleado: null,
        seccion: [],
    });*/
    const [loadCalendar, setLoadCalendar] = useState(!history.location.state);
    //Configuracion para buscador
    const api_buscador = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const [hacienda, setHacienda] = useState(history.location.state ? history.location.state.hacienda : null);
    const [searchEmpleado, setSearchEmpleado] = useState('');
    const [apiEmpleado, setApiEmpleado] = useState(`${API_LINK}/bansis-app/index.php/search/empleados`);
    const [empleado, setEmpleado] = useState(history.location.state ? history.location.state.empleado : null);
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
    const [searchDetallesDistribucion, setSearchDetallesDistribucion] = useState(!!history.location.state);

    const [reloadComponent, setReloadComponent] = useState(false);

    //Eliminar enfundes
    const [itemsToDelete, setItemsToDelete] = useState([]);

    const [changeSemanaBuutton, setChangeSemanaButton] = useState(false);
    const [changeSemana, setChangeSemana] = useState({
        status: false,
        codigoSemana: 0
    });

    useEffect(() => {
        if (!loadCalendar && !changeSemana.status && changeSemanaBuutton) {
            //setDetalleDistribucion([]);
            //La labor de enfunde es 3 en el codigo de la BD queda quemada por el momento, ya que este formulario es solo para esta labor
            setApiSearchDetalles(`${API_LINK}/bansis-app/index.php/get-data/lote-seccion-labor?labor=3&empleado=${empleado.id}&activo=true&calendario=${changeSemana.codigoSemana}`);
            setChangeSemanaButton(false);
            setSearchDetallesDistribucion(true);
        }
    }, [changeSemana, labor, empleado, cabeceraEnfunde, loadCalendar, changeSemanaBuutton]);

    useEffect(() => {
        if (reloadComponent) {
            setReloadComponent(false);
        }
    }, [reloadComponent]);

    useEffect(() => {
        if (changeURL) {
            setApiEmpleado(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}&hacienda=${hacienda.id}`);
            setChangeURL(false);
        }
    }, [changeURL, searchEmpleado, hacienda, labor]);

    useEffect(() => {
        if (searchDetallesDistribucion && !changeSemanaBuutton) {
            (async () => {
                let url = '';
                if (history.location.state) {
                    const {empleado} = history.location.state;
                    url = `${API_LINK}/bansis-app/index.php/get-data/lote-seccion-labor?labor=3&empleado=${empleado.id}&activo=true&calendario=${cabeceraEnfunde.codigoSemana}`;
                }
                const progessbarStatus = (state) => dispatch(progressActions(state));
                await progessbarStatus(true);
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
                        (async () => {
                            try {
                                const apiEnfunde = `${API_LINK}/bansis-app/index.php/getEnfunde/empleado?calendario=${cabeceraEnfunde.codigoSemana}&hacienda=${hacienda.id}&empleado=${empleado.id}&grupoMaterial=${idGrupoMaterialEnfunde}`;
                                const request = await fetch(apiEnfunde);
                                const response = await request.json();
                                const detallesDB = [];
                                detalle_seccion_labor.map(seccion => {
                                    const distribucion = {
                                        id: seccion['id'],
                                        loteSeccion: seccion['seccion_lote'],
                                        has: +(seccion['has']),
                                        status_presente: true,
                                        status_futuro: false,
                                    };
                                    if (response.code === 200) {
                                        if (response.dataArray.length > 0) {
                                            const arrayFilter = response.dataArray.filter((item) => item['idseccion'] === seccion.id);
                                            if (arrayFilter.length > 0) {
                                                distribucion.presente = [];
                                                distribucion.futuro = [];
                                                distribucion.total_presente = 0;
                                                distribucion.total_futuro = 0;
                                                distribucion.total_desbunchados = 0;
                                                distribucion.status_presente = true;
                                                distribucion.status_futuro = true;
                                                arrayFilter.map((item) => {
                                                    item.presente.length > 0 && distribucion.presente.push(item.presente[0]);
                                                    item.futuro.length > 0 && distribucion.futuro.push(item.futuro[0]);
                                                    distribucion.total_presente = +distribucion.total_presente + +item['totalP'];
                                                    distribucion.total_futuro = +distribucion.total_futuro + +item['totalF'];
                                                    distribucion.total_desbunchados = +distribucion.total_desbunchados + +item['totalD'];
                                                    return true;
                                                });
                                            }
                                        }
                                    }
                                    detallesDB.push(distribucion);
                                    return true;
                                });
                                await setDetalleDistribucion(detallesDB);
                            } catch (e) {
                                console.log(e)
                            }
                        })();
                        setDisabledBtn({
                            ...disabledBtn,
                            btnSave: false
                        })
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
    }, [dispatch, searchDetallesDistribucion,
        authentication, apiSearchDetalles, disabledBtn,
        cabeceraEnfunde, empleado, hacienda, history, loadCalendar, changeSemanaBuutton]);

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
            clearDistribuciones();
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
                empleado: true
            });
            setEmpleado(null);
            clearDistribuciones();
        }
        setCabeceraEnfunde({
            ...cabeceraEnfunde,
            labor: value
        });
    };

    const changeEmpleado = (e, value) => {
        setItemsToDelete([]);
        setEmpleado(value);
        if (value) {
            setDisabledElements({
                ...disabledElements,
                labor: false
            });
            setApiSearchDetalles(`${API_LINK}/bansis-app/index.php/get-data/lote-seccion-labor?labor=3&empleado=${value.id}&activo=true&calendario=${cabeceraEnfunde.codigoSemana}`);
            setSearchDetallesDistribucion(true);
        } else {
            clearDistribuciones();
            setDetalleDistribucion([]);
        }
        setCabeceraEnfunde({
            ...cabeceraEnfunde,
            empleado: value
        });
    };

    const clearDistribuciones = () => {
        setDetalleDistribucion([]);
    };

    const openModal = (distribucion) => {
        setOpenFullScreen(true);
        setDistribucionSelect(distribucion);
    };

    const irSemanaAnterior = () => {
        setCabeceraEnfunde({
            ...cabeceraEnfunde,
            fecha: moment(cabeceraEnfunde.fecha, "DD-MM-YYYY").subtract(7, 'days').format('DD/MM/YYYY')
        });
        setChangeSemanaButton(true);
        setLoadCalendar(true);
        setChangeSemana({...changeSemana, status: true});
    };

    const irSemanaSiguiente = () => {
        setCabeceraEnfunde({
            ...cabeceraEnfunde,
            fecha: moment(cabeceraEnfunde.fecha, "DD-MM-YYYY").add(7, 'days').format('DD/MM/YYYY')
        });
        setChangeSemanaButton(true);
        setLoadCalendar(true);
        setChangeSemana({...changeSemana, status: true});
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
        openNotificacion('Enfunde agregado a seccion');
    };

    const nuevoAvanceLabor = () => {

    };

    const saveAvanceLabor = () => {
        //Eliminar registros
        if (itemsToDelete.length > 0) {
            (async () => {
                try {
                    const url = `${API_LINK}/bansis-app/index.php/deleteEnfunde/empleado`;
                    const configuracion = {
                        method: 'DELETE',
                        body: qs.stringify({
                            json: JSON.stringify({eliminar: itemsToDelete})
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': authentication
                        }
                    };
                    const request = await fetch(url, configuracion);
                    const response = await request.json();
                    const {message} = response;
                    openNotificacion(message);
                } catch (e) {
                    console.log(e)
                }
            })();
        }
        setItemsToDelete([]);

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
                const {message} = response;
                openNotificacion(message);
                setSearchDetallesDistribucion(true);
            } catch (e) {
                console.log(e);
            }
        })();
    };

    const openNotificacion = (message) => {
        setNotificacion({
            open: true,
            message
        })
    };

    if (!history.location.state) {
        return <Page404
            code1={5}
            code2={0}
            mensaje="Lo sentimos, pero debe volver al listado de los loteros."
        />
    }

    return (
        <FormularioBase
            icon='fas fa-street-view'
            title={'Formulario Secciones por Formulario'}
            nuevo={nuevoAvanceLabor}
            guardar={saveAvanceLabor}
            volver={Regresar}
            disabledElements={disabledBtn}
        >
            <SnackbarComponent
                notificacion={notificacion}
                setNotificacion={setNotificacion}
            />
            <CabeceraSemana
                title="ENFUNDE SEMANAL POR EMPLEADO"
                loadCalendar={loadCalendar}
                setLoadCalendar={setLoadCalendar}
                changeSemana={changeSemana}
                setChangeSemana={setChangeSemana}
                data={cabeceraEnfunde}
                setData={setCabeceraEnfunde}
            />
            <hr className="mt-3 mb-3"/>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="row">
                        <div className="col-md-12 d-none">
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
                        <div className="col-md-12 d-none">
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
                        <FormEnfundeDetalle
                            cabecera={cabeceraEnfunde}
                            hacienda={hacienda}
                            empleado={empleado}
                            labor={labor}
                            distribucion={distribucionSelect}
                            detalles={detalleDistribucion}
                            save={saveDistribucionLabor}
                            itemsToDelete={itemsToDelete}
                            setItemsToDelete={setItemsToDelete}
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
                        {detalleDistribucion.length > 0 && !reloadComponent &&
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
                                                className="btn btn-success btn-lg"
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
                                    colSpan={2}>{`TOTAL SEMANA ${cabeceraEnfunde.semana}`}</td>
                                <td><b>{totalPresente()}</b></td>
                                <td><b>{totalFuturo()}</b></td>
                                <td><b>{totalDesbunche()}</b></td>
                                <td><b>{totalPresente() + totalFuturo()}</b></td>
                            </tr>
                        </>
                        }
                        </tbody>
                    </table>
                    {detalleDistribucion.length > 0 && !reloadComponent &&
                    <div className="row p-0">
                        <div className="col-md-4">
                            <button className="btn btn-danger btn-block" onClick={() => irSemanaAnterior()}>
                                <i className="fas fa-arrow-alt-circle-left"/> -1 Semana
                            </button>
                        </div>
                        <div className="offset-4 col-md-4">
                            <button className="btn btn-primary btn-block" onClick={() => irSemanaSiguiente()}>
                                +1 Semana <i className="fas fa-arrow-alt-circle-right"/>
                            </button>
                        </div>
                    </div>
                    }
                </div>
            </div>
        </FormularioBase>
    );
}
