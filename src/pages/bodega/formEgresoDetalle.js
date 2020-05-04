import React, {useEffect, useState} from "react";
import {Badge, Button, ButtonGroup, Col} from "react-bootstrap";
import SimpleTableUI from "../../components/TableUI";
import {TableCell, TableRow} from "@material-ui/core";

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

import {focuselement} from "../../utils/constants";

export default function EgresoDetalle(props) {
    const {detalleEgreso, setDetalleEgreso, reload, setReload} = props;
    const [edit, setEdit] = useState(false);
    const [itemEdit, setItemEdit] = useState(null);

    useEffect(() => {
        if (reload) {
            setReload(false);
        }
    }, [reload, setReload]);

    const onClickEdit = (id) => {
        setEdit(true);
        setItemEdit(id);
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
                    if (data.idmaterial === itemEdit) {
                        if (cantidad <= (data.stock + data.cantidad)) {
                            data.stock = (+data.stock + +data.cantidad) - +cantidad;
                            data.cantidad = +cantidad;
                            return true;
                        }
                    }
                    return false;
                });
            }
        }
        setItemEdit(null);
    };

    const deleteMaterial = material => {
        if (material) {
            const nuevosItems = detalleEgreso.filter((item) => material.shortid !== item.shortid);
            setDetalleEgreso(nuevosItems);
        }
    };

    return (
        <>
            <Col md={12}>
                <SimpleTableUI
                    columns={['Material', 'Movimiento', 'Cantidad', 'Stock', 'Fech.Salida', 'Accion']}
                >
                    {detalleEgreso.length > 0 &&
                    detalleEgreso.map((material, index) => (
                        <TableRow key={index} hover={true} className="table-sm table-responsive-sm">
                            <TableCell>{material.descripcion}</TableCell>
                            <TableCell align={"center"}>
                                <Badge variant="warning">
                                    {material.movimiento}
                                </Badge>
                            </TableCell>
                            <TableCell align={"center"}>
                                {edit && itemEdit === material.idmaterial ? (
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
                                    {edit && itemEdit === material.idmaterial ?
                                        <Button variant="success" size="sm" onClick={(e) => onClickSave(e)}>
                                            <SaveIcon/>
                                        </Button> :
                                        <Button variant="primary" size="sm"
                                                onClick={() => onClickEdit(material.idmaterial)}>
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
            </Col>
        </>
    );
}
