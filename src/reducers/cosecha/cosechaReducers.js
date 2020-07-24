const initialProps = {
    updateCajasDia: true,
    updateLotesRecobro: true,
    updateCintaRecobro: true,
    loadRequestData: true,
    loadDataCosecha: false,
    lotesCortados: false
};

export default function (state = initialProps, action) {
    switch (action.type) {
        case 'LOAD_DATA':
            return ({
                ...state,
                loadRequestData: action.payload
            });
        case 'LOAD_DATA_COSECHA':
            return ({
                ...state,
                loadDataCosecha: action.payload
            });
        case 'UPDATE_CAJAS':
            return ({
                ...state,
                updateCajasDia: action.payload
            });
        case 'UPDATE_LOTES_RECOBRO':
            return ({
                ...state,
                updateLotesRecobro: action.payload
            });
        case 'UPDATE_CINTA_RECOBRO':
            return ({
                ...state,
                updateCintaRecobro: action.payload
            });
        case 'LOTES_CORTADOS':
            return ({
                ...state,
                lotesCortados: action.payload
            });
        case 'NOT_LOAD_COMPONENTS' :
            return ({
                updateCajasDia: false,
                updateLotesRecobro: false,
                updateCintaRecobro: false
            });
        default:
            return state;
    }
}
