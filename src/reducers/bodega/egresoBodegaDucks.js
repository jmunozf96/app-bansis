import moment from "moment";
import 'moment/locale/es';
import {v4 as uuidv4} from "uuid";
import qs from "qs";
import axios from "axios";
import {API_LINK} from "../../utils/constants";
import React from "react";

const dataInicial = {
        save: true,
        cabecera: {
            fecha: moment().format("DD/MM/YYYY"),
            hacienda: null,
            empleado: null,
            bodega: null,
            grupo: null,
            parcial: true,
        },
        despacho: {
            id: '',
            fecha: moment().format("DD/MM/YYYY"),
            material: null,
            cantidad: 0,
            movimiento: 'EGRE-ART'
        },
        detalle: [],
        cambiosCantidades: [], //Cuando se editen los items que ya estan registrados en la base de datos
        disabledBtn: {
            btnSave: true,
            btnNuevo: false
        },
        waiting: false,
        configuracionModalTransfer: {
            show: false,
            icon: '',
            title: '',
            animation: true,
            backdrop: true,
            size: 'lg',
            centered: true,
            scrollable: true,
            view: <React.Fragment/>
        },
        transferencia: {
            cabecera: {
                empleado: null,
                saldos: []
            },
            detalle: [],
            error: null
        }
    }
;

const CLEAR_CABECERA = 'CLEAR_CABECERA';
const CLEAR_DETALLE = 'CLEAR_DETALLE';
const CLEAR_MATERIAL = 'CLEAR_MATERIAL';
const CLEAR_RESPALDOS = 'CLEAR_RESPALDOS';

const SAVE_DATA = 'SAVE_DATA';

const UPDATE_CABECERA = 'UPDATE_CABECERA';
const UPDATE_CABECERA_HACIENDA = 'UPDATE_CABECERA_HACIENDA';
const UPDATE_CABECERA_EMPLEADO = 'UPDATE_CABECERA_EMPLEADO';
const UPDATE_CABECERA_BODEGA = 'UPDATE_CABECERA_BODEGA';
const UPDATE_CABECERA_GRUPO = 'UPDATE_CABECERA_GRUPO';
const UPDATE_CABECERA_EGRESO_PARCIAL = 'UPDATE_CABECERA_EGRESO_PARCIAL';
const DESPACHO_MATERIAL = 'DESPACHO_MATERIAL';
const DESPACHO_CANTIDAD = 'DESPACHO_CANTIDAD';
const ADD_DESPACHO_TO_CAR = 'ADD_DESPACHO_TO_CAR';
const UPDATE_DESPACHOS = 'UPDATE_DESPACHO';
const DELETE_DESPACHOS = 'DELETE_DESPACHOS';
const ESPERAR_PETICION = 'ESPERAR_PETICION';

const CHANGE_STATUS_BTN_SAVE = 'CHANGE_STATUS_BTN_SAVE';
const CHANGE_STATUS_BTN_NUEVO = 'CHANGE_STATUS_BTN_NUEVO';

const BACKUP_MATERIAL_STOCK = 'BACKUP_MATERIAL_STOCK';

const MODAL_TRANSFER_SHOW = 'MODAL_TRANSFER_SHOW';
const MODAL_TRANSFER_CONFIG = 'MODAL_TRANSFER_CONFIG';
const UPDATE_CABECERA_TRANSFER_EMPLEADO = 'UPDATE_CABECERA_TRANSFER_EMPLEADO';
const UPDATE_DETALLE_TRANSFER = 'UPDATE_DETALLE_TRANSFER';
const GET_CABECERA_TRANSFER_EMPLEADO_SALDOS = 'GET_CABECERA_TRANSFER_EMPLEADO_SALDOS';
const ERROR_TRANSFER = 'ERROR_TRANSFER';
const CLEAR_TRANSFER_CABECERA = 'CLEAR_TRANSFER_CABECERA';
const CLEAR_TRANSFER_DETALLE = 'CLEAR_TRANSFER_DETALLE';

export default function reducer(state = dataInicial, action) {
    switch (action.type) {
        case CLEAR_CABECERA:
            return {...state, cabecera: action.payload};
        case CLEAR_DETALLE:
            return {...state, detalle: action.payload};
        case CLEAR_MATERIAL:
            return {...state, despacho: action.payload};
        case CLEAR_RESPALDOS:
            return {...state, cambiosCantidades: action.payload};
        case SAVE_DATA:
            return {...state, save: action.payload};
        case UPDATE_CABECERA:
            return {...state, cabecera: action.payload};
        case UPDATE_CABECERA_HACIENDA:
            return {...state, cabecera: {...state.cabecera, hacienda: action.payload}};
        case UPDATE_CABECERA_EMPLEADO:
            return {...state, cabecera: {...state.cabecera, empleado: action.payload}};
        case UPDATE_CABECERA_BODEGA:
            return {...state, cabecera: {...state.cabecera, bodega: action.payload}};
        case UPDATE_CABECERA_GRUPO:
            return {...state, cabecera: {...state.cabecera, grupo: action.payload}};
        case UPDATE_CABECERA_EGRESO_PARCIAL:
            return {...state, cabecera: {...state.cabecera, parcial: action.payload}};
        case DESPACHO_MATERIAL:
            return {...state, despacho: {...state.despacho, material: action.payload}};
        case DESPACHO_CANTIDAD:
            return {...state, despacho: {...state.despacho, cantidad: action.payload}};
        case ADD_DESPACHO_TO_CAR:
            return {...state, detalle: [...state.detalle, action.payload]};
        case UPDATE_DESPACHOS:
            return {...state, detalle: action.payload};
        case DELETE_DESPACHOS:
            return {...state, detalle: action.payload};
        case CHANGE_STATUS_BTN_SAVE:
            return {...state, disabledBtn: {...state.disabledBtn, btnSave: action.payload}};
        case CHANGE_STATUS_BTN_NUEVO:
            return {...state, disabledBtn: {...state.disabledBtn, btnNuevo: action.payload}};
        case ESPERAR_PETICION:
            return {...state, waiting: action.payload};
        case BACKUP_MATERIAL_STOCK:
            return {...state, cambiosCantidades: action.payload};
        case MODAL_TRANSFER_SHOW:
            return {
                ...state,
                configuracionModalTransfer: {
                    ...state.configuracionModalTransfer,
                    show: action.payload.show,
                    view: action.payload.view
                }
            };
        case MODAL_TRANSFER_CONFIG:
            return {
                ...state,
                configuracionModalTransfer: {
                    ...state.configuracionModalTransfer,
                    icon: action.payload.icon,
                    title: action.payload.title,
                    size: action.size,
                }
            };
        case UPDATE_CABECERA_TRANSFER_EMPLEADO:
            return {
                ...state, transferencia: {
                    ...state.transferencia,
                    cabecera: {empleado: action.payload, saldos: []}
                }
            };
        case ERROR_TRANSFER:
            return {
                ...state, transferencia: {
                    ...state.transferencia,
                    error: action.payload
                }
            };
        case GET_CABECERA_TRANSFER_EMPLEADO_SALDOS:
            return {
                ...state, transferencia: {
                    ...state.transferencia,
                    cabecera: {...state.transferencia.cabecera, saldos: action.payload}
                }
            };
        case UPDATE_DETALLE_TRANSFER:
            return {
                ...state,
                transferencia: {...state.transferencia, detalle: action.payload}
            };
        case CLEAR_TRANSFER_CABECERA:
            return {
                ...state, transferencia: {...state.transferencia, cabecera: action.payload}
            };
        case CLEAR_TRANSFER_DETALLE:
            return {
                ...state, transferencia: {...state.transferencia, detalle: action.payload}
            };
        default:
            return state
    }
}

//Reseteo del formulario
export const clearCabecera = () => (dispatch, getState) => {
    const data = getState().egresoBodega.cabecera;
    dispatch({
        type: CLEAR_CABECERA,
        payload: {
            ...data,
            hacienda: null,
            empleado: null,
            bodega: null,
            grupo: null,
            parcial: true,
        }
    })
};

export const clearDetalle = () => (dispatch) => {
    dispatch({
        type: CLEAR_DETALLE,
        payload: []
    });
};

export const clearDespacho = () => (dispatch, getState) => {
    const data = getState().egresoBodega.despacho;
    dispatch({
        type: CLEAR_MATERIAL,
        payload: {
            ...data,
            id: '',
            material: null,
            cantidad: 0,
        }
    })
};

export const clearRespaldo = () => (dispatch) => {
    dispatch({
        type: CLEAR_RESPALDOS,
        payload: []
    })
};

/*Acciones para agregar informacion a los estados*/

export const setDataCabeceraHacienda = (hacienda) => (dispatch) => {
    dispatch({
        type: UPDATE_CABECERA_HACIENDA,
        payload: hacienda
    })
};

export const setDataCabeceraEmpleado = (empleado) => (dispatch) => {
    dispatch({
        type: UPDATE_CABECERA_EMPLEADO,
        payload: empleado
    })
};

export const setDataCabeceraBodega = (bodega) => (dispatch) => {
    dispatch({
        type: UPDATE_CABECERA_BODEGA,
        payload: bodega
    })
};

export const setDataCabeceraGrupo = (grupo) => (dispatch) => {
    dispatch({
        type: UPDATE_CABECERA_GRUPO,
        payload: grupo
    })
};

export const setDataCabeceraParcial = (status) => (dispatch) => {
    dispatch({
        type: UPDATE_CABECERA_EGRESO_PARCIAL,
        payload: status
    })
};

export const setDataMaterial = (material) => (dispatch) => {
    dispatch({
        type: DESPACHO_MATERIAL,
        payload: material
    })
};

export const setDataCantidad = (cantidad) => (dispatch) => {
    dispatch({
        type: DESPACHO_CANTIDAD,
        payload: cantidad
    })
};

/*Accion para cambiar el estado del boton guardar*/
export const changeStatusBtnsave = (status) => (dispatch) => {
    dispatch({
        type: CHANGE_STATUS_BTN_SAVE,
        payload: status
    })
};

/*Accion para llenar el carro de despachos por fecha*/
export const setAddDespacho = (despacho) => (dispatch, getState) => {
    let despachos = getState().egresoBodega.detalle;
    if (despacho.movimiento === 'EGRE-ART') {
        let status = (data) => (data.fecha === despacho.fecha && data.material.id === despacho.material.id
            && ((!data.hasOwnProperty('delete') || (data.hasOwnProperty('delete') && !data.delete))
                && data.movimiento === despacho.movimiento)
        );

        let existe = despachos.filter(data => (status(data)));

        if (existe.length > 0) {

            if (existe[0].hasOwnProperty('idSQL') && existe[0].movimiento === 'EGRE-ART' && existe[0].fecha === getState().egresoBodega.cabecera.fecha) {
                dispatch(registerChangesItemsProcess(existe[0], despacho.cantidad, true));
            }

            const nw_despachos = despachos.map(data => (status(data)) ? {
                ...data,
                cantidad: data.cantidad + despacho.cantidad
            } : data);

            dispatch({
                type: UPDATE_DESPACHOS,
                payload: nw_despachos
            });

            return;
        }

        despacho.id = uuidv4();

        dispatch({
            type: ADD_DESPACHO_TO_CAR,
            payload: despacho
        })
    }
};

export const changeItemDetalle = (index, cantidad) => (dispatch, getState) => {
    let despachos = getState().egresoBodega.detalle;
    const despacho = {...despachos[index]};
    if (despacho.movimiento === 'EGRE-ART') {
        let status = (data) => (data.fecha === despacho.fecha && data.material.id === despacho.material.id
            && data.movimiento === despacho.movimiento);

        const nw_despachos = despachos.map(data => (status(data)) ? {
            ...data,
            cantidad: cantidad
        } : data);

        dispatch({
            type: UPDATE_DESPACHOS,
            payload: nw_despachos
        })
    }
};

export const registerChangesItemsProcess = (data, cantidad_nw, adicion = false) => (dispatch, getState) => {
    let cambiosRegistrados = [...getState().egresoBodega.cambiosCantidades];
    if (data.movimiento === 'EGRE-ART') {
        const status = (item) => (item.idmaterial === data.material.id && item.fecha === data.fecha && item.movimiento === data.movimiento);
        let datos = [];

        if (cambiosRegistrados.length > 0) {

            datos = [...cambiosRegistrados.map((item) => (status(item)) ?
                {
                    ...item,
                    diferencia: !adicion ? item.cantidad_salvada - cantidad_nw : item.cantidad_salvada - (data.cantidad + cantidad_nw)
                }
                : item)];
        } else {
            datos.push({
                idmaterial: data.material.id,
                fecha: data.fecha,
                diferencia: !adicion ? data.cantidad - cantidad_nw : -cantidad_nw,
                cantidad_salvada: data.cantidad,
                adicion: adicion
            });
        }

        dispatch({
            type: BACKUP_MATERIAL_STOCK,
            payload: datos
        })
    }
};

export const deleteItemDetalle = (despacho) => (dispatch, getState) => {
    //Tomar en cuenta IDSQL
    let despachos = getState().egresoBodega.detalle;
    if (despacho.movimiento === 'EGRE-ART') {
        if (!despacho.hasOwnProperty('idSQL')) {
            despachos = despachos.filter(data => data.id !== despacho.id);
        } else {
            despachos = despachos.map(data => (data.idSQL === despacho.idSQL) ? {
                ...data,
                delete: true
            } : data);

            let cambiosRegistrados = [...getState().egresoBodega.cambiosCantidades];

            const status = (item) => (item.idmaterial === despacho.material.id && item.fecha === despacho.fecha);
            const getCambiosRegistradosItem = cambiosRegistrados.filter(data => status(data));
            let changesCambiosRegistrados = [];
            if (getCambiosRegistradosItem.length > 0) {
                changesCambiosRegistrados = [...cambiosRegistrados.map(data => status(data) ? {
                    ...data,
                    diferencia: 0
                } : data)];
            } else {
                changesCambiosRegistrados.push({
                    idmaterial: despacho.material.id,
                    fecha: despacho.fecha,
                    diferencia: despacho.cantidad,
                    cantidad_salvada: despacho.cantidad,
                    adicion: despacho
                });
            }
            dispatch({
                type: BACKUP_MATERIAL_STOCK,
                payload: changesCambiosRegistrados
            })
        }
    }

    dispatch({
        type: DELETE_DESPACHOS,
        payload: despachos
    });

    if (despachos.length === 0) dispatch({type: CHANGE_STATUS_BTN_SAVE, payload: true})
};

/*Acciones para guardar la información en el servidor*/
export const saveEgresoBodega = () => async (dispatch, getState) => {
    const data = getState().egresoBodega;
    const transaccion = {
        cabecera: {
            fecha: data.cabecera.fecha,
            hacienda: data.cabecera.hacienda.id,
            idempleado: data.cabecera.empleado.id,
            parcial: data.cabecera.parcial
        },
        detalle: data.detalle.filter(data => data.movimiento === 'EGRE-ART').map(data => ({
            idmaterial: data.material.id,
            time: data.fecha,
            cantidad: data.cantidad,
            movimiento: 'EGRE-ART'
        })),
        transferencias: data.transferencia.detalle.map(data => ({
            idmaterial: data.material.id,
            time: data.fecha,
            cantidad: data.cantidad,
            idInv: data.idInv
        }))
    };

    dispatch({type: ESPERAR_PETICION, payload: true});
    dispatch(changeStatusBtnsave(true));
    //Peticion async

    const prepate_data = qs.stringify({
        json: JSON.stringify(transaccion)
    });

    try {
        const url = `${API_LINK}/bansis-app/index.php/bodega/egresos`;
        const respuesta = await axios.post(url, prepate_data, {
            onDownloadProgress: function () {
                dispatch({type: ESPERAR_PETICION, payload: false});
                dispatch(changeStatusBtnsave(false));
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': '' //token,
            }
        });

        console.log(respuesta.data);
        await dispatch(existEgreso(data.cabecera.empleado.id, data.cabecera.fecha));
        await dispatch(clearRespaldo());

        await dispatch(clearCabeceraTransfer());
        await dispatch(clearDetallesTransfer());
    } catch (e) {
        console.error(e);
    }
};

export const updateEgresoBodega = () => async (dispatch, getState) => {
    const data = getState().egresoBodega;
    const transaccion = {
        cabecera: {
            id: data.cabecera.idSQL, //Id de la base de datos
            fecha: data.cabecera.fecha,
            hacienda: data.cabecera.hacienda.id,
            idempleado: data.cabecera.empleado.id,
            parcial: data.cabecera.parcial
        },
        detalle: data.detalle.filter(data => data.movimiento === 'EGRE-ART').map(data => ({
            id: data.hasOwnProperty('idSQL') ? data.idSQL : '', //Id de la base de datos
            idmaterial: data.material.id,
            time: data.fecha,
            movimiento: data.movimiento,
            cantidad: data.cantidad,
            delete: data.hasOwnProperty('delete') ? data.delete : false
        })),
        transferencias: data.transferencia.detalle.map(data => ({
            idmaterial: data.material.id,
            time: data.fecha,
            cantidad: data.cantidad,
            idInv: data.idInv
        }))
    };

    dispatch({type: ESPERAR_PETICION, payload: true});
    dispatch(changeStatusBtnsave(true));
    //Peticion async

    const prepate_data = qs.stringify({
        json: JSON.stringify(transaccion)
    });

    try {
        const url = `${API_LINK}/bansis-app/index.php/bodega/egresos/${transaccion.cabecera.id}`;
        const respuesta = await axios.put(url, prepate_data, {
            onDownloadProgress: function () {
                dispatch({type: ESPERAR_PETICION, payload: false});
                dispatch(changeStatusBtnsave(false));
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': '' //token,
            }
        });

        console.log(respuesta.data);
        await dispatch(existEgreso(data.cabecera.empleado.id, data.cabecera.fecha));
        await dispatch(clearRespaldo());

        //Clear Transferencias
        await dispatch(clearCabeceraTransfer());
        await dispatch(clearDetallesTransfer());
    } catch (e) {
        console.error(e);
    }
};

export const existEgreso = (idempleado, fecha) => async (dispatch, getState) => {
    const data = getState().egresoBodega;
    try {
        const url = `${API_LINK}/bansis-app/index.php/bodega/search-egresos/${idempleado}?fecha=${fecha}`;
        const respuesta = await axios.get(url, {
            onDownloadProgress: function () {
                dispatch({type: ESPERAR_PETICION, payload: false});
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': '' //token,
            }
        });

        const {code} = respuesta.data;
        if (code === 200) {
            const {transaccion} = respuesta.data;

            const cabecera = {...data.cabecera};
            cabecera.idSQL = transaccion.id;

            let detalle = [...transaccion.egreso_detalle.map(data => ({
                'id': uuidv4(),
                'idSQL': data.id,
                'fecha': moment(data.fecha).format("DD/MM/YYYY"),
                'movimiento': data.movimiento,
                'material': data.materialdetalle,
                'cantidad': +data.cantidad
            }))];

            dispatch({type: UPDATE_CABECERA, payload: cabecera});
            dispatch({type: UPDATE_DESPACHOS, payload: detalle});
            //No va a guardar, sino actualizar.
            dispatch({type: CHANGE_STATUS_BTN_SAVE, payload: false});
            dispatch({type: SAVE_DATA, payload: false});
        } else {
            dispatch({type: CHANGE_STATUS_BTN_SAVE, payload: true});
            dispatch({type: SAVE_DATA, payload: true});
        }
    } catch (e) {
        console.error(e);
    }
};

/*Acciones para configurar modal de transferencias*/
export const showTransferModal = (show, view) => (dispatch) => {
    dispatch({
        type: MODAL_TRANSFER_SHOW,
        payload: {show, view}
    })
};

export const configTransferModal = (icon, title, size = 'lg') => (dispatch) => {
    dispatch({
        type: MODAL_TRANSFER_CONFIG,
        payload: {icon, title, animation: true, backdrop: true, size, centered: true, scrollable: true,}
    })
};

export const clearCabeceraTransfer = () => (dispatch) => {
    dispatch({
        type: CLEAR_TRANSFER_CABECERA,
        payload: {
            empleado: null,
            saldos: []
        }
    });
};

export const clearDetallesTransfer = () => (dispatch) => {
    dispatch({
        type: CLEAR_TRANSFER_DETALLE,
        payload: []
    });
};

export const clearDetallesEmpleadoSinConfirmar = (empleado) => (dispatch, getState) => {
    if (empleado) {
        const data_detalle = getState().egresoBodega.transferencia.detalle;
        const status = (item) => (item.procesado);
        const array_transfers = data_detalle.filter(item => status(item));
        dispatch({
            type: UPDATE_DETALLE_TRANSFER,
            payload: array_transfers
        });
        dispatch(clearCabeceraTransfer());
    }
};

export const procesarDetallesEmpleados = (empleado) => (dispatch, getState) => {
    if (empleado) {
        const data_detalle = getState().egresoBodega.transferencia.detalle;
        const status = (item) => (item.empleado_solicitado.id === empleado.id);
        const transfer_process = data_detalle.filter(item => item.procesado);
        const transfer_unprocess = [...data_detalle.filter(item => status(item) && !item.procesado)];

        let procesados = []; //...array_transfers.map(item => ({...item, procesado: true}))
        if (transfer_unprocess.length > 0) {
            if (transfer_process.length > 0) {
                let backup_procesados = [];
                for (let unprocess of transfer_unprocess) {
                    let filter = transfer_process.filter(item => item.idInv === unprocess.idInv);

                    if (backup_procesados.length === 0) {
                        backup_procesados = [...transfer_process.filter(item => item.idInv !== unprocess.idInv)];
                    }

                    if (filter.length > 0) {
                        procesados.push({
                            ...filter[0], //Solo es un tipo de material por semana del inventario
                            cantidad: +filter[0].cantidad + +unprocess.cantidad,
                            procesado: true
                        });
                    } else {
                        procesados.push({...unprocess, procesado: true});
                    }
                }
                procesados = [...backup_procesados.concat([...procesados])];
            } else {
                procesados = [...transfer_unprocess.map(item => ({...item, procesado: true}))];
            }
        }

        if (procesados.length > 0)
            dispatch(changeStatusBtnsave(false));

        dispatch({
            type: UPDATE_DETALLE_TRANSFER,
            payload: procesados
        });

        dispatch(clearCabeceraTransfer());
    }
};

export const setDataCabeceraTransferEmpleado = (empleado_solicitado) => (dispatch, getState) => {
    const empleado_solicitante = getState().egresoBodega.cabecera.empleado;

    if (empleado_solicitante && empleado_solicitado) {
        if (empleado_solicitante.id === empleado_solicitado.id) {
            dispatch(errorTransfer({status: 'danger', message: 'No se puede tomar saldos del mismo empleado'}));
            return
        }
    }

    dispatch(errorTransfer(null));
    dispatch({
        type: UPDATE_CABECERA_TRANSFER_EMPLEADO,
        payload: empleado_solicitado
    })
};

export const errorTransfer = (error) => (dispatch) => {
    dispatch({
        type: ERROR_TRANSFER,
        payload: error
    })
};

export const getSaldostoTransfer = () => async (dispatch, getState) => {
    const datos = getState().egresoBodega.cabecera;
    const datos_transferencia = getState().egresoBodega.transferencia.cabecera;

    if (datos.empleado && datos.bodega && datos.grupo && datos_transferencia.empleado) {
        const empleado = datos_transferencia.empleado;
        const url = `${API_LINK}/bansis-app/index.php/bodega/transferencia/search-saldos?empleado=${empleado.id}&grupo=${datos.grupo.id}`;
        const respuesta = await axios.get(url);
        const {code} = await respuesta.data;

        if (code === 200) {
            await dispatch({type: GET_CABECERA_TRANSFER_EMPLEADO_SALDOS, payload: respuesta.data.saldos});
            return;
        }

        await dispatch({type: GET_CABECERA_TRANSFER_EMPLEADO_SALDOS, payload: []})
    }
};

export const setAddSaldoToTransfer = (transferencia) => (dispatch, getState) => {
    const data_cabecera = getState().egresoBodega.transferencia.cabecera;
    const data_detalle = getState().egresoBodega.transferencia.detalle;
    let array_transfers = [...data_detalle];
    const status = (item) => (item.material.id === transferencia.material.id
        && item.idInv === transferencia.idInv && !item.procesado);

    const existe = data_detalle.filter(data => status(data));
    if (existe.length > 0) {
        array_transfers = [...data_detalle.map(item => status(item) ? {
            ...item,
            cantidad: !item.procesado ? transferencia.cantidad : +item.cantidad + +transferencia.cantidad,
        } : item)];
    } else {
        array_transfers.push({
            id: uuidv4(),
            idInv: transferencia.idInv,
            fecha: moment().format("DD/MM/YYYY"),
            material: transferencia.material,
            cantidad: transferencia.cantidad,
            empleado_solicitado: data_cabecera.empleado,
            contabiliza: false,
            procesado: false
        });
    }


    dispatch({
        type: UPDATE_DETALLE_TRANSFER,
        payload: array_transfers
    })
};

export const deleteTransfer = (transferencia) => (dispatch, getState) => {
    const data_detalle = getState().egresoBodega.transferencia.detalle;
    const status = (item) => (item.material.id !== transferencia.material.id && item.idInv !== transferencia.idInv);
    const array_transfers = data_detalle.filter(item => status(item));
    dispatch({
        type: UPDATE_DETALLE_TRANSFER,
        payload: array_transfers
    })
};

export const deleteTransferProcess = (id) => (dispatch, getState) => {
    const data_detalle = getState().egresoBodega.transferencia.detalle;
    const status = (item) => (item.id !== id);
    const array_transfers = data_detalle.filter(item => status(item));
    dispatch({
        type: UPDATE_DETALLE_TRANSFER,
        payload: array_transfers
    })
};