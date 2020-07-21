import {createStore} from "redux";
import reducer from "./reducers";
import {getStateLocalStorage, setCookie, setCookieRecursos, setStateLocalStorage,} from "./utils/localStorage";

const store = createStore(
    reducer,
    getStateLocalStorage(),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


store.subscribe(() => {
    setStateLocalStorage(store.getState().auth._token);
    setCookie(store.getState().credential);
    setCookieRecursos(store.getState().recursos);
});


export default store;
