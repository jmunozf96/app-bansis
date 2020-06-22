import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import {useHistory, useParams} from "react-router-dom";
import CabeceraSemana from "../../CabeceraSemana";
import moment from "moment";
import {API_LINK} from "../../../../utils/constants";
import InputSearch from "../../../../components/InputSearch/InputSearch";
import {FormHelperText} from "@material-ui/core";
import PaginationForm from "../../../../components/Pagination/Pagination";
import {useDispatch} from "react-redux";
import {progressActions} from "../../../../actions/progressActions";
import Buscador from "../../../../components/Buscador";
import {useSelector} from "react-redux";

const style = {
    table: {
        textCenter: {
            textAlign: "center",
            verticalAlign: "middle"
        }
    }
};

export default function EnfundeLoteroList() {
    const {idmodulo} = useParams();
    const [page, setPage] = useState(1);
    const [loadCalendar, setLoadCalendar] = useState(true);
    const [changeSemana, setChangeSemana] = useState({
        status: false,
        codigoSemana: 0
    });
    const [changeSemanaButon, setChangeSemanaButon] = useState(false);
    const [cabeceraSemana, setCabeceraSemana] = useState({
        fecha: moment().format("DD/MM/YYYY"),
        codigoSemana: 0,
        semana: 0,
        periodo: 0,
        colorp: '',
        colorf: ''
    });

    const credential = useSelector((state) => state.credential.credential);
    const [loadLoteros, setLoadLoteros] = useState(!!credential.idhacienda);
    const [loterosSemanal, setLoterosSemanal] = useState(null);
    const [loterosSemanaPendiente, setLoterosSemanaPendiente] = useState([]);

    const [changeURL, setChangeURL] = useState(false);
    const api_buscador = `${API_LINK}/bansis-app/index.php/haciendas-select`;
    const [hacienda, setHacienda] = useState(credential.idhacienda ? credential.idhacienda : null);
    const [searchEmpleado, setSearchEmpleado] = useState('');
    const [apiEmpleado, setApiEmpleado] = useState(`${API_LINK}/bansis-app/index.php/search/empleados${(credential && credential.idhacienda) ? "?hacienda=" + credential.idhacienda.id : ''}`);
    const [empleado, setEmpleado] = useState(null);

    const history = useHistory();
    const dispatch = useDispatch();
    //const progessbarStatus = (state) => dispatch(progressActions(state));

    useEffect(() => {
        if (changeURL) {
            if (hacienda) {
                setApiEmpleado(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}&hacienda=${hacienda.id}`);
            }
            setChangeURL(false);
        }
    }, [changeURL, searchEmpleado, hacienda]);

    useEffect(() => {
        if (!changeSemana.status && changeSemanaButon && !loadCalendar) {
            setPage(1);
            setLoadLoteros(true);
            setChangeSemanaButon(false);
        }
    }, [changeSemana, changeSemanaButon, loadCalendar]);

    useEffect(() => {
        if (loadLoteros && !loadCalendar && cabeceraSemana.codigoSemana !== 0) {
            const progessbarStatus = (state) => dispatch(progressActions(state));
            (async () => {
                progessbarStatus(true);
                let url = `${API_LINK}/bansis-app/index.php/getLotero?calendario=${cabeceraSemana.codigoSemana}&hacienda=${hacienda.id}&page=${page}`;

                if (empleado) {
                    url = `${API_LINK}/bansis-app/index.php/getLotero?calendario=${cabeceraSemana.codigoSemana}&hacienda=${hacienda.id}&empleado=${empleado.id}&page=1`;
                }

                const request = await fetch(url);
                const response = await request.json();

                const {code} = response;
                await progessbarStatus(false);

                if (code === 200) {
                    response.hasOwnProperty('dataArrayPendientes') && setLoterosSemanaPendiente(response.dataArrayPendientes);
                    setLoterosSemanal(response.dataArray);
                }

            })();
            setLoadLoteros(false);
        }
    }, [loadLoteros, loadCalendar, cabeceraSemana, page, changeSemana, dispatch, empleado, hacienda]);

    const changeHacienda = (e, value) => {
        setHacienda(value);
        setChangeURL(true);
        if (value) {
            setLoadLoteros(true);
        } else {
            setLoterosSemanal(null);
        }
    };

    const changeEmpleado = (e, value) => {
        setEmpleado(value);
        setLoadLoteros(true);
        if (!value) {
            setSearchEmpleado('');
            setChangeURL(true);
        }
    };

    const onChangePage = (page) => {
        setPage(page);
        setLoadLoteros(true);
    };

    const irSemanaAnterior = () => {
        setCabeceraSemana({
            ...cabeceraSemana,
            fecha: moment(cabeceraSemana.fecha, "DD-MM-YYYY").subtract(7, 'days').format('DD/MM/YYYY')
        });
        setChangeSemanaButon(true);
        setLoadCalendar(true);
        setChangeSemana({...changeSemana, status: true});
    };

    const irSemanaSiguiente = () => {
        setCabeceraSemana({
            ...cabeceraSemana,
            fecha: moment(cabeceraSemana.fecha, "DD-MM-YYYY").add(7, 'days').format('DD/MM/YYYY')
        });
        setChangeSemanaButon(true);
        setLoadCalendar(true);
        setChangeSemana({...changeSemana, status: true});
    };

    return (
        <div className="container-fluid mt-3 mb-5">
            <Row>
                <Col className="mt-3 mb-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" to="/">
                            Hacienda
                        </Link>
                        <Typography color="textPrimary">Labor</Typography>
                        <Typography color="textPrimary">Enfunde</Typography>
                        <Typography color="textPrimary">Semana</Typography>
                        <Typography color="textPrimary">Loteros</Typography>
                    </Breadcrumbs>
                </Col>
            </Row>
            <div className="row">
                <div className="col-6">
                    <button
                        className="btn btn-danger text-center"
                        onClick={() => history.push(`/hacienda/avances/labor/enfunde/${idmodulo}`)}
                    >
                        <i className="fas fa-arrow-circle-left"/> Regresar
                    </button>
                </div>
            </div>
            <hr/>
            <CabeceraSemana
                title="ENFUNDE SEMANAL"
                loadCalendar={loadCalendar}
                setLoadCalendar={setLoadCalendar}
                changeSemana={changeSemana}
                setChangeSemana={setChangeSemana}
                data={cabeceraSemana}
                setData={setCabeceraSemana}
            />
            <hr/>
            <div className="row mt-4">
                <div className={`${credential && !credential.idhacienda ? "col-md-4" : "d-none"}`}>
                    <div className="form-group">
                        <Buscador
                            api={api_buscador}
                            change={changeHacienda}
                            disabled={credential && credential.idhacienda}
                            id="id-hacienda-search"
                            label="Hacienda"
                            setData={setHacienda}
                            variant="outlined"
                            value={hacienda}
                        />
                    </div>
                </div>
                <div className={`col-md-${credential && !credential.idhacienda ? "8" : "12"}`}>
                    <InputSearch
                        id="asynchronous-empleado"
                        label="Listado de empleados"
                        api_url={apiEmpleado}
                        setSearch={setSearchEmpleado}
                        onChangeValue={changeEmpleado}
                        disabled={false}
                        value={empleado}
                        setChangeURL={setChangeURL}
                    />
                    <FormHelperText id="outlined-weight-helper-text">
                        Puede filtrar los empleados por nombre o codigo de empleado
                    </FormHelperText>
                </div>
            </div>
            {loterosSemanal &&
            <>
                <div className="row mt-3 mb-3">
                    <div className="col-md-2">
                        <button className="btn btn-danger btn-block" onClick={() => irSemanaAnterior()}>
                            <i className="fas fa-arrow-alt-circle-left"/> -1 Sem.
                        </button>
                    </div>
                    <div className="offset-8 col-md-2">
                        <button className="btn btn-primary btn-block" onClick={() => irSemanaSiguiente()}>
                            +1 Sem. <i className="fas fa-arrow-alt-circle-right"/>
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 table-responsive p-0">
                        <table className="table table-bordered table-hover">
                            <thead className="text-center">
                            <tr>
                                <th width="35%">Hacienda</th>
                                <th>Nombre</th>
                                <th width="8%">Despachos</th>
                                <th width="8%">Enfunde</th>
                                <th width="5%">Pre.</th>
                                <th width="5%">Fut.</th>
                                <th width="8%">Accion</th>
                            </tr>
                            </thead>
                            <tbody>
                            {!loadLoteros && loterosSemanal.data.length > 0 &&
                            Object.keys(loterosSemanal.data).map((item) => (
                                <tr key={loterosSemanal.data[item].id} className={`table-sm text-center`}>
                                    <td style={style.table.textCenter}>
                                        {loterosSemanal.data[item].hacienda.descripcion}
                                    </td>
                                    <td style={style.table.textCenter}>
                                        {loterosSemanal.data[item].nombre1} {loterosSemanal.data[item].apellido1} {loterosSemanal.data[item].apellido2}
                                    </td>
                                    <td style={style.table.textCenter}>
                                        <b>{loterosSemanal.data[item].total}</b>
                                    </td>
                                    <td style={style.table.textCenter}>{loterosSemanal.data[item].enfunde}</td>
                                    <td style={style.table.textCenter}>
                                        {loterosSemanal.data[item].presente ?
                                            <i className="fas fa-check-square"/>
                                            :
                                            <i className="fas fa-times"/>
                                        }
                                    </td>
                                    <td style={style.table.textCenter}>
                                        {loterosSemanal.data[item].futuro ?
                                            <i className="fas fa-check-square"/>
                                            :
                                            <i className="fas fa-times"/>}
                                    </td>
                                    <td>
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-success btn-lg"
                                                onClick={() => history.push({
                                                    pathname: `/hacienda/avances/labor/enfunde/${idmodulo}/empleado/formulario`,
                                                    state: {
                                                        hacienda: loterosSemanal.data[item].hacienda,
                                                        empleado: {
                                                            id: loterosSemanal.data[item].id,
                                                            descripcion: loterosSemanal.data[item].nombres
                                                        },
                                                        calendario: cabeceraSemana
                                                    }
                                                })}
                                            >
                                                <i className="fas fa-external-link-alt"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-2 mb-2">
                        <button className="btn btn-info">
                            <i className="fas fa-users"/> Pendientes <span className="badge badge-light">
                        {loterosSemanaPendiente.length}
                    </span>
                        </button>
                    </div>
                    {!loadLoteros && loterosSemanal.data.length > 0 &&
                    <div className="col-12 align-content-center">
                        <PaginationForm
                            current_page={loterosSemanal.current_page}
                            total={loterosSemanal.total}
                            pageSize={5}
                            onChangePage={onChangePage}
                        />
                    </div>
                    }
                </div>
            </>
            }
        </div>
    )
}
