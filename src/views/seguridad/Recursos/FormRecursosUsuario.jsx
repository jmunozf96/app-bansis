import React, {useEffect, useState} from "react";
import ComponentFormularioBase from "../../../components/ComponentFormularioBase";
import {useParams} from "react-router-dom";
import {API_LINK} from "../../../constants/helpers";
import {useDispatch, useSelector} from "react-redux";
import Buscador from "../../../components/Buscador";
import InputSearch from "../../../components/InputSearch/InputSearch"
import {Checkbox, FormControlLabel, FormHelperText} from "@material-ui/core";
import PanelExpansion from "../../../components/PanelExpansion";
import qs from "qs";
import {progressActions} from "../../../actions/progressActions";
import SnackbarComponent from "../../../components/Snackbar/Snackbar";

export default function FormRecursoUsuario() {
    const {idmodulo} = useParams();
    //-----------------------------------------------------------------------
    const Regresar = `/seguridad/usuario/rol/${idmodulo}`;
    const [disabledElements, setDisabledElements] = useState({
        hacienda: false,
        empleado: true,
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
    const [changeURL, setChangeURL] = useState(false);

    const authentication = useSelector((state) => state.login.token);

    const [loadRecursos, setLoadRecursos] = useState(false);
    const [recursos, setRecursos] = useState([]);
    const [rolesUser, setRolesUser] = useState([]);

    const [notificacion, setNotificacion] = useState({
        open: false,
        message: ''
    });

    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));

    useEffect(() => {
        if (changeURL) {
            if (hacienda) {
                setApiEmpleado(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}&user=true&hacienda=${hacienda.id}`);
            } else {
                setApiEmpleado(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}&user=true`);
            }
            setChangeURL(false);
        }
    }, [changeURL, searchEmpleado, hacienda]);

    useEffect(() => {
        if (loadRecursos) {
            (async () => {
                const url = `${API_LINK}/bansis/recursos`;
                const request = await fetch(url);
                const response = await request.json();
                if (response.code === 200) {
                    setRecursos(response.dataArray);
                }
            })();
            setLoadRecursos(false);
        }
    }, [loadRecursos]);

    const changeHacienda = (e, value) => {
        setHacienda(value);
        if (value) {
            setDisabledElements({
                ...disabledElements,
                empleado: false
            })
        } else {
            setDisabledElements({
                ...disabledElements,
                empleado: true
            })
        }
        setChangeURL(true);
    };

    const changeEmpleado = (e, value) => {
        setEmpleado(value);
        if (value) {
            if (value.user) {
                if (value.user.perfil.length > 0) {
                    const recursos = [];
                    value.user.perfil.map(perfil => recursos.push(+perfil.idrecurso));
                    setRolesUser(recursos);
                }
                setLoadRecursos(true);
                setDisabledBtn({
                    ...disabledBtn,
                    btnSave: false
                })
            }
        } else {
            setSearchEmpleado('');
            setChangeURL(true);
            setRecursos([]);
        }
    };

    const addUserRol = (e, recursos, childrens) => {
        if (e.target.checked) {
            const filter = recursos.filter(recurso => !rolesUser.includes(recurso));
            setRolesUser(rolesUser.concat(filter));
        } else {
            // eslint-disable-next-line no-extend-native
            Array.prototype.unique = function (a) {
                return function () {
                    return this.filter(a)
                }
            }(function (a, b, c) {
                return c.indexOf(a, b + 1) < 0
            });

            //Eliminar los padres si ya no quedan hijos
            //Filtros los modulos que existen aparte del que se haya deseleccionado
            const filtro_only = childrens.filter(recurso => recursos.includes(recurso.id));
            const filtro_only_id = filtro_only.map(obj => obj.id);
            const filtro_only_padreId = filtro_only.map(obj => +obj.padreId).unique();

            //Filtros los modulos que existen aparte del que se haya deseleccionado
            const filtro_all = childrens.filter(recurso => !recursos.includes(recurso.id));
            //Extraigo solo los id para hacerle saber si los incluye en el registro
            const filtro_all_id = filtro_all.map(obj => obj.id);
            const filtro_all_padreId = filtro_all.map(obj => +obj.padreId).unique();

            let todo = [];
            if (filtro_all_padreId.length === 0) {
                todo = filtro_only_padreId.concat(filtro_only_id);
            } else {
                todo = filtro_all_padreId.concat(filtro_all_id).concat(filtro_only_id);
            }

            //Pregunto si estos id estan en los roles (Para poder eliminar los padres)
            const eliminarSoloUno = filtro_all_id.filter(recurso => rolesUser.includes(recurso)).length > 0;
            if (eliminarSoloUno) {
                //Eliminar el hijo
                const newArray = rolesUser.filter((recurso) => !filtro_only_id.includes(recurso));
                setRolesUser(newArray);
            } else {
                //Eliminar los padres y el hijo
                const newArray = rolesUser.filter((recurso) => !todo.includes(recurso));
                setRolesUser(newArray);
            }

        }
    };

    const sendNotificacion = (mensaje) => {
        setNotificacion({
            open: true,
            message: mensaje
        })
    };

    const consultaRol = (id) => {
        let arrayFilter = [];
        if (rolesUser.length > 0) {
            arrayFilter = rolesUser.filter((rol) => rol === id);
        }
        return arrayFilter.length > 0;
    };

    const nuevoRolUsuario = () => {

    };

    const guardarRolUsuario = () => {
        if (rolesUser.length > 0) {
            (async () => {
                try {
                    progessbarStatus(true);
                    const url = `${API_LINK}/bansis/user/asignModule`;
                    const configuracion = {
                        method: 'POST',
                        body: qs.stringify({
                            json: JSON.stringify({
                                usuario: empleado,
                                roles: rolesUser
                            })
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': authentication
                        }
                    };
                    const request = await fetch(url, configuracion);
                    const response = await request.json();
                    await progessbarStatus(false);
                    const {code} = response;

                    if (code === 200) {
                        sendNotificacion(response.message)
                    } else {
                        console.info(response.message)
                    }
                } catch (e) {
                    console.warn(e);
                }
            })();
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-6" style={{marginTop: "-2.5rem"}}>
                    <ComponentFormularioBase
                        icon='far fa-address-card'
                        title={'Formulario de asignacion de rol a usuarios'}
                        nuevo={nuevoRolUsuario}
                        guardar={guardarRolUsuario}
                        volver={Regresar}
                        disabledElements={disabledBtn}
                    >
                        <div className="row">
                            <SnackbarComponent
                                notificacion={notificacion}
                                setNotificacion={setNotificacion}
                            />
                            <div className="col-md-12">
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
                                    <div className="col-md-12">
                                        {empleado && empleado.user ?
                                            <div className="card mt-3">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-12 mb-3">
                                                            <div className="input-group">
                                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1">
                                                    <i className="fas fa-info-circle"/>
                                                    </span>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    className="form-control bg-white"
                                                                    disabled={true}
                                                                    defaultValue={empleado.user.descripcion}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="input-group">
                                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1">
                                                        <i className="fas fa-user-circle"/>
                                                    </span>
                                                                </div>
                                                                <input
                                                                    type="text" className="form-control bg-white"
                                                                    disabled={true}
                                                                    defaultValue={empleado.user.nick}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-12 mt-3">
                                                            <div className="input-group">
                                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1">
                                                        <i className="fas fa-at"/>
                                                    </span>
                                                                </div>
                                                                <input
                                                                    type="text" className="form-control bg-white"
                                                                    disabled={true}
                                                                    defaultValue={empleado.user.correo}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <>
                                                {empleado &&
                                                <div className="alert alert-info mt-3">
                                                    <i className="fas fa-info-circle"/> Empleado no tiene usuario
                                                    registrado.
                                                </div>
                                                }
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ComponentFormularioBase>
                </div>
                <div className="col-md-6" style={{marginTop: "1.5rem"}}>
                    <div className="row p-0 m-0">
                        <div className="col-md-12 p-0 mb-5">
                            <div className="row p-0 mr-3">
                                {loadRecursos && recursos.length === 0 ?
                                    <div className="col-md-12 text-center mt-5">
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                    :
                                    <div className="col-md-12 mr-0 pr-0"
                                         style={{height: "500px", overflowY: "scroll"}}>
                                        {recursos.length > 0 &&
                                        recursos.map((recurso, index) => (
                                            <RecursoExpand recurso={recurso} key={index} col={12}>
                                                <div className="row">
                                                    {recurso.recurso_hijo.length > 0 &&
                                                    recurso.recurso_hijo.map((recursoHijo, index) => (
                                                        <RecursoExpand recurso={recursoHijo} key={index}
                                                                       col={12}>
                                                            <div className="row p-0">
                                                                {recursoHijo.recurso_hijo.length > 0 &&
                                                                recursoHijo.recurso_hijo.map((recursoHijo2, index) => (
                                                                    <div className="col-md-6" key={index}>
                                                                        <FormControlLabel
                                                                            aria-label="Acknowledge"
                                                                            control={<Checkbox
                                                                                checked={consultaRol(recursoHijo2.id)}
                                                                                onChange={(e) => addUserRol(e, [recurso.id, recursoHijo.id, recursoHijo2.id], recursoHijo.recurso_hijo)}
                                                                            />}
                                                                            label={`Acceso: ${recursoHijo2.nombre}`}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </RecursoExpand>
                                                    ))}
                                                </div>
                                            </RecursoExpand>
                                        ))
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RecursoExpand(props) {
    const {recurso, children, col} = props;

    return (
        <div className={`col-md-${col} col-12 mb-1`}>
            <PanelExpansion
                icon='fas fa-align-left'
                contentTabPanel={recurso.nombre}
                data={recurso}
                descripcion={recurso.nombre}
            >
                {children}
            </PanelExpansion>
        </div>
    );
}
