import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {progressActions} from "../../actions/progressActions";
import {API_LINK} from "../../utils/constants";
import moment from "moment";
import 'moment/locale/es';
import {
    enabledLoadDataCosecha, enabledLotesCortados,
    enabledLotesRecobroAction,
    enabledRequestDataAction
} from "../../actions/cosecha/cosechaActions";

export default function SectionDataPeso(props) {
    const {
        hacienda, colorCorte, setColorCorte, setLotesDia,
        addLote, setLoadChart, searchRecobroCintaSemana, setSearchRecobroCintaSemana
    } = props;

    const day = moment().format("DD/MM/YYYY");
    //const day = "18/07/2020";
    const [primerRegistro, setPrimerRegistro] = useState(true);
    const [contadorData, setContadorData] = useState(0);
    //const [continueInterval, setContinueInterval] = useState(true);
    //const [searchData, setSearchData] = useState(false);

    //const [updateComponent, setUpdateComponent] = useState(false);
    const [dataCosecha, setDataCosecha] = useState(null);
    const [dataRecobro, setDataRecobro] = useState(null);

    const [searchDataRecobroLote, setSearchDataRecobroLote] = useState(false);
    //const [dataRecobroLote, setDataRecobroLote] = useState(null);

    const dispatch = useDispatch();
    const loadRequestData = useSelector((state) => state.cosecha.loadRequestData);
    const loadDataCosecha = useSelector((state) => state.cosecha.loadDataCosecha);

    useEffect(() => {
        if (loadRequestData && !loadDataCosecha && hacienda !== '') {
            const interval = setInterval(() => {
                (async () => {
                    const url = `${API_LINK}/bansis-app/index.php/recepcion/${hacienda}/status?fecha=${day}`;
                    const request = await fetch(url);
                    const response = await request.json();
                    const {code, contador} = response;
                    if (code === 200) {
                        if ((contador === 0 && primerRegistro) || contadorData !== contador) {
                            setContadorData(contador);
                            dispatch(enabledLoadDataCosecha(true));
                            dispatch(enabledRequestDataAction(false));
                            setPrimerRegistro(false);
                        }
                    }
                })();
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [loadRequestData, loadDataCosecha, dispatch, contadorData, primerRegistro, hacienda, day]);

    useEffect(() => {
        if (loadDataCosecha && hacienda !== '') {
            const progressbarStatus = (state) => dispatch(progressActions(state));
            (async () => {
                await progressbarStatus(true);
                const url = `${API_LINK}/bansis-app/index.php/recepcion/${hacienda}/cosecha?fecha=${day}`;
                const request = await fetch(url);
                const response = await request.json();
                const {code, cosecha} = response;
                if (code === 200) {
                    //Trae el registro de la tabla de cosecha {seccion y color}
                    setDataCosecha(cosecha);
                    setSearchDataRecobroLote(true);
                } else {
                    setLotesDia([]);
                }
                await progressbarStatus(false);
            })();
            dispatch(enabledLoadDataCosecha(false));
            dispatch(enabledRequestDataAction(true));
        }
    }, [loadDataCosecha, dispatch, day, hacienda, setLotesDia]);

    useEffect(() => {
        if (searchDataRecobroLote && dataCosecha) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/recepcion/${hacienda}/cosecha-lote?color=${dataCosecha['cs_color']}&lote=${dataCosecha['cs_seccion']}&fecha=${day}`;
                const request = await fetch(url);
                const response = await request.json();
                const {code, datos} = response;
                if (code === 200) {
                    //setDataRecobroLote(datos);
                    /*
                    * enfunde, cortados, peso, recobro
                    * */
                    if (colorCorte === 0) {
                        setColorCorte(+dataCosecha['cs_color']);
                        setSearchRecobroCintaSemana(true);
                    } else if (colorCorte === +dataCosecha['cs_color']) {
                        addLote(dataCosecha, datos);
                    } else {
                        setColorCorte(+dataCosecha['cs_color']);
                        setSearchRecobroCintaSemana(true);
                        dispatch(enabledLotesCortados(true));
                        dispatch(enabledLotesRecobroAction(true));
                    }

                }
            })();

            dispatch(enabledRequestDataAction(true));
            setSearchDataRecobroLote(false);
        }
    }, [hacienda, searchDataRecobroLote, dataCosecha, day, colorCorte, dispatch,
        setColorCorte, addLote, setLoadChart, setSearchRecobroCintaSemana]);

    useEffect(() => {
        if (searchRecobroCintaSemana && +colorCorte !== 0 && hacienda) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/recepcion/${hacienda}/cintaRecobro?cinta=${colorCorte}`;
                const request = await fetch(url);
                const response = await request.json();
                const {code, recobro} = response;
                if (code === 200) {
                    setDataRecobro(recobro);
                }
            })();
            setSearchRecobroCintaSemana(false);
        }
    }, [searchRecobroCintaSemana, day, hacienda, colorCorte, setSearchRecobroCintaSemana]);

    return (
        <>
            <div className="row ">
                <div className="col-12">
                    <div className="form-row">
                        <div className="col-2">
                            <label><b>Cinta</b></label>
                            <input className="form-control"
                                   name={`${dataRecobro && dataRecobro.cinta}-CALENDARIO`}
                                   disabled/>
                        </div>
                        <div className="col-2">
                            <label>Enfunde</label>
                            <input
                                className="form-control text-center bg-white"
                                value={dataRecobro ? dataRecobro.enfunde : 0}
                                disabled
                            />
                        </div>
                        <div className="col-2">
                            <label><b style={{color: "red"}}>Cortados</b></label>
                            <input
                                className="form-control text-center bg-white"
                                value={dataRecobro ? dataRecobro.cortados : 0}
                                disabled
                            />
                        </div>
                        <div className="col-2">
                            <label><b>Saldo</b></label>
                            <input
                                className="form-control text-center bg-white"
                                value={dataRecobro ? +dataRecobro.enfunde - +dataRecobro.cortados : 0}
                                disabled
                            />
                        </div>
                        <div className="col-2">
                            <label>Recobro</label>
                            <input
                                className="form-control text-center bg-white"
                                value={dataRecobro ? ((+dataRecobro.recobro).toFixed(2).toString() + ' %') : 0}
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/*<div className="row">
                <div className="col-12 p-0">
                    <RecepcionRacimos
                        data={dataCosecha}
                        update={updateComponent}
                        setUpdate={setUpdateComponent}
                    />
                </div>
            </div>*/}
            {/*<div className="row">
                <div className="col-12 ">
                    <table className="table table-bordered table-hover">
                        <thead>
                        <tr className="text-center">
                            <th width="20%">ENFUNDE</th>
                            <th width="20%">INICIO</th>
                            <th width="20%">HOY</th>
                            <th width="20%">TOTAL</th>
                            <th width="20%">RECOBRO</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dataRecobroLote &&
                        <tr className="text-center" style={{fontSize: "22px"}}>
                            <td>{dataRecobroLote.enfunde}</td>
                            <td>{dataRecobroLote.cortadosInicio}</td>
                            <td>{dataRecobroLote.cortadosFecha}</td>
                            <td>{dataRecobroLote.cortados}</td>
                            <td>
                                <span className="badge badge-primary">
                                    {(+dataRecobroLote.recobro).toFixed(2).toString() + ' %'}
                                </span>
                            </td>
                        </tr>
                        }
                        </tbody>
                    </table>
                </div>
            </div>*/}
        </>
    );
}
