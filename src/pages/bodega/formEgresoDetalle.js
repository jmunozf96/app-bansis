import React, {useEffect, useState} from "react";
import {Badge, Button, ButtonGroup, Col} from "react-bootstrap";
import SimpleTableUI from "../../components/TableUI";
import {TableCell, TableRow} from "@material-ui/core";

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

import {API_LINK, focuselement} from "../../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import AlertDialog from "../../components/AlertDialog/AlertDialog";
import {progressActions} from "../../actions/progressActions";

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
            const nuevosItems = detalleEgreso.filter((item) => material.shortid !== item.shortid);
            setDetalleEgreso(nuevosItems);

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
                        }
                        setNotificacion({
                            open: true,
                            message
                        });
                        console.log(response);
                    } catch (e) {
                        console.error(e);
                    }
                })();
            }
        }
        setOpenModal(false);
        progressbarStatus(false);
    };

    return (
        <>
            <Col md={12}>
                <SimpleTableUI
                    columns={['...', 'Material', 'Movimiento', 'Cantidad', 'Stock', 'Fech.Salida', 'Accion']}
                >
                    {detalleEgreso.length > 0 &&
                    detalleEgreso.map((material, index) => (
                        <TableRow key={index} hover={true} className="table-sm table-responsive-sm">
                            <TableCell align={"center"}>
                                {material.id && !material.edit ? <i className="fas fa-cloud-upload-alt"/> :
                                    <i className="fas fa-spinner fa-spin"/>}
                            </TableCell>
                            <TableCell>{material.descripcion}</TableCell>
                            <TableCell align={"center"}>
                                <Badge variant="warning">
                                    {material.movimiento}
                                </Badge>
                            </TableCell>
                            <TableCell align={"center"}>
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
                            </TableCell>
                            <TableCell align={"center"}>{material.stock}</TableCell>
                            <TableCell align={"center"}>{material.time}</TableCell>
                            <TableCell align={"center"}>
                                <ButtonGroup>
                                    {edit && itemEdit.shortid === material.shortid ?
                                        <Button variant="success" size="sm" onClick={(e) => onClickSave(e)}>
                                            <SaveIcon/>
                                        </Button> :
                                        <Button variant="primary" size="sm"
                                                onClick={() => onClickEdit(material)}>
                                            <EditIcon/>
                                        </Button>
                                    }
                                    <Button variant="danger" size="sm" onClick={() => deleteMaterial(material)}>
                                        <DeleteIcon/>
                                    </Button>
                                </ButtonGroup>
                            </TableCell>
                        </TableRow>
                    ))
                    }
                </SimpleTableUI>
                <AlertDialog
                    title={dataModal.title}
                    content={dataModal.content}
                    open={openModal}
                    setOpen={setOpenModal}
                    actionDestroy={destroyData}
                    id={dataModal.material}
                />
            </Col>
        </>
    );
}
