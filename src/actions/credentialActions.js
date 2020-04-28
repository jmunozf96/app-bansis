export const credentialAction = (state) => {
    return {
        type: 'AUTH_CREDENTIALS_USER',
        payload: state
    }
};

export const cleanCredentialAction = (state) => {
    return {
        type: 'AUTH_CREDENTIALS_CLEAN',
        payload: state
    }
};