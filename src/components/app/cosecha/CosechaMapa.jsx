import React, {useCallback, useEffect, useState} from "react";
import Mapa from "./mapa";
import {Button, Modal} from "react-bootstrap";
import {useSelector} from "react-redux";

export default function CosechaMapa({show, setShow}) {
    const cosecha = useSelector(state => state.cosecha.cosecha);
    const cintas = useSelector(state => state.cosecha.cintas);
    const [dataMap, setDataMap] = useState([]);
    const [loadCoordenadas, setLoadCoordenadas] = useState(true);
    const [viewMapa, setViewMapa] = useState('');
    const [reloadMap, setReloadMap] = useState(false);

    const mapa = useCallback(() => {
        return <Mapa coordenadas={dataMap}/>
    }, [dataMap]);

    useEffect(() => {
        if (loadCoordenadas) {
            if (cosecha.length > 0) {
                const data = [...cosecha.map(item => ({title: item.cs_seccion, coordenadas: item.cs_coordenadas}))];
                let hash = {};
                const unique = data.filter(o => hash[o.title] ? false : hash[o.title] = true);
                const nw_data = unique.map(item => {
                    const cosecha_cintas = cosecha.filter(data => data.cs_seccion === item.title)
                        .map(item => ({
                            ...item,
                            color: cintas.filter(data => data.codigo === item.cs_color)[0]
                        }));
                    return {
                        ...item, cintas: cosecha_cintas.sort(function (a, b) {
                            if (a.cs_color > b.cs_color) return 1;
                            if (a.cs_color < b.cs_color) return -1;
                            return 0;
                        })
                    }
                });
                setDataMap(nw_data);
                setViewMapa(mapa);
                setReloadMap(true);
            }
            setLoadCoordenadas(false);
        }
    }, [cintas, cosecha, loadCoordenadas, setLoadCoordenadas, show, mapa]);

    useEffect(() => {
        setViewMapa(mapa);
    }, [show, mapa]);

    useEffect(() => {
        if (reloadMap) {
            setViewMapa(mapa);
            setReloadMap(false);
        }
    }, [reloadMap, mapa]);

    return (
        <Modal
            show={show}
            animation={true}
            centered={true}
            scrollable={true}
            size="xl"
            onHide={() => setShow(false)}
        >
            <Modal.Header>
                <Modal.Title>
                    <i className="fas fa-map-marker-alt"/> <small>Lotes cortados</small>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {viewMapa}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Salir
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
