import React from "react";
import {Card, Col, FormGroup, Row} from "react-bootstrap";
import MapaHacienda from "../../hacienda/Mapa";
import {API_LINK} from "../../../constants/helpers";
import InputSearch from "../../../components/Tools/InputSearch/InputSearch";

export default function FormularioRegistro(props) {
    const {lote, setLote, reload, setReload} = props;
    const api_haciendas = `${API_LINK}/bansis-app/index.php/haciendas-select`;

    const onChangeValueHaciendaSearch = (e, value) => {
        setLote({
            ...lote,
            hacienda: value
        });
    };

    const onChangeValue = (e) => {
        setLote({
            ...lote,
            [e.target.name]: e.target.value.toUpperCase()
        })
    };

    return (
        <Row>
            <Col md={12} className="">
                <FormGroup>
                    <InputSearch
                        id="asynchronous-hacienda"
                        label="Listado de Haciendas"
                        api_url={api_haciendas}
                        onChangeValue={onChangeValueHaciendaSearch}
                        value={lote.hacienda}
                    />
                </FormGroup>
            </Col>
            <Col md={12}>
                <form>
                    <hr className="mt-0 pt-0"/>
                    <Row>
                        <Col md={6}>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <label>Descripcion de Lote</label>
                                        <input
                                            autoComplete="off"
                                            className="form-control"
                                            value={lote.lote}
                                            name="lote"
                                            id="id-lote"
                                            onChange={onChangeValue}
                                            style={{textTransform: "uppercase"}}
                                            type="text"
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <label>Has. de Lote</label>
                                        <input
                                            autoComplete="off"
                                            className="form-control"
                                            value={lote.has}
                                            onChange={onChangeValue}
                                            name="has"
                                            type="text"
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <label>Descripcion</label>
                                <textarea
                                    autoComplete="off"
                                    className="form-control"
                                    value={lote.detalle}
                                    onChange={onChangeValue}
                                    maxLength={300}
                                    name="detalle"
                                    rows={3}
                                    style={{textTransform: "uppercase"}}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </form>
            </Col>
            <Col>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <label>Longitud - Coordenadas (X)</label>
                                    <input type="text" className="form-control bg-white" value={lote.longitud}
                                           disabled/>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label>Latitud - Coordenadas (Y)</label>
                                    <input type="text" className="form-control bg-white" value={lote.latitud} disabled/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="">
                            <Col className="p-0 m-0">
                                <MapaHacienda
                                    lote={lote}
                                    setLote={setLote}
                                    reload={reload}
                                    setReload={setReload}
                                />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}
