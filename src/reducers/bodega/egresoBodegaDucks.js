import moment from "moment";
import 'moment/locale/es';
import {v4 as uuidv4} from "uuid";
import qs from "qs";
import axios from "axios";
import {API_LINK} from "../../utils/constants";

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
        },
        detalle: [],
        cambiosCantidades: [], //Cuando se editen los items que ya estan registrados en la base de datos
        disabledBtn: {
            btnSave: true,
            btnNuevo: false
        },
        waiting: false
    }
;

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

export default function reducer(state = dataInicial, action) {
    switch (action.type) {
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
        default:
            return state
    }
}

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

export const changeStatusBtnsave = (status) => (dispatch) => {
    dispatch({
        type: CHANGE_STATUS_BTN_SAVE,
        payload: status
    })
};

export const setAddDespacho = (despacho) => (dispatch, getState) => {
    let despachos = getState().egresoBodega.detalle;
    let status = (data) => (data.fecha === despacho.fecha && data.material.id === despacho.material.id);

    let existe = despachos.filter(data => (status(data)));

    if (existe.length > 0) {

        if (existe[0].hasOwnProperty('idSQL') && existe[0].fecha === getState().egresoBodega.cabecera.fecha) {
            dispatch(registerChangesItemsProcess(existe[0], despacho.cantidad, false));
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
};

export const changeItemDetalle = (index, cantidad) => (dispatch, getState) => {
    let despachos = getState().egresoBodega.detalle;
    const despacho = {...despachos[index]};
    let status = (data) => (data.fecha === despacho.fecha && data.material.id === despacho.material.id);

    const nw_despachos = despachos.map(data => (status(data)) ? {
        ...data,
        cantidad: cantidad
    } : data);

    dispatch({
        type: UPDATE_DESPACHOS,
        payload: nw_despachos
    })
};

export const registerChangesItemsProcess = (data, cantidad_nw, adicion = true) => (dispatch, getState) => {
    let cambiosRegistrados = [...getState().egresoBodega.cambiosCantidades];
    let datos = [];

    if (cambiosRegistrados.length > 0) {
        datos = [...cambiosRegistrados.map((item) => (item.idmaterial === data.material.id && item.fecha === data.fecha) ?
            {...item, diferencia: adicion ? item.cantidad_salvada - cantidad_nw : +data.cantidad + +cantidad_nw}
            : item)];
    } else {
        datos.push({
            idmaterial: data.material.id,
            fecha: data.fecha,
            diferencia: adicion ? data.cantidad - cantidad_nw : cantidad_nw,
            cantidad_salvada: data.cantidad,
            adicion: adicion
        });
    }

    dispatch({
        type: BACKUP_MATERIAL_STOCK,
        payload: datos
    })
};

export const deleteItemDetalle = (despacho) => (dispatch, getState) => {
    //Tomar en cuenta IDSQL
    let despachos = getState().egresoBodega.detalle;
    if (!despacho.hasOwnProperty('idSQL')) {
        despachos = despachos.filter(data => data.id !== despacho.id);
    } else {
        despachos = despachos.map(data => (data.idSQL === despacho.idSQL) ? {
            ...data,
            delete: true
        } : data);
    }

    dispatch({
        type: DELETE_DESPACHOS,
        payload: despachos
    });

    if (despachos.length === 0) dispatch({type: CHANGE_STATUS_BTN_SAVE, payload: true})
};

export const saveEgresoBodega = () => async (dispatch, getState) => {
    const data = getState().egresoBodega;
    const transaccion = {
        cabecera: {
            fecha: data.cabecera.fecha,
            hacienda: data.cabecera.hacienda.id,
            idempleado: data.cabecera.empleado.id,
            parcial: data.cabecera.parcial
        },
        detalle: data.detalle.map(data => ({
            idmaterial: data.material.id,
            time: data.fecha,
            cantidad: data.cantidad
        }))
    };

    dispatch({type: ESPERAR_PETICION, payload: true});
    //Peticion async

    const prepate_data = qs.stringify({
        json: JSON.stringify(transaccion)
    });

    try {
        const url = `${API_LINK}/bansis-app/index.php/bodega/egresos`;
        const respuesta = await axios.post(url, prepate_data, {
            onDownloadProgress: function () {
                dispatch({type: ESPERAR_PETICION, payload: false});
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': '' //token,
            }
        });
        console.log(respuesta.data);
        await dispatch(existEgreso(data.cabecera.empleado.id, data.cabecera.fecha));
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
        detalle: data.detalle.map(data => ({
            id: data.hasOwnProperty('idSQL') ? data.idSQL : '', //Id de la base de datos
            idmaterial: data.material.id,
            time: data.fecha,
            cantidad: data.cantidad,
            delete: data.hasOwnProperty('delete') ? data.delete : false
        }))
    };

    dispatch({type: ESPERAR_PETICION, payload: true});
    //Peticion async

    const prepate_data = qs.stringify({
        json: JSON.stringify(transaccion)
    });

    try {
        const url = `${API_LINK}/bansis-app/index.php/bodega/egresos/${transaccion.cabecera.id}`;
        const respuesta = await axios.put(url, prepate_data, {
            onDownloadProgress: function () {
                dispatch({type: ESPERAR_PETICION, payload: false});
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': '' //token,
            }
        });
        console.log(respuesta.data);
        await dispatch(existEgreso(data.cabecera.empleado.id, data.cabecera.fecha));
    } catch (e) {
        console.error(e);
    }
};

export const existEgreso = (idempleado, fecha) => async (dispatch, getState) => {
    console.log('entro');
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
