import React, {useEffect, useState} from "react";
import ComponentFormularioBase from "../../../components/ComponentFormularioBase";
import {Link, useParams} from "react-router-dom";
import {API_LINK} from "../../../constants/helpers";
import Buscador from "../../../components/Buscador";
import InputSearch from "../../../components/InputSearch/InputSearch";
import {FormControl, FormHelperText, TextField} from "@material-ui/core";

import {useSelector} from "react-redux";
import qs from "qs";

export default function FormUsuario() {
    const {idmodulo} = useParams();
    //-----------------------------------------------------------------------
    const Regresar = `/seguridad/usuario/${idmodulo}`;
    const [disabledElements, setDisabledElements] = useState({
        hacienda: false,
        empleado: true,
    });

    const [disabledBtn, setDisabledBtn] = useState({
        btnSave: true,
        btnNuevo: false
    });

    const [dataUser, setDataUser] = useState(false);
    const [user, setUser] = useState({
        id: '',
        idhacienda: '',
        correo: '',
        nombre: '',
        apellido: '',
        password: '',
        confirmpassword: '',
        descripcion: ''
    });
    const [passwordCoincide, setPasswordCoincide] = useState({
        load: false,
        message: ''
    });
    const [statusUser, setStatusUser] = useState({
        load: false,
        nick: '',
        message: '',
    });

    //Configuracion para buscador
    const api_buscador = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const [hacienda, setHacienda] = useState(null);
    const [searchEmpleado, setSearchEmpleado] = useState('');
    const [apiEmpleado, setApiEmpleado] = useState(`${API_LINK}/bansis-app/index.php/search/empleados`);
    const [empleado, setEmpleado] = useState(null);
    const [changeURL, setChangeURL] = useState(false);

    const authentication = useSelector((state) => state.login.token);

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
        if (dataUser) {
            if (empleado.user) {
                setUser({
                    ...user,
                    id: empleado.id,
                    idhacienda: hacienda.id,
                    nombre: empleado.nombre1 + ' ' + empleado.nombre2,
                    apellido: empleado.apellido1 + ' ' + empleado.apellido2,
                    correo: empleado.user.correo,
                    descripcion: empleado.user.descripcion
                });

                setStatusUser({
                    load: true,
                    nick: empleado.user.nick,
                    message: 'Usuario ya se encuentra registrado.'
                })
            } else {
                setUser({
                    ...user,
                    id: empleado.id,
                    idhacienda: hacienda.id,
                    nombre: empleado.nombre1 + ' ' + empleado.nombre2,
                    apellido: empleado.apellido1 + ' ' + empleado.apellido2
                });

                setStatusUser({
                    load: false,
                    nick: '',
                    message: ''
                })
            }
            setDataUser(false);
        }
    }, [dataUser, empleado, user, hacienda]);

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
            setDataUser(true);
            setDisabledBtn({
                ...disabledBtn,
                btnSave: false
            });
        } else {
            setSearchEmpleado('');
            setChangeURL(true);
        }
    };

    const onChange = (e) => {
        if (e.target.value.trim()) {
            setUser({
                ...user,
                [e.target.name]: e.target.value
            })
        }
    };

    const confirmPassword = (e) => {
        if (e.target.value.trim()) {
            if (e.target.value === user.password) {
                setUser({
                    ...user,
                    [e.target.name]: e.target.value
                });
                setPasswordCoincide({...passwordCoincide, load: false});
            } else {
                setPasswordCoincide({
                    load: true,
                    message: 'Contraseñas no coinciden'
                });
            }
        } else {
            setPasswordCoincide({
                load: false,
                message: ''
            });
        }
    };

    const nuevoUsuario = () => {

    };

    const guardarUsuario = () => {
        if (user && user.id !== '' && !disabledBtn.btnSave) {
            (async () => {
                const url = `${API_LINK}/bansis/user/create`;
                const configuracion = {
                    method: 'POST',
                    body: qs.stringify({
                        json: JSON.stringify(user)
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': authentication
                    }
                };
                const request = await fetch(url, configuracion);
                const response = await request.json();
                const {code} = response;
                if (code === 200) {
                    setStatusUser({
                        load: true,
                        nick: response.nick,
                        message: response.message
                    })
                }
                console.log(response);
            })();
        }
    };

    return (
        <ComponentFormularioBase
            icon='fas fa-users'
            title={'Formulario de creacion de usuarios'}
            nuevo={nuevoUsuario}
            guardar={guardarUsuario}
            volver={Regresar}
            disabledElements={disabledBtn}
        >
            <div className="row">
                <div className="col-md-6">
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
                <div className="col-md-6">
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
            <hr/>
            {empleado && !dataUser &&
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row mt-n3 mb-m1">
                                <div className="col-md-6">
                                    <FormControl>
                                        <TextField
                                            defaultValue={user.nombre}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="nombre"
                                            label="Nombres"
                                            type="text"
                                            disabled={true}
                                        />
                                    </FormControl>
                                </div>
                                <div className="col-md-6">
                                    <FormControl>
                                        <TextField
                                            defaultValue={user.apellido}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="apellido"
                                            label="Apellidos"
                                            type="text"
                                            disabled={true}
                                        />
                                    </FormControl>
                                </div>
                                <div className="col-md-6">
                                    <FormControl>
                                        <TextField
                                            defaultValue={user.password}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="password"
                                            label="Contraseña"
                                            type="password"
                                            autoComplete="current-password"
                                            autoFocus={true}
                                            onChange={(e) => onChange(e)}
                                        />
                                    </FormControl>
                                </div>
                                <div className="col-md-6">
                                    <FormControl>
                                        <TextField
                                            defaultValue={user.confirmpassword}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="confirmpassword"
                                            label="Confirmar contraseña"
                                            type="password"
                                            autoComplete="current-password"
                                            onChange={(e) => confirmPassword(e)}
                                        />
                                        {passwordCoincide.load &&
                                        <FormHelperText id="outlined-weight-helper-text" style={{color: 'red'}}>
                                            {passwordCoincide.message}
                                        </FormHelperText>
                                        }
                                    </FormControl>
                                </div>
                                <div className="col-md-6">
                                    <FormControl>
                                        <TextField
                                            defaultValue={user.correo}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="correo"
                                            label="Correo electronico"
                                            type="email"
                                            autoComplete="off"
                                            onChange={(e) => onChange(e)}
                                        />
                                    </FormControl>
                                </div>
                                <div className="col-md-6 mt-3">
                                    <textarea
                                        name="descripcion"
                                        className="form-control"
                                        defaultValue={user.descripcion}
                                        rows={2}
                                        style={{textTransform: "uppercase"}}
                                        onChange={(e) => onChange(e)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {statusUser.load &&
                <div className="col-12">
                    <div className="card text-center mt-3">
                        <div className="card-body">
                            <h5 className="card-title"><i className="fas fa-id-card-alt"/> Usuario: {statusUser.nick}
                            </h5>
                            <p className="card-text">{statusUser.message}</p>
                            <Link to="/seguridad/usuario/rol/24" className="btn btn-primary">Asignar Recursos</Link>
                        </div>
                    </div>
                </div>
                }
            </div>
            }
        </ComponentFormularioBase>
    );
}
