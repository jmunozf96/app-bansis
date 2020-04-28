export const empleadoAction = (state) => {
    return {
        type: 'ADD_EMPLEADO_FORM',
        payload: state
    }
};

export const empleadoCleanAction = (state) => {
    return {
        type: 'CLEAR_EMPLEADO_FORM',
        payload: state
    }
};