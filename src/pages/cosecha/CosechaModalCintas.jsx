import React, {useEffect, useState} from "react";
import ModalForm from "../../components/ModalForm";
import {Checkbox, FormControlLabel} from "@material-ui/core";
import {
    confirmLoadingDataStorage,
    loadingData,
    prepareData, restoreDataStorage,
    searchaDataByCintasSemana
} from "../../reducers/cosecha/cosechaDucks";
import {useDispatch, useSelector} from "react-redux";

export default function CosechaModalCintas() {
    const dispatch = useDispatch();
    const prepare = useSelector(state => state.cosecha.prepareData);
    const [cintasSelect, setCintasSelect] = useState([]);
    const [modalConfig, setModalConfig] = useState({
        show: prepare,
        icon: '',
        title: 'Semanas de corte de cinta',
        animation: true,
        backdrop: "static",
        size: '',
        centered: false,
        scrollable: true,
        view: <ViewSemanasSelect setCintasSelect={setCintasSelect}/>
    });

    const onHideModal = () => {
        setModalConfig({...modalConfig, show: false});
        dispatch(prepareData(false));
    };

    const onSave = () => {
        dispatch(loadingData(true));
        setModalConfig({
            ...modalConfig,
            view: <WaitProcessLoadingData/>
        });

        dispatch(searchaDataByCintasSemana(cintasSelect));
    };

    return (
        <ModalData
            configuracion={modalConfig}
            onHide={onHideModal}
            onSave={onSave}
        />
    )
}

const ViewSemanasSelect = ({setCintasSelect}) => {
    const [cintas, setCintas] = useState([
        {label: '13 SEMANAS', status: false, value: 13}, {label: '12 SEMANAS', status: false, value: 12},
        {label: '11 SEMANAS', status: false, value: 11}, {label: '10 SEMANAS', status: false, value: 10},
        {label: '09 SEMANAS', status: false, value: 9}, {label: '08 SEMANAS', status: false, value: 8},
    ]);
    const [select, setSelect] = useState([]);
    const [status, setStatus] = useState(false);

    useEffect(() => {
        if (status) {
            setCintasSelect([...select]);
            setStatus(false);
        }
    }, [status, select, setCintasSelect]);

    const changeCintas = (data) => {
        if (!data.status) {
            //Cambiara a true
            setSelect([...select, data]);
        } else {
            setSelect(select.filter(item => item.value !== data.value))
        }
        setStatus(true);
        setCintas([...cintas.map(item => item.label === data.label ? {...item, status: !data.status} : item)]);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="alert alert-primary">
                        <i className="fas fa-cube"/> <b>Seleccionar</b> semanas de cinta.
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
    const loadingDataStorage = useSelector(state => state.cosecha.loadingDataStorage.status);

    return (
        <React.Fragment>
            {!loadingDataStorage ?
                <div className="row m-1">
                    <div className="col-12 text-center">
                        <i className="fas fa-cog fa-spin fa-10x"/>
                        <p className="mt-5">Preparando aplicación, espere unos segundos...</p>
                    </div>
                </div>
                :
                <LoadDataStorage/>
            }
        </React.Fragment>
    )
};

const LoadDataStorage = () => {
    const dispatch = useDispatch();
    const load = useSelector(state => state.cosecha.loadingDataStorage.load);

    const confirmar = () => {
        dispatch(confirmLoadingDataStorage(true));
        dispatch(restoreDataStorage());
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {!load ?
                    <React.Fragment>
                        <div className="col-12 text-center">
                            <i className="fas fa-database fa-10x mt-1 mb-3" style={{color: "#ababab"}}/>
                            <i className="fas fa-cog fa-spin fa-4x ml-2 mt-4" style={{color: "#ababab"}}/>
                            <p className="">Tiene información guardada localmente, ¿Desea recuperar los registros?</p>
                        </div>
                        <div className="col-12">
                            <div className="row justify-content-center">
                                <button className="btn btn-danger col-2 btn-lg"
                                        onClick={() => dispatch(confirmLoadingDataStorage(false))}>
                                    NO
                                </button>
                                <div className="col-1"/>
                                <button className="btn btn-primary col-2 btn-lg"
                                        onClick={() => confirmar()}>
                                    SI
                                </button>
                            </div>
                        </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div className="col-12 text-center">
                            <i className="fas fa-check-circle fa-10x mt-5 mb-3" style={{color: "#1cab09"}}/>
                            <p className="">Información salvada.</p>
                        </div>
                    </React.Fragment>
                }
            </div>
        </div>
    )
}

function ModalData({configuracion, onHide, onSave}) {
    return (
        <ModalForm
            show={configuracion.show}
            icon={configuracion.icon}
            title={configuracion.title}
            animation={configuracion.animation}
            backdrop={configuracion.backdrop}
            size={configuracion.size}
            centered={configuracion.centered}
            scrollable={configuracion.scrollable}
            dialogSize={'65'}
            cancel={onHide}
            save={onSave}
        >
            {configuracion.view}
        </ModalForm>
    )
}
