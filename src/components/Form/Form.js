import React from "react";
import {Col, Row} from "react-bootstrap";
import SelectForm from "./SelectForm";
import TextAreaForm from "./TextAreaForm";
import InputForm from "./InputForm";

export default function FormComponent(props) {
    const {arrayFormulario, getData, setData} = props;
    return (
        <Row>
            {arrayFormulario.map((control, i) => {
                switch (control.type) {
                    case 'select' :
                        return (
                            <Col md={control.size} key={i}>
                                <SelectForm
                                    dataSelect={control.dataSelect}
                                    setData={setData}
                                    getData={getData}
                                    control={control}
                                />
                            </Col>
                        );
                    case 'textarea':
                        return (
                            <Col md={control.size} key={i}>
                                <TextAreaForm
                                    setData={setData}
                                    getData={getData}
                                    control={control}
                                />
                            </Col>
                        )
                    default:
                        return (
                            <Col md={control.size} key={i}>
                                <InputForm
                                    setData={setData}
                                    getData={getData}
                                    control={control}
                                />
                            </Col>
                        );
                }
            })}
        </Row>
    );
}