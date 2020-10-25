import React from "react";
import {useDispatch, useSelector} from "react-redux";
import CosechaModalCintas from "./CosechaModalCintas";
import {prepareData, searchData, setDataHacienda} from "../../reducers/cosecha/cosechaDucks";
import CosechaRecobro from "./CosechaRecobro";
import ComponentOptions from "../../components/ComponentOptions";
import {API_LINK} from "../../utils/constants";

export default function CosechaBalanza() {
    const dispatch = useDispatch();
    const listen = useSelector(state => state.cosecha.listen);
    const prepare = useSelector(state => state.cosecha.prepareData);
    const build = useSelector(state => state.cosecha.build);
    const hacienda = useSelector(state => state.cosecha.hacienda);
    //const credential = useSelector(state => state.login.credential);

    const api_haciendas = `${API_LINK}/bansis-app/index.php/haciendas-select`;

    const conectarse = () => {
        dispatch(prepareData(true));
        dispatch(searchData(true));
    };

    const changeOption = (e, data) => {
        const data_option = data['data-json'] !== undefined ? data['data-json'] : null;
        dispatch(setDataHacienda(data_option));
    };


    return (
        <React.Fragment>
            <div className="container-fluid mb-3" style={{marginTop: "4rem"}}>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="m-0">
                                    <i className="fas fa-chart-bar"/> Saldo de Recobro
                                </h5>
                            </div>
                            {!listen &&
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <ComponentOptions
                                            api={api_haciendas}
                                            label="Hacienda"
                                            name="hacienda"
                                            value={hacienda !== null ? hacienda.descripcion : ""}
                                            changeValue={changeOption}
                                            disabled={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            }
                            {!build ?
                                <div className="card-body text-center m-5">
                                    <i className="fas fa-wifi fa-10x" style={{color: "#ababab"}}/>
                                </div> : <CosechaRecobro/>
                            }
                            {prepare && <CosechaModalCintas show={prepare}/>}

                            <div className="card-footer">
                                {!listen ?
                                    <button className="btn btn-success btn-block btn-lg"
                                            disabled={!hacienda}
                                            onClick={() => hacienda ? conectarse() : console.error("Seleccione una hacienda para conectarse.")}>
                                        <i className="fas fa-plug"/> CONECTARSE A
                                        BALANZA {!hacienda && " - (Seleccione una hacienda)"}
                                    </button>
                                    :
                                    <button className="btn btn-danger btn-block btn-lg"
                                            onClick={() => hacienda ? conectarse() : console.error("Seleccione una hacienda para conectarse.")}>
                                        <i className="fas fa-sign-out-alt"/> DESCONECTARSE
                                    </button>

                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
