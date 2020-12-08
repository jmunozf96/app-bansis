import React from "react";
import {useSelector} from "react-redux";

export default function CosechaCintaRecobro() {
    const cinta_Select = useSelector(state => state.cosecha.cinta_select);
    const cinta = useSelector(state => state.cosecha.cintas).filter(cinta => cinta.codigo === cinta_Select)[0];
    const cosecha = useSelector(state => state.cosecha.cosecha);

    const getTotalCosechaCinta = () => {
        const filter_cinta = cosecha.filter(item => item.cs_color === cinta_Select);
        return filter_cinta.reduce((total, item) => +total + +item.cs_cortados, 0);
    };

    return (
        <div className="col-12">
            {cinta ?
                <div className="form-row">
                    <div className="col-1">
                        <label><b>Cinta</b></label>
                        <input className="form-control"
                               name={`${cinta.color}-CALENDARIO`}
                               disabled/>
                    </div>
                    <div className="col-1">
                        <label>Enfunde</label>
                        <input
                            className="form-control text-center bg-white"
                            value={cinta.enfunde}
                            disabled
                        />
                    </div>
                    <div className="col-1">
                        <label><b style={{color: "red"}}>Caidas</b></label>
                        <input
                            className="form-control text-center bg-white"
                            value={cinta.caidas}
                            disabled
                        />
                    </div>
                    <div className="col-2">
                        <label><b>Cort. Ini.</b></label>
                        <input
                            className="form-control text-center bg-white"
                            value={cinta.cortados}
                            disabled
                        />
                    </div>
                    <div className="col-2">
                        <label><b>Saldo Ini.</b></label>
                        <input
                            className="form-control text-center bg-white"
                            value={+cinta.enfunde - (+cinta.caidas + +cinta.cortados)}
                            disabled
                        />
                    </div>
                    <div className="col-2">
                        <label><b style={{color: "red"}}>Cort. Hoy</b></label>
                        <input
                            className="form-control text-center bg-white"
                            value={getTotalCosechaCinta()}
                            disabled
                        />
                    </div>
                    <div className="col-2">
                        <label><b>Saldo Fin.</b></label>
                        <input
                            className="form-control text-center bg-white"
                            value={+cinta.enfunde - (+cinta.cortados + +cinta.caidas + getTotalCosechaCinta())}
                            disabled
                        />
                    </div>
                    <div className="col-1">
                        <label>% a Recob.</label>
                        <input
                            className="form-control text-center bg-white"
                            value={(((1 - ((+cinta.cortados + +cinta.caidas + getTotalCosechaCinta()) / +cinta.enfunde)) * 100).toFixed(2).toString() + ' %')}
                            disabled
                        />
                    </div>
                </div>
                :
                <div className="alert alert-info mb-0">
                    Seleccionar una cinta para visualizar datos.
                </div>
            }
        </div>
    )
}
