import {createStore, compose, applyMiddleware} from "redux";
import thunk from 'redux-thunk'
import reducer from "./index";
import {loadCredentials, loadStorageAuth} from "./seguridad/loginDucks";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer, composeEnhancers(applyMiddleware(thunk)));

store.dispatch(loadStorageAuth());
store.subscribe(() => {
    store.dispatch(loadCredentials());
});


export default store;
