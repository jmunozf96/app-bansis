import React, {useState} from "react";
import ListadoLotesDetalle from "./ListadoLotesDetalle";
import {paginate} from "./HelpersInforme";
import Pagination from "@material-ui/lab/Pagination";
import ModalBase from "./ModalBase";

export default function ListadoLotes({data, danosSelect}) {
    const [dataModal, setDataModal] = useState({
        show: false,
        view: ''
    });
    const [page, setPage] = useState(1);

    const ordenarDatos = () => {
        return data.sort((a, b) => {
            if (a.cantidad < b.cantidad) return 1;
            if (a.cantidad > b.cantidad) return -1;
            return 0;
        })
    };

    const changePage = (e, value) => {
        setPage(value)
    };

    return (
        <React.Fragment>
            <table className="table table-bordered table-hover">
                <thead className="text-center">
                <tr>
                    <th width="5%">Daños</th>
                    <th width="10%">Lote</th>
                    <th width="10%">Has.</th>
                    <th width="15%">Variedad</th>
                    <th width="10%">TipoSuelo</th>
                    <th width="10%">Cant.Daños</th>
                    <th width="20%">
                        <i className="fas fa-exclamation-triangle"/> Manos
                    </th>
                    <th>
                        (<i className="fas fa-sync-alt"/>) Manos <i className="fas fa-arrow-right"/> Racimos
                    </th>
                </tr>
                </thead>
                <tbody className="text-center table-sm">
                {paginate(ordenarDatos(), 5, page).filter(item => item.cantidad > 0).map((item, i) =>
                    <ListadoLotesDetalle
                        key={i}
                        data={item}
                        setDataModal={setDataModal} //Cambiar configuracion del modal
                        filterDanos={danosSelect}
                    />
                )}
                </tbody>
            </table>
            {(data.filter(item => item.cantidad > 0).length / 5) > 1 &&
            <div className="row mb-3">
                <div className="col-12 d-flex justify-content-center">
                    <Pagination count={Math.ceil(data.filter(item => item.cantidad > 0).length / 5)} page={page}
                                onChange={changePage}
                                variant="outlined"
                                shape="rounded"/>
                </div>
            </div>
            }
            {dataModal.show &&
            <ModalBase
                iconTitle="fas fa-map-marker-alt"
                title="Daños encontrados"
                dataModal={dataModal}
                setDataModal={setDataModal}
            />
            }
        </React.Fragment>
    )
}
