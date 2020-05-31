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

export default function MenuTop() {

    const authentication = useSelector(
        (state) => state.auth._token
    );

    const progressbarStatus = useSelector(
        (state) => state.progressbar.loading
    );

    const credentialCard = useSelector(
        (state) => state.credential.credential
    );

    const dispatch = useDispatch();
    const logout = (state) => dispatch(logoutActions(state));
    const credential = (state) => dispatch(cleanCredentialAction(state));

    const logoutSite = () => {
        logout('');
        credential(true);
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
                                <NavDropdown title="Hacienda" id="collasible-nav-dropdown">
                                    <NavDropdown.Item disabled>Mantenimientos</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/hacienda">Haciendas</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/hacienda/labor">Labores</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/hacienda/empleado">Empleados</NavDropdown.Item>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item as={Link} to="/hacienda/lote">Lotes</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/hacienda/lote/seccion/labor">
                                        Lotes - Labor
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item disabled>Transaccion</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/hacienda/avances/labor/empleado">
                                        Avances - Labor
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item as={Link} to="/hacienda/mapa">Mapa</NavDropdown.Item>
                                    <NavDropdown.Item>Separated link</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Bodega" id="">
                                    <NavDropdown.Item disabled>Mantenimientos</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/bodega">Bodegas</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/bodega/grupo">Grupos</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/bodega/material">Materiales</NavDropdown.Item>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item disabled>Transaccion</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/bodega/egreso-material">
                                        Egreso Bodega
                                    </NavDropdown.Item>
                                </NavDropdown>
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
