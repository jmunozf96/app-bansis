export const recursosAction = (state) => {
    return {
        type: 'LOAD_RECURSOS',
        payload: state
    }
};

export const cleanRecursosAction = (state) => {
    return {
        type: 'CLEAN_RECURSOS',
        payload: state
    }
};
