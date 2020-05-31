import React, {useEffect, useState} from "react";
import ListSelect from "../../../../../components/ListSelect";
import {API_LINK} from "../../../../../utils/constants";
import InputSearch from "../../../../../components/InputSearch/InputSearch";
import {FormHelperText} from "@material-ui/core";

const statusAvanceSemana = ['Presente', 'Futuro'];

export default function FormLaborEnfunde() {
    const [changeStatus, setChangeStatus] = useState(false);
    const [index, setIndex] = useState(0);
    const [semana, setSemana] = useState({
        presente: {status: true, index: 0},
        futuro: {status: false, index: 1}
    });

    const [loadMaterialesInventario, setLoadMaterialesInventario] = useState(true);
    const [materialesInventario, setMaterialesInventario] = useState([]);
    const [materialSelect, setMaterialSelect] = useState(null);

    const [searchReelevo, setSearchReelevo] = useState(false);
    const [empleadoReelevo, setEmpleadoReelevo] = useState(null);
    const [apiSearchEmpleadoReelevo, setApiSearchEmpleadoReelevo] = useState(`${API_LINK}/bansis-app/index.php/search/empleados/1/2/inventario`);
    const [materialesInventarioReelevo, setMaterialesInventarioReelevo] = useState([]);

    useEffect(() => {
        if (loadMaterialesInventario) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/search/empleados/1/2/inventario?indirecto=true`;
                const request = await fetch(url);
                const response = await request.json();
                if (response.length > 0) {
                    await setMaterialesInventario(response[0]['inventario']);
                }
            })();
            setLoadMaterialesInventario(false);
        }
    }, [loadMaterialesInventario]);

    useEffect(() => {
        if (changeStatus) {
            if (index !== semana.presente.index) {
                setSemana({
                    presente: {...semana.presente, status: false},
                    futuro: {...semana.futuro, status: true}
                })
            } else {
                setSemana({
                    presente: {...semana.presente, status: true},
                    futuro: {...semana.futuro, status: false}
                })
            }
            setChangeStatus(false);
        }
    }, [changeStatus, semana, index]);

    const onChangeReelevo = () => {
        setSearchReelevo(!searchReelevo);
        clearFormulario();
    };

    const clearFormulario = () => {
        setMaterialSelect(null);
    };

    return (
        <div className="container-fluid mt-3">
            <div className="row">
                <div className="col-md-4 mb-3">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="nav flex-column">
                                <ListSelect
                                    data={statusAvanceSemana}
                                    setStatusData={setIndex}
                                    setChange={setChangeStatus}
                                />
                            </div>
                            <button
                                className={`btn btn-${!searchReelevo ? 'primary' : 'danger'} btn-block mt-2`}
                                onClick={() => onChangeReelevo()}
                            >
                                <i className="fas fa-search"/> {!searchReelevo ? 'Buscar Reelevo' : 'Cancelar Busqueda'}
                            </button>
                        </div>
                        {empleadoReelevo &&
                        <div className="col-md-12 mt-2">
                            <ProfileReelevo
                                empleado={empleadoReelevo}
                            />
                        </div>
                        }
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="row">
                        {!searchReelevo ?
                            <>
                                <div className="col-md-12">
                                    {(materialesInventario.length > 0 && !loadMaterialesInventario) &&
                                    <MaterialesInventario
                                        materiales={materialesInventario}
                                        setMaterialSelect={setMaterialSelect}
                                    />
                                    }
                                </div>
                                {materialSelect &&
                                <>
                                    <div className="col-md-12">
                                        <StatusSaldoMaterial
                                            material={materialSelect}/>
                                    </div>
                                    <div className="col-md-12 mt-0">
                                        <AvanceSemana
                                            semana={semana}
                                        >
                                            {semana.presente.status ?
                                                <SemanaPresente/> : <SemanaFuturo/>
                                            }
                                        </AvanceSemana>
                                    </div>
                                </>
                                }
                            </>
                            :
                            <BuscarReelevos
                                apiEmpleado={apiSearchEmpleadoReelevo}
                                empleado={empleadoReelevo}
                                setEmpleado={setEmpleadoReelevo}
                                setMaterialesInventario={setMaterialesInventario}
                                setLoadMaterialesInventario={setLoadMaterialesInventario}
                                materialesInventarioReelevo={materialesInventarioReelevo}
                                setMaterialesInventarioReelevo={setMaterialesInventarioReelevo}
                            />
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

function MaterialesInventario({materiales, setMaterialSelect}) {

    const onSetValue = (e, value) => {
        setMaterialSelect(value)
    };

    return (
        <div className="row">
            {materiales.map((item) => (
                <div className="input-group col-md-6 mb-3" key={item.id}>
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <input
                                type="radio"
                                name="materiales"
                                onChange={(e) => onSetValue(e, item)}
                            />
                        </div>
                    </div>
                    <input type="text" className="form-control bg-white" value={item.material.descripcion}
                           aria-label="Text input with radio button" disabled/>
                </div>
            ))}
        </div>
    );
}

function AvanceSemana({semana, children}) {
    return (
        <div className="card">
            <div className="card-header">
                Enfunde {semana.presente.status ? 'Presente' : 'Futuro'}
            </div>
            <div className="card-body">
                {children}
            </div>
            <div className="card-footer">
            </div>
        </div>
    );
}

function SemanaPresente() {
    return (
        <div className="row">
            <div className="col-md-9">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <b>P</b>
                        </span>
                    </div>
                    <input className="form-control" type="number" min={0}/>
                    <div className="input-group-append">
                        <span className="input-group-text">
                            <i className="fas fa-hands-wash"/>
                        </span>
                    </div>
                </div>
                <small>Ingrese cantidad de enfunde</small>
            </div>
            <div className="col-md-auto">
                <button type="button" className="btn btn-success">
                    Agregar
                </button>
            </div>
        </div>
    );
}

function SemanaFuturo() {
    return (
        <div className="row">
            <div className="col-md-6">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <b>F</b>
                        </span>
                    </div>
                    <input className="form-control" type="number" min={0}/>
                    <div className="input-group-append">
                        <span className="input-group-text">
                            <i className="fas fa-hands-wash"/>
                        </span>
                    </div>
                </div>
                <small>Ingrese cantidad de enfunde</small>
            </div>
            <div className="col-md-3">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className="fas fa-times"/>
                        </span>
                    </div>
                    <input className="form-control" type="number" min={0}/>
                </div>
                <small>Desbunchados</small>
            </div>
            <div className="col-md-auto">
                <button type="button" className="btn btn-success">
                    Agregar
                </button>
            </div>
        </div>
    );
}

function ProfileReelevo({empleado}) {
    return (
        <div className="card mt-3">
            <div className="card-body">
                <blockquote className="blockquote mb-0">
                    <p><i className="fas fa-user-circle"/> {empleado.descripcion}</p>
                    <footer className="blockquote-footer">
                        Empleado Reelevo. {" "}
                        <cite title="Source Title">
                            CI: {empleado.cedula}
                        </cite>
                    </footer>
                </blockquote>
            </div>
        </div>
    )
}

function BuscarReelevos(props) {
    const {
        apiEmpleado, empleado, setEmpleado, setMaterialesInventario, setLoadMaterialesInventario,
        materialesInventarioReelevo, setMaterialesInventarioReelevo
    } = props;

    const [searchEmpleado, setSearchEmpleado] = useState('');

    const changeEmpleado = (e, value) => {
        setEmpleado(value);
        if (value) {
            setMaterialesInventario(value['inventario']);
            setMaterialesInventarioReelevo(value['inventario']);
        } else {
            setLoadMaterialesInventario(true);
            setMaterialesInventarioReelevo([]);
        }
    };

    return (
        <>
            <div className="col-md-12">
                <InputSearch
                    id="asynchronous-empleado"
                    label="Listado de empleados"
                    api_url={apiEmpleado}
                    setSearch={setSearchEmpleado}
                    onChangeValue={changeEmpleado}
                    value={empleado}
                />
                <FormHelperText id="outlined-weight-helper-text">
                    Puede filtrar los empleados por nombre o numero de cedula
                </FormHelperText>
            </div>
            <div className="col-md-12 table-responsive mt-3">
                {materialesInventarioReelevo.length > 0 &&
                <table className="table table-bordered table-hover">
                    <thead className="text-center">
                    <tr>
                        <th>Material</th>
                        <th>Saldo</th>
                    </tr>
                    </thead>
                    <tbody>
                    {materialesInventarioReelevo.map((item) => (
                        <tr>
                            <td>{item.material.descripcion}</td>
                            <td className="text-center"><b>{parseFloat(item['sld_final']).toFixed(2)}</b></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                }
            </div>
        </>
    )
}

function StatusSaldoMaterial({material, value = parseFloat(material['sld_final'])}) {
    const [progressStatus, setprogressStatus] = useState({
        reload: true,
        color: 'success',
        porcentaje: 0
    });
    const [saldo, setSaldo] = useState(parseFloat(material['sld_final']));

    useEffect(() => {
        if (progressStatus.reload) {
            let color;
            const rango2 = (saldo) * 0.25;
            const rango3 = (saldo) * 0.50;
            const rango4 = (saldo) * 0.75;

            if ((value).toFixed(2) === (saldo).toFixed(2)) {
                color = 'bg-success';
            } else if (value > rango4 && value < (saldo).toFixed(2)) {
                color = 'bg-primary';
            } else if (value > rango3 && value < rango4) {
                color = 'bg-info';
            } else if (value > rango2 && value < rango3) {
                color = 'bg-warning';
            } else {
                color = 'bg-danger';
            }

            const porcentaje = (value / saldo) * 100;

            setprogressStatus({
                reload: false,
                color,
                porcentaje
            });
        }
    }, [progressStatus, value, saldo]);

    return (
        <>
            {!progressStatus.reload &&
            <ul className="list-group mb-3">
                <li className="list-group-item">
                                <span className="lead">
                                    Saldo disponible: {parseFloat(material['sld_final']).toFixed(2)}
                                </span>
                    <div className="progress mt-2">
                        <div className={`progress-bar ${progressStatus.color}`} role="progressbar"
                             id="id-lote-cupo"
                             aria-valuenow="0"
                             aria-valuemin="0"
                             aria-valuemax="100"
                             style={{width: `${progressStatus.porcentaje}%`}}
                        />
                    </div>
                </li>
            </ul>
            }
        </>
    )
}