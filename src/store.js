import {createStore} from "redux";
import reducer from "./reducers";
import {getStateLocalStorage, setCookie, setCookieRecursos, setStateLocalStorage,} from "./utils/localStorage";

const localStorageStateToken = getStateLocalStorage();

const store = createStore(
    reducer,
    localStorageStateToken,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


store.subscribe(() => {
    setStateLocalStorage(store.getState().auth._token);
});

store.subscribe(() => {
    setCookie(store.getState().credential.credential)
});

store.subscribe(() => {
    setCookieRecursos(store.getState().recursos)
});

export default store;
