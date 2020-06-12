import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";

import qs from 'qs';
import {API_LINK, _saveApi, _configStoreApi} from "../../utils/constants"

import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../actions/progressActions";
import {editFormAction} from "../../actions/statusFormAction";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import DataForm from "../dataForm";
import {addBodegaFormAction, clearBodegaFormAction} from "../../actions/bodega/bodegaActions";

export default function FormBodega() {
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

    const [paramsForm, setParamsForm] = useState({method: 'post', url: `${API_LINK}/bansis-app/index.php/bodegas`});

    const history = useHistory();

    //------------------------------------------------------------------------- REDUX
    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));
    const setBodega = (state) => dispatch(addBodegaFormAction(state));
    const cleanBodega = (state) => dispatch(clearBodegaFormAction(state));
    const setEditForm = (state) => dispatch(editFormAction(state));

    const bodega = useSelector((state) => state.dataBodega.bodega);
    const authentication = useSelector((state) => state.auth._token);
    const statusForm = useSelector((state) => state.statusForm.status);

    //------------------------------------------------------------------------------------

    const haciendas = useFetch(`${API_LINK}/bansis-app/index.php/haciendas-select`);

    const [statusResponseForm, setStatusResponseForm] = useState({
        severity: 'warning',
        color: 'info',
        message: 'Ingrese los datos para la bodega'
    });

    useEffect(() => {
        if (redirect.status) {
            setRedirect({...redirect, status: false});
            history.push(redirect.page);
        }

        if (id !== undefined && loadData) {
            const setBodega = (state) => dispatch(addBodegaFormAction(state));
            const setEditForm = (state) => dispatch(editFormAction(state));
            (async () => {
                const bodegaAPI = await fetch(`${API_LINK}/bansis-app/index.php/bodegas/${id}`);
                const json = await bodegaAPI.json();
                if (json.code === 200) {
                    const {bodega} = json;
                    setBodega({
                        id: bodega.id,
                        idhacienda: bodega.idhacienda,
                        nombre: bodega.nombre,
                        descripcion: bodega.descripcion,
                    });
                    setStatusResponseForm({
                        severity: 'info',
                        color: 'warning',
                        message: `La bodega ${bodega.nombre} esta lista para edicion.`
                    });
                    //Cambiamos la configuracion del envio del formulario
                    setParamsForm({method: 'put', url: `${API_LINK}/bansis-app/index.php/bodegas/${bodega.id}`});
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
    if (haciendas.loading) {
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        );
    }

    //Construimos un array con nuestro formulario
    const arrayFormulario = [
        {
            size: 6,
            label: 'Hacienda',
            type: 'select',
            name: 'idhacienda',
            value: bodega.idhacienda,
            dataSelect: haciendas,
        },
        {
            size: 6,
            label: 'Nombre',
            type: 'text',
            placeholder: 'INGRESE EL NOMBRE DE LA BODEGA...',
            name: 'nombre',
            value: bodega.nombre,
        },
        {
            size: 12,
            label: 'Descripcion',
            type: 'textarea',
            rows: 5,
            placeholder: 'INGRESE UNA DESCRIPCION PARA LA BODEGA...',
            name: 'descripcion',
            value: bodega.descripcion
        }
    ];

    //Evento para guardar datos
    const onClicksubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setFormReset(form);
        const {idhacienda, nombre, descripcion} = bodega;

        if (!idhacienda || !nombre || !descripcion) {
            setNotificacion({
                open: true,
                message: 'Error al enviar los datos, faltan campos por completar...'
            });
            return;
        }

        const data = qs.stringify({json: JSON.stringify(bodega)});
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
                        message: error['nombre'][0]
                    })
                }
            } else {
                const {bodega: {nombre, id}} = response;
                let message = `ID bodega: ${id} - La bodega ${nombre} ha sido registrada en la base de datos.`;
                if (statusForm) {
                    message = `ID bodega: ${id} - La bodega ${nombre} ha sido actualizada en la base de datos.`;
                } else {
                    cleanBodega(true);
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
        cleanBodega(true);
        setStatusResponseForm({
            severity: 'warning',
            color: 'info',
            message: 'Ingrese los datos para la bodega'
        });
        setEditForm(false);

        if (formReset) {
            formReset.reset();
            setFormReset(null);
            setParamsForm({method: 'post', url: `${API_LINK}/bansis-app/index.php/bodegas`});
        }

        if (id !== undefined) {
            setRedirect({status: true, page: `/bodega/${idmodulo}/formulario`});
        }
    };


    return (
        <DataForm
            titleForm="Bodega"
            onClicksubmit={onClicksubmit}
            onNuevo={onNuevo}
            notificacion={notificacion}
            setNotificacion={setNotificacion}
            statusResponseForm={statusResponseForm}
            arrayFormulario={arrayFormulario}
            getData={bodega}
            setData={setBodega}
            routeReturn={`/bodega/${idmodulo}`}
        />
    );
}
