export const authVerifyActions = (state) => {
    return {
        type: 'AUTHENTICATION_USER',
        payload: state
    }
};

export const logoutActions = (state) => {
    return {
        type: 'LOGOUT_USER',
        payload: state
    }
};