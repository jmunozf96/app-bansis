import React, {useState} from "react";
import CosechaCintasSelect from "../../components/app/cosecha/CosechaCintasSelect";
import {useDispatch, useSelector} from "react-redux";
import CosechaChart from "../../components/app/cosecha/CosechaChart";
import CosechaDetalle from "../../components/app/cosecha/CosechaDetalle";
import CosechaCajasDia from "../../components/app/cosecha/CosechaCajasDia";
import {prepareData, searchData} from "../../reducers/cosecha/cosechaDucks";
import CosechaCintaRecobro from "../../components/app/cosecha/CosechaCintaRecobro";

export default function CosechaRecobro() {
    const dispatch = useDispatch();
    const cinta = useSelector(state => state.cosecha.cinta_select);
    const cintas = useSelector(state => state.cosecha.cintas);

    const [showModalCajas, setShowModalCajas] = useState(false);

    const addCintas = () => {
        dispatch(prepareData(true));
        dispatch(searchData(true));
    };

    return (
        <div className="container-fluid mt-3 mb-3">
            <div className="row">
                <div className="col-12">
                    <ComponentCard>
                        {cintas.map((data, i) =>
                            <div className="col-2" key={i}>
                                <CosechaCintasSelect data={data}/>
                            </div>
                        )}
                        <div className="col-2">
                            <button className="btn btn-danger pb-2" onClick={() => addCintas()}>
                                <i className="fa fa-plus"/>
                            </button>
                        </div>
                    </ComponentCard>
                </div>
                <div className="col-12 mt-3">
                    <ComponentCard>
                       <CosechaCintaRecobro/>
                    </ComponentCard>
                </div>
                <div className="col-12 mt-3">
                    <ComponentCard>
                        <div className="col-12">
                            <CosechaChart/>
                        </div>
                    </ComponentCard>
                </div>
                <div className="col-12 mt-3">
                    <ComponentCard>
                        <div className="col-12 d-flex justify-content-center">
                            <button className="btn btn-primary btn-lg btn-block"
                                    onClick={() => setShowModalCajas(true)}>
                                <i className="fa fa-eye"/> Visualizar Cajas del día
                            </button>
                        </div>
                        {showModalCajas && <CosechaCajasDia show={showModalCajas} setShow={setShowModalCajas}/>}
                    </ComponentCard>
                </div>
                {cinta !== '' &&
                <div className="col-12 mt-3">
                    <ComponentCard>
                        <div className="col-12 table-responsive">
                            <CosechaDetalle/>
                        </div>
                    </ComponentCard>
                </div>
                }
            </div>
        </div>
    )
}


const ComponentCard = ({children}) => {
    return (
        <div className="card">
            <div className="card-body">
                <div className="row">
                    {children}
                </div>
            </div>
        </div>
    )
};
