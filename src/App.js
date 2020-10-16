import React from 'react';
import MenuTop from "./components/MenuTop";

import {BrowserRouter as Router} from "react-router-dom";
import RouterConfig from "./RouterConfig";
//import Footer from "./components/Footer";

//Redux
import store from "./reducers/store";
import {Provider} from "react-redux";

function App() {
    return (
        <Provider store={store}>
            <Router basename="bansis">
                <header>
                    <MenuTop/>
                </header>
                <div style={{marginTop: "2.5rem"}}>
                    <RouterConfig/>
                </div>
                {/*<Footer/>*/}
            </Router>
        </Provider>
    );
}

export default App;
