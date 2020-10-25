import React, {useState} from "react";
import {useSelector} from "react-redux";
import Pagination from "@material-ui/lab/Pagination";
import CosechaDetalleBody from "./CosechaDetalleBody";
import moment from "moment";

export default function CosechaDetalle() {
    const cinta = useSelector(state => state.cosecha.cinta_select);
    const cintas = useSelector(state => state.cosecha.cintas);
    const cosecha = useSelector(state => state.cosecha.cosecha.filter(data => data.cs_color === cinta));
    const [page, setPage] = useState(1);

    const colorCinta = () => {
        return cintas.filter(item => item.codigo === cinta)[0];
    };

    const ordenarUltimoDatoRegistrado = () => {
        return cosecha.sort(function (a, b) {
            let keyA = moment(a.ultima_actualizacion).format("YYYY-MM-DDTHH:mm:ss.SSS"),
                keyB = moment(b.ultima_actualizacion).format("YYYY-MM-DDTHH:mm:ss.SSS");
            // Compare the 2 dates
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
        });
    };

    const paginate = (page_size, page_number) => {
        return ordenarUltimoDatoRegistrado().slice((page_number - 1) * page_size, page_number * page_size);
    };

    const changePage = (e, value) => {
        setPage(value)
    };

    return (
        <React.Fragment>
            <table className="table table-bordered table-bordered table-hover">
                <thead className="text-center">
                <tr>
                    <th width="5%">...</th>
                    <th width="8%">Lote</th>
                    <th width="4%">...</th>
                    <th width="10%">Enfunde</th>
                    <th width="10%">Cort. Ini.</th>
                    <th width="10%">Cort.</th>
                    <th width="10%">Saldo</th>
                    <th width="13%">Peso</th>
                    <th width="13%">Peso</th>
                    <th width="15%">Ult.</th>
                </tr>
                </thead>
                <tbody className="">
                {cosecha.length > 0 && paginate(5, page).map((data, index) =>
                    <CosechaDetalleBody key={index} data={data} index={index} cinta={colorCinta()}/>
                )}
                </tbody>
            </table>
            {(cosecha.length / 5) > 1 &&
            <div className="row">
                <div className="col-12 d-flex justify-content-center">
                    <Pagination count={Math.ceil(cosecha.length / 5)} page={page} onChange={changePage}
                                variant="outlined"
                                shape="rounded"/>
                </div>
            </div>
            }
        </React.Fragment>
    )
}
