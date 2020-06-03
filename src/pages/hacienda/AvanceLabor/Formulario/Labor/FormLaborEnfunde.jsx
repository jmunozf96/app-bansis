import React, {useEffect, useState} from "react";
import ListSelect from "../../../../../components/ListSelect";
import {API_LINK, focuselement} from "../../../../../utils/constants";
import InputSearch from "../../../../../components/InputSearch/InputSearch";
import {FormHelperText} from "@material-ui/core";

import shortid from "shortid";
import moment from "moment";
import 'moment/locale/es';

const statusAvanceSemana = ['Presente', 'Futuro'];
const style = {
    table: {
        textCenter: {
            textAlign: "center",
            verticalAlign: "middle"
        }
    }
};

export default function FormLaborEnfunde({cabecera, hacienda, empleado, distribucion, detalles, save}) {
    const [changeStatus, setChangeStatus] = useState(false);
    const [index, setIndex] = useState(0);
    const [semana, setSemana] = useState({
        presente: {status: true, index: 0},
        futuro: {status: false, index: 1}
    });
    const [colorSemana, setColorSemana] = useState(cabecera.colorp);

    //Avances segun labor
    const [loadDataEnfunde, setLoadDataEnfunde] = useState(true);
    const [detallesEnfundePresente, setDetallesEnfundePresente] = useState([]);
    const [detallesEnfundeFuturo, setDetallesEnfundeFuturo] = useState([]);

    const [loadDataDetalle, setLoadDataDetalle] = useState(false);

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
        if (loadDataEnfunde) {
            let array = [];
            const arrayFilterPresente = detalles.filter((item) => item.hasOwnProperty('presente'));
            if (arrayFilterPresente.length > 0) {
                arrayFilterPresente.map((item) => [].push.apply(array, item.presente));
                setDetallesEnfundePresente(array);
            }
            array = [];
            const arrayFilterFuturo = detalles.filter((item) => item.hasOwnProperty('futuro'));
            if (arrayFilterFuturo.length > 0) {
                arrayFilterFuturo.map((item) => [].push.apply(array, item.futuro));
                setDetallesEnfundeFuturo(array);
            }

            setLoadDataDetalle(true);
            setLoadDataEnfunde(false);
        }
    }, [loadDataEnfunde, distribucion, detalles]);

    useEffect(() => {
        if (loadMaterialesInventario) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/search/empleados/${hacienda.id}/${empleado.id}/inventario?indirecto=true&calendario=${cabecera.codigoSemana}`;
                const request = await fetch(url);
                const response = await request.json();
                if (response.length > 0) {
                    await setMaterialesInventario(response[0]['inventario']);
                }
            })();
            setLoadMaterialesInventario(false);
        }
    }, [loadMaterialesInventario, hacienda, empleado, cabecera]);

    useEffect(() => {
        if (changeStatus) {
            if (index !== semana.presente.index) {
                setSemana({
                    presente: {...semana.presente, status: false},
                    futuro: {...semana.futuro, status: true}
                });
                setColorSemana(cabecera.colorf);
            } else {
                setSemana({
                    presente: {...semana.presente, status: true},
                    futuro: {...semana.futuro, status: false}
                });
                setColorSemana(cabecera.colorp);
            }
            setLoadDataDetalle(true);
            setChangeStatus(false);
        }
    }, [changeStatus, semana, index, cabecera]);

    const onChangeReelevo = () => {
        setSearchReelevo(!searchReelevo);
        clearFormulario();
        setLoadDataDetalle(true);
    };

    const destroyReelevo = () => {
        setEmpleadoReelevo(null);
        setSearchReelevo(false);
        clearFormulario();
        setChangeStatus(true);
        setMaterialesInventarioReelevo([]);
        reloadProressbar(true);
        setValue(0);
        setSaldo(0);
    };

    const clearFormulario = () => {
        setMaterialSelect(null);
    };

    const getArrayFilter = () => {
        let arraydata = [];

        if (semana.presente.status) {
            arraydata = detallesEnfundePresente;
        } else {
            arraydata = detallesEnfundeFuturo;
        }

        return arraydata;
    };

    /*const cantidadUsada = (material, reelevo = empleadoReelevo) => {
        let arrayFilter = [];

        if (!reelevo) {
            arrayFilter = getArrayFilter().filter((item) => item.detalle.material.id === material.id && !item.reelevo);
        } else {
            arrayFilter = getArrayFilter().filter((item) => item.detalle.material.id === material.id && (item.reelevo && item.reelevo.id === reelevo.id));
        }

        return arrayFilter.reduce((total, item) => +total + +item.cantidad, 0);
    };*/

    const canChangeCantidad = (cantidad) => {
        if (parseInt(cantidad) <= saldo) {
            setValue(saldo - parseInt(cantidad));
            return true;
        } else {
            setValue(saldo);
            return false;
        }
    };

    const reloadProressbar = (reload) => {
        setprogressStatus({
            ...progressStatus,
            reload
        });
    };

    const addItemtoSemana = (cantidad, desbunche = 0) => {
        const itemSemana = {
            id: shortid.generate(),
            fecha: moment().format("DD/MM/YYYY"),
            distribucion: {
                id: distribucion.id,
                loteSeccion: distribucion.loteSeccion
            },
            cantidad,
            detalle: materialSelect,
            reelevo: empleadoReelevo,
            desbunche
        };

        const itemExists = existeItemtoSemana(itemSemana);

        if (!itemExists.length > 0) {
            if (semana.presente.status) {
                setDetallesEnfundePresente([
                    ...detallesEnfundePresente,
                    itemSemana
                ])
            } else {
                setDetallesEnfundeFuturo([
                    ...detallesEnfundeFuturo,
                    itemSemana
                ])
            }
        } else {
            editItemtoSemana(itemExists[0], itemSemana);
        }

        setSaldo(saldo - cantidad);

        setprogressStatus({
            ...progressStatus,
            reload: true
        });

        setLoadDataDetalle(true);
    };

    const existeItemtoSemana = ({detalle: {material}, reelevo}) => {
        let arrayFilter = [];

        if (!reelevo) {
            arrayFilter = getArrayFilter().filter((item) => item.detalle.material.id === material.id && item.distribucion.id === distribucion.id);
        } else {
            arrayFilter = getArrayFilter().filter((item) => item.detalle.material.id === material.id && item.distribucion.id === distribucion.id && (item.reelevo && item.reelevo.id === reelevo.id));
        }

        return arrayFilter;
    };

    const editItemtoSemana = (item, {cantidad, desbunche}) => {
        item['cantidad'] += +cantidad;
        item['desbunche'] += +desbunche;
    };

    const searchTotalUsadoItem = (material, reelevo) => {
        let arrayFilterP = [];
        let arrayFilterF = [];

        if (!reelevo) {
            arrayFilterP = detallesEnfundePresente.filter((item) => item.detalle.material.id === material.id && !item.reelevo);
            arrayFilterF = detallesEnfundeFuturo.filter((item) => item.detalle.material.id === material.id && !item.reelevo);
        } else {
            arrayFilterP = detallesEnfundePresente.filter((item) => item.detalle.material.id === material.id && (item.reelevo && item.reelevo.id === reelevo.id));
            arrayFilterF = detallesEnfundeFuturo.filter((item) => item.detalle.material.id === material.id && (item.reelevo && item.reelevo.id === reelevo.id));
        }

        return arrayFilterP.reduce((total, item) => +total + +item.cantidad, 0) + arrayFilterF.reduce((total, item) => +total + +item.cantidad, 0);
    };

    const editItemtoSemanaDirect = (item, item_new) => {
        const calculoSaldo = (+item.detalle['sld_final'] - (searchTotalUsadoItem(item.detalle.material, item.reelevo) - +item.cantidad));
        const canChange = +item_new.cantidad <= calculoSaldo;
        if (canChange) {
            if (reloadProgressBarofItemSelect(item_new.detalle.material.id)) {
                if (reloadProgressBarofEmpleadoSelect(item.reelevo)) {
                    setValue(+((calculoSaldo) - +item_new.cantidad));
                    setSaldo(+((calculoSaldo) - +item_new.cantidad));
                    reloadProressbar(true);
                }
            }

            item['cantidad'] = item_new['cantidad'];
            item['desbunche'] = item_new['desbunche'];
            setLoadDataDetalle(true);
            return true;
        }
        return false;
    };

    const destroyItemtoSemana = (data) => {
        const newArray = getArrayFilter().filter((item) => item.id !== data.id);
        if (semana.presente.status) {
            setDetallesEnfundePresente(newArray);
        } else {
            setDetallesEnfundeFuturo(newArray);
        }

        if (reloadProgressBarofItemSelect(data.detalle.material.id)) {
            if (reloadProgressBarofEmpleadoSelect(data.reelevo)) {
                setValue(+value + +data.cantidad);
                setSaldo(+saldo + +data.cantidad);
                reloadProressbar(true);
            }
        }

        setLoadDataDetalle(true);
    };

    const reloadProgressBarofItemSelect = (id) => {
        //En caso de que el material este seleccionado se pueden ahcer ediciones como en la barra de progreso
        if (materialSelect) {
            return materialSelect.material.id === id;
        }
        return false;

    };

    const reloadProgressBarofEmpleadoSelect = (reelevo) => {
        if (empleadoReelevo) {
            return reelevo && (reelevo.id === empleadoReelevo.id);
        } else {
            return true;
        }
    };

    const saveEnfunde = () => {
        const presente = detallesEnfundePresente.filter((item) => item.distribucion.id === distribucion.id);
        const total_presente = presente.reduce((total, item) => total + +item.cantidad, 0);
        const datos_presente = {
            detalle: presente, total: total_presente
        };

        const futuro = detallesEnfundeFuturo.filter((item) => item.distribucion.id === distribucion.id);
        const total_futuro = futuro.reduce((total, item) => total + +item.cantidad, 0);
        const total_desbunchados = futuro.reduce((total, item) => total + +item.desbunche, 0);
        const datos_futuro = {
            detalle: futuro, total: total_futuro, desbunche: total_desbunchados
        };

        save(distribucion, datos_presente, datos_futuro);
    };

    return (
        <div className="container-fluid mt-3">
            <div className="row">
                <div className="col-12">
                    <h5>
                        <i className="fas fa-user"/> {empleado.nombres} |
                        Lote: {distribucion['loteSeccion'].descripcion}
                    </h5>
                </div>
            </div>
            <hr className="mt-0"/>
            <div className="row">
                <div className="col-md-2 mb-3">
                    <div className="row">
                        <div className="col-md-12">
                            {!searchReelevo &&
                            <>
                                <div className="row">
                                    <div className="col-md-12 col-12 mb-2">
                                        <div className="input-group">
                                            <input className="form-control" name={`${colorSemana}-CALENDARIO`}
                                                   type="text"
                                                   disabled={true}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="jumbotron mb-0 jumbotron-fluid p-1 text-center rounded">
                                    <div className="container">
                                        <h1 className="display-4">{distribucion['loteSeccion'].alias}</h1>
                                        <p className="lead">{distribucion['has']} has.</p>
                                    </div>
                                </div>
                                <div className="nav flex-column mb-2 mt-2">
                                    <ListSelect
                                        data={statusAvanceSemana}
                                        index={index}
                                        setStatusData={setIndex}
                                        setChange={setChangeStatus}
                                    />
                                </div>
                                <button
                                    className={`btn btn-success btn-block`}
                                    onClick={() => saveEnfunde()}
                                >
                                    <i className="fas fa-save"/> Guardar Enfunde
                                </button>
                            </>
                            }
                            <button
                                className={`btn btn-${!searchReelevo ? 'primary' : 'danger'} btn-block mb-2`}
                                onClick={() => onChangeReelevo()}
                            >
                                <i className="fas fa-search"/> {!searchReelevo ? 'Buscar Reelevo' : 'Cancelar Busqueda'}
                            </button>
                            {empleadoReelevo && !searchReelevo &&
                            <button
                                className={`btn btn-danger btn-block mb-2`}
                                onClick={() => destroyReelevo()}
                            >
                                <i className="fas fa-times"/> Eliminar Reelevo
                            </button>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-10">
                    <div className="row">
                        {!searchReelevo ?
                            <>
                                <div className="col-md-6">
                                    {(materialesInventario.length > 0 && !loadMaterialesInventario) ?
                                        <MaterialesInventario
                                            materiales={materialesInventario}
                                            setMaterialSelect={setMaterialSelect}
                                            setSaldo={setSaldo}
                                            setValue={setValue}
                                            setLoadDataDetalle={setLoadDataDetalle}
                                            cantidadUsada={searchTotalUsadoItem}
                                            reloadProressbar={reloadProressbar}
                                            reelevo={empleadoReelevo}
                                        />
                                        :
                                        <div className="alert alert-info">
                                            <i className="fas fa-exclamation-circle"/> <b>Advertencia!</b> El empleado
                                            no tiene saldo disponible.
                                        </div>
                                    }
                                </div>
                                <div className="col-md-6">
                                    <div className="row">
                                        {empleadoReelevo &&
                                        <div className="col-md-12 mb-2">
                                            <ProfileReelevo
                                                empleado={empleadoReelevo}
                                            />
                                        </div>
                                        }
                                        <div className={`col-md-12`}>
                                            <StatusSaldoMaterial
                                                material={materialSelect}
                                                value={value}
                                                saldo={saldo}
                                                progressStatus={progressStatus}
                                                setprogressStatus={setprogressStatus}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {materialSelect &&
                                <>
                                    <div className="col-md-12 mt-0 mb-3">
                                        <AvanceSemana
                                            semana={semana}
                                        >
                                            {semana.presente.status ?
                                                <SemanaPresente
                                                    setValue={setValue}
                                                    saldo={saldo}
                                                    reloadProressbar={reloadProressbar}
                                                    addItemtoSemana={addItemtoSemana}
                                                    canChange={canChangeCantidad}
                                                /> :
                                                <SemanaFuturo
                                                    setValue={setValue}
                                                    saldo={saldo}
                                                    reloadProressbar={reloadProressbar}
                                                    addItemtoSemana={addItemtoSemana}
                                                    canChange={canChangeCantidad}
                                                />
                                            }
                                        </AvanceSemana>
                                    </div>
                                </>
                                }
                                <div className="col-md-12 table-responsive">
                                    <DetalleEnfunde
                                        semana={semana}
                                        distribucion={distribucion}
                                        detalles={getArrayFilter}
                                        loadDataDetalle={loadDataDetalle}
                                        setLoadDataDetalle={setLoadDataDetalle}
                                        destroy={destroyItemtoSemana}
                                        edition={editItemtoSemanaDirect}
                                    />
                                </div>
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
        </div>
    );
}

function SemanaPresente(props) {
    const {
        setValue, saldo, canChange, reloadProressbar, addItemtoSemana
    } = props;

    const [cantidad, setCantidad] = useState(0);

    const changeValue = (e) => {
        const cantidad = parseInt((e.target.value));
        if (e.target.value !== undefined) {
            if (canChange(cantidad)) {
                setCantidad(cantidad);
            } else {
                alert("No tiene saldo suficiente");
                resetInput();
            }
        } else {
            setValue(parseInt(saldo));
            resetInput();
        }
        reloadProressbar(true);
    };

    const addCantidad = () => {
        if (cantidad !== undefined && cantidad > 0) {
            addItemtoSemana(cantidad);
            resetInput();
        }
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
                        onKeyDown={(e) => e.keyCode === 13 && addCantidad()}
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

function SemanaFuturo(props) {
    const {
        setValue, saldo, canChange, reloadProressbar, addItemtoSemana
    } = props;

    const [cantidad, setCantidad] = useState(0);
    const [desbunchados, setDesbunchados] = useState(0);

    const changeValue = (e) => {
        const cantidad = parseInt((e.target.value));
        if (e.target.value !== undefined) {
            if (canChange(cantidad)) {
                setCantidad(cantidad);
            } else {
                alert("No tiene saldo suficiente");
                resetInput();
            }
        } else {
            setValue(parseInt(saldo));
            resetInput();
        }
        reloadProressbar(true);
    };

    const changeDesbunche = (e) => {
        if (e.target.value.trim()) {
            if (parseInt(e.target.value) > 0) {
                setDesbunchados(+e.target.value);
            }
        }
    };

    const addCantidad = () => {
        if (cantidad !== undefined && cantidad > 0) {
            addItemtoSemana(cantidad, desbunchados);
            resetInput();
        }
    };

    const resetInput = () => {
        setCantidad(0);
        setDesbunchados(0);
        focuselement('id-cantidad-futuro');
        document.getElementById('id-cantidad-futuro').value = '';
        document.getElementById('id-desbunchados-futuro').value = '';
    };
    return (
        <div className="row">
            <div className="col-md-6">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <b>F</b>
                        </span>
                    </div>
                    <input
                        id='id-cantidad-futuro'
                        className="form-control"
                        type="number"
                        min={0}
                        defaultValue={cantidad}
                        onKeyDown={(e) => e.keyCode === 13 && addCantidad()}
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
            <div className="col-md-3">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className="fas fa-times"/>
                        </span>
                    </div>
                    <input
                        className="form-control"
                        type="number"
                        id='id-desbunchados-futuro'
                        min={0}
                        onKeyDown={(e) => e.keyCode === 13 && addCantidad()}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => changeDesbunche(e)}
                    />
                </div>
                <small>Desbunchados</small>
            </div>
            <div className="col-md-auto">
                <button type="button" className="btn btn-success" onClick={() => addCantidad()}>
                    Agregar
                </button>
            </div>
        </div>
    );
}

function DetalleEnfunde({semana, distribucion, detalles, loadDataDetalle, setLoadDataDetalle, destroy, edition}) {
    const [listData, setListData] = useState([]);

    const [edit, setEdit] = useState(false);
    const [itemEdit, setItemEdit] = useState(null);

    useEffect(() => {
        if (loadDataDetalle) {
            setListData(detalles());
            setLoadDataDetalle(false);
        }
    }, [loadDataDetalle, setLoadDataDetalle, setListData, detalles]);

    const changeEdit = (item) => {
        setEdit(true);
        setItemEdit(item);
        focuselement('id-cantidad-edit');
    };

    const changeCantidad = (e) => {
        const cantidad = parseInt(e.target.value);
        if (cantidad > 0) {
            setItemEdit({
                ...itemEdit,
                cantidad
            });
        }
    };

    const changeDesbunche = (e) => {
        const desbunche = parseInt(e.target.value);
        if (desbunche > 0) {
            setItemEdit({
                ...itemEdit,
                desbunche
            });
        }
    };

    const saveEdit = (item) => {
        if (edition(item, itemEdit)) {
            setItemEdit(null);
            setEdit(false);
        } else {
            alert("sobrepasa el saldo");
        }
    };

    return (
        <table className="table table-bordered">
            <thead className="text-center">
            <tr>
                <th width="5%">...</th>
                <th>Material</th>
                <th width="5%">Lote</th>
                <th width="10%">Cantidad</th>
                <th width="10%">Desbunche</th>
                <th width="20%">Reelevo</th>
                <th width="15%">Accion</th>
            </tr>
            </thead>
            <tbody>
            {listData.length > 0 &&
            listData.map((item) => item.distribucion.id === distribucion.id && (
                <tr key={item.id} className="table-sm text-center">
                    <td style={style.table.textCenter}>
                        <i className="fas fa-receipt"/>
                    </td>
                    <td className="text-left" style={style.table.textCenter}>
                        {item.detalle.material.descripcion}
                    </td>
                    <td className="text-center" style={style.table.textCenter}>
                        {item.distribucion.loteSeccion.alias}
                    </td>
                    <td style={style.table.textCenter}>
                        {edit && itemEdit.id === item.id ?
                            <input
                                id='id-cantidad-edit'
                                type="number"
                                className="form-control text-center"
                                defaultValue={itemEdit.cantidad}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => changeCantidad(e)}
                                onKeyDown={(e) => e.keyCode === 13 && saveEdit(item)}
                            />
                            :
                            item.cantidad
                        }
                    </td>
                    <td style={style.table.textCenter}>
                        {semana.futuro.status && edit && itemEdit.id === item.id ?
                            <input
                                id='id-desbunche-edit'
                                type="number"
                                className="form-control text-center"
                                defaultValue={itemEdit.desbunche}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => changeDesbunche(e)}
                                onKeyDown={(e) => e.keyCode === 13 && saveEdit(item)}
                            />
                            :
                            item.desbunche
                        }
                    </td>
                    <td style={style.table.textCenter}>
                        {item.reelevo && `${item.reelevo.apellido1} ${item.reelevo.nombre1} ${item.reelevo.nombre2}`}
                    </td>
                    <td>
                        <div className="btn-group">
                            {edit && itemEdit.id === item.id ?
                                <button className="btn btn-success" onClick={() => saveEdit(item)}>
                                    <i className="fas fa-save"/>
                                </button>
                                :
                                <button className="btn btn-primary" onClick={() => changeEdit(item)}>
                                    <i className="fas fa-edit"/>
                                </button>
                            }
                            <button className="btn btn-danger" onClick={() => destroy(item)}>
                                <i className="fas fa-trash-alt"/>
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

function ProfileReelevo({empleado}) {
    return (
        <div className="card">
            <div className="card-body p-0">
                <blockquote className="blockquote mb-0 ml-3 mt-3">
                    <p><i className="fas fa-user-circle"/> {empleado.descripcion} - <small><var>Reelevo</var></small>
                    </p>
                </blockquote>
            </div>
        </div>
    )
}

function BuscarReelevos(props) {
    const {
        hacienda, labor, empPrincipal, apiEmpleado, setApiEmpleado,
        empleado, setEmpleado, setMaterialesInventario, setLoadMaterialesInventario,
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
                        <tr key={item.material.id}>
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

function MaterialesInventario(props) {
    const {
        materiales, setMaterialSelect, setSaldo, setValue,
        setLoadDataDetalle, reloadProressbar, cantidadUsada, reelevo
    } = props;

    const onSetValue = (e, value) => {
        setMaterialSelect(value);
        setLoadDataDetalle(true);
        setSaldo(parseInt(value['sld_final']) - +cantidadUsada(value.material, reelevo));
        setValue(parseInt(value['sld_final']) - +cantidadUsada(value.material, reelevo));
        reloadProressbar(true);
    };

    return (
        <div className="row">
            {materiales.map((item) => (
                <div className="input-group col-md-12 mb-3" key={item.id}>
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
                    <div className="input-group-append">
                        <span className="input-group-text"><b>{parseFloat(item['sld_final']).toFixed(2)}</b></span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function StatusSaldoMaterial({value, saldo, progressStatus, setprogressStatus}) {

    useEffect(() => {
        if (progressStatus.reload) {
            let color;
            let porcentaje = 0;

            if (saldo > 0) {
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

                porcentaje = ((value / saldo) * 100).toFixed(0);
            }

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
            <ul className="list-group mb-3">
                <li className="list-group-item">
                                <span className="lead">
                                    Saldo disponible: {parseFloat(saldo).toFixed(2)}
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
        </>
    )
}
