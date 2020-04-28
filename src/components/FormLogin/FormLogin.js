import React, {useEffect, useState} from "react";
import {Alert, Col, Form, Row} from "react-bootstrap";
import axios from "axios";
import {
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    Button,
} from "@material-ui/core";
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authVerifyActions} from "../../actions/authActions";
import {credentialAction} from "../../actions/credentialActions";

import "./FormLogin.scss"
import {progressActions} from "../../actions/progressActions";

import {API_LINK} from "../../utils/constants";

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
                    credentialCard(credential);
                }
            });
        }
    ;

    async function getUser(url, data, config = null) {
        try {
            const response = await axios.post(url, data, config)
                .then((response) => {
                    progessbarStatus(false);
                    return response.data;
                })
                .catch((error) => {
                    progessbarStatus(false);
                    return error;
                });

            return response;
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
                        <InputLabel>Ingrese su usuario</InputLabel>
                        <Input
                            name="user"
                            startAdornment={
                                <InputAdornment position="start">
                                    <AccountCircle/>
                                </InputAdornment>
                            }
                            required
                            autoComplete="off"
                        />
                    </FormControl>
                </Col>
                <Col md={12} className="mt-2">
                    <FormControl>
                        <InputLabel>Ingrese su contraseña</InputLabel>
                        <Input
                            fullWidth
                            name="password"
                            type="password"
                            startAdornment={
                                <InputAdornment position="start">
                                    <LockIcon/>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </Col>
                <Col md={12} className="mt-3">
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
                </Col>
            </Row>
        </Form>
    );
}