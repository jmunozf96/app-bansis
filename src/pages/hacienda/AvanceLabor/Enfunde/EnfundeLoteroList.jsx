import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import {useHistory} from "react-router-dom";
import CabeceraSemana from "../../CabeceraSemana";
import moment from "moment";
import {API_LINK} from "../../../../utils/constants";
import InputSearch from "../../../../components/InputSearch/InputSearch";
import {FormHelperText} from "@material-ui/core";
import PaginationForm from "../../../../components/Pagination/Pagination";

const style = {
    table: {
        textCenter: {
            textAlign: "center",
            verticalAlign: "middle"
        }
    }
};

export default function EnfundeLoteroList() {
    const [page, setPage] = useState(1);
    const [loadCalendar, setLoadCalendar] = useState(true);
    const [changeSemana, setChangeSemana] = useState({
        status: false,
        codigoSemana: 0
    });
    const [cabeceraSemana, setCabeceraSemana] = useState({
        fecha: moment().format("DD/MM/YYYY"),
        codigoSemana: 0,
        semana: 0,
        periodo: 0,
        colorp: '',
        colorf: ''
    });

    const [loadLoteros, setLoadLoteros] = useState(true);
    const [loterosSemanal, setLoterosSemanal] = useState(null);
    const [loterosSemanaPendiente, setLoterosSemanaPendiente] = useState([]);

    const [changeURL, setChangeURL] = useState(false);
    const [searchEmpleado, setSearchEmpleado] = useState('');
    const [apiEmpleado, setApiEmpleado] = useState(`${API_LINK}/bansis-app/index.php/search/empleados`);
    const [empleado, setEmpleado] = useState(null);

    const history = useHistory();

    useEffect(() => {
        if (changeURL) {
            setApiEmpleado(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}`);
            setChangeURL(false);
        }
    }, [changeURL, searchEmpleado]);

    useEffect(() => {
        if (loadLoteros && !loadCalendar && cabeceraSemana.codigoSemana !== 0) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/getLotero?calendario=${cabeceraSemana.codigoSemana}&page=${page}`;
                const request = await fetch(url);
                const response = await request.json();
                const {code} = response;
                if (code === 200) {
                    response.hasOwnProperty('dataArrayPendientes') && setLoterosSemanaPendiente(response.dataArrayPendientes);
                    setLoterosSemanal(response.dataArray);
                }

            })();
            setLoadLoteros(false);
        }
    }, [loadLoteros, loadCalendar, cabeceraSemana, page]);

    const changeEmpleado = (e, value) => {
        setEmpleado(value);
        if (value) {

        } else {

        }
    };

    const onChangePage = (page) => {
        setPage(page);
        setLoadLoteros(true);
    };

    return (
        <div className="container-fluid mt-3 mb-5">
            <Row>
                <Col className="mb-3">
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
                <div className="btn-group col-5">
                    <button
                        className="btn btn-danger col-1 text-center"
                        onClick={() => history.push(`/hacienda/avances/labor/enfunde`)}
                    >
                        <i className="fas fa-arrow-circle-left"/>
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
                <div className="col-md-12">
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
            <div className="row">
                <div className="col-12 mt-3 mb-2">
                    <button className="btn btn-info">
                        <i className="fas fa-users"/> Loteros Pendientes <span className="badge badge-light">
                        {loterosSemanaPendiente.length}
                    </span>
                    </button>
                </div>
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
                                        <button className="btn btn-primary">
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
            }
        </div>
    )
}
