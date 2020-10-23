import React, {useEffect, useState} from "react";
import {Checkbox, FormControlLabel} from "@material-ui/core";
import {
    cintasSelectBackup,
    loadingData,
    prepareData,
    searchaDataByCintasSemana
} from "../../reducers/cosecha/cosechaDucks";
import {useDispatch, useSelector} from "react-redux";
import {Button, Modal} from "react-bootstrap";

export default function CosechaModalCintas() {
    const dispatch = useDispatch();
    const loadingDataSelect = useSelector(state => state.cosecha.loadingData);
    const prepare = useSelector(state => state.cosecha.prepareData);
    const search = useSelector(state => state.cosecha.searchData);

    const [wait, setWait] = useState(false); //Esperar que se realice la petición
    const [cintasSelect, setCintasSelect] = useState([]);
    const [modalConfig, setModalConfig] = useState({
        show: prepare,
        icon: '',
        title: 'Semanas de corte de cinta',
        animation: true,
        backdrop: "static",
        size: 'xl',
        centered: false,
        scrollable: true,
        view: <ViewSemanasSelect setCintasSelect={setCintasSelect}/>
    });

    useEffect(() => {
        if (!loadingDataSelect) {
            setWait(false);
        } else {
            setWait(true);
        }
    }, [loadingDataSelect]);

    const onHideModal = () => {
        setModalConfig({...modalConfig, show: false});
        dispatch(prepareData(false));
    };

    const onSave = () => {
        //Ejecutar consulta
        dispatch(loadingData(true));
        setModalConfig({
            ...modalConfig,
            view: <WaitProcessLoadingData/>
        });
        dispatch(cintasSelectBackup(cintasSelect));
        dispatch(searchaDataByCintasSemana());
    };

    return (
        <Modal
            show={modalConfig.show}
            animation={modalConfig.animation}
            backdrop={modalConfig.backdrop}
            size={modalConfig.size}
            centered={modalConfig.centered}
            scrollable={modalConfig.scrollable}
            onHide={() => onHideModal()}
        >
            <Modal.Header>
                <Modal.Title><i className={modalConfig.icon}/> <small>{modalConfig.title}</small></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {modalConfig.view}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onHideModal()}>
                    Salir
                </Button>
                {search &&
                <Button variant="primary" disabled={wait} onClick={() => onSave()}>
                    Cargar datos
                </Button>}
            </Modal.Footer>
        </Modal>
    )
}

const ViewSemanasSelect = ({setCintasSelect}) => {
    const cintas_seleccionadas = useSelector(state => state.cosecha.cintas_select);
    const [cintas, setCintas] = useState(cintas_seleccionadas);
    const [status, setStatus] = useState(false);

    useEffect(() => {
        if (status) {
            setCintasSelect(cintas);
            setStatus(false);
        }
    }, [status, setCintasSelect, cintas]);

    const changeCintas = (data) => {
        setStatus(true);
        setCintas([...cintas.map(item => item.label === data.label ? {...item, status: !data.status} : item)]);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="alert alert-primary">
                        <p className="mb-0">
                            <i className="fas fa-info-circle"/>{" "}
                            <em><b>Recomendación:</b> No pasar racimos por balanza, hasta que se hayan cargado los datos iniciales
                            de cosecha.</em>
                        </p>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                {cintas.map((data, index) =>
                                    <div className="col-md-3 text-center" key={index}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={data.status}
                                                    onChange={() => changeCintas(data)}
                                                    name={data.label}
                                                    color="secondary"
                                                />
                                            }
                                            label={data.label}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const WaitProcessLoadingData = () => {
    const loadingData = useSelector(state => state.cosecha.loadingData);

    return (
        <React.Fragment>
            {loadingData ?
                <div className="row m-1">
                    <div className="col-12 text-center">
                        <i className="fas fa-cog fa-spin fa-10x"/>
                        <p className="mt-5">Preparando aplicación, espere unos segundos...</p>
                        <em><b>Recomendación:</b> No pasar racimos por balanza, hasta que se hayan cargado los datos iniciales
                            de cosecha.</em>
                    </div>
                </div>
                :
                <div className="col-12 text-center">
                    <i className="fas fa-check-circle fa-10x mt-5 mb-3" style={{color: "#1cab09"}}/>
                    <p className="">Información cargada.</p>
                </div>
            }
        </React.Fragment>
    )
};


