import React from "react";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import {APP_TITLE} from "../../constants/helpers";
import {Link} from "react-router-dom"

import {useDispatch, useSelector} from "react-redux";

import "./MenuNavbar.scss"
import LinearProgress from "@material-ui/core/LinearProgress";
import {clearAuthentication} from "../../reducers/seguridad/loginDucks";
import profileDefault from "../../assets/img/profile.png"

export default function MenuNavbar() {
    const dispatch = useDispatch();
    const authentication = useSelector((state) => state.login.auth);
    const credentialCard = useSelector((state) => state.login.credential);
    const recursos = useSelector((state) => state.login.recursos);

    const loadingProgress = useSelector(state => state.progressLoading);
    const progressbarStatus = useSelector((state) => state.progressbar.loading);


    const logoutSite = () => {
        dispatch(clearAuthentication());
    };

    return (
        <>
            <Navbar className="menu-top py-1" collapseOnSelect expand="lg" bg="dark" variant="dark" fixed={"top"}>
                <Navbar.Brand as={Link} to="/">
                    <i className="fas fa-seedling"/> {APP_TITLE}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    {authentication !== '' && credentialCard && recursos.length > 0 ? (
                        <>
                            <Nav className="mr-auto">
                                <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                                {recursos.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {item.recurso.recurso_hijo.length > 0 &&
                                        <NavDropdown
                                            title={item.recurso.nombre}
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
                                                        >
                                                            <i className="fas fa-caret-right"/> {hijo2.nombre}
                                                        </NavDropdown.Item>
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
                                {credentialCard &&
                                <NavDropdown title={credentialCard.nick} id="nav-dropdown" drop="left">
                                    <NavDropdown.Item
                                        eventKey="4.1"
                                        disabled>
                                        <img
                                            src={profileDefault}
                                            width="40" height="40"
                                            style={{textAlign: "center", marginLeft: -5, marginRight: 5}}
                                            className="rounded-circle" alt="profile"/>{" "}
                                        {credentialCard.nombres} {credentialCard.apellidos}
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item>
                                        <i className="fas fa-user-edit"/> Actualizar
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/login"
                                        onClick={logoutSite}>
                                        <i className="fas fa-sign-out-alt"/> Salir
                                    </NavDropdown.Item>
                                </NavDropdown>
                                }
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
            {(progressbarStatus) &&
            <LinearProgress color="secondary" style={{marginTop: "3rem", marginBottom: "-3rem"}}/>}
            {loadingProgress.loading &&
            <LinearProgress
                variant="determinate"
                color="secondary"
                style={{marginTop: "3rem", marginBottom: "-3rem", height: 4}}
                value={loadingProgress.progress}/>
            }
        </>
    );
}
