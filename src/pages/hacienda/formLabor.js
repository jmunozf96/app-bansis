import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";

import qs from 'qs';
import {API_LINK, _saveApi, _configStoreApi} from "../../utils/constants"

import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../actions/progressActions";
import {editFormAction} from "../../actions/statusFormAction";

import DataForm from "../dataForm";
import {laborAddAction, laborCleanAction} from "../../actions/hacienda/laborActions";

export default function FormLabor() {
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

    const [paramsForm, setParamsForm] = useState({method: 'post', url: `${API_LINK}/bansis-app/index.php/labores`});

    const history = useHistory();

    //------------------------------------------------------------------------- REDUX
    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));
    const setLabor = (state) => dispatch(laborAddAction(state));
    const cleanLabor = (state) => dispatch(laborCleanAction(state));
    const setEditForm = (state) => dispatch(editFormAction(state));

    const labor = useSelector((state) => state.dataLabor.labor);
    const authentication = useSelector((state) => state.auth._token);
    const statusForm = useSelector((state) => state.statusForm.status);
    //------------------------------------------------------------------------------------

    const [statusResponseForm, setStatusResponseForm] = useState({
        severity: 'warning',
        color: 'info',
        message: 'Ingrese los datos de la labor'
    });

    useEffect(() => {
        if (redirect.status) {
            setRedirect({...redirect, status: false});
            history.push(redirect.page);
        }

        if (id !== undefined && loadData) {
            const setLabor = (state) => dispatch(laborAddAction(state));
            const setEditForm = (state) => dispatch(editFormAction(state));
            (async () => {
                const laborAPI = await fetch(`${API_LINK}/bansis-app/index.php/labores/${id}`);
                const json = await laborAPI.json();
                if (json.code === 200) {
                    const {labor} = json;
                    setLabor({
                        id: labor.id,
                        descripcion: labor.descripcion,
                    });
                    setStatusResponseForm({
                        severity: 'info',
                        color: 'warning',
                        message: `La labor ${labor.descripcion} esta lista para edicion.`
                    });
                    //Cambiamos la configuracion del envio del formulario
                    setParamsForm({method: 'put', url: `${API_LINK}/bansis-app/index.php/labores/${labor.id}`});
                } else {
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
            type: 'text',
            placeholder: 'INGRESE LA DESCRIPCION DE LA LABOR...',
            name: 'descripcion',
            value: labor.descripcion,
        },
    ];

    //Evento para guardar datos
    const onClicksubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setFormReset(form);
        const {descripcion} = labor;

        if (!descripcion) {
            setNotificacion({
                open: true,
                message: 'Error al enviar los datos, faltan campos por completar...'
            });
            return;
        }

        const data = qs.stringify({json: JSON.stringify(labor)});
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
                const {labor: {descripcion, id}} = response;
                let message = `ID labor: ${id} - La labor ${descripcion} ha sido registrado en la base de datos.`;
                if (statusForm) {
                    message = `ID labor: ${id} - La labor ${descripcion} ha sido actualizada en la base de datos.`;
                } else {
                    cleanLabor(true);
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
        cleanLabor(true);
        setStatusResponseForm({
            severity: 'warning',
            color: 'info',
            message: 'Ingrese los datos de la labor'
        });
        setEditForm(false);

        if (formReset) {
            formReset.reset();
            setFormReset(null);
            setParamsForm({method: 'post', url: `${API_LINK}/bansis-app/index.php/labores`});
        }

        if (id !== undefined) {
            setRedirect({status: true, page: `/hacienda/labor/${idmodulo}/formulario`});
        }
    };


    return (
        <DataForm
            titleForm="Labor"
            onClicksubmit={onClicksubmit}
            onNuevo={onNuevo}
            notificacion={notificacion}
            setNotificacion={setNotificacion}
            statusResponseForm={statusResponseForm}
            arrayFormulario={arrayFormulario}
            getData={labor}
            setData={setLabor}
            routeReturn={`/hacienda/labor/${idmodulo}`}
        />
    );
}
