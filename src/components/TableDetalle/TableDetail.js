import React from "react";
import UpdateIcon from "@material-ui/icons/Update";
import {Badge, Button, ButtonGroup} from "react-bootstrap";
import SyncIcon from "@material-ui/icons/Sync";
import DeleteIcon from "@material-ui/icons/Delete";

import moment from "moment";
import 'moment/locale/es';

export default function TableDetail(props) {
    const {dataArray, actionEdit, showModal, propertys} = props;
    return (
        <>
            {dataArray &&
            dataArray.data.map((data, i) => (
                <tr key={i} className="text-center">
                    <td>{i + 1}</td>
                    {propertys.map((prop, i) => {
                        switch (prop) {
                            case 'estado':
                                return (
                                    <td key={i}>
                                        {data[prop] ?
                                            (<Badge variant="success">A</Badge>)
                                            :
                                            (<Badge variant="danger">I</Badge>)
                                        }
                                    </td>
                                );
                            case 'updated_at':
                                return (
                                    <td key={i}>
                                        <small><b><UpdateIcon/> {moment(data[prop]).fromNow()}</b></small>
                                    </td>
                                );
                            default:
                                return Array.isArray(prop) > 0 ? (
                                    <td key={i} style={{fontSize: "14px"}}>{data[prop[0]][prop[1]]}</td>) : (
                                    <td key={i} style={{fontSize: "14px"}}>{data[prop]}</td>)
                        }
                    })}
                    <td>
                        <ButtonGroup aria-label="Basic example">
                            <Button
                                variant="primary"
                                size="sm"
                                type="button"
                                onClick={() => actionEdit(data)}
                            >
                                <SyncIcon/>
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                type="button"
                                onClick={() => showModal(data)}
                            >
                                <DeleteIcon/>
                            </Button>
                        </ButtonGroup>
                    </td>
                </tr>
            ))
            }
        </>
    );
}
