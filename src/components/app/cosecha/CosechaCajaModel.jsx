import React from "react";
import moment from "moment";
import 'moment/locale/es';

export default function CosechaCajaModel(props) {
    const {data = null} = props;
    console.log(data);
    return (
        <>
            {data &&
            <div className="card mt-1">
                <div className="card-header pt-1 pb-1">
                    <small>
                        Última caja pesada: {" "}
                        <b>Hace <i className="fas fa-history"/>{" "}{moment(data.last).fromNow(true)}</b>
                    </small>
                </div>
                <div className="card-body d-flex justify-content-between pt-3 pb-1">
                    <h5 className="card-title m-0">{data.datos['descripcion']}</h5>
                    <p>
                        <span style={{fontSize: "16px"}}>{+data.totalpesadas}</span>
                        <span style={{fontSize: "18px"}}><b>{" "} / {+data.totalcajas}</b></span>
                    </p>
                </div>
                <div className="card-footer pt-1 pb-1">
                    <b>Peso Total: </b> {+data.pesototal} lbs.
                </div>
            </div>
            }
        </>
    );
}
