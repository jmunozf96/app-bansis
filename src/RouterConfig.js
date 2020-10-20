import React from "react";
import {Route, Switch} from "react-router-dom";
import {routes} from "./Router";

import Login from "./pages/seguridad/Login/login";
import ComponentVerificacionAuth from "./components/ComponentVerificacionAuth";

export default function RouterConfig() {
    return (
        <Switch>
            <Route exact path="/login" component={Login}/>
            {routes.map((route, i) => (
                <Route
                    key={i}
                    path={route.path}
                    exact={true}
                    render={() => (
                        <ComponentVerificacionAuth>
                            <route.component/>
                        </ComponentVerificacionAuth>
                    )}
                />
            ))}
        </Switch>
    );
}




