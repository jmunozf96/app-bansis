import React, {useEffect, useState} from "react";
import {Alert, Col, Form, Row} from "react-bootstrap";
import {
    FormControl,
    Button, TextField, FormControlLabel, Checkbox
} from "@material-ui/core";
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import "./FormLogin.scss"
import {loginSystem} from "../../../../reducers/seguridad/loginDucks";

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

    const authentication = useSelector((state) => state.login.token);

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
                setStatusForm({
                    status: true,
                    message: "Debe completar los campos..."
                });
                return;
            }

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
