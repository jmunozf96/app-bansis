import React, {useEffect, useState} from "react";
import ListSelect from "../../../../components/Tools/ListSelect";
import {API_LINK, focuselement} from "../../../../constants/helpers";

import shortid from "shortid";
import moment from "moment";
import 'moment/locale/es';

const statusAvanceSemana = ['PRESENTE', 'FUTURO'];

const style = {
    table: {
        textCenter: {
            textAlign: "center",
            verticalAlign: "middle"
        }
    }
};

export default function FormEnfundeDetalle(props) {
    const {
        statusEnfunde, cabecera, hacienda, empleado, distribucion,
        detalles, save, itemsToDelete, setItemsToDelete,
        searchReelevo, setSearchReelevo, empleadoReelevo, setEmpleadoReelevo,
        materialesInventarioReelevo, setMaterialesInventarioReelevo
    } = props;

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
    const [loadMaterialesInventario, setLoadMaterialesInventario] = useState(materialesInventarioReelevo.length === 0 && !empleadoReelevo);
    const [materialesInventario, setMaterialesInventario] = useState([]);
    const [materialSelect, setMaterialSelect] = useState(null);
    const [value, setValue] = useState(0);
    const [saldo, setSaldo] = useState(0);

    const [progressStatus, setprogressStatus] = useState({
        reload: true,
        color: 'success',
        porcentaje: 100
    });

    const [reloadComponent, setReloadComponent] = useState(false);
    const [loadAlertEmptyMateriales, setLoadAlertEmptyMateriales] = useState(false);

    const [presente, setPresente] = useState(distribucion.total_presente > 0);

    const [loadDataReelevo, setLoadDataReelevo] = useState(materialesInventarioReelevo.length > 0);
    const [calculateSaldo, setCalculateSaldo] = useState(false);
    const [calculateSaldoReelevo, setCalculateSaldoReelevo] = useState(false);

    const [deleteSectionEnfunde, setDeleteSectionEnfunde] = useState([]);

    useEffect(() => {
        if (presente) {
            setIndex(1);
            setSemana({
                presente: {status: false, index: 0},
                futuro: {status: true, index: 1}
            });
            setChangeStatus(true);
            setReloadComponent(true);
            setPresente(false);
        }
    }, [presente]);

    useEffect(() => {
        if (reloadComponent) {
            setReloadComponent(false);
        }
    }, [reloadComponent]);

    useEffect(() => {
        if (loadDataEnfunde) {
            let array = [];
            const arrayFilterPresente = detalles.filter((item) => item.hasOwnProperty('presente'));
            if (arrayFilterPresente.length > 0) {
                arrayFilterPresente.map((item) => [].push.apply(array, item.presente));
                setDetallesEnfundePresente(array.map((item) => ({...item, cerrado: statusEnfunde.status_presente})));
            }
            array = [];
            const arrayFilterFuturo = detalles.filter((item) => item.hasOwnProperty('futuro'));
            if (arrayFilterFuturo.length > 0) {
                arrayFilterFuturo.map((item) => [].push.apply(array, item.futuro));
                setDetallesEnfundeFuturo(array.map((item) => ({...item, cerrado: statusEnfunde.status_futuro})));
            }
            setLoadDataDetalle(true);
            setLoadDataEnfunde(false);
        }
    }, [loadDataEnfunde, distribucion, detalles]);

    useEffect(() => {
        if (loadMaterialesInventario && !loadDataEnfunde) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/search/empleados/${hacienda.id}/${empleado.id}/inventario?indirecto=true&calendario=${cabecera.codigoSemana}`;
                const request = await fetch(url);
                const response = await request.json();
                if (response.length > 0) {
                    setMaterialesInventario(response[0]['inventario']);
                    const materialInventario = response[0]['inventario'][0];
                    if (materialInventario !== undefined) {
                        setMaterialSelect(materialInventario);
                        setCalculateSaldo(true);
                    }
                } else {
                    setLoadAlertEmptyMateriales(true);
                }
            })();
            setLoadMaterialesInventario(false);
        }
    }, [loadMaterialesInventario, hacienda, empleado, cabecera, loadDataEnfunde]);

    useEffect(() => {
        if (calculateSaldo) {
            if (materialSelect) {
                const {material} = materialSelect;

                //Array de eliminados sin confirmar
                const arrayDeleteMaterialPrepare = deleteSectionEnfunde.filter((item) => item.material === material.id && !item.reelevo);
                const saldoEliminadosPrepare = arrayDeleteMaterialPrepare.reduce((total, item) => +total + item.cantidad, 0);
                //Array de eliminados confirmados
                const arrayDeleteMaterial = itemsToDelete.filter((item) => item.material === material.id && !item.reelevo);
                const saldoEliminados = arrayDeleteMaterial.reduce((total, item) => +total + item.cantidad, 0);
                const arrayFilterP = detallesEnfundePresente.filter((item) => item.detalle.material.id === material.id
                    && (!item.hasOwnProperty('contabilizar')
                        || (item.hasOwnProperty('contabilizar') && item.hasOwnProperty('edicion')))
                    && !item.reelevo);
                const arrayFilterF = detallesEnfundeFuturo.filter((item) => item.detalle.material.id === material.id
                    && (!item.hasOwnProperty('contabilizar')
                        || (item.hasOwnProperty('contabilizar') && item.hasOwnProperty('edicion')))
                    && !item.reelevo);
                const total = arrayFilterP.reduce((total, item) => +total +
                    (item.hasOwnProperty('edicion') ? +item.edicion : +item.cantidad), 0) +
                    arrayFilterF.reduce((total, item) => +total +
                        (item.hasOwnProperty('edicion') ? +item.edicion : +item.cantidad), 0);

                setValue((+materialSelect['sld_final'] - total) + saldoEliminados + saldoEliminadosPrepare);
                setSaldo((+materialSelect['sld_final'] - total) + saldoEliminados + saldoEliminadosPrepare);
                setCalculateSaldo(false);
                setprogressStatus({...progressStatus, reload: true});
            }
        }
    }, [calculateSaldo, materialSelect, detallesEnfundePresente, detallesEnfundeFuturo, progressStatus, itemsToDelete, deleteSectionEnfunde]);

    useEffect(() => {
        if (loadDataReelevo) {
            setMaterialesInventario(materialesInventarioReelevo);
            const material = materialesInventarioReelevo[0];
            setMaterialSelect(material);
            setCalculateSaldoReelevo(true);
            setLoadDataReelevo(false);
        }
    }, [detallesEnfundeFuturo, detallesEnfundePresente, loadDataReelevo, materialesInventarioReelevo]);

    useEffect(() => {
        if (calculateSaldoReelevo) {
            if (materialSelect && empleadoReelevo) {
                const {material} = materialSelect;
                const arrayDeleteMaterialPrepare = deleteSectionEnfunde.filter((item) => item.material === material.id && item.reelevo && item.reelevo.id === empleadoReelevo.id);
                const saldoEliminadosPrepare = arrayDeleteMaterialPrepare.reduce((total, item) => +total + item.cantidad, 0);

                const arrayDeleteMaterial = itemsToDelete.filter((item) => item.material === material.id && item.reelevo && item.reelevo.id === empleadoReelevo.id);
                const saldoEliminados = arrayDeleteMaterial.reduce((total, item) => +total + item.cantidad, 0);

                const arrayFilterP = detallesEnfundePresente.filter((item) => item.detalle.material.id === material.id
                    && (item.reelevo && item.reelevo.id === empleadoReelevo.id)
                    && (!item.hasOwnProperty('contabilizar')
                        || (item.hasOwnProperty('contabilizar') && item.hasOwnProperty('edicion'))));
                const arrayFilterF = detallesEnfundeFuturo.filter((item) => item.detalle.material.id === material.id
                    && (item.reelevo && item.reelevo.id === empleadoReelevo.id)
                    && (!item.hasOwnProperty('contabilizar')
                        || (item.hasOwnProperty('contabilizar') && item.hasOwnProperty('edicion'))));
                const total = arrayFilterP.reduce((total, item) => +total +
                    (item.hasOwnProperty('edicion') ? +item.edicion : +item.cantidad), 0) +
                    arrayFilterF.reduce((total, item) => +total +
                        (item.hasOwnProperty('edicion') ? +item.edicion : +item.cantidad), 0);
                setValue((+materialSelect['sld_final'] - total) + saldoEliminados + saldoEliminadosPrepare);
                setSaldo((+materialSelect['sld_final'] - total) + saldoEliminados + saldoEliminadosPrepare);
                setprogressStatus({...progressStatus, reload: true});
                setCalculateSaldoReelevo(false);
            }
        }
    }, [calculateSaldoReelevo, materialSelect, detallesEnfundePresente, detallesEnfundeFuturo,
        progressStatus, itemsToDelete, empleadoReelevo, deleteSectionEnfunde]);

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
    }, [changeStatus, semana, index, cabecera, distribucion]);


    const destroyReelevo = () => {
        setEmpleadoReelevo(null);
        setSearchReelevo(false);
        clearFormulario();
        setChangeStatus(true);
        setMaterialesInventarioReelevo([]);
        setValue(0);
        setSaldo(0);
        reloadProressbar(true);
        setLoadMaterialesInventario(true);
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

    const canChangeCantidad = (cantidad) => {
        if (cantidad !== undefined) {
            if (parseInt(cantidad) <= saldo) {
                setValue(saldo - parseInt(cantidad));
                return true;
            } else {
                setValue(saldo);
                return false;
            }
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

    const existeItemtoSemana = ({detalle: {material}, reelevo, distribucion}) => {
        let arrayFilter = [];
        if (reelevo === null) {
            arrayFilter = getArrayFilter().filter((item) => item.detalle.material.id === material.id && item.distribucion.id === distribucion.id && item.reelevo === null);
        } else {
            arrayFilter = getArrayFilter().filter((item) => item.detalle.material.id === material.id && item.distribucion.id === distribucion.id && (item.reelevo && item.reelevo.id === reelevo.id));
        }

        return arrayFilter;
    };

    const editItemtoSemana = (item, {cantidad, desbunche}) => {
        if (item.hasOwnProperty('contabilizar')) {
            //En caso de que se edite un valor contabilizado es un caso especial
            item['edicion'] += +cantidad;
        }
        item['cantidad'] += +cantidad;
        item['desbunche'] += +desbunche;
    };

    const totalMAterialUsadoSinContabilizar = (material, reelevo) => {
        //Contabilizar todo lo que se ha ocupado en los lotes
        const arrayFilterP = detallesEnfundePresente.filter((item) => item.detalle.material.id === material.id
            //Si no esta contabilizado con el saldo final del material
            && (!item.hasOwnProperty('contabilizar')
                || (item.hasOwnProperty('contabilizar') && item.hasOwnProperty('edicion')))
            //En caso de haber un empleado reelevo o en caso de que no
            && ((!reelevo && !item.reelevo) || (reelevo && (item.reelevo && item.reelevo.id === reelevo.id))));
        const arrayFilterF = detallesEnfundeFuturo.filter((item) => item.detalle.material.id === material.id
            //Si no esta contabilizado con el saldo final del material
            && (!item.hasOwnProperty('contabilizar')
                || (item.hasOwnProperty('contabilizar') && item.hasOwnProperty('edicion')))
            //En caso de haber un empleado reelevo o en caso de que no
            && ((!reelevo && !item.reelevo) || (reelevo && (item.reelevo && item.reelevo.id === reelevo.id))));
        return arrayFilterP.reduce((total, item) => +total +
            (item.hasOwnProperty('edicion') ? +item.edicion : +item.cantidad), 0) +
            arrayFilterF.reduce((total, item) => +total +
                (item.hasOwnProperty('edicion') ? +item.edicion : +item.cantidad), 0);
    };

    const itemsEliminadosCantidad = (material, reelevo) => {
        const arrayDeleteMaterialPrepare = deleteSectionEnfunde.filter((item) => item.material === material.id
            && ((!reelevo && !item.reelevo) || (reelevo && (item.reelevo && item.reelevo.id === reelevo.id))));
        const saldoEliminadosPrepare = arrayDeleteMaterialPrepare.reduce((total, item) => +total + item.cantidad, 0);

        const arrayDeleteMaterial = itemsToDelete.filter((item) => item.material === material.id && item.reelevo
            && ((!reelevo && !item.reelevo) || (reelevo && (item.reelevo && item.reelevo.id === reelevo.id))));
        const saldoEliminados = arrayDeleteMaterial.reduce((total, item) => +total + item.cantidad, 0);

        return saldoEliminadosPrepare + saldoEliminados;
    };

    const editItemtoSemanaDirect = (item, item_new) => {
        const cant_anterior = +item.cantidad;
        const nw_cantidad = +item_new.cantidad;
        const saldo_final = +item.detalle.sld_final;
        let canChangeValue = 0;
        let aumentaSaldo = 0;

        if (item.reelevo === null) {
            canChangeValue = totalMAterialUsadoSinContabilizar(item.detalle.material);
            aumentaSaldo = itemsEliminadosCantidad(item.detalle.material);
        } else if (item.reelevo) {
            canChangeValue = totalMAterialUsadoSinContabilizar(item.detalle.material, item.reelevo);
            aumentaSaldo = itemsEliminadosCantidad(item.detalle.material, item.reelevo);
        }

        canChangeValue = ((saldo_final + aumentaSaldo) - (canChangeValue - cant_anterior));

        if (canChangeValue >= nw_cantidad) {
            if (item.hasOwnProperty('contabilizar')) {
                //En caso de que se edite un valor contabilizado es un caso especial
                const diferencia = nw_cantidad - cant_anterior;
                if (diferencia < 0) {
                    //Obtener la diferencia
                    item['edicion'] += diferencia;
                } else {
                    item['edicion'] = nw_cantidad - (cant_anterior - +item['edicion']);
                }
            }

            item['cantidad'] = nw_cantidad;
            item['desbunche'] = item_new['desbunche'];

            if (empleadoReelevo === null) {
                if (+materialSelect.material.id === +item.detalle.material.id && item.reelevo === null) {
                    setCalculateSaldo(true);
                }
            } else {
                if (+materialSelect.material.id === +item.detalle.material.id && item.reelevo && (+item.reelevo.id === +empleadoReelevo.id)) {
                    setCalculateSaldoReelevo(true);
                }
            }

            setLoadDataDetalle(true);
            return true;
        } else {
            return false;
        }
    };

    const destroyItemtoSemana = (data) => {
        const newArray = getArrayFilter().filter((item) => item.id !== data.id);

        if (semana.presente.status) {
            setDetallesEnfundePresente(newArray);
        } else {
            setDetallesEnfundeFuturo(newArray);
        }

        if (data.reelevo) {
            setCalculateSaldoReelevo(true);
        } else {
            setCalculateSaldo(true);
        }

        const delete_enfunde = {
            id: shortid.generate(),
            material: data.detalle.material.id,
            seccion: data.distribucion.id,
            hacienda: cabecera.hacienda.id,
            calendario: cabecera.codigoSemana,
            cantidad: data.cantidad,
            reelevo: data.reelevo,
            presente: semana.presente.status,
            futuro: semana.futuro.status
        };

        if (data.hasOwnProperty('contabilizar')) {
            setDeleteSectionEnfunde([
                ...deleteSectionEnfunde,
                delete_enfunde
            ]);
        }
        setLoadDataDetalle(true);
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

        if (deleteSectionEnfunde.length > 0) {
            setItemsToDelete(itemsToDelete.concat(deleteSectionEnfunde));
            setDeleteSectionEnfunde([]);
        }

        save(distribucion, datos_presente, datos_futuro);
    };

    return (
        <div className="container-fluid mt-3">
            <div className="row">
                <div className="col-12">
                    <h5>
                        <i className="fas fa-user"/> {empleado.descripcion} |
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
                                    {!reloadComponent &&
                                    <ListSelect
                                        data={statusAvanceSemana}
                                        index={index}
                                        setStatusData={setIndex}
                                        setChange={setChangeStatus}
                                    />}
                                </div>
                                <button
                                    className={`btn btn-primary btn-block btn-lg`}
                                    onClick={(statusEnfunde && statusEnfunde.status_presente && statusEnfunde.status_futuro) ? null : () => saveEnfunde()}
                                >
                                    <i className="fas fa-check-circle"/> Confirmar
                                </button>
                            </>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-10">
                    <div className="row">
                        <div className="col-md-6">
                            {(materialesInventario.length > 0 && !loadMaterialesInventario) ?
                                <MaterialesInventario
                                    materiales={materialesInventario}
                                    setMaterialSelect={setMaterialSelect}
                                    setLoadDataDetalle={setLoadDataDetalle}
                                    reloadProressbar={reloadProressbar}
                                    loadSaldo={empleadoReelevo === null ? setCalculateSaldo : setCalculateSaldoReelevo}
                                />
                                :
                                <>
                                    {loadAlertEmptyMateriales &&
                                    <div className="alert alert-info">
                                        <i className="fas fa-exclamation-circle"/> <b>Advertencia!</b> El
                                        empleado
                                        no tiene saldo disponible.
                                    </div>
                                    }
                                </>
                            }
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                {empleadoReelevo &&
                                <div className="col-md-12 mb-2">
                                    <ProfileReelevo
                                        empleado={empleadoReelevo}
                                    />
                                    {empleadoReelevo && !searchReelevo &&
                                    <button
                                        className={`btn btn-danger btn-block mt-1 btn-lg`}
                                        onClick={() => destroyReelevo()}
                                    >
                                        <i className="fas fa-times"/> Quitar reelevo
                                    </button>
                                    }
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
                        <div className="col-md-12">
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
                    </div>
                </div>
            </div>
        </div>
    )
}

function AvanceSemana({semana, children}) {
    return (
        <div>
            <hr className="mt-1"/>
            {children}
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
        if (e.target.value !== undefined && e.target.value !== "") {
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
                        autoFocus={true}
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
                    Agregar enfunde
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
        if (e.target.value !== undefined && e.target.value !== "") {
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
                        autoFocus={true}
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
                    Agregar enfunde
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
        console.log(item);
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
                <th>Material</th>
                <th width="5%">Lote</th>
                <th width="8%">Cant.</th>
                <th width="8%">Desb.</th>
                <th width="15%">Reelevo</th>
                <th width="10%">Accion</th>
            </tr>
            </thead>
            <tbody>
            {listData.length > 0 &&
            listData.map((item) => item.distribucion.id === distribucion.id && (
                <tr key={item.id} className="text-center">
                    <td className="text-left" style={style.table.textCenter}>
                        <span className="badge badge-light">{item.detalle.material.descripcion}</span>
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
                        <span className="badge badge-light">
                            {item.reelevo && `${item.reelevo.apellido1} ${item.reelevo.nombre1}`}
                        </span>
                    </td>
                    <td>
                        {!item.cerrado ?
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
                            :
                            <span className="badge badge-danger">
                                <i className="fas fa-lock"/> Cerrado
                            </span>
                        }
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

function MaterialesInventario(props) {
    const {
        materiales, setMaterialSelect,
        setLoadDataDetalle, reloadProressbar, loadSaldo
    } = props;

    const onSetValue = (value) => {
        setMaterialSelect(value);
        setLoadDataDetalle(true);
        loadSaldo(true);
        reloadProressbar(true);
    };

    return (
        <div className="row">
            {materiales.map((item, i) => (
                <div className="input-group col-md-12 mb-3" key={item.id}>
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <input
                                type="radio"
                                name="materiales"
                                defaultChecked={i === 0}
                                onChange={() => onSetValue(item)}
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

                porcentaje = ((+value / +saldo) * 100).toFixed(0);
            }

            document.getElementById('id-lote-cupo').style.width = `${porcentaje}%`;

            setprogressStatus({
                reload: false,
                color,
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
                        />
                    </div>
                </li>
            </ul>
        </>
    )
}
