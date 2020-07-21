import React from "react";

import "./Caja.scss"

export default function Caja(props) {
    const {active = false, data = null} = props;
    return (
        <>
            {data &&
            <div className="adminLte">
                <div className="info-box">
            <span className={`info-box-icon bg-${active ? 'success' : 'primary'} text-white`}>
                <i className="fas fa-pallet"/>
            </span>
                    <div className="info-box-content">
                        <span className="info-box-text">{data.datos['descripcion']} - <span
                            className="info-box-number">{+data.totalpesadas}</span></span>
                        <div className="progress">
                            <div className="progress-bar"
                                 style={{width: `${(+data.totalpesadas / +data.totalcajas) * 100}%`}}/>
                        </div>
                        <span className="progress-description">
                    {((+data.totalpesadas / +data.totalcajas) * 100).toFixed(0)}%
                </span>
                    </div>
                </div>
            </div>
            }
        </>
    );
}
