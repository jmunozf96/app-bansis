import React, {useEffect, useState} from "react";
import {Button, Card, Col, Form, FormGroup, Row} from "react-bootstrap";
import {API_LINK} from "../../utils/constants";
import CustomSelect from "../../components/CustomSelect";
import InputSearch from "../../components/InputSearch/InputSearch";
import {FormHelperText} from "@material-ui/core";

import moment from "moment";
import 'moment/locale/es';
import {v4 as uuidv4} from 'uuid';

export default function EgresoCabecera(props) {
    const {cabeceraEgreso, setCabeceraEgreso, children} = props;
    const [searchEmpleado, setSearchEmpleado] = useState('');
    const [searchMaterial, setSearchMaterial] = useState('');

    const api_haciendas = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const api_bodegas = `${API_LINK}/bansis-app/index.php/bodegas-select`;
    const api_bodegas_grupos = `${API_LINK}/bansis-app/index.php/bodegas-grupos-select`;
    const api_labores = `${API_LINK}/bansis-app/index.php/labores-select`;

    const [api_empleados, setApiEmpleados] = useState(`${API_LINK}/bansis-app/index.php/search/empleados`);
    const [api_materiales, setApiMateriales] = useState(`${API_LINK}/bansis-app/index.php/search/materiales`);
    const [changeURL, setChangeURL] = useState(false);

    const [item, setItem] = useState(null);
    const [cantidad, setCantidad] = useState(0);

    useEffect(() => {
        if (changeURL) {
            setApiEmpleados(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}&hacienda=${cabeceraEgreso.hacienda}&labor=${cabeceraEgreso.labor}`);
            setApiMateriales(`${API_LINK}/bansis-app/index.php/search/materiales?params=${searchMaterial}&hacienda=${cabeceraEgreso.hacienda}&bodega=${cabeceraEgreso.bodega}&grupo=${cabeceraEgreso.grupo}`);
            setChangeURL(false);
        }
    }, [changeURL, setApiEmpleados, setApiMateriales, searchEmpleado, searchMaterial, cabeceraEgreso]);

    const onChange = (e) => {
        setCabeceraEgreso({
            ...cabeceraEgreso,
            [e.target.name]: e.target.value
        });
        setChangeURL(true);
    };

    const onChangeCantidadItem = (e) => {
        if (item) {
            if (e.target.value !== undefined && e.target.value > 0) {
                setCantidad(+e.target.value);
                setItem({
                    ...item,
                    cantidad: +e.target.value
                })
            } else {
                setCantidad(0);
            }
        } else {
            alert("Debe seleccionar un material");
        }
    };

    const onChangeValueEmpleadoSearch = (e, value) => {
        setCabeceraEgreso({
            ...cabeceraEgreso,
            empleado: value
        });
    };

    const onChangeValueMaterialSearch = (e, value) => {
        if (value) {
            const material = {
                shortid: uuidv4(),
                id: value.id,
                descripcion: value.descripcion,
                cantidad: 0,
                stock: value.stock,
                time: moment().format("DD/MM/YY H:m:s")
            };
            setItem(material);
        }
    };

    return (
        <Form onChange={onChange}>
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <label>Fecha</label>
                                <input className="form-control bg-white" name="fecha"
                                       defaultValue={cabeceraEgreso.fecha}
                                       readOnly/>
                            </FormGroup>
                        </Col>
                        <Col md={8}>
                            <FormGroup>
                                <label>Hacienda</label>
                                <CustomSelect
                                    name="hacienda"
                                    defaultValue={cabeceraEgreso.hacienda}
                                    placeholder="SELECCIONE UNA HACIENDA..."
                                    api_url={api_haciendas}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
                <Col md={4}>
                    <Row>
                        <Col md={12}>
                            <Card>
                                <Card.Header className="pb-3 pt-1 pl-3">
                                    <Row>
                                        <Col md={8} className="pb-0">
                                            <FormHelperText id="outlined-weight-helper-text">
                                                Seleccione una labor...
                                            </FormHelperText>
                                            <CustomSelect
                                                name="labor"
                                                defaultValue={cabeceraEgreso.labor}
                                                placeholder="SELECCIONE..."
                                                api_url={api_labores}
                                            />
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body className="p-3">
                                    <Row>
                                        <Col className="mb-0" md={12}>
                                            <InputSearch
                                                id="asynchronous-empleado"
                                                label="Listado de empleados"
                                                api_url={api_empleados}
                                                setSearch={setSearchEmpleado}
                                                onChangeValue={onChangeValueEmpleadoSearch}
                                                disabled={false}
                                                value={cabeceraEgreso.empleado}
                                            />
                                            <FormHelperText id="outlined-weight-helper-text">
                                                Puede filtrar los empleados por nombre o numero de cedula
                                            </FormHelperText>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <hr/>
                        </Col>
                        <Col md={12}>
                            <Card>
                                <Card.Header className="pb-3 pt-1 pl-3">
                                    <Row>
                                        <Col md={6} className="pb-0">
                                            <FormHelperText id="outlined-weight-helper-text">
                                                Bodega
                                            </FormHelperText>
                                            <CustomSelect
                                                name="bodega"
                                                defaultValue={cabeceraEgreso.bodega}
                                                placeholder="SELECCIONE..."
                                                api_url={api_bodegas}
                                            />
                                        </Col>
                                        <Col md={6} className="pb-0">
                                            <FormHelperText id="outlined-weight-helper-text">
                                                Grupo
                                            </FormHelperText>
                                            <CustomSelect
                                                name="grupo"
                                                defaultValue={cabeceraEgreso.grupo}
                                                placeholder="SELECCIONE..."
                                                api_url={api_bodegas_grupos}
                                            />
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body className="p-3">
                                    <Row className="pb-0 mb-0">
                                        <Col md={12}>
                                            <InputSearch
                                                id="asynchronous-empleado"
                                                label="Listado de Materiales"
                                                api_url={api_materiales}
                                                setSearch={setSearchMaterial}
                                                onChangeValue={onChangeValueMaterialSearch}
                                                disabled={false}
                                                value={item}
                                            />
                                            <FormHelperText id="outlined-weight-helper-text">
                                                Puede filtrar los empleados por nombre o numero de cedula
                                            </FormHelperText>
                                        </Col>
                                        <Col md={8}>
                                            <FormGroup className="mb-0 mt-1">
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    defaultValue={cantidad}
                                                    onChange={onChangeCantidadItem}
                                                    onFocus={(e) => e.target.select()}
                                                />
                                                <FormHelperText id="outlined-weight-helper-text">Ingrese la
                                                    cantidad....</FormHelperText>
                                            </FormGroup>
                                        </Col>
                                        <Col className="pl-0 pb-0">
                                            <Button type="button" className="mt-1">
                                                Agregar
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col md={8}>
                    <Row>
                        {children}
                    </Row>
                </Col>
            </Row>
        </Form>
    );
}
