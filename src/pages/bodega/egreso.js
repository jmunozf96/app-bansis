import React, {useState} from "react";
import {Button, ButtonGroup, Col, Container, Row} from "react-bootstrap";
import TemporaryDrawer from "../../components/TemporaryDrawer";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DatePicker from "../../components/DatePicker";


export default function Egreso() {
    //const [egresos, setEgresos] = useState([]);
    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

    const [openDrawer, setOpenDrawer] = useState(false);
    return (
        <Container fluid className="mb-4">
            <Row>
                <Col className="mt-3 mb-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" to="/">
                            Bodega
                        </Link>
                        <Typography color="textPrimary">Egresos de bodega</Typography>
                    </Breadcrumbs>
                </Col>
            </Row>
            <Row>
                <Col className="col-12">
                    <ButtonGroup>
                        <Button onClick={() => setOpenDrawer(true)} size="">
                            <i className="fas fa-search"/> Buscar por periodo
                        </Button>
                        <Button
                            variant="success"
                            className="align-self-end"
                            type="button"
                        >
                            <AddCircleIcon/> Registrar nuevo despacho
                        </Button>
                    </ButtonGroup>
                    <TemporaryDrawer
                        openDrawer={openDrawer}
                        setOpenDrawer={setOpenDrawer}
                    />
                </Col>
            </Row>
            <hr/>
            <DatePicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />
        </Container>
    );
}
