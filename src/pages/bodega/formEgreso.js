import React, {useState} from "react";
import {Card, Container} from "react-bootstrap";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import moment from "moment";
import 'moment/locale/es';

import EgresoCabecera from "./formEgresoCabecera";
import EgresoDetalle from "./formEgresoDetalle";

export default function FormEgreso() {
    const [cabeceraEgreso, setCabeceraEgreso] = useState({
        fecha: moment().format("DD/MM/YYYY"),
        hacienda: "",
        labor: "",
        bodega: "",
        grupo: "",
        empleado: null
    });

    return (
        <Container className="mt-3" fluid>
            <Card>
                <Card.Header>
                    <ExitToAppIcon/> Formulario de Egreso de Bodega
                </Card.Header>
                <Card.Body>
                    <EgresoCabecera
                        cabeceraEgreso={cabeceraEgreso}
                        setCabeceraEgreso={setCabeceraEgreso}
                    >
                        <EgresoDetalle/>
                    </EgresoCabecera>
                </Card.Body>
                <Card.Footer>

                </Card.Footer>
            </Card>
        </Container>
    );
}
