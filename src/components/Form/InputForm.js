import React from "react";
import {Form} from "react-bootstrap";

export default function InputForm(props) {
    const {control, setData, getData} = props;
    return (
        <>
            <Form.Group>
                <Form.Label>{control.label}</Form.Label>
                <Form.Control
                    style={{textTransform: 'uppercase'}}
                    type={control.type}
                    name={control.name}
                    autoComplete="off"
                    placeholder={control.placeholder}
                    defaultValue={control.value}
                    onChange={(e) => setData({...getData, [e.target.name]: e.target.value})}
                    required
                    disabled={control.disabled}
                />
            </Form.Group>
        </>
    );
}