import React from "react";
import CosechaCintasSelect from "./CosechaCintasSelect";
import {useSelector} from "react-redux";
import CosechaChart from "./CosechaChart";
import CosechaDetalle from "./CosechaDetalle";

export default function CosechaRecobro() {
    const cinta = useSelector(state => state.cosecha.cinta_select);
    const cintas = useSelector(state => state.cosecha.cintas);

    return (
        <div className="container-fluid mt-3 mb-3">
            <div className="row">
                <div className="col-12">
                    <ComponentCard>
                        {cintas.map((data, i) =>
                            <div className="col-3" key={i}>
                                <CosechaCintasSelect data={data}/>
                            </div>
                        )}
                    </ComponentCard>
                </div>
                <div className="col-12 mt-3">
                    <ComponentCard>
                        <div className="col-12">
                            <CosechaChart/>
                        </div>
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
}
