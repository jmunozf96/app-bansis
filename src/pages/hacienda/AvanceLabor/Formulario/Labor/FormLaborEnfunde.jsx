import React, {useEffect, useState} from "react";
import ListSelect from "../../../../../components/ListSelect";
import {API_LINK, focuselement} from "../../../../../utils/constants";
import InputSearch from "../../../../../components/InputSearch/InputSearch";
import {FormHelperText} from "@material-ui/core";

const statusAvanceSemana = ['Presente', 'Futuro'];

export default function FormLaborEnfunde({hacienda, empleado, labor, distribucion, enfunde, setEnfunde}) {
    const [changeStatus, setChangeStatus] = useState(false);
    const [index, setIndex] = useState(0);
    const [semana, setSemana] = useState({
        presente: {status: true, index: 0},
        futuro: {status: false, index: 1}
    });

    const [loadMaterialesInventario, setLoadMaterialesInventario] = useState(true);
    const [materialesInventario, setMaterialesInventario] = useState([]);
    const [materialSelect, setMaterialSelect] = useState(null);
    const [value, setValue] = useState(0);
    const [saldo, setSaldo] = useState(0);

    const [progressStatus, setprogressStatus] = useState({
        reload: true,
        color: 'success',
        porcentaje: 0
    });

    //Empleado reelevo
    const [searchReelevo, setSearchReelevo] = useState(false);
    const [empleadoReelevo, setEmpleadoReelevo] = useState(null);
    const [apiSearchEmpleadoReelevo, setApiSearchEmpleadoReelevo] = useState(`${API_LINK}/bansis-app/index.php/search/empleados?params=&hacienda=${hacienda.id}`);
    const [materialesInventarioReelevo, setMaterialesInventarioReelevo] = useState([]);

    useEffect(() => {
        if (loadMaterialesInventario) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/search/empleados/${hacienda.id}/${empleado.id}/inventario?indirecto=true`;
                const request = await fetch(url);
                const response = await request.json();
                if (response.length > 0) {
                    await setMaterialesInventario(response[0]['inventario']);
                }
            })();
            setLoadMaterialesInventario(false);
        }
    }, [loadMaterialesInventario, hacienda, empleado]);

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
                <div className="col-12">
                    <h5><i className="fas fa-user"/> {empleado.nombres} |
                        Lote: {distribucion['loteSeccion'].descripcion}</h5>
                </div>
            </div>
            <hr className="mt-0"/>
            <div className="row">
                <div className="col-md-4 mb-3">
                    <div className="row">
                        <div className="col-md-12">
                            {!searchReelevo &&
                            <div className="nav flex-column mb-2">
                                <ListSelect
                                    data={statusAvanceSemana}
                                    setStatusData={setIndex}
                                    setChange={setChangeStatus}
                                />
                            </div>
                            }
                            <button
                                className={`btn btn-${!searchReelevo ? 'primary' : 'danger'} btn-block`}
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
                                        setSaldo={setSaldo}
                                        setValue={setValue}
                                    />
                                    }
                                </div>
                                {materialSelect &&
                                <>
                                    <div className="col-md-12">
                                        <StatusSaldoMaterial
                                            material={materialSelect}
                                            value={value}
                                            saldo={saldo}
                                            progressStatus={progressStatus}
                                            setprogressStatus={setprogressStatus}
                                        />
                                    </div>
                                    <div className="col-md-12 mt-0">
                                        <AvanceSemana
                                            semana={semana}
                                        >
                                            {semana.presente.status ?
                                                <SemanaPresente
                                                    datos={enfunde}
                                                    setDatos={setEnfunde}
                                                    setValue={setValue}
                                                    saldo={saldo}
                                                    material={materialSelect}
                                                    reelevo={empleadoReelevo}
                                                    progressStatus={progressStatus}
                                                    setprogressStatus={setprogressStatus}
                                                /> :
                                                <SemanaFuturo
                                                    datos={enfunde}
                                                    setDatos={setEnfunde}
                                                    setValue={value}
                                                    saldo={saldo}
                                                />
                                            }
                                        </AvanceSemana>
                                    </div>
                                </>
                                }
                            </>
                            :
                            <BuscarReelevos
                                hacienda={hacienda}
                                apiEmpleado={apiSearchEmpleadoReelevo}
                                setApiEmpleado={setApiSearchEmpleadoReelevo}
                                empPrincipal={empleado}
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

function SemanaPresente({datos, setDatos, setValue, saldo, material, reelevo, progressStatus, setprogressStatus}) {
    const [cantidad, setCantidad] = useState(0);

    const changeValue = (e) => {
        if (e.target.value.trim()) {
            if (parseInt(e.target.value) <= saldo) {
                setValue(parseInt(saldo) - parseInt(e.target.value));
                setCantidad(parseInt(e.target.value));
            } else {
                setValue(parseInt(saldo));
                alert("No tiene saldo suficiente");
                resetInput();
            }
        } else {
            setValue(parseInt(saldo));
            resetInput();
        }
        setprogressStatus({
            ...progressStatus,
            reload: true
        });
    };

    const addCantidad = (e) => {
        setDatos({
            ...datos,
            presente: {
                cantidad,
                idmaterial: material.id,
                reelevo
            }
        })
    };

    const resetInput = () => {
        setCantidad(0);
        focuselement('id-cantidad-presente');
        document.getElementById('id-cantidad-presente').value = '';
    };

    return (
        <div className="row">
            <div className="col-md-9">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <b>P</b>
                        </span>
                    </div>
                    <input
                        id='id-cantidad-presente'
                        className="form-control"
                        type="number"
                        min={0}
                        defaultValue={cantidad}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => changeValue(e)}
                    />
                    <div className="input-group-append">
                        <span className="input-group-text">
                            <i className="fas fa-hands-wash"/>
                        </span>
                    </div>
                </div>
                <small>Ingrese cantidad de enfunde</small>
            </div>
            <div className="col-md-auto">
                <button type="button" className="btn btn-success" onClick={() => addCantidad()}>
                    Agregar
                </button>
            </div>
        </div>
    );
}

function SemanaFuturo({datos}) {
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
        hacienda, labor, empPrincipal, apiEmpleado, setApiEmpleado, empleado, setEmpleado, setMaterialesInventario, setLoadMaterialesInventario,
        materialesInventarioReelevo, setMaterialesInventarioReelevo
    } = props;

    const [loadInventario, setLoadInventario] = useState(false);
    const [searchEmpleado, setSearchEmpleado] = useState('');
    const [changeURL, setChangeURL] = useState(false);

    useEffect(() => {
        if (changeURL) {
            setApiEmpleado(`${API_LINK}/bansis-app/index.php/search/empleados?params=${searchEmpleado}&hacienda=${hacienda.id}`);
            setChangeURL(false);
        }
    }, [changeURL, searchEmpleado, hacienda, setApiEmpleado]);

    useEffect(() => {
        if (loadInventario) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/search/empleados/${hacienda.id}/${empleado.id}/inventario?indirecto=true`;
                const request = await fetch(url);
                const response = await request.json();
                if (response.length > 0) {
                    await setMaterialesInventario(response[0]['inventario']);
                    await setMaterialesInventarioReelevo(response[0]['inventario']);
                } else {
                    alert("No se encuentran saldos para este empleado");
                    await setEmpleado(null);
                }
            })();
            setLoadInventario(false);
        }
    }, [loadInventario, hacienda, labor, empleado, setMaterialesInventario, setMaterialesInventarioReelevo, setEmpleado]);

    const changeEmpleado = (e, value) => {
        setEmpleado(value);
        if (value) {
            if (value.id !== empPrincipal.id) {
                setLoadInventario(true);
            } else {
                alert("No puede seleccionar al mismo empleado");
                setEmpleado(null);
            }
        } else {
            //En caso de no escoger un reelevo, se debe regresar el inventario del empleado de origen.
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
                    setChangeURL={setChangeURL}
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

function MaterialesInventario({materiales, setMaterialSelect, setSaldo, setValue}) {

    const onSetValue = (e, value) => {
        setMaterialSelect(value);
        setSaldo(parseInt(value['sld_final']));
        setValue(parseInt(value['sld_final']));
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

function StatusSaldoMaterial({material, value, saldo, progressStatus, setprogressStatus}) {

    useEffect(() => {
        if (progressStatus.reload) {
            let color;
            const rango2 = (saldo) * 0.25;
            const rango3 = (saldo) * 0.50;
            const rango4 = (saldo) * 0.75;

            if (value === parseInt(saldo)) {
                color = 'bg-success';
            } else if (value > rango4 && value < parseInt(saldo)) {
                color = 'bg-primary';
            } else if (value > rango3 && value < rango4) {
                color = 'bg-info';
            } else if (value > rango2 && value < rango3) {
                color = 'bg-warning';
            } else {
                color = 'bg-danger';
            }

            const porcentaje = ((value / saldo) * 100).toFixed(0);

            document.getElementById('id-lote-cupo').style.width = `${porcentaje}%`;

            setprogressStatus({
                reload: false,
                color,
                porcentaje: 0
            });
        }
    }, [progressStatus, value, saldo, setprogressStatus]);

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
