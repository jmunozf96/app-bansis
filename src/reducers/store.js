import {createStore, compose, applyMiddleware} from "redux";
import thunk from 'redux-thunk'
import reducer from "./index";
import {getStateLocalStorage, setCookie, setCookieRecursos, setStateLocalStorage,} from "../utils/localStorage";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    getStateLocalStorage(),
    composeEnhancers(applyMiddleware(thunk))
);


store.subscribe(() => {
    setStateLocalStorage(store.getState().auth._token);
    setCookie(store.getState().credential);
    setCookieRecursos(store.getState().recursos);
});


export default store;
