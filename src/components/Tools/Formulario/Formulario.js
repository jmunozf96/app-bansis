import React from "react";
import {Button, ButtonGroup, Col, Container, Row} from "react-bootstrap";
import SnackbarComponent from "../Snackbar/Snackbar";
import Card from "../Card/Card";
import AssignmentReturnIcon from "@material-ui/icons/AssignmentReturn";
import SaveIcon from "@material-ui/icons/Save";
import CreateIcon from '@material-ui/icons/Create';
import {Link} from "react-router-dom";

export default function Formulario(props) {
    const {title, notificacion, setNotificacion, children, onClicksubmit, onNuevo, routeReturn} = props;
    return (
        <Container fluid className="mb-5" style={{marginTop: "4rem"}}>
            <Row className="mt-3">
                <SnackbarComponent
                    notificacion={notificacion}
                    setNotificacion={setNotificacion}
                />
                <Col md={12}>
                    <Card title={title}>
                        <form onSubmit={onClicksubmit}>
                            {children}
                            <hr/>
                            <ButtonGroup className="justify-content-end">
                                <Button
                                    variant="primary"
                                    onClick={() => onNuevo()}
                                    type="button"
                                >
                                    <CreateIcon/> Nuevo
                                </Button>
                                <Button
                                    className=""
                                    variant="success"
                                    type="submit"
                                >
                                    <SaveIcon/> Guardar
                                </Button>
                                <Button as={Link} to={routeReturn} variant="danger">
                                    <AssignmentReturnIcon/> Cancelar
                                </Button>
                            </ButtonGroup>
                        </form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
