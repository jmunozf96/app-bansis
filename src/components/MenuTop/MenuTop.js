import React, {useEffect, useState} from "react";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import EqualizerIcon from '@material-ui/icons/Equalizer';
import {API_LINK, APP_TITLE} from "../../utils/constants";
import {Link} from "react-router-dom"

import {useDispatch, useSelector} from "react-redux";

import "./MenuTop.scss"
import LinearProgress from "@material-ui/core/LinearProgress";
import {logoutActions} from "../../actions/authActions";
import {cleanCredentialAction, credentialAction} from "../../actions/credentialActions";
import Cookies from "js-cookie";
import qs from "qs";
import {recursosAction} from "../../actions/recursosActions";

export default function MenuTop() {
    const authentication = useSelector((state) => state.auth._token);
    const progressbarStatus = useSelector((state) => state.progressbar.loading);
    const credentialCard = useSelector((state) => state.credential.credential);
    const recursos = useSelector((state) => state.recursos);

    const localStorageAuth = localStorage.getItem('_sessionId') === undefined || localStorage.getItem('_sessionId') === null;
    const credentialsCookie = Cookies.get('sessionId') === undefined || Cookies.get('sessionId') === null;
    const recursosCookie = Cookies.get('sessionRecursos') === undefined || Cookies.get('sessionRecursos') === null;
    const [checkAuth, setCheckAuth] = useState((localStorageAuth || credentialsCookie || recursosCookie));

    const dispatch = useDispatch();
    const logout = (state) => dispatch(logoutActions(state));
    const credential = (state) => dispatch(cleanCredentialAction(state));

    useEffect(() => {
        if (checkAuth) {
            (async () => {
                const logout = (state) => dispatch(logoutActions(state));
                const credential = (state) => dispatch(cleanCredentialAction(state));
                const recursosLoad = (state) => dispatch(recursosAction(state));
                const credentialLoad = (state) => dispatch(credentialAction(state));
                if (localStorageAuth) {
                    logout('');
                    credential(true);
                    credentialsCookie && Cookies.remove('sessionId');
                    recursosCookie && Cookies.remove('sessionRecursos');
                } else {
                    const url = `${API_LINK}/bansis/verifyToken`;
                    const configuracion = {
                        method: 'POST',
                        body: qs.stringify({
                            json: JSON.stringify({
                                credentials: credentialsCookie,
                                recursos: recursosCookie
                            })
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': authentication
                        }
                    };
                    const request = await fetch(url, configuracion);
                    const response = await request.json();
                    const {logueado} = response;
                    if (!logueado) {
                        logout('');
                        credential(true);
                    } else {
                        const {credentials, recursos} = response;
                        if (credentialsCookie) {
                            const credentialObject = {
                                sub: credentials.sub,
                                nick: credentials.nick,
                                nombres: credentials.nombres,
                                apellidos: credentials.apellido1,
                                idhacienda: credentials.idhacienda
                            };
                            Cookies.set('sessionId', credentialObject, {expires: 1});
                            credentialLoad(credentialObject);
                        }
                        if (recursosCookie) {
                            Cookies.set('sessionRecursos', recursos, {expires: 1});
                            recursosLoad(recursos);
                        }
                    }
                }
            })();
            setCheckAuth(false);
        }
    }, [checkAuth, authentication, credentialCard, dispatch, localStorageAuth, credentialsCookie, recursosCookie]);

    const logoutSite = () => {
        logout('');
        credential(true);
        localStorage.getItem('_sessionId') !== null && localStorage.removeItem('_sessionId');
        Cookies.get('sessionId') !== undefined && Cookies.remove('sessionId');
        Cookies.get('sessionRecursos') !== undefined && Cookies.remove('sessionRecursos');
    };

    return (
        <>
            <Navbar className="menu-top py-1" collapseOnSelect expand="lg" bg="dark" variant="dark" fixed={"top"}>
                <Navbar.Brand as={Link} to="/">
                    <EqualizerIcon className="mt-n2"/> {APP_TITLE}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    {authentication !== '' && !checkAuth && credentialCard ? (
                        <>
                            <Nav className="mr-auto">
                                <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                                {recursos && recursos.length > 0 && recursos.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {item.recurso.recurso_hijo.length > 0 &&
                                        <NavDropdown
                                            title={`${item.recurso.nombre}`}
                                            id="collasible-nav-dropdown"
                                        >
                                            {item.recurso.recurso_hijo.length > 0 && item.recurso.recurso_hijo.map((hijo1, index) => (
                                                <React.Fragment key={index}>
                                                    <NavDropdown.Item disabled>{hijo1.nombre}</NavDropdown.Item>
                                                    {hijo1.recurso_hijo.length > 0 && hijo1.recurso_hijo.map((hijo2, index) => (
                                                        <NavDropdown.Item
                                                            key={index}
                                                            as={Link}
                                                            to={{
                                                                pathname: `${hijo2.ruta}/${(hijo2.id)}`,
                                                                state: hijo2.id
                                                            }}
                                                        >{hijo2.nombre}</NavDropdown.Item>
                                                    ))}
                                                    <NavDropdown.Divider/>
                                                </React.Fragment>
                                            ))}
                                        </NavDropdown>
                                        }
                                    </React.Fragment>
                                ))}
                            </Nav>
                            <Nav className="ml-auto">
                                <NavDropdown title={credentialCard.nick} id="nav-dropdown" drop="left">
                                    <NavDropdown.Item
                                        eventKey="4.1"
                                        disabled>
                                        {credentialCard.nombres} {credentialCard.apellidos}</NavDropdown.Item>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item>Actualizar</NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/login"
                                        onClick={logoutSite}>
                                        Salir
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </>
                    ) : (
                        <>{authentication === '' && !checkAuth && !credentialCard &&
                        <Nav className="ml-auto">
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link eventKey={2} href="#memes">
                                Registro
                            </Nav.Link>
                        </Nav>
                        }</>
                    )}
                </Navbar.Collapse>
            </Navbar>
            {progressbarStatus && <LinearProgress color="secondary" style={{marginTop: "3rem", marginBottom: "-5rem"}}/>}
        </>
    );
}
