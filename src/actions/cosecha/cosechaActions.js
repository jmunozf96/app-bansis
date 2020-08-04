export const enabledRequestDataAction = (state) => {
    return ({
        type: 'LOAD_DATA',
        payload: state
    })
};

export const enabledLoadDataCosecha = (state) => {
    return ({
        type: 'LOAD_DATA_COSECHA',
        payload: state
    })
};

export const enabledCajasDiaAction = (state) => {
    return ({
        type: 'UPDATE_CAJAS',
        payload: state
    })
};

export const enabledLotesRecobroAction = (state) => {
    return ({
        type: 'UPDATE_LOTES_RECOBRO',
        payload: state
    })
};

export const enabledCintaRecobro = state => {
    return ({
        type: 'UPDATE_CINTA_RECOBRO',
        payload: state
    })
};

export const enabledLoadLotesCortadosAction = state => {
    return ({
        type: 'LOAD_LOTES_CORTADOS',
        payload: state
    })
};

export const enabledLotesCortados = state => {
    return ({
        type: 'LOTES_CORTADOS',
        payload: state
    })
};

export const setTotalCortadosDia = state => {
    return ({
        type: 'LOAD_TOTAL_CORTADOS_CINTA',
        payload: state
    })
};

export const disabledComponents = state => {
    return ({
        type: 'NOT_LOAD_COMPONENTS',
        payload: state
    })
};