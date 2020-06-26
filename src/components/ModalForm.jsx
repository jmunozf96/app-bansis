import React from "react";
import {Button, Modal} from "react-bootstrap";
import "./ModalForm.scss"

const ModalForm = ({show, icon, title, children, ...config}) => {
    return (
        <Modal
            show={show}
            animation={config.animation}
            backdrop={config.backdrop}
            size={config.size}
            centered={config.centered}
            scrollable={config.scrollable}
            dialogClassName={`custom-dialog-${config.dialogSize}`}
        >
            <Modal.Header>
                <Modal.Title><i className={icon}/> <small>{title}</small></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => config.cancel()}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={() => config.save()}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default ModalForm;
