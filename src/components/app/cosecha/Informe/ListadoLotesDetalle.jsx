import React, {useEffect, useState} from "react";
import {codigo_dano_otros} from "./HelpersInforme";

const style = {table: {textCenter: {textAlign: "center", verticalAlign: "middle"}}};

export default function ListadoLotesDetalle({data, setDataModal, filterDanos}) {
    const [dataStorage, setDataStorage] = useState([]);
    const [danos, setDanos] = useState([]);

    useEffect(() => {
        const data_storage = JSON.parse(localStorage.getItem('_dataManos'));
        if (data_storage.length > 0 && data_storage) {
            //Buscamos los datos almacenados del lote
            const busqueda = data_storage.filter((item) => item.id === data.id);
            if (busqueda.length > 0) {
                setDataStorage(busqueda[0]['manos_recusadas']);
            }
        }
    }, [data]);

    useEffect(() => {
        let data_modal = [];
        dataStorage.forEach(data => {
            const existe = filterDanos.filter(item => item.id === data.dano.id);
            if (existe.length > 0) data_modal.push(data);
        });
        setDanos(data_modal);
    }, [dataStorage, filterDanos]);

    const showModalData_Danos = () => {
        //Enviar datos al modal
        setDataModal({
            show: true,
            view: <TemplateModalDetalleDanos data={danos}/>
        });
    };

    const countDanos = () => {
        return danos.length;
    };

    return (
        <tr>
            <td width="5%">
                <button className="btn btn-danger btn-lg" onClick={() => showModalData_Danos(data.id)}>
                    {/*<i className="fas fa-eye"/>*/}
                    <i className="fas fa-exclamation-circle"/>
                </button>
            </td>
            <td width="10%" style={style.table.textCenter}><b>{data.alias}</b></td>
            <td width="10%" style={style.table.textCenter}><em>{data.has}</em></td>
            <td width="15%" style={style.table.textCenter}>
                {data.variedad}
            </td>
            <td width="10%" style={style.table.textCenter}>{data.tipo_suelo}</td>
            <td width="10%" style={style.table.textCenter}>
                <b>{countDanos()}</b>
            </td>
            <td width="20%" style={style.table.textCenter}>
                <b style={{color: "red"}}>{data.cantidad}</b>
            </td>
            <td style={style.table.textCenter}>
                <em><b>{(data.cantidad / 8).toFixed(0)}</b> racimos.</em>
            </td>
        </tr>
    )
}


const TemplateModalDetalleDanos = ({data}) => {

    const ordenarDatos = () => {
        return data.sort((a, b) => {
            if (+a.cantidad < +b.cantidad) return 1;
            if (+a.cantidad > +b.cantidad) return -1;
            return 0;
        })
    };

    const totalizar = () => {
        return data.reduce((total, item) => total + +item.cantidad, 0)
    };

    return (
        <div className="row">
            <div className="col-12">
                <table className="table table-hover table-bordered">
                    <thead className="text-center">
                    <tr>
                        <th>Dano</th>
                        <th>Cantidad</th>
                    </tr>
                    </thead>
                    <tbody className="text-center table-sm">
                    {ordenarDatos().map((item, i) =>
                        <tr key={i}>
                            <td style={style.table.textCenter}>
                                <b>{item.dano.nombre}</b>
                                <p className="mb-0">
                                    <em><small>
                                        {item.dano.id === codigo_dano_otros ? item.otros_des : item.dano.detalle}
                                        {/*Daño de otros es el codigo 20*/}
                                    </small></em>
                                </p>
                            </td>
                            <td style={style.table.textCenter}>{item.cantidad}</td>
                        </tr>
                    )}
                    <tr>
                        <td style={style.table.textCenter}><h5 className="m-2"><b>TOTAL MANOS RECUSADAS</b></h5></td>
                        <td style={style.table.textCenter}><h5 className="m-2"><b>{totalizar()}</b></h5></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
