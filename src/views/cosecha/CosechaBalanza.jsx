import React from "react";
import {useDispatch, useSelector} from "react-redux";
import CosechaModalCintas from "./CosechaModalCintas";
import {
    buildApp,
    closeChanel,
    listenChannelBalanza,
    prepareData,
    searchData, setDataFecha,
    setDataHacienda, setDefaultCintas
} from "../../reducers/cosecha/cosechaDucks";
import CosechaRecobro from "./CosechaRecobro";
import OptionsHaciendas from "../../components/Global/OptionsHaciendas";
import moment from "moment";

export default function CosechaBalanza() {
    const dispatch = useDispatch();
    const listen = useSelector(state => state.cosecha.listen);
    const prepare = useSelector(state => state.cosecha.prepareData);
    const build = useSelector(state => state.cosecha.build);
    const hacienda = useSelector(state => state.cosecha.hacienda);
    //const credential = useSelector(state => state.login.credential);

    const conectarse = () => {
        dispatch(setDataFecha(moment().format("DD/MM/YYYY")));
        dispatch(prepareData(true));
        dispatch(searchData(true));
    };

    const desconectarse = () => {
        dispatch(setDataFecha(moment().format("DD/MM/YYYY")));
        dispatch(closeChanel());//Cerramos canal
        dispatch(listenChannelBalanza(false));//Apagamos el listening en redux
        dispatch(setDataHacienda(null));
        dispatch(buildApp(false));//Destruimos la app
        dispatch(setDefaultCintas());//Seteamos las cintas seleccionadas

        //Eliminamos el storage
        const existe = JSON.parse(localStorage.getItem('_cintasSemanaLotes'));
        if (existe) {
            localStorage.removeItem('_cintasSemana');
            localStorage.removeItem('_cintasSemanaLotes');
        }
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
                                    <i className="fas fa-chart-bar"/>{" "}
                                    Saldo de Recobro {hacienda && ` | ${hacienda.descripcion}`}
                                </h5>
                            </div>
                            {!listen &&
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <OptionsHaciendas
                                            hacienda={hacienda}
                                            changeOption={changeOption}
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
                                            onClick={() => desconectarse()}>
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
