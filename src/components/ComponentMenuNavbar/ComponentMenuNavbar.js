import React from "react";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import EqualizerIcon from '@material-ui/icons/Equalizer';
import {APP_TITLE} from "../../constants/helpers";
import {Link} from "react-router-dom"

import {useDispatch, useSelector} from "react-redux";

import "./ComponentMenuNavbar.scss"
import LinearProgress from "@material-ui/core/LinearProgress";
import {clearAuthentication} from "../../reducers/seguridad/loginDucks";

export default function ComponentMenuNavbar() {
    const dispatch = useDispatch();
    const authentication = useSelector((state) => state.login.auth);
    const credentialCard = useSelector((state) => state.login.credential);
    const recursos = useSelector((state) => state.login.recursos);

    const progressbarStatus = useSelector((state) => state.progressbar.loading);


    const logoutSite = () => {
        dispatch(clearAuthentication());
    };

    return (
        <>
            <Navbar className="menu-top py-1" collapseOnSelect expand="lg" bg="dark" variant="dark" fixed={"top"}>
                <Navbar.Brand as={Link} to="/">
                    <EqualizerIcon className="mt-n2"/> {APP_TITLE}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    {authentication !== '' && credentialCard ? (
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
                    ) : <Nav className="ml-auto">
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        <Nav.Link eventKey={2} href="#memes">
                            Registro
                        </Nav.Link>
                    </Nav>}
                </Navbar.Collapse>
            </Navbar>
            {progressbarStatus &&
            <LinearProgress color="secondary" style={{marginTop: "3rem", marginBottom: "-3rem"}}/>}
        </>
    );
}
