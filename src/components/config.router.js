import React from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import {routes} from "../router";

import {useSelector} from "react-redux";
import Login from "../pages/login";

export default function RouterConfig() {
    const authentication = useSelector(
        (state) => state.auth._token
    );

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
                        authentication !== '' ?
                            <route.component {...props} routes={route.routes}/> :
                            <Redirect
                                to="/login"
                            />
                    )}
                />
            ))}
        </Switch>
    );
}



