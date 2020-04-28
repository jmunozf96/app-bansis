export const laborAddAction = (state) => {
    return {
        type: 'ADD_LABOR_FORM',
        payload: state
    }
};

export const laborCleanAction = (state) => {
    return {
        type: 'CLEAR_LABOR_FORM',
        payload: state
    }
};