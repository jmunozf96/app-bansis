import React from "react";
import {Button, Modal} from "react-bootstrap";

export default function ModalBase({iconTitle, title, dataModal, setDataModal, size = 'lg'}) {
    return (
        <Modal
            show={dataModal.show}
            animation={true}
            centered={true}
            scrollable={true}
            size={size}
            onHide={() => setDataModal({...dataModal, show: false})}
        >
            <Modal.Header>
                <Modal.Title>
                    <i className={iconTitle}/> <small>{title}</small>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {dataModal.view}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setDataModal({...dataModal, show: false})}>
                    Salir
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
