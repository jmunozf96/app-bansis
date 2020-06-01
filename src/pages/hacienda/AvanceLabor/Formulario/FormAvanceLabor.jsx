import React, {useEffect, useState} from "react";
import SnackbarComponent from "../../../../components/Snackbar/Snackbar";
import Buscador from "../../../../components/Buscador";
import InputSearch from "../../../../components/InputSearch/InputSearch";
import FormularioBase from "../../../../components/FormularioBase";
import {API_LINK} from "../../../../utils/constants";
import {FormHelperText} from "@material-ui/core";
import {progressActions} from "../../../../actions/progressActions";
import shortid from "shortid";
import moment from "moment";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import EgresoTransferencia from "../../../bodega/Egreso/Formulario/formEgresoTransferencia";
import FullScreen from "../../../../components/FullScreen/FullScreen";
import FormLaborEnfunde from "./Labor/FormLaborEnfunde";

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

    //Avances segun labor
    const [enfunde, setEnfunde] = useState({
        presente: {
            cantidad: 0,
            idmaterial: 0,
            reelevo: null
        },
        futuro: {
            cantidad: 0,
            idmaterial: 0,
            reelevo: null,
            desbunche: 0
        }
    });

    //Estados de transaccion de enfunde
    const [openFullScreen, setOpenFullScreen] = useState(false);

    const history = useHistory();
    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));

    const authentication = useSelector((state) => state.auth._token);
    const progressbar = useSelector((state) => state.progressbar.loading);

    const [distribucionSelect, setDistribucionSelect] = useState(null); //Variable para ecpecificar el lote de registro de avance por labor
    const [detalleDistribucion, setDetalleDistribucion] = useState([]);
    const [apiSearchDetalles, setApiSearchDetalles] = useState('');
    const [searchDetallesDistribucion, setSearchDetallesDistribucion] = useState(false);

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
    };

    const openModal = (distribucion) => {
        setOpenFullScreen(true);
        setDistribucionSelect(distribucion);
    };

    const nuevoAvanceLabor = () => {

    };

    const saveAvanceLabor = () => {

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
                <div className="col-md-5">
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
                <div className="col-md-3">
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
            </div>
            <hr className="mt-n1 mb-3"/>
            <div className="row">
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
            <hr className="mt-1 mb-3"/>
            <div className="row">
                <div className="col-md-12 table-responsive">
                    <FullScreen
                        open={openFullScreen}
                        setOpen={setOpenFullScreen}
                    >
                        <FormLaborEnfunde
                            hacienda={hacienda}
                            empleado={empleado}
                            labor={labor}
                            distribucion={distribucionSelect}
                            enfunde={enfunde}
                            setEnfunde={setEnfunde}
                        />
                    </FullScreen>
                    <table className="table table-hover table-bordered">
                        <thead>
                        <tr className="text-center">
                            <th>Lote</th>
                            <th>Has</th>
                            <th width="20%">Presente</th>
                            <th width="20%">Futuro</th>
                            <th width="15%">Desbunche</th>
                            <th width="10%">Accion</th>
                        </tr>
                        </thead>
                        <tbody>
                        {detalleDistribucion.length > 0 &&
                        detalleDistribucion.map((item) => (
                            <tr key={item.id} className="text-center table-sm">
                                <td>{item.loteSeccion.alias}</td>
                                <td><small><b>{(item.has).toFixed(2)}</b></small></td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
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
                        ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </FormularioBase>
    );
}
