export const codigo_dano_otros = 20;

export const calcularIntensidadMapa = (valor) => {
    switch (true) {
        case (valor > 0 && valor < 50):
            return ((valor / 10)) * 0.5 + 25;
        case (valor >= 50 && valor < 1000):
            return ((valor / 100) * 10) * 0.5 + 25;
        case (valor >= 1000):
            return ((valor / 1000) + 100) * 0.5 + 25;
        default:
            return valor;
    }
};

export const removeLocalStorage = (storage) => {
    if (localStorage.getItem(storage)) {
        localStorage.removeItem(storage);
    }
};

export const convertDataHttp_ConsolidarDanos = (data) => {
    return [...data.map(item => ({
        id: item.id,
        alias: item.alias,
        has: parseFloat(item.has).toFixed(2),
        lat: item.latitud,
        lng: item.longitud,
        variedad: item.variedad,
        tipo_variedad: item.tipo_variedad,
        tipo_suelo: item.tipo_suelo,
        cantidad: data.filter(data => data.id === item.id)[0]['manos_recusadas']
            .reduce((total, data) => total + +data.cantidad, 0)
    }))];
};

export const paginate = (data, page_size, page_number) => {
    return data.slice((page_number - 1) * page_size, page_number * page_size);
};
