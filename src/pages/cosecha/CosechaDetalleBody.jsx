import React from "react";
import moment from "moment";
import 'moment/locale/es';

const style = {table: {textCenter: {textAlign: "center", verticalAlign: "middle", fontSize: 18}}};

export default function CosechaDetalleBody({data, cinta}) {
    const saldo = () => {
        return +data.cs_enfunde - ((+data.cs_caidas + +data.cs_cosecha_inicial) + +data.cs_cortados);
    };
    return (
        <tr style={{backgroundColor: saldo() < 0 ? "rgba(255,68,85,0.42)" : data.pesando ? "rgba(154,208,130,0.58)" : ""}}>
            <td style={style.table.textCenter} width="3%">
                {data.pesando &&
                <span className="badge badge-success">PESANDO</span>
                }
            </td>
            <td style={style.table.textCenter} width="8%">{data.cs_seccion}</td>
            <td style={style.table.textCenter} width="4%">
                <input className="form-control" name={`${cinta.color}-CALENDARIO`} type="text"
                       disabled={true}/>
            </td>
            <td style={style.table.textCenter} width="10%">{data.cs_enfunde}</td>
            <td style={style.table.textCenter} width="10%">
                {+data.cs_caidas + +data.cs_cosecha_inicial}
            </td>
            <td style={style.table.textCenter} width="10%">{data.cs_cortados}</td>
            <td style={style.table.textCenter} width="10%">
                {saldo()}
            </td>
            <td style={style.table.textCenter} width="13%">{data.cs_peso} lbs.</td>
            <td style={style.table.textCenter} width="13%">{(+data.cs_peso / +data.cs_cortados).toFixed(2)} lbs.</td>
            <td style={style.table.textCenter} width="15%">
                <small>
                    <em>
                        <b>Hace <i className="fas fa-history"/> {moment(data.ultima_actualizacion).fromNow(true)}</b>
                    </em>
                </small>
            </td>
        </tr>
    )
}
