import React from "react";
import {Form} from "react-bootstrap";

export default function TextAreaForm(props) {
    const {control, setData, getData} = props;
    return (
        <>
            <Form.Group>
                <Form.Label>{control.label}</Form.Label>
                <Form.Control
                    style={{textTransform: 'uppercase'}}
                    as={control.type}
                    name={control.name}
                    placeholder={control.placeholder}
                    defaultValue={control.value}
                    onChange={(e) => setData({...getData, [e.target.name]: e.target.value})}
                    disabled={control.disabled}
                    rows={control.rows}
                />
            </Form.Group>
        </>
    );
}