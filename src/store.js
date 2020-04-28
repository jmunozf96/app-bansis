import {createStore} from "redux";
import reducer from "./reducers";
import {
    getStateLocalStorage,
    setStateLocalStorage,
}
    from "./utils/localStorage";

const localStorageStateToken = getStateLocalStorage();

const store = createStore(
    reducer,
    localStorageStateToken,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


store.subscribe(() => {
    setStateLocalStorage({
        auth: {_token: store.getState().auth._token},
        credential: {credential: store.getState().credential.credential}
    });
});

export default store;