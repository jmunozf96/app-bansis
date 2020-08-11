import React, {useCallback, useEffect, useState} from "react";
import {Button, ButtonGroup, Col} from "react-bootstrap";

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import VisibilityIcon from '@material-ui/icons/Visibility';
import BlockIcon from '@material-ui/icons/Block';

import {API_LINK, focuselement} from "../../../../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import AlertDialog from "../../../../components/AlertDialog/AlertDialog";
import {progressActions} from "../../../../actions/progressActions";
import FormDialog from "../../../../components/FormDialog";
import EgresoShowTransferencia from "./formEgresoShowTransferencia";

const style = {
    table: {
        tableCenter: {
            verticalAlign: "middle"
        }
    }
};

export default function EgresoDetalle(props) {
    const {detalleEgreso, setDetalleEgreso, reload, setReload, setNotificacion, setSearchTransaccionSemana} = props;
    const [edit, setEdit] = useState(false);
    const [itemEdit, setItemEdit] = useState(null);
    const [dataModal, setDataModal] = useState({
        title: '',
        content: '',
        material: null
    });
    const [openModal, setOpenModal] = useState(false);

    const [showDetailTransferencia, setShowDetailTransferencia] = useState({
        transfer: null
    });
    const [openModalDetailTransferencia, setOpenModalDetailTransferencia] = useState(false);

    const dispatch = useDispatch();
    const progressbarStatus = (state) => dispatch(progressActions(state));
    const authentication = useSelector(state => state.auth._token);

    useEffect(() => {
        if (reload) {
            setReload(false);
        }
    }, [reload, setReload]);

    const onClickEdit = (material) => {
        setEdit(true);
        setItemEdit({
            id: material.id,
            shortid: material.shortid
        });
        focuselement('id-edit-cantidad');
    };

    const onClickSave = (e) => {
        onEditMaterial(e);
    };

    const onEditMaterial = (e) => {
        setEdit(false);
        //Editar el material
        let cantidad = e.target.value;
        if (itemEdit) {
            if (cantidad > 0) {
                detalleEgreso.map((data) => {
                    if (data.shortid === itemEdit.shortid) {
                        if (data.cantidad !== +cantidad) {
                            if (cantidad <= (data.stock + data.cantidad)) {
                                data.stock = (+data.stock + +data.cantidad) - +cantidad;
                                data.cantidad = +cantidad;
                                if (data.hasOwnProperty('id')) {
                                    data.edit = true;
                                }
                                return true;
                            }
                        }
                    }
                    return false;
                });
            }
        }
        setItemEdit(null);
    };

    const deleteMaterial = material => {
        setOpenModal(true);
        progressbarStatus(true);
        setDataModal({
            title: 'Movimiento con fecha: ' + material.time,
            content: 'Esta seguro de eliminar este despacho de ' + material.cantidad + ' ' + material.descripcion,
            material: material
        });
        //destroyData(material);
    };

    const destroyData = (material) => {
        if (material) {
            if (!material.hasOwnProperty('id')) {
                const nuevosItems = detalleEgreso.filter((item) => material.shortid !== item.shortid);
                setDetalleEgreso(nuevosItems);
            }

            //Eliminar registro de la base de datos.
            if (material.hasOwnProperty('id')) {
                (async () => {
                    try {
                        const url = `${API_LINK}/bansis-app/index.php/egreso-bodega/${material.id}`;
                        const response = await fetch(url, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': authentication
                            }
                        }).then(
                            (response) => response.json()
                        );
                        const {code, message} = response;

                        if (code === 200) {
                            setSearchTransaccionSemana(true);
                            const nuevosItems = detalleEgreso.filter((item) => material.shortid !== item.shortid);
                            setDetalleEgreso(nuevosItems);
                        }
                        setNotificacion({
                            open: true,
                            message
                        });
                    } catch (e) {
                        console.error(e);
                    }
                })();
            }
        }
        setOpenModal(false);
        progressbarStatus(false);
    };

    const showTransferencia = (id) => {
        (async () => {
            const url = `${API_LINK}/bansis-app/index.php/show-transaction?id=${id}`;
            const request = await fetch(url).then(
                (response) => response.json()
            );
            if (Object.entries(request).length > 0) {
                setShowDetailTransferencia({
                    id: request.id,
                    transfer: request.debito_transfer ? request.debito_transfer : request.credito_transfer,
                    movimiento: request.movimiento,
                    debito: request.debito,
                    cantidad: request.cantidad
                });
                setOpenModalDetailTransferencia(true);
            }
        })()
    };

    const colorMovimiento = (movimiento) => {
        switch (movimiento) {
            case 'DEBIT-SAL':
                return 'danger';
            case 'CREDIT-SAL':
                return 'warning';
            default:
                return 'success';
        }
    };

    const totalDespachadoSemana = useCallback(() => {
        if (detalleEgreso.length > 0) {
            const contabilizar = detalleEgreso.filter(item => (item.hasOwnProperty('debito') && !item.debito) || item.movimiento === 'EGRE-ART');
            return contabilizar.reduce((total, item) => total + +item.cantidad, 0);
        }
        return 0;
    }, [detalleEgreso]);

    return (
        <Col md={12} className="mt-2">
            <hr className="mt-n0 mb-2"/>
            <div className="row">
                <div className="col-12 mb-2">
                    <small>
                        <i className="fas fa-list"/> Listado de materiales despachados en la semana
                    </small>
                </div>
                <div className="col-12 table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="text-white bg-dark">
                        <tr className="text-center">
                            <th width="5%">...</th>
                            <th width="40%">Descripcion Material</th>
                            <th width="10%">Movimiento</th>
                            <th width="10%">Cantidad</th>
                            <th width="10%">Stock</th>
                            <th width="15%">Fech.Salida</th>
                            <th width="10%">Accion</th>
                        </tr>
                        </thead>
                        <tbody>
                        {detalleEgreso.length > 0 &&
                        detalleEgreso.map((material, index) => (
                            <tr key={index} className="table-sm">
                                <td width="5%" className="text-center"
                                    style={style.table.tableCenter}>{material.id && !material.edit ?
                                    <i className="fas fa-cloud-upload-alt"/> :
                                    <i className="fas fa-spinner fa-spin"/>}</td>
                                <td width="40%" style={style.table.tableCenter}>{material.descripcion}</td>
                                <td width="10%" className="text-center" style={style.table.tableCenter}>
                                    <span
                                        className={`badge badge-${colorMovimiento(material.movimiento)}`}>
                                        {material.movimiento}
                                    </span>
                                </td>
                                <td width="10%" className="text-center" style={style.table.tableCenter}>
                                    {edit && itemEdit.shortid === material.shortid ? (
                                        <input
                                            type="number"
                                            className="form-control text-center"
                                            id="id-edit-cantidad"
                                            defaultValue={material.cantidad}
                                            onKeyDown={(e) => e.keyCode === 13 ? onEditMaterial(e) : null}
                                            onBlur={(e) => onEditMaterial(e)}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    ) : material.cantidad}
                                </td>
                                <td width="10%" className="text-center"
                                    style={style.table.tableCenter}>{material.stock}</td>
                                <td width="15%" className="text-center"
                                    style={style.table.tableCenter}>{material.time}</td>
                                <td width="10%" className="text-center" style={style.table.tableCenter}>
                                    {(material.hasOwnProperty('transferencia') && material.transferencia) ?
                                        <ButtonGroup>
                                            <Button size="sm" variant="info"
                                                    onClick={() => showTransferencia(material.id)}>
                                                <VisibilityIcon/>
                                            </Button>
                                            <Button size="sm" variant="dark">
                                                <BlockIcon/>
                                            </Button>
                                        </ButtonGroup>
                                        :
                                        <ButtonGroup>
                                            {edit && itemEdit.shortid === material.shortid ?
                                                <Button variant="success" size="sm" onClick={(e) => onClickSave(e)}>
                                                    <SaveIcon/>
                                                </Button> :
                                                <Button variant="primary" size="sm"
                                                        disabled={(material.hasOwnProperty('transfer'))}
                                                        onClick={() => !material.hasOwnProperty('transfer') && onClickEdit(material)}>
                                                    <EditIcon/>
                                                </Button>
                                            }
                                            <Button variant="danger" size="sm" onClick={() => deleteMaterial(material)}>
                                                <DeleteIcon/>
                                            </Button>
                                        </ButtonGroup>
                                    }
                                </td>
                            </tr>
                        ))
                        }
                        <tr className="text-center">
                            <td colSpan={3}><b>TOTAL DESPACHADO EN LA SEMANA</b></td>
                            <td>{totalDespachadoSemana()}</td>
                            <td colSpan={3}/>
                        </tr>
                        </tbody>
                    </table>
                    <FormDialog
                        title="Detalle de transferencia de saldo:"
                        open={openModalDetailTransferencia}
                        setOpen={setOpenModalDetailTransferencia}
                    >
                        <EgresoShowTransferencia
                            data={showDetailTransferencia}
                            setOpen={setOpenModalDetailTransferencia}
                            setNotificacion={setNotificacion}
                            setSearchTransaccionSemana={setSearchTransaccionSemana}
                        />
                    </FormDialog>
                    <AlertDialog
                        title={dataModal.title}
                        content={dataModal.content}
                        open={openModal}
                        setOpen={setOpenModal}
                        actionDestroy={destroyData}
                        id={dataModal.material}
                    />
                </div>
            </div>
        </Col>
    );
}
