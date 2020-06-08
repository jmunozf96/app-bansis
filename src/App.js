import React from 'react';
import MenuTop from "./components/MenuTop";

import {BrowserRouter as Router} from "react-router-dom";
import RouterConfig from "./components/config.router";
import Footer from "./components/Footer";

//Redux
import store from "./store";
import {Provider,} from "react-redux";

function App() {
    return (
        <Provider store={store}>
            <Router basename="/bansis">
                <header>
                    <MenuTop/>
                </header>
                <RouterConfig/>
                <Footer/>
            </Router>
        </Provider>
    );
}

export default App;
