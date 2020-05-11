import axios from "axios";

export const APP_TITLE = 'Bansis - WEB';
export const API_LINK = 'http://192.168.1.125:8082/api';
export const API_XASS_PRIMO = `${API_LINK}/bansis-app/XassInventario.php/primo`;
export const API_XASS_SOFCA = `${API_LINK}/bansis-app/XassInventario.php/sofca`;

export const _saveApi = async (config) => {
    try {
        axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        const peticion = await axios(config).then((response) => {
            return response.data;
        }, (error) => {
            return error.response.data;
        });
        return peticion;
    } catch (error) {
        console.error(error);
    }
};
export const _configStoreApi = (metodo, url, datos, ...funciones) => {
    return {
        method: metodo,
        url: url,
        data: datos,
        onUploadProgress: function (progressEvent) {
            //Progressbar
            funciones[0](false);
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //Autenticacion
            'Authorization': funciones[1],
        }
    };
};

export const focuselement = (id) => {
    window.setTimeout(() => {
        document.getElementById(id).focus();
    }, 0);
};

