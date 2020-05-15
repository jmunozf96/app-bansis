import React, {useEffect, useState} from "react";
import FormularioBase from "../../../../components/FormularioBase";
import Buscador from "../../../../components/Buscador";
import {API_LINK} from "../../../../utils/constants";
import ExploreIcon from "@material-ui/icons/Explore";
import shortid from "shortid";
import ModalForm from "../../../../components/ModalForm";
import FormModalSeccion from "./FormModalSeccion";
import MapaBase from "../../../../components/MapaBase";

const FormSeccionLote = () => {
    const Regresar = '/hacienda/lote';
    const [disabledElements, setDisabledElements] = useState({
        hacienda: false,
        lotes: true
    });
    //Configuracion para buscador
    const api_buscador = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const [hacienda, setHacienda] = useState(null);
    const [apiLote, setApiLote] = useState('');
    const [lote, setLote] = useState(null);

    const [has, setHas] = useState(0);
    const [progressStatus, setProgressStatus] = useState({
        update: true,
        value: 0,
        color: ''
    });

    const [distribucion, setDistribucion] = useState({
        descripcion: '',
        has: 0,
        latitud: 0,
        longitud: 0
    });
    const [coordenadas, setCoordenadas] = useState(null);
    const [reload, setReload] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [distribuciones, setDistribuciones] = useState([]);

    useEffect(() => {
        if (progressStatus.update) {
            setProgressStatus({...progressStatus, update: false});
        }
    }, [progressStatus]);

    const changeHacienda = (e, value) => {
        setHacienda(value);
        if (value) {
            setDisabledElements({
                ...disabledElements,
                lotes: false
            });
            setApiLote(`${API_LINK}/bansis-app/index.php/lotes-select?hacienda=${value.id}`)
        } else {
            setDisabledElements({
                ...disabledElements,
                lotes: true
            })
        }
    };

    const changeLote = (e, value) => {
        setLote(value);
        if (value) {
            setHas(parseFloat(value.has));
            setProgressStatus({...progressStatus, update: true, color: 'bg-success'});
            document.getElementById('id-lote-cupo').style.width = `100%`;
        } else {
            setHas(0);
            setProgressStatus({...progressStatus, value: 0, update: true})
        }
    };

    const calcularProgreso = () => {
        const result = has - parseFloat(distribucion.has).toFixed(2);
        if (result >= 0) {
            const porcentaje = parseFloat(result).toFixed(2) / lote.has;
            setHas(result);

            const rango2 = lote.has * 0.25;
            const rango3 = lote.has * 0.75;
            let color;

            if (result > rango3 && result < lote.has) {
                color = 'bg-info';
            } else if (result > rango2 && result < rango3) {
                color = 'bg-warning';
            } else {
                color = 'bg-danger';
            }
            document.getElementById('id-lote-cupo').style.width = `${porcentaje * 100}%`;
            setProgressStatus({...progressStatus, update: true, color});
            return true;
        } else {
            return false;
        }
    };

    const addDistribucion = () => {
        if (distribucion.descripcion.trim() && parseFloat(distribucion.has) > 0) {
            if (calcularProgreso()) {
                setDistribuciones([
                    ...distribuciones,
                    {id: shortid.generate(), ...distribucion}
                ]);
                setShowModal(true);
                setDistribucion({descripcion: '', has: 0});
                document.getElementById('id-descripcion-distribucion').focus();
            } else {
                alert("Se excede")
                setDistribucion({...distribucion, has});
                document.getElementById('id-has-distribucion').focus();
            }
        }
    };

    const NuevaSeccion = () => {
        console.log('nuevo')
    };

    const GuardarSeccion = () => {
        console.log('guardar')
    };


    return (
        <FormularioBase
            icon='fas fa-location-arrow'
            title={'Formulario Secciones por Lote'}
            nuevo={NuevaSeccion}
            guardar={GuardarSeccion}
            volver={Regresar}
        >
            <div className="row">
                <FormModalSeccion show={showModal} setShow={setShowModal}/>
                <div className="col-md-8">
                    <div className="form-group">
                        <Buscador
                            api={api_buscador}
                            change={changeHacienda}
                            disabled={disabledElements.hacienda}
                            id="id-hacienda-search"
                            label="Seleccione una Hacienda"
                            setData={setHacienda}
                            variant="outlined"
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <Buscador
                            api={apiLote}
                            change={changeLote}
                            componentIcon={<ExploreIcon/>}
                            disabled={disabledElements.lotes}
                            icon={true}
                            id="id-lotes-search"
                            label="Seleccione un Lote"
                            setData={setLote}
                            variant="outlined"
                        />
                    </div>
                </div>
            </div>
            <hr className="mt-0"/>
            <div className="row">
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-12">
                            <ul className="list-group">
                                <li className="list-group-item">
                                <span className="lead">
                                    Hectareas a distribuir: {parseFloat(has).toFixed(2)}
                                </span>
                                    <div className="progress mt-2">
                                        <div className={`progress-bar ${progressStatus.color}`} role="progressbar"
                                             id="id-lote-cupo"
                                             aria-valuenow="0"
                                             aria-valuemin="0"
                                             aria-valuemax="100"/>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col-12 p-3">
                            <MapaBase
                                size={450}
                                reload={reload}
                                maxZoom={16}
                                setPositions={setCoordenadas}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Descripcion</th>
                            <th>Has.</th>
                            <th>Accion</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    id="id-descripcion-distribucion"
                                    value={distribucion.descripcion}
                                    onChange={(e) => setDistribucion({
                                        ...distribucion,
                                        descripcion: e.target.value.toUpperCase()
                                    })}
                                    className="form-control text-center"
                                    placeholder="Descripcion"/>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    id="id-has-distribucion"
                                    value={distribucion.has}
                                    className="form-control text-center"
                                    onKeyPress={(e) => e.key === 'Enter' ? addDistribucion() : null}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => setDistribucion({...distribucion, has: e.target.value})}
                                    placeholder="Has."/>
                            </td>
                            <td>
                                <button className="btn btn-success btn-block" onClick={() => addDistribucion()}>
                                    <i className="fas fa-plus fa-1x"/>
                                </button>
                            </td>
                        </tr>
                        {distribuciones.length > 0 && distribuciones.map((data) =>
                            <tr key={data.id} className="">
                                <td className="text-center">{lote.identificacion}{data.descripcion}</td>
                                <td className="text-center">
                                    <small><b>{data.has}</b></small>
                                </td>
                                <td>
                                    <div className="btn-group">
                                        <button className="btn btn-primary">
                                            <i className="fas fa-edit fa-1x"/>
                                        </button>
                                        <button className="btn btn-danger">
                                            <i className="fas fa-minus fa-1x"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </FormularioBase>
    );
};

export default FormSeccionLote;
