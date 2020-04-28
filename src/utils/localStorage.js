export const getStateLocalStorage = () => {
    const auth = localStorage.getItem('_authenticationKey');
    if (auth === null) return undefined;
    return JSON.parse(auth);
};

export const setStateLocalStorage = (state) => {
    localStorage.setItem('_authenticationKey', JSON.stringify(state))
};