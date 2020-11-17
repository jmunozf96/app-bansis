import React, {useEffect} from "react";
//import Spinner from "../../../components/Tools/Spinner";

import {Col, Container, Row} from "react-bootstrap";
import FormLogin from "./FormLogin";
import {useDispatch} from "react-redux";
import {stateLoading} from "../../../reducers/seguridad/loginDucks";
import {uploadProgressBar} from "../../../reducers/progressDucks";

export default function Login() {
    const dispatch = useDispatch();

    useEffect(() => {
        //dispatch(setError(false, ''));
        dispatch(uploadProgressBar(0));
        dispatch(stateLoading(false));
    }, [dispatch]);


    return (
        <Container fluid style={{marginTop: "6.5rem"}}>
            <Row className="d-flex justify-content-center mb-2">
                <div className="col-12 text-center mb-3">
                    <i className="fas fa-user-circle fa-6x"/>
                </div>
                <Col className="" xs={11} sm={12} md={12} lg={3}>
                    <FormLogin/>
                </Col>
            </Row>
        </Container>
    );
}
