import React, {useEffect, useState} from "react";
import {Button, Col, Form, FormGroup, Row} from "react-bootstrap";
import {API_LINK, focuselement} from "../../../../utils/constants";
import CustomSelect from "../../../../components/CustomSelect";
import InputSearch from "../../../../components/InputSearch/InputSearch";
import {FormHelperText} from "@material-ui/core";

import moment from "moment";
import 'moment/locale/es';
import {v4 as uuidv4} from 'uuid';
import {progressActions} from "../../../../actions/progressActions";
import {useDispatch, useSelector} from "react-redux";

export default function EgresoCabecera(props) {
    const {
        cabeceraEgreso,
        setCabeceraEgreso,
        detalleEgreso,
        setDetalleEgreso,
        setReload,
        disabledElements,
        setDisabledElements,
        searchEmpleado,
        setSearchEmpleado,
        searchMaterial,
        setSearchMaterial,
        changeURL,
        setChangeURL,
        searchTransaccionSemana,
        setSearchTransaccionSemana,
        item,
        setItem,
        stock,
        setStock,
        children
    } = props;

    const api_haciendas = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const api_bodegas = `${API_LINK}/bansis-app/index.php/bodegas-select`;
    const api_bodegas_grupos = `${API_LINK}/bansis-app/index.php/bodegas-grupos-select`;

    const [api_empleados, setApiEmpleados] = useState(`${API_LINK}/bansis-app/index.php/search/empleados${cabeceraEgreso.hacienda !== "" ? "?hacienda=" + cabeceraEgreso.hacienda : ''}`);
    const [api_materiales, setApiMateriales] = useState(`${API_LINK}/bansis-app/index.php/search/materiales`);

    const [cantidad, setCantidad] = useState(0);

    const dispatch = useDispatch();
    //const progressbarStatus = (state) => dispatch(progressActions(state));
    const credential = useSelector((state) => state.credential.credential);

    useEffect(() => {
        if (changeURL) {
            setApiEmpleados(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}&hacienda=${cabeceraEgreso.hacienda}`);
            setApiMateriales(`${API_LINK}/bansis-app/index.php/search/materiales?params=${searchMaterial}&bodega=${cabeceraEgreso.bodega}&grupo=${cabeceraEgreso.grupo}`);
            setChangeURL(false);
        }
    }, [changeURL, setApiEmpleados, setApiMateriales, searchEmpleado, searchMaterial, cabeceraEgreso, setChangeURL]);

    useEffect(() => {
        if (searchTransaccionSemana) {
            const progressbarStatus = (state) => dispatch(progressActions(state));
            progressbarStatus(false);
            const detalles = [];
            (async () => {
                let url = `${API_LINK}/bansis-app/index.php/search-egreso?empleado=${cabeceraEgreso.empleado.id}&fecha=${cabeceraEgreso.fecha}`;

                const request = await fetch(url).then(
                    (response) => response.json(),
                    (error) => error.response
                );
                if (Object.entries(request).length > 0) {
                    const {fecha, egreso_detalle} = request;
                    setCabeceraEgreso({
                        ...cabeceraEgreso,
                        fecha: moment(fecha).format("DD/MM/YYYY")
                    });
                    egreso_detalle.map((egreso, index) => {
                        let material = {
                            id: egreso.id,
                            shortid: uuidv4(),
                            idmaterial: egreso.materialdetalle.id,
                            descripcion: egreso.materialdetalle.descripcion,
                            movimiento: egreso.movimiento,
                            cantidad: parseInt(egreso.cantidad),
                            stock: parseFloat(egreso.materialdetalle.stock),
                            time: moment(egreso.fecha_salida).format('DD/MM/YYYY'),
                            edit: false,
                            transferencia: egreso.movimiento !== 'EGRE-ART'
                        };
                        return detalles.push(material);
                    });
                    await setDisabledElements({...disabledElements, btnsave: false});
                }
                await progressbarStatus(false);
            })();
            setDetalleEgreso(detalles);
            setSearchTransaccionSemana(false);
        }
    }, [
        searchTransaccionSemana,
        setSearchTransaccionSemana,
        cabeceraEgreso,
        setCabeceraEgreso,
        setDetalleEgreso,
        dispatch,
        setDisabledElements,
        disabledElements,
    ]);

    const onChange = (e) => {
        setCabeceraEgreso({
            ...cabeceraEgreso,
            [e.target.name]: e.target.value
        });

        //Habilitar componentes segun cambio
        switch (e.target.name) {
            case 'hacienda':
                setDisabledElements({
                    ...disabledElements,
                    change: true,
                    bodega: false,
                    empleado: false,
                    hacienda: true
                });
                break;
            case 'labor':
                setDisabledElements({...disabledElements, change: true, empleado: false});
                break;
            case 'bodega':
                setDisabledElements({...disabledElements, change: true, grupo: false});
                break;
            case 'grupo':
                setDisabledElements({...disabledElements, change: true, material: false, btnnuevo: false});
                break;
            default:
                setDisabledElements({...disabledElements, change: true})
        }

        setChangeURL(true);
        //setItem(null);
        //document.getElementById('id-cantidad').value = 0;
    };

    const onChangeCantidadItem = (e) => {
        if (item) {
            if (e.target.value !== undefined || e.target.value > 0 || e.target.value !== '') {
                setCantidad(+e.target.value);
            }

            setStock(item.stock - +e.target.value);

            if (+e.target.value > item.stock) {
                setStock(parseInt(item.stock));
                setCantidad(0);
                document.getElementById('id-cantidad').value = 0;
                alert("La cantidad sobrepasa el stock");
            }

            setItem({
                ...item,
                cantidad: +e.target.value
            });
        }
    };

    const onChangeValueEmpleadoSearch = (e, value) => {
        setCabeceraEgreso({
            ...cabeceraEgreso,
            empleado: value
        });
        if (value) {
            setDisabledElements({...disabledElements, change: true, bodega: false, transfer: false});
            setSearchTransaccionSemana(true);

            if (item) {
                document.getElementById('id-cantidad').value = 0;
                focuselement('id-cantidad');
            }

        } else {
            setDisabledElements({...disabledElements, change: true, transfer: true});
            setDetalleEgreso([]);
        }
        setSearchEmpleado('');
        setChangeURL(true);
    };

    const existsMaterial = (material) => {
        if (material)
            return detalleEgreso.filter((item) =>
                material.idmaterial === item.idmaterial && material.time === item.time);

        return [];
    };

    const editCantidadMaterial = (material) => {
        if (material.cantidad > 0) {
            detalleEgreso.map((data) => {
                if (data.idmaterial === material.idmaterial && data.time === material.time) {
                    if (material.cantidad <= data.stock) {
                        data.stock -= material.cantidad;
                        data.cantidad += material.cantidad;
                        if (data.hasOwnProperty('id')) {
                            data.edit = true;
                        }
                        return true;
                    }
                }

                return false;
            });
        }
    };

    const onChangeValueMaterialSearch = (e, value) => {
        if (value) {
            let material = {
                shortid: uuidv4(),
                idmaterial: value.id,
                descripcion: value.descripcion,
                movimiento: 'EGRE-ART',
                cantidad: 0,
                stock: parseFloat(value.stock),
                time: moment().format("DD/MM/YYYY")
            };

            setItem(material);
            setDisabledElements({...disabledElements, change: true, cantidad: false});
            focuselement('id-cantidad');
            setStock(parseInt(value.stock));
        } else {
            setDisabledElements({...disabledElements, change: true, cantidad: true});
            setItem(null);
            setStock(0);
            document.getElementById('id-cantidad').value = 0;
        }
        setSearchMaterial('');
        setChangeURL(true);
    };

    const onSubmitInputItemAdd = (e) => {
        e.preventDefault();
        const {bodega, grupo, empleado} = cabeceraEgreso;

        if (!empleado) {
            alert("Debe seleccionar un empleado");
            return;
        }

        if (bodega === "") {
            alert("Debe seleccionar una bodega");
            return;
        }

        if (grupo === "") {
            alert("Debe seleccionar un grupo");
            return;
        }

        if (!item) {
            alert("No se ha seleccionado un material");
            setCantidad(0);
            document.getElementById('id-cantidad').value = 0;
            return;
        }

        if (item.stock < item.cantidad) {
            alert("Excede el stock");
            return;
        }

        if (item.cantidad <= 0) {
            alert("Ingrese una cantidad mayor a 0");
            return;
        }


        if (existsMaterial(item).length > 0) {
            editCantidadMaterial(item);
            setReload(true);
        } else {
            item.stock = item.stock - item.cantidad;
            setDetalleEgreso([
                ...detalleEgreso,
                item
            ]);
        }

        //setStock(item.stock - cantidad);
        setItem({...item, cantidad: 0, stock});
        setCantidad(0);

        setDisabledElements({...disabledElements, change: true, btnsave: false});
        document.getElementById('id-cantidad').value = '';
    };

    return (
        <Row>
            <Col md={12}>
                <Row>
                    <Col md={12}>
                        <Form onChange={onChange}>
                            <Row>
                                <Col md={2} className="">
                                    <FormGroup>
                                        <FormHelperText id="outlined-weight-helper-text">
                                            Fecha
                                        </FormHelperText>
                                        <input className="form-control bg-white" name="fecha"
                                               value={cabeceraEgreso.fecha}
                                               readOnly/>
                                    </FormGroup>
                                </Col>
                                <Col md={4} className="">
                                    <FormGroup>
                                        <FormHelperText id="outlined-weight-helper-text">
                                            Hacienda
                                        </FormHelperText>
                                        <CustomSelect
                                            name="hacienda"
                                            defaultValue={cabeceraEgreso.hacienda}
                                            placeholder="SELECCIONE UNA HACIENDA..."
                                            api_url={api_haciendas}
                                            disabled={disabledElements.hacienda}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3} className="pb-0">
                                    <FormHelperText id="outlined-weight-helper-text">
                                        Bodega
                                    </FormHelperText>
                                    <CustomSelect
                                        name="bodega"
                                        defaultValue={cabeceraEgreso.bodega}
                                        placeholder="SELECCIONE..."
                                        api_url={api_bodegas}
                                        disabled={disabledElements.bodega}
                                    />
                                </Col>
                                <Col md={3} className="pb-0">
                                    <FormHelperText id="outlined-weight-helper-text">
                                        Grupo
                                    </FormHelperText>
                                    <CustomSelect
                                        name="grupo"
                                        defaultValue={cabeceraEgreso.grupo}
                                        placeholder="SELECCIONE..."
                                        api_url={api_bodegas_grupos}
                                        disabled={disabledElements.grupo}
                                    />
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <hr className="mt-0 pt-0"/>
            </Col>
            <Col md={12}>
                <Row>
                    <Col md={12}>
                        <Form onChange={onChange}>
                            <Row>
                                <Col className="mb-0" md={12}>
                                    <InputSearch
                                        id="asynchronous-empleado"
                                        label="Listado de empleados"
                                        api_url={api_empleados}
                                        setSearch={setSearchEmpleado}
                                        onChangeValue={onChangeValueEmpleadoSearch}
                                        disabled={disabledElements.empleado}
                                        value={cabeceraEgreso.empleado}
                                        setChangeURL={setChangeURL}
                                    />
                                    <FormHelperText id="outlined-weight-helper-text">
                                        Puede filtrar los empleados por nombre o numero de cedula
                                    </FormHelperText>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col md={12} className="mt-3">
                        <form id="id-input-add" onSubmit={onSubmitInputItemAdd}>
                            <Row className="pb-0 mb-0">
                                <Col md={7}>
                                    <InputSearch
                                        id="asynchronous-material"
                                        label="Listado de Materiales"
                                        api_url={api_materiales}
                                        setSearch={setSearchMaterial}
                                        onChangeValue={onChangeValueMaterialSearch}
                                        disabled={disabledElements.material}
                                        value={item}
                                        setChangeURL={setChangeURL}
                                    />
                                    <FormHelperText id="outlined-weight-helper-text">
                                        Puede filtrar los materiales por descripcion o codigo
                                    </FormHelperText>
                                </Col>
                                <Col md={2} className="">
                                    <FormGroup className="mb-0 mt-1 mr-0">
                                        <input
                                            className="form-control"
                                            type="number"
                                            id="id-cantidad"
                                            name="cantidad"
                                            defaultValue={cantidad}
                                            onChange={onChangeCantidadItem}
                                            onFocus={(e) => e.target.select()}
                                            disabled={disabledElements.cantidad}
                                        />
                                        <FormHelperText id="outlined-weight-helper-text">Ingrese la
                                            cantidad...</FormHelperText>
                                    </FormGroup>
                                </Col>
                                <Col md={2} className="">
                                    <FormGroup className="mb-0 mt-1 mr-0">
                                        <input
                                            className="form-control bg-white"
                                            type="number"
                                            id="id-stock"
                                            name="stock"
                                            value={stock}
                                            disabled={true}
                                        />
                                        <FormHelperText id="outlined-weight-helper-text">
                                            Stock
                                        </FormHelperText>
                                    </FormGroup>
                                </Col>
                                <Col className="pb-0">
                                    <Button type="submit" className="mt-1" variant="primary">
                                        <i className="fas fa-plus-circle"/>
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    </Col>
                </Row>
            </Col>
            <Col md={12}>
                <Row>
                    {children}
                </Row>
            </Col>
        </Row>
    );
}
