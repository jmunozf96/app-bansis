import React from "react";
import {Col} from "react-bootstrap";
import SimpleTableUI from "../../components/TableUI";

export default function EgresoDetalle() {
    return (
        <Col md={12}>
            <SimpleTableUI
                columns={['Material', 'Cantidad', 'Stock', 'Accion']}
            >

            </SimpleTableUI>
        </Col>
    );
}
