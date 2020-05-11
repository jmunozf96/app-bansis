import React, {useEffect, useState} from "react";
import {Badge, Button, Col} from "react-bootstrap";
import {FormHelperText} from "@material-ui/core";

import moment from "moment";
import 'moment/locale/es';
import qs from 'qs';
import {_configStoreApi, _saveApi, API_LINK} from "../../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../actions/progressActions";

export default function EgresoTransDetail(props) {
    const {data: {id, tot_egreso, material}, hacienda, recibe, solicita, setSearchTransaccionSemana, setNotificacion} = props;
    const [dataTransfer, setDataTransfer] = useState({
        hacienda: hacienda,
        emp_recibe: recibe,
        emp_solicitado: solicita,
        id_inventario_tomado: id,
        tot_egreso,
        cantidad: 0,
        time: moment().format("DD/MM/YYYY")
    });

    const [reload, setReload] = useState(false);

    useEffect(() => {
        if (reload) {
            setReload(true);
        }
    }, [reload]);

    const dispatch = useDispatch();
    const progressbarStatus = (state) => dispatch(progressActions(state));
    const authentication = useSelector(state => state.auth._token);

    const onChangeCantidad = (e) => {
        const cantidad = parseInt(e.target.value);
        if (cantidad !== undefined && cantidad > 0 && cantidad !== '') {
            if (parseInt(cantidad) <= parseInt(dataTransfer.tot_egreso)) {
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
        (async () => {
            const datos = qs.stringify({json: JSON.stringify(dataTransfer)});
            const url = `${API_LINK}/bansis-app/index.php/egreso-bodega/saldos/transfer`;
            const configuracion = _configStoreApi('POST', url, datos, progressbarStatus, authentication);
            const request = await _saveApi(configuracion);
            const {code, message} = request;
            if (code === 200) {
                setNotificacion({
                    open: true,
                    message
                });
                setSearchTransaccionSemana(true);
            }
        })();

        setDataTransfer({
            ...dataTransfer,
            tot_egreso: (dataTransfer.tot_egreso - dataTransfer.cantidad),
            cantidad: 0
        });

        document.getElementById(`'id-cantidad-inv'${id}`).value = '';
        setReload(true);
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
                    value={dataTransfer.tot_egreso}
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
