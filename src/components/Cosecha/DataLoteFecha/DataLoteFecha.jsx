import React from "react";

export default function DataLoteFecha({data}) {
    return (
        <div className="col-md-3 mb-3">
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-12 text-center">
                            <h2>{data['cs_seccion']}</h2>
                        </div>
                        <div className="col-12 mb-n2">
                            <div className="input-group input-group-lg mb-1">
                                <input className="form-control col-2" name={`${data && data.color}-CALENDARIO`}
                                       disabled/>
                                <input className="form-control col-5 text-center bg-white" value={data.cortados}
                                       disabled/>
                                <input className="form-control col-5 text-center"
                                       value={(((data.cortados / data.enfunde) * 100).toFixed(2)) + '%'} disabled/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
