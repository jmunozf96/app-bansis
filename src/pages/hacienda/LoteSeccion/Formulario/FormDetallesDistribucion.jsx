import React from "react";
import DestroyDistribucion from "./DestroyDistribucion";

export default function FormDetallesDistribucion({data, edit, destroy, addCoordenadas}) {

    return (
        <>
            <tr key={data.id} className="">
                <td className="text-center">{data.lote}{data.descripcion}</td>
                <td className="text-center">
                    <small><b>{data.has}</b></small>
                </td>
                <td className="text-center">
                    {!addCoordenadas.status ?
                        <div className="btn-group">
                            <button className="btn btn-primary" onClick={() => edit(data)}>
                                <i className="fas fa-edit fa-1x"/>
                            </button>
                            <DestroyDistribucion
                                id={data.id}
                                has={data.has}
                                metodo={destroy}
                            />
                        </div>
                        :
                        <>
                            <i className="fas fa-location-arrow fa-spin"/>
                        </>
                    }
                </td>
            </tr>
        </>
    )
}
