import React from "react";
import Menu from "../components/Tools/Menu"
//import LinearProgress from "@material-ui/core/LinearProgress";
import {Container} from "react-bootstrap";

export default function Home() {
    return (
        <div className="mt-5">
            {/*<LinearProgress color="secondary"/>*/}
            <Container fluid>
                <Menu/>
            </Container>
        </div>
    );
}
