import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";

import qs from 'qs';
import {API_LINK, _saveApi, _configStoreApi} from "../../constants/helpers"

import {useDispatch, useSelector} from "react-redux";
import {empleadoAction, empleadoCleanAction} from "../../actions/hacienda/empleadoActions";
import {progressActions} from "../../actions/progressActions";
import {editFormAction} from "../../actions/statusFormAction";

/*import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";*/
import DataForm from "../dataForm";

export default function FormEmpleado() {
    const {id, idmodulo} = useParams();
    const [loadData, setLoadData] = useState(true);
    const [redirect, setRedirect] = useState({
        status: false,
        page: "/error"
    });

    const [formReset, setFormReset] = useState(null);

    const [notificacion, setNotificacion] = useState({
        open: false,
        message: ''
    });

    const [paramsForm, setParamsForm] = useState({method: 'post', url: `${API_LINK}/bansis-app/index.php/empleados`});

    const history = useHistory();

    //------------------------------------------------------------------------- REDUX
    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));
    const setEmpleado = (state) => dispatch(empleadoAction(state));
    const cleanEmpleado = (state) => dispatch(empleadoCleanAction(state));
    const setEditForm = (state) => dispatch(editFormAction(state));

    const empleado = useSelector((state) => state.empleado.empleado);
    const authentication = useSelector((state) => state.login.token);
    const statusForm = useSelector((state) => state.statusForm.status);

    //------------------------------------------------------------------------------------

    const haciendas = useFetch(`${API_LINK}/bansis-app/index.php/haciendas-select`);
    const labores = useFetch(`${API_LINK}/bansis-app/index.php/labores-select`);

    const [statusResponseForm, setStatusResponseForm] = useState({
        severity: 'warning',
        color: 'info',
        message: 'Ingrese los datos del empleado'
    });

    useEffect(() => {
        if (redirect.status) {
            setRedirect({...redirect, status: false});
            history.push(redirect.page);
        }

        if (id !== undefined && loadData) {
            const setEmpleado = (state) => dispatch(empleadoAction(state));
            const setEditForm = (state) => dispatch(editFormAction(state));
            (async () => {
                const empleadoAPI = await fetch(`${API_LINK}/bansis-app/index.php/empleados/${id}`);
                const json = await empleadoAPI.json();
                if (json.code === 200) {
                    const {empleado} = json;
                    setEmpleado({
                        id: empleado.id,
                        cedula: empleado.cedula,
                        idhacienda: empleado.idhacienda,
                        nombre1: empleado.nombre1,
                        nombre2: empleado.nombre2,
                        apellido1: empleado.apellido1,
                        apellido2: empleado.apellido2,
                        nombres: empleado.nombres,
                        idlabor: empleado.idlabor
                    });
                    setStatusResponseForm({
                        severity: 'info',
                        color: 'warning',
                        message: `El empleado ${empleado.nombres} con CI: ${empleado.cedula} esta listo para edicion.`
                    });
                    //Cambiamos la configuracion del envio del formulario
                    setParamsForm({method: 'put', url: `${API_LINK}/bansis-app/index.php/empleados/${empleado.id}`});
                } else {
                    //history.push("/empleado");
                    setRedirect({status: true, page: "/error"});
                }
            })();
            setEditForm(true);
            setLoadData(false);
        }
    }, [statusForm, history, dispatch, id, loadData, setLoadData, setStatusResponseForm, statusResponseForm, redirect, setRedirect]);

    //Primero hay que verificar que se carguen todos los datos de los componentes
    /*if (haciendas.loading || labores.loading) {
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        );
    }*/

    //Construimos un array con nuestro formulario
    const arrayFormulario = [
        {
            size: 5,
            label: 'Hacienda',
            type: 'select',
            name: 'idhacienda',
            value: empleado.idhacienda,
            dataSelect: haciendas,
        },
        {
            size: 4,
            label: 'Formulario',
            type: 'select',
            name: 'idlabor',
            value: empleado.idlabor,
            dataSelect: labores
        },
        {
            size: 3,
            label: 'Cedula',
            type: 'text',
            placeholder: 'INGRESE EL N° DE CEDULA...',
            name: 'cedula',
            value: empleado.cedula,
        },
        {
            size: 3,
            label: 'Primer Nombre',
            type: 'text',
            placeholder: 'INGRESE EL PRIMER NOMBRE...',
            name: 'nombre1',
            value: empleado.nombre1
        },
        {
            size: 3,
            label: 'Segundo Nombre',
            type: 'text',
            placeholder: 'INGRESE EL SEGUNDO NOMBRE...',
            name: 'nombre2',
            value: empleado.nombre2,
        },
        {
            size: 3,
            label: 'Primer Apellido',
            type: 'text',
            placeholder: 'INGRESE EL PRIMER APELLIDO...',
            name: 'apellido1',
            value: empleado.apellido1,
        },
        {
            size: 3,
            label: 'Segundo Apellido',
            type: 'text',
            placeholder: 'INGRESE EL SEGUNDO APELLIDO...',
            name: 'apellido2',
            value: empleado.apellido2
        }
    ];

    //Evento para guardar datos
    const onClicksubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setFormReset(form);
        const {idhacienda, cedula, nombre1, nombre2, apellido1, apellido2, idlabor} = empleado;

        if (!idhacienda || !cedula || !nombre1 || !nombre2 || !apellido1 || !apellido2 || !idlabor) {
            setNotificacion({
                open: true,
                message: 'Errors al enviar los datos, faltan campos por completar...'
            });
            return;
        }

        const data = qs.stringify({json: JSON.stringify(empleado)});
        progessbarStatus(true);

        const config = _configStoreApi(paramsForm.method, paramsForm.url, data, progessbarStatus, authentication);

        (async () => {
            const response = await _saveApi(config);
            const {code, message} = response;
            setNotificacion({
                open: true,
                message: message
            });
            if (code !== 200) {
                const {error} = response;
                if (error) {
                    setNotificacion({
                        open: true,
                        message: error['cedula'][0]
                    })
                }
            } else {
                const {empleado: {cedula, nombres, id}} = response;
                let message = `ID empleado: ${id} - El empleado ${nombres} con CI: ${cedula} ha sido registrado en la base de datos.`;
                if (statusForm) {
                    message = `ID empleado: ${id} - El empleado ${nombres} con CI: ${cedula} ha sido actualizado en la base de datos.`;
                } else {
                    cleanEmpleado(true);
                    form.reset();
                }

                setStatusResponseForm({
                    severity: 'success',
                    color: 'success',
                    message: message
                });
            }
            progessbarStatus(false);
        })();
    };

    //Evento para editar los datos
    const onNuevo = () => {
        cleanEmpleado(true);
        setStatusResponseForm({
            severity: 'warning',
            color: 'info',
            message: 'Ingrese los datos del empleado'
        });
        setEditForm(false);

        if (formReset) {
            formReset.reset();
            setFormReset(null);
            setParamsForm({method: 'post', url: `${API_LINK}/bansis-app/index.php/empleados`});
        }

        if (id !== undefined) {
            setRedirect({status: true, page: `/hacienda/empleado/${idmodulo}/formulario`});
        }
    };


    return (
        <DataForm
            titleForm="Empleado"
            onClicksubmit={onClicksubmit}
            onNuevo={onNuevo}
            notificacion={notificacion}
            setNotificacion={setNotificacion}
            statusResponseForm={statusResponseForm}
            arrayFormulario={arrayFormulario}
            getData={empleado}
            setData={setEmpleado}
            routeReturn={`/hacienda/empleado/${idmodulo}`}
        />
    );
}
