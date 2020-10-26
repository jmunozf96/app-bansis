import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import qs from 'qs';
import {API_LINK, _saveApi, _configStoreApi} from "../../constants/helpers"

import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../actions/progressActions";
import {editFormAction} from "../../actions/statusFormAction";

import DataForm from "../dataForm";
import {addGrupoFormAction, clearGrupoFormAction} from "../../actions/bodega/grupoActions";

export default function FormGrupo() {
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

    const [paramsForm, setParamsForm] = useState({
        method: 'post',
        url: `${API_LINK}/bansis-app/index.php/bodega-grupos`
    });

    const history = useHistory();

    //------------------------------------------------------------------------- REDUX
    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));
    const setGrupo = (state) => dispatch(addGrupoFormAction(state));
    const cleanGrupo = (state) => dispatch(clearGrupoFormAction(state));
    const setEditForm = (state) => dispatch(editFormAction(state));

    const grupo = useSelector((state) => state.dataGrupo.grupo);
    const authentication = useSelector((state) => state.login.token);
    const statusForm = useSelector((state) => state.statusForm.status);

    //------------------------------------------------------------------------------------

    const [statusResponseForm, setStatusResponseForm] = useState({
        severity: 'warning',
        color: 'info',
        message: 'Ingrese los datos para el grupo'
    });

    useEffect(() => {
        if (redirect.status) {
            setRedirect({...redirect, status: false});
            history.push(redirect.page);
        }

        if (id !== undefined && loadData) {
            const setGrupo = (state) => dispatch(addGrupoFormAction(state));
            const setEditForm = (state) => dispatch(editFormAction(state));
            (async () => {
                const grupoAPI = await fetch(`${API_LINK}/bansis-app/index.php/bodega-grupos/${id}`);
                const json = await grupoAPI.json();
                if (json.code === 200) {
                    const {grupo} = json;
                    setGrupo({
                        id: grupo.id,
                        descripcion: grupo.descripcion,
                    });
                    setStatusResponseForm({
                        severity: 'info',
                        color: 'warning',
                        message: `El grupo ${grupo.descripcion} esta listo para edicion.`
                    });
                    //Cambiamos la configuracion del envio del formulario
                    setParamsForm({method: 'put', url: `${API_LINK}/bansis-app/index.php/bodega-grupos/${grupo.id}`});
                } else {
                    //history.push("/empleado");
                    setRedirect({status: true, page: "/error"});
                }
            })();
            setEditForm(true);
            setLoadData(false);
        }
    }, [statusForm, history, dispatch, id, loadData, setLoadData, setStatusResponseForm, statusResponseForm, redirect, setRedirect]);

    //Construimos un array con nuestro formulario
    const arrayFormulario = [
        {
            size: 12,
            label: 'Descripcion',
            type: 'textarea',
            rows: 3,
            placeholder: 'INGRESE UNA DESCRIPCION PARA EL GRUPO...',
            name: 'descripcion',
            value: grupo.descripcion
        }
    ];

    //Evento para guardar datos
    const onClicksubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setFormReset(form);
        const {descripcion} = grupo;

        if (!descripcion) {
            setNotificacion({
                open: true,
                message: 'Errors al enviar los datos, faltan campos por completar...'
            });
            return;
        }

        const data = qs.stringify({json: JSON.stringify(grupo)});
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
                        message: error['descripcion'][0]
                    })
                }
            } else {
                const {grupo: {descripcion, id}} = response;
                let message = `ID grupo: ${id} - El grupo ${descripcion} ha sido registrado en la base de datos.`;
                if (statusForm) {
                    message = `ID grupo: ${id} - El grupo ${descripcion} ha sido actualizado en la base de datos.`;
                } else {
                    cleanGrupo(true);
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
        cleanGrupo(true);
        setStatusResponseForm({
            severity: 'warning',
            color: 'info',
            message: 'Ingrese los datos del grupo...'
        });
        setEditForm(false);

        if (formReset) {
            formReset.reset();
            setFormReset(null);
            setParamsForm({method: 'post', url: `${API_LINK}/bansis-app/index.php/bodega-grupos`});
        }

        if (id !== undefined) {
            setRedirect({status: true, page: `/bodega/grupo/${idmodulo}/formulario`});
        }
    };


    return (
        <DataForm
            titleForm="Grupo"
            onClicksubmit={onClicksubmit}
            onNuevo={onNuevo}
            notificacion={notificacion}
            setNotificacion={setNotificacion}
            statusResponseForm={statusResponseForm}
            arrayFormulario={arrayFormulario}
            getData={grupo}
            setData={setGrupo}
            routeReturn={`/bodega/grupo/${idmodulo}`}
        />
    );
}
