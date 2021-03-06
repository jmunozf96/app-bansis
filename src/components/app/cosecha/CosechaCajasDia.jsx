import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {useSelector} from "react-redux";
import {API_LINK} from "../../../constants/helpers";
import CosechaCajaModel from "./CosechaCajaModel";
import axios from "axios";

export default function CosechaCajasDia({show, setShow}) {
    const [load, setLoad] = useState(true);
    const [cajas, setCajas] = useState([]);

    const closeModal = () => {
        setShow(false);
        setLoad(false);
        setCajas([]);
    };

    return (
        <Modal
            show={show}
            animation={true}
            centered={true}
            backdrop="static"
            scrollable={true}
            size="lg"
            onHide={() => setShow(false)}
        >
            <Modal.Header>
                <Modal.Title>
                    <i className="fa fa-box"/> <small>Cajas procesadas</small>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CajasDia
                    load={load}
                    setLoad={setLoad}
                    cajas={cajas}
                    setCajas={setCajas}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" disabled={load}
                        onClick={() => !load ? closeModal() : console.error("Espere un momento...")}>
                    Salir
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

const CajasDia = ({load, setLoad, cajas, setCajas}) => {
    const hacienda = useSelector(state => state.cosecha.hacienda);
    const fecha = useSelector(state => state.cosecha.fecha);

    useEffect(() => {
        if (load) {
            (async () => {
                try {
                    const url = `${API_LINK}/bansis-app/index.php/cosecha/${hacienda.id}/cajas-dia?fecha=${fecha}`;
                    const respuesta = await axios.get(url);
                    const {code} = respuesta.data;
                    if (code === 200) {
                        const {data} = respuesta.data;
                        if (data.length > 0)
                            setCajas(data);
                        await setLoad(false);
                    }
                } catch (e) {
                    console.error(e);
                    await setLoad(false);
                }
            })();
        }
    }, [hacienda, load, fecha, setCajas, setLoad]);

    if (load) {
        return (
            <div className="row m-1">
                <div className="col-12 text-center mt-2">
                    <i className="fas fa-spinner fa-spin fa-10x"/>
                    <p className="mt-5">Buscando datos de cajas Allweigths, espere unos segundos...</p>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <button className="btn btn-primary" onClick={() => setLoad(true)}>
                        <i className="fas fa-sync-alt"/> Recargar
                    </button>
                </div>
            </div>
            <hr/>
            <div className="row">
                {cajas.length > 0 ?
                    <>
                        {cajas.map((caja, i) => (
                            <div className="col-md-6 col-12 mb-2" key={i}>
                                <CosechaCajaModel data={caja}/>
                            </div>
                        ))}
                    </> :
                    <div className="col-12 m-0">
                        <div className="alert alert-danger">
                            <i className="fas fa-exclamation-circle"/> No se han encontrado datos de cajas pesadas el
                            día de hoy.
                        </div>
                    </div>
                }
            </div>
        </React.Fragment>
    )
};
