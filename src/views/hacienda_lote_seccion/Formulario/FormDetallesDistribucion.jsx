import React from "react";
import DestroyDistribucion from "./DestroyDistribucion";

export default function FormDetallesDistribucion({data, edit, destroy, addCoordenadas}) {

    return (
        <>
            <tr key={data.id} className="">
                <td className="text-center">
                    <span className={`badge badge-pill badge-${data.activo ? 'primary' : 'danger'}`}>
                        <i className={`fas ${data.activo ? 'fa-check-circle' : 'fa-ban'}`}/>
                    </span>
                </td>
                <td className="text-center">
                    {data.lote}{data.descripcion}
                </td>
                <td className="text-center">
                    <small><b>{data.has}</b></small>
                </td>
                <td className="text-center">
                    {!addCoordenadas.status ?
                        <div className="btn-group">
                            <button className="btn btn-primary" onClick={() => edit(data)}>
                                <i className="fas fa-edit fa-1x"/>
                            </button>
                            {!data.hasOwnProperty('idDistribucion') ?
                                <DestroyDistribucion
                                    id={data.id}
                                    has={data.has}
                                    classBtn="danger"
                                    classIcon="fas fa-minus fa-1x"
                                    metodo={destroy}
                                />
                                :
                                <DestroyDistribucion
                                    id={data.id}
                                    has={data.has}
                                    db={true}
                                    idDistribucion={data.idDistribucion}
                                    classBtn="info"
                                    classIcon="fas fa-minus"
                                    metodo={destroy}
                                />
                            }
                        </div>
                        :
                        <>
                            <button className="btn btn-dark">
                                <i className="fas fa-spinner fa-pulse"/>
                            </button>
                        </>
                    }
                </td>
            </tr>
        </>
    )
}
