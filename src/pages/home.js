import React from "react";
import Menu from "../components/Menu"
import LinearProgress from "@material-ui/core/LinearProgress";
import {Container} from "react-bootstrap";

export default function Home() {
    return (
        <>
            <LinearProgress color="secondary"/>
            <Container fluid><Menu/>
            </Container>
        </>);
}
