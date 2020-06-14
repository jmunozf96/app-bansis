import React from "react";
import Spinner from "../components/Spinner";

import {Col, Container, Row} from "react-bootstrap";
import FormLogin from "../components/FormLogin";

export default function Login() {

    return (
        <Container fluid style={{marginTop: "5.5rem"}}>
            <Spinner/>
            <Row className="justify-content-center">
                <Col className="" xs={11} sm={8} md={6} lg={3}>
                    <FormLogin/>
                </Col>
            </Row>
        </Container>
    );
}