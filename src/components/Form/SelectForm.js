import React from "react";
import {Col, Form} from "react-bootstrap";

export default function SelectForm(props) {
    const {control, setData, getData} = props;
    const {loading, result} = control.dataSelect;
    if (loading) {
        return (<Col className="p-0">
            Cargando Datos...
        </Col>);
    } else {
        const {dataArray} = result;
        return (
            <>
                <Form.Group>
                    <Form.Label>{control.label}</Form.Label>
                    <Form.Control
                        as="select"
                        name={control.name}
                        value={control.value}
                        onChange={(e) => setData({...getData, [e.target.name]: e.target.value})}
                        required
                    >
                        <option hidden value="">SELECCIONE UNA OPCION...</option>
                        {dataArray && dataArray.map((data) => (
                            <option key={data.id} value={data.id}>
                                {data.hasOwnProperty('detalle') && data.detalle}
                                {data.hasOwnProperty('descripcion') && data.descripcion}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
            </>
        );


    }
}