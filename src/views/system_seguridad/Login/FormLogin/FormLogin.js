import React, {useEffect, useState} from "react";
import {Alert, Col, Form, Row} from "react-bootstrap";
import {
    FormControl,
    /*Button,*/ TextField, FormControlLabel, Checkbox
} from "@material-ui/core";
//import VpnKeyIcon from '@material-ui/icons/VpnKey';

import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import "./FormLogin.scss"
import {loginSystem, setError, stateLoading} from "../../../../reducers/seguridad/loginDucks";
import {loadingProgressBar} from "../../../../reducers/progressDucks";

export default function FormLogin() {
    const history = useHistory();
    const [userAcount, setUserAcount] = useState({
        user: '',
        password: ''
    });
    const [credentialStatus, setCredentialStatus] = useState(false);
    const [getCredential, setGetCredential] = useState({
        user: '',
        password: '',
        getToken: true
    });

    const loading = useSelector(state => state.login.loading);
    const authentication = useSelector((state) => state.login.token);
    const error_login = useSelector(state => state.login.error);

    //En caso de loguearse se debe dejar el token
    const dispatch = useDispatch();

    useEffect(() => {
        if (credentialStatus) {
            setGetCredential({
                ...getCredential,
                user: userAcount.user,
                password: userAcount.password,
                getToken: true
            });

            setCredentialStatus(false);
        }
        if (authentication !== '') {
            history.push("/");
        }

    }, [history, authentication, userAcount, getCredential, credentialStatus]);

    const onChangeHandler = (e) => {
        setUserAcount({
            ...userAcount,
            [e.target.name]: e.target.value
        });
        setCredentialStatus(true);
    };

    const login = (e) => {
            e.preventDefault();
            const {user, password} = userAcount;

            if (!user || !password) {
                dispatch(setError(true, "Debe completar los campos..."));
                return;
            }

            dispatch(stateLoading(true));
            dispatch(loadingProgressBar(true));
            dispatch(loginSystem(userAcount));
        }
    ;

    return (
        <Form
            onChange={onChangeHandler}
            onSubmit={login}
        >
            <Row>
                <Col md={12}>
                    {!error_login.status ?
                        <React.Fragment>
                            {!loading ?
                                <Alert variant="primary">
                                    <i className="fas fa-key"/> Ingrese sus credenciales.
                                </Alert>
                                :
                                <Alert variant="warning">
                                    Iniciando sesión, <b>espere un momento...</b>
                                </Alert>
                            }
                        </React.Fragment>
                        :

                        <Alert variant="danger">
                            <i className="fas fa-times"/> <b>Error, </b> {error_login.message}.
                        </Alert>
                    }
                    <FormControl>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Usuario"
                            name="user"
                            autoComplete="off"
                            autoFocus
                        />
                    </FormControl>
                </Col>
                <Col md={12} className="">
                    <FormControl>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            autoComplete="current-password"
                        />
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary"/>}
                        label="Recordar"
                    />
                    <p>En caso de problemas, contactar al <a href="mailto:astestadistica@pmb.vanet">administrador.</a>
                    </p>
                </Col>
                <Col md={12} className="d-flex">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? <i className="fas fa-spinner fa-spin"/> :
                            <i className="fas fa-sign-in-alt"/>} Entrar
                    </button>
                    {/*<Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Olvidaste tu contraseña?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"No tienes una cuenta? Registrarse"}
                            </Link>
                        </Grid>
                    </Grid>*/}
                </Col>
            </Row>
        </Form>
    );
}
