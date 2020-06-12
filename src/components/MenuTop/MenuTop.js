import React from "react";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import EqualizerIcon from '@material-ui/icons/Equalizer';
import {APP_TITLE} from "../../utils/constants";
import {Link} from "react-router-dom"

import {useDispatch, useSelector} from "react-redux";

import "./MenuTop.scss"
import LinearProgress from "@material-ui/core/LinearProgress";
import {logoutActions} from "../../actions/authActions";
import {cleanCredentialAction} from "../../actions/credentialActions";
import Cookies from "js-cookie";

export default function MenuTop() {
    const authentication = useSelector((state) => state.auth._token);
    const progressbarStatus = useSelector((state) => state.progressbar.loading);
    const credentialCard = useSelector((state) => state.credential.credential);
    const recursos = useSelector((state) => state.recursos);

    const dispatch = useDispatch();
    const logout = (state) => dispatch(logoutActions(state));
    const credential = (state) => dispatch(cleanCredentialAction(state));

    const logoutSite = () => {
        logout('');
        credential(true);
        localStorage.getItem('_sessionId') !== null && localStorage.removeItem('_sessionId');
        Cookies.get('sessionId') !== undefined && Cookies.remove('sessionId');
        Cookies.get('sessionRecursos') !== undefined && Cookies.remove('sessionRecursos');
    };

    return (
        <>
            <Navbar className="menu-top" collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand as={Link} to="/">
                    <EqualizerIcon className="mt-n2"/> {APP_TITLE}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    {authentication !== '' ? (
                        <>
                            <Nav className="mr-auto">
                                <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                                {recursos && recursos.length > 0 && recursos.map((item, index) => (
                                    <NavDropdown
                                        title={`${item.recurso.nombre}`}
                                        id="collasible-nav-dropdown"
                                        key={index}
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
                        <Nav className="ml-auto">
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link eventKey={2} href="#memes">
                                Registro
                            </Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Navbar>
            {progressbarStatus && <LinearProgress color="secondary"/>}
        </>
    );
}
