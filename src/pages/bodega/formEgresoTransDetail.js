import React, {useState} from "react";
import {Badge, Button, Col} from "react-bootstrap";
import {FormHelperText} from "@material-ui/core";

import moment from "moment";
import 'moment/locale/es';
//import qs from 'qs';

export default function EgresoTransDetail(props) {
    const {data: {id, tot_egreso, material}, hacienda, recibe, solicita} = props;
    const [dataTransfer, setDataTransfer] = useState({
        hacienda: hacienda,
        emp_recibe: recibe,
        emp_solicitado: solicita,
        id_inventario_tomado: id,
        tot_egreso,
        cantidad: 0,
        time: moment().format("DD/MM/YYYY")
    });

    const onChangeCantidad = (e) => {
        const cantidad = e.target.value;
        if (cantidad !== undefined && cantidad > 0 && cantidad !== '') {
            if (parseInt(cantidad) <= parseInt(tot_egreso)) {
                setDataTransfer({
                    ...dataTransfer,
                    cantidad
                });
                return;
            } else {
                alert("No se puede exceder del saldo.");
                document.getElementById(`'id-cantidad-inv'${id}`).value = '';
            }
        }
        setDataTransfer({
            ...dataTransfer,
            cantidad: 0
        });
    };

    const onclickTransfer = () => {
        console.log(dataTransfer);
    };

    return (
        <>
            <Col md={5} className="m-0 mb-2">
                <input
                    className="form-control bg-white"
                    defaultValue={material.descripcion}
                    disabled
                />
                <FormHelperText id="outlined-weight-helper-text">
                    Material
                </FormHelperText>
            </Col>
            <Col md={2} className="m-0 mb-2 col-6">
                <input
                    name="tot_egreso"
                    className="form-control text-center"
                    defaultValue={dataTransfer.tot_egreso}
                    disabled
                />
                <FormHelperText id="outlined-weight-helper-text">
                    Saldo
                </FormHelperText>
            </Col>
            <Col md={3} className="m-0 mb-2 col-6">
                <input
                    id={`'id-cantidad-inv'${id}`}
                    name="cantidad"
                    className="form-control text-center bg-white"
                    type="number"
                    onChange={onChangeCantidad}
                />
                <FormHelperText id="outlined-weight-helper-text">
                    Cantidad a transferir
                </FormHelperText>
            </Col>
            <Col md={2} className="m-0 mb-2 col-12">
                <Button
                    variant="danger"
                    onClick={() => onclickTransfer()}
                >
                    <i className="fas fa-exchange-alt"/> Transferir <Badge
                    variant="light">{dataTransfer.cantidad}</Badge>
                </Button>
            </Col>
        </>
    );
}
