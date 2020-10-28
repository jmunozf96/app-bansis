import React from "react";
import Spinner from "../../../components/Tools/Spinner";

import {Col, Container, Row} from "react-bootstrap";
import FormLogin from "./FormLogin";

export default function Login() {

    return (
        <Container fluid style={{marginTop: "6.5rem"}}>
            <Spinner/>
            <Row className="justify-content-center mb-2">
                <Col className="" xs={11} sm={12} md={12} lg={3}>
                    <FormLogin/>
                </Col>
            </Row>
        </Container>
    );
}
