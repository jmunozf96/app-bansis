import React from "react";
import {Route, Switch} from "react-router-dom";
import {routes} from "../router";

import Login from "../pages/login";
import VerifyAuthentication from "./VerifyAuthentication";

export default function RouterConfig() {
    return (
        <Switch>
            <Route exact path="/login" component={Login}/>
            {routes.map((route, i) => (
                <Route
                    key={i}
                    path={route.path}
                    exact={true}
                    render={(props) => (
                        // pass the sub-routes down to keep nesting
                        <VerifyAuthentication>
                            <route.component {...props} routes={route.routes}/>
                        </VerifyAuthentication>
                    )}
                />
            ))}
        </Switch>
    );
}



