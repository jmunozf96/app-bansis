import React, {useEffect, useState} from "react";
import {Alert, Col, Form, Row} from "react-bootstrap";
import axios from "axios";
import {
    FormControl,
    Button, TextField, FormControlLabel, Checkbox, Grid, Link,
} from "@material-ui/core";
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authVerifyActions} from "../../actions/authActions";
import {credentialAction} from "../../actions/credentialActions";

import "./FormLogin.scss"
import {progressActions} from "../../actions/progressActions";

import {API_LINK} from "../../utils/constants";
import {recursosAction} from "../../actions/recursosActions";

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
    const [statusForm, setStatusForm] = useState({
        status: false,
        message: 'Credenciales Incorrectas'
    });
    const authentication = useSelector(
        (state) => state.auth._token
    );

    //En caso de loguearse se debe dejar el token
    const dispatch = useDispatch();
    const authorization = (state) => dispatch(authVerifyActions(state));
    const progessbarStatus = (state) => dispatch(progressActions(state));
    const credentialCard = (state) => dispatch(credentialAction(state));
    const recursosUser = (state) => dispatch(recursosAction(state));

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
            const form = e.currentTarget;

            if (!user || !password) {
                setStatusForm({
                    status: true,
                    message: "Debe completar los campos..."
                });
                return;
            }

            let data = new FormData();
            data.append('json', JSON.stringify(userAcount));

            const config = {
                timeout: 10000,
                onUploadProgress: function (progressEvent) {
                    progessbarStatus(true);
                }
            };

            const response = getUser(`${API_LINK}/bansis/login`, data, config);
            response.then((data) => {
                if (data) {
                    const {code, message, token, credential} = data;
                    if (code === 400) {
                        setStatusForm({
                            status: true,
                            message: message
                        });
                    } else {
                        if (code === 200) {
                            if (token) {
                                authorization(credential);
                                form.reset();
                            }
                        } else {
                            setStatusForm({
                                status: true,
                                message: message
                            });
                        }
                    }
                }
            });

            const dataCard = new FormData();
            dataCard.append('json', JSON.stringify(getCredential));

            axios.post(`${API_LINK}/bansis/login`, dataCard, null).then((response) => {
                const {code, credential} = response.data;
                if (code === 200) {
                    const data_user = {
                        sub: credential.sub,
                        nick: credential.nick,
                        nombres: credential.nombres,
                        apellidos: credential.apellidos,
                        idhacienda: credential.idhacienda
                    };
                    credentialCard(data_user);
                    if (response.data.recursos) {
                        recursosUser(response.data.recursos);
                    }
                }
            });
        }
    ;

    async function getUser(url, data, config = null) {
        try {
            return await axios.post(url, data, config)
                .then((response) => {
                    progessbarStatus(false);
                    return response.data;
                })
                .catch((error) => {
                    progessbarStatus(false);
                    return error;
                });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Form
            onChange={onChangeHandler}
            onSubmit={login}
        >
            <Row>
                <Col md={12}>
                    {!statusForm.status ? (
                            <Alert variant="primary">
                                Ingrese sus credenciales.
                            </Alert>
                        ) :
                        (
                            <Alert variant="danger">
                                {statusForm.message}.
                            </Alert>
                        )}

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
                <Col md={12} className="mt-2">
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
                </Col>
                <Col md={12} className="">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<VpnKeyIcon/>}
                        required
                        fullWidth
                    >
                        Ingresar
                    </Button>
                    <Grid container>
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
                    </Grid>
                </Col>
            </Row>
        </Form>
    );
}
