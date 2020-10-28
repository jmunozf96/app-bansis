import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";

import qs from 'qs';
import {API_LINK, _saveApi, _configStoreApi} from "../../constants/helpers"

import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../actions/progressActions";
import {editFormAction} from "../../actions/statusFormAction";

import DataForm from "../dataForm";
import {
    addHaciendaFormAction,
    clearHaciendaFormAction
} from "../../actions/hacienda/haciendaActions";

export default function FormHacienda() {
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

    const [paramsForm, setParamsForm] = useState({method: 'post', url: `${API_LINK}/bansis-app/index.php/haciendas`});

    const history = useHistory();

    //------------------------------------------------------------------------- REDUX
    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));
    const setHacienda = (state) => dispatch(addHaciendaFormAction(state));
    const cleanHacienda = (state) => dispatch(clearHaciendaFormAction(state));
    const setEditForm = (state) => dispatch(editFormAction(state));

    const hacienda = useSelector((state) => state.dataHacienda.hacienda);
    const authentication = useSelector((state) => state.login.token);
    const statusForm = useSelector((state) => state.statusForm.status);
    //------------------------------------------------------------------------------------

    const [statusResponseForm, setStatusResponseForm] = useState({
        severity: 'warning',
        color: 'info',
        message: 'Ingrese los datos de la hacienda'
    });

    useEffect(() => {
        if (redirect.status) {
            setRedirect({...redirect, status: false});
            history.push(redirect.page);
        }

        if (id !== undefined && loadData) {
            const setHacienda = (state) => dispatch(addHaciendaFormAction(state));
            const setEditForm = (state) => dispatch(editFormAction(state));
            (async () => {
                const haciendaAPI = await fetch(`${API_LINK}/bansis-app/index.php/haciendas/${id}`);
                const json = await haciendaAPI.json();
                if (json.code === 200) {
                    const {hacienda} = json;
                    setHacienda({
                        id: hacienda.id,
                        detalle: hacienda.detalle,
                    });
                    setStatusResponseForm({
                        severity: 'info',
                        color: 'warning',
                        message: `La hacienda ${hacienda.detalle} esta lista para edicion.`
                    });
                    //Cambiamos la configuracion del envio del formulario
                    setParamsForm({method: 'put', url: `${API_LINK}/bansis-app/index.php/haciendas/${hacienda.id}`});
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
            label: 'Hacienda',
            type: 'text',
            placeholder: 'INGRESE LA DESCRIPCION DE LA HACIENDA...',
            name: 'detalle',
            value: hacienda.detalle,
        },
    ];

    //Evento para guardar datos
    const onClicksubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setFormReset(form);
        const {detalle} = hacienda;

        if (!detalle) {
            setNotificacion({
                open: true,
                message: 'Errors al enviar los datos, faltan campos por completar...'
            });
            return;
        }

        const data = qs.stringify({json: JSON.stringify(hacienda)});
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
                        message: error['detalle'][0]
                    })
                }
            } else {
                const {hacienda: {detalle, id}} = response;
                let message = `ID hacienda: ${id} - La hacienda ${detalle} ha sido registrado en la base de datos.`;
                if (statusForm) {
                    message = `ID hacienda: ${id} - La hacienda ${detalle} ha sido actualizada en la base de datos.`;
                } else {
                    cleanHacienda(true);
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
        cleanHacienda(true);
        setStatusResponseForm({
            severity: 'warning',
            color: 'info',
            message: 'Ingrese los datos de la labor'
        });
        setEditForm(false);

        if (formReset) {
            formReset.reset();
            setFormReset(null);
            setParamsForm({method: 'post', url: `${API_LINK}/bansis-app/index.php/haciendas`});
        }

        if (id !== undefined) {
            setRedirect({status: true, page: `/hacienda/${idmodulo}/formulario`});
        }
    };


    return (
        <DataForm
            titleForm="Hacienda"
            onClicksubmit={onClicksubmit}
            onNuevo={onNuevo}
            notificacion={notificacion}
            setNotificacion={setNotificacion}
            statusResponseForm={statusResponseForm}
            arrayFormulario={arrayFormulario}
            getData={hacienda}
            setData={setHacienda}
            routeReturn={`/hacienda/${idmodulo}`}
        />
    );
}
