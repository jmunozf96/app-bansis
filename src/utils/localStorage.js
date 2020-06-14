import Cookies from "js-cookie"

export const getStateLocalStorage = () => {
    const auth = localStorage.getItem('_sessionId');
    const credential = Cookies.get('sessionId');
    const recursos = Cookies.get('sessionRecursos');
    if (auth === null) return undefined;
    return {
        "auth": {"_token": JSON.parse(auth)},
        "credential": {"credential": JSON.parse(credential !== undefined ? credential : null)},
        "recursos": JSON.parse(recursos !== undefined ? recursos : null)
    };
};

export const setStateLocalStorage = (state) => {
    if (state !== "") {
        localStorage.setItem('_sessionId', JSON.stringify(state))
    }
};

export const setCookie = (state) => {
    Cookies.set('sessionId', JSON.stringify(state), {expires: 1});
};

export const setCookieRecursos = (state) => {
    Cookies.set('sessionRecursos', JSON.stringify(state), {expires: 1});
};

