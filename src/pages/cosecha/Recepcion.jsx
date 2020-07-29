import React, {useEffect, useState} from "react"
import CajasFecha from "../../components/Cosecha/CajasFecha";
import SectionDataPeso from "./SectionDataPeso";
//import DataLoteFecha from "../../components/Cosecha/DataLoteFecha";
import CintaSemana from "./CintaSemana";
import {API_LINK} from "../../utils/constants";
import moment from "moment";
import LotesRecobro from "../../components/Cosecha/LotesRecobro";

import {makeStyles} from '@material-ui/core/styles';
import {Paper, Grid} from "@material-ui/core";
import LotesRecobroDia from "../../components/Cosecha/LotesRecobroDia";
import CustomSelect from "../../components/CustomSelect/CustomSelect";

import {useDispatch, useSelector} from "react-redux";
import {
    enabledCajasDiaAction, enabledLoadLotesCortadosAction, enabledLotesCortados,
    enabledLotesRecobroAction,
    enabledRequestDataAction, setTotalCortadosDia
} from "../../actions/cosecha/cosechaActions";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
}));

export default function Recepcion() {
    const classes = useStyles();
    const day = moment().format("DD/MM/YYYY");
    //const day = "24/07/2020";
    const [cajasDay, setCajasDay] = useState([]);
    const [lotesDia, setLotesDia] = useState([]);
    const [colorCorte, setColorCorte] = useState(0);

    const [addData, setAddData] = useState(false);
    const [updateData, setUpdateData] = useState(false);
    const [lote, setLote] = useState(null);
    const [recobro, setRecobro] = useState(null);

    const [ordenarArray, setOrdenarArray] = useState(false);

    const [loadDataChartBar, setLoadDataChartBar] = useState(false);
    const [updateDataChartBar, setUpdateDataChartBar] = useState(false);

    const [searchRecobroCintaSemana, setSearchRecobroCintaSemana] = useState(false);

    const [btnGroupStatus, setBtnGroupStatus] = useState({
        sync: false,
        stop: false,
        record: true
    });
    //Peticiones por segundo
    //const [recordAsync, setRecordAsync] = useState(true);
    //const [updateComponentCajasDia, setUpdateComponentCajasDia] = useState(false);

    const dispatch = useDispatch();
    //const getUpdateCajasDia = useSelector((state) => state.cosecha.updateCajasDia);
    const getRequestData = useSelector((state) => state.cosecha.loadRequestData);
    const getUpdateLotesRecobro = useSelector((state) => state.cosecha.updateLotesRecobro);
    const credential = useSelector((state) => state.credential);
    const api_buscador = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const [loadDataSelectHacienda, setLoadDataSelectHacienda] = useState(true);
    const [hacienda, setHacienda] = useState(credential.idhacienda ? credential.idhacienda.id : "");

    useEffect(() => {
        if (ordenarArray && lotesDia.length > 0) {
            let array = lotesDia;
            array = array.sort(function (a, b) {
                if (a['cs_seccion'] > b['cs_seccion']) {
                    return 1
                }
                if (a['cs_seccion'] < b['cs_seccion']) {
                    return -1
                }
                return 0;
            });
            setLotesDia(array);
            setOrdenarArray(false);
        }
    }, [ordenarArray, lotesDia]);

    useEffect(() => {
        if (addData && lote && hacienda !== '') {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/recepcion/${hacienda}/cosecha-lotes?color=${colorCorte}&fecha=${day}&lote=${lote['cs_seccion']}`;
                const request = await fetch(url);
                const response = await request.json();
                const {code} = response;
                if (code === 200) {
                    if (response.data.length > 0) {
                        response.data[0]['activo'] = 1;
                        setLotesDia([
                            ...lotesDia,
                            response.data[0]
                        ]);
                        setOrdenarArray(true);
                        setUpdateDataChartBar(true);
                    }
                }
            })();

            if (lotesDia.length > 0) {
                const filterCinta = lotesDia.filter(item => +item['cs_color'] === +colorCorte);
                dispatch(setTotalCortadosDia(filterCinta.reduce((total, item) => total + +item['cortados'], 0)));
            }

            setAddData(false);
            setLote(null);
        }
    }, [addData, lote, colorCorte, day, lotesDia, hacienda, dispatch]);

    useEffect(() => {
        if (updateData && lote && !addData && recobro) {
            lotesDia.map((item) => {
                if (item['cs_seccion'] === lote['cs_seccion'] && +item['cs_color'] === colorCorte) {
                    item['peso'] = +recobro['peso'];
                    item['cortados'] = +recobro['cortados'];
                    item['activo'] = 1;
                }
                return true;
            });

            if (lotesDia.length > 0) {
                const filterCinta = lotesDia.filter(item => +item['cs_color'] === +colorCorte);
                dispatch(setTotalCortadosDia(filterCinta.reduce((total, item) => total + +item['cortados'], 0)));
            }

            setLote(null);
            setUpdateData(false);
            setRecobro(null);
            setUpdateDataChartBar(true);
        }
    }, [addData, updateData, lote, lotesDia, colorCorte, recobro, dispatch]);

    useEffect(() => {
        if ((getUpdateLotesRecobro && colorCorte !== 0) && lotesDia.length === 0 && hacienda !== '') {
            (async () => {
                await dispatch(enabledLotesCortados(true));
                await dispatch(enabledLoadLotesCortadosAction(true));
                const url = `${API_LINK}/bansis-app/index.php/recepcion/${hacienda}/cosecha-lotes?color=${colorCorte}&fecha=${day}`;
                const response = await fetch(url);
                const request = await response.json();
                const {code} = request;
                if (code === 200) {
                    if (request.data.length > 0) {
                        setLotesDia(request.data);
                        const filterCinta = request.data.filter(item => +item['cs_color'] === +colorCorte);
                        dispatch(setTotalCortadosDia(filterCinta.reduce((total, item) => total + +item['cortados'], 0)));
                    } else {
                        setLotesDia([]);
                        //dispatch(enabledLotesCortados(false));
                    }
                    setLoadDataChartBar(true);
                }
                await dispatch(enabledLoadLotesCortadosAction(false));
            })();
            dispatch(enabledLotesRecobroAction(false));
        }
    }, [lotesDia, getUpdateLotesRecobro, dispatch, colorCorte, day, hacienda]);

    const addLote = (lote, recobro) => {
        if (lotesDia.length > 0) {
            lotesDia.forEach((item) => item.activo = 0);
            if (!existeLote(lote)) {
                setAddData(true);
            } else {
                setUpdateData(true);
            }
            setLote(lote);
            setRecobro(recobro);
        }
    };

    const existeLote = (lote) => {
        const arrayFilter = lotesDia.filter((item) => (item['cs_seccion'] === lote['cs_seccion'] && +item['cs_color'] === colorCorte));
        return arrayFilter.length > 0;
    };

    const onStopRecording = () => {
        if (!btnGroupStatus.record) {
            setLotesDia([]);
            setSearchRecobroCintaSemana(true);
            dispatch(enabledLotesRecobroAction(true));
        }

        setBtnGroupStatus({
            ...btnGroupStatus,
            stop: !btnGroupStatus.stop,
            record: !btnGroupStatus.record
        });

        dispatch(enabledRequestDataAction(!getRequestData));
    };

    const changeHacienda = (e) => {
        const dato = e.target.value;
        setHacienda(dato);
        setCajasDay([]);
        setLotesDia([]);
        dispatch(setTotalCortadosDia(0));
        if (dato !== '') {
            //Actualizar componentes
            //setLoadDataChartBar(true);
            setSearchRecobroCintaSemana(true);
            dispatch(enabledLotesRecobroAction(true));
            dispatch(enabledRequestDataAction(true));
            dispatch(enabledCajasDiaAction(true));
            dispatch(enabledLotesCortados(true));
        } else {
            dispatch(enabledLotesRecobroAction(false));
            dispatch(enabledRequestDataAction(false));
            dispatch(enabledCajasDiaAction(false));
            dispatch(enabledLotesCortados(false));
        }
    };

    return (
        <div className="container-fluid mb-3" style={{marginTop: "4rem"}}>
            <div className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item lg={2}>
                        <Grid item lg={12} style={{marginBottom: 10}}>
                            <Paper className={classes.paper}>
                                <div className="btn-group btn-block">
                                    <button className="btn btn-success" disabled={btnGroupStatus.sync}
                                            onClick={() => dispatch(enabledCajasDiaAction(true))}>
                                        <i className="fas fa-sync"/>
                                    </button>
                                    <button className="btn btn-danger" disabled={btnGroupStatus.stop}
                                            onClick={() => onStopRecording()}>
                                        <i className="fas fa-stop"/>
                                    </button>
                                    <button className="btn btn-primary" disabled={btnGroupStatus.record}
                                            onClick={() => onStopRecording()}>
                                        <i className="fas fa-play"/>
                                    </button>
                                </div>
                            </Paper>
                        </Grid>
                        <Grid item lg={12}>
                            <Paper className={classes.paper} style={{height: 418, overflowY: "scroll"}}>
                                <CintaSemana
                                    hacienda={hacienda}
                                    color={colorCorte}
                                    setColor={setColorCorte}
                                    setLotes={setLotesDia}
                                    setSearchRecobroCintaSemana={setSearchRecobroCintaSemana}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                    {/*Cajas diarias*/}
                    <Grid item xs={10}>
                        <Grid container style={{marginBottom: 10}} spacing={2}>
                            <Grid item lg={4} xs={12}>
                                <Paper className={classes.paper} style={{height: "100px"}}>
                                    <CustomSelect
                                        label="Hacienda"
                                        name="hacienda"
                                        value={hacienda}
                                        setValue={setHacienda}
                                        placeholder="NINGUNA..."
                                        api_url={api_buscador}
                                        disabled={!!(credential && credential.idhacienda)}
                                        loading={loadDataSelectHacienda}
                                        setLoading={setLoadDataSelectHacienda}
                                        changeValue={changeHacienda}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item lg={8} xs={12}>
                                <Paper className={classes.paper} style={{height: "100px", overflowY: "scroll"}}>
                                    <CajasFecha
                                        hacienda={hacienda}
                                        cajasDay={cajasDay}
                                        setCajasDay={setCajasDay}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid item lg={12} xs={12}>
                            <Paper className={classes.paper} style={{height: 380}}>
                                <LotesRecobro
                                    hacienda={hacienda}
                                    color={colorCorte}
                                    load={loadDataChartBar}
                                    setLoad={setLoadDataChartBar}
                                    lotesDia={lotesDia}
                                    update={updateDataChartBar}
                                    setUpdate={setUpdateDataChartBar}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid item lg={12} xs={12}>
                        <Paper className={classes.paper} style={{height: 350, overflowY: "scroll"}}>
                            <SectionDataPeso
                                hacienda={hacienda}
                                colorCorte={colorCorte}
                                setColorCorte={setColorCorte}
                                lotesDia={lotesDia}
                                setLotesDia={setLotesDia}
                                addLote={addLote}
                                setLoadChart={setLoadDataChartBar}
                                searchRecobroCintaSemana={searchRecobroCintaSemana}
                                setSearchRecobroCintaSemana={setSearchRecobroCintaSemana}
                            />
                            <div className="row mt-3">
                                <div className="col-12 table-responsive">
                                    <LotesRecobroDia
                                        data={lotesDia}
                                    />
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
