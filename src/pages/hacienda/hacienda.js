import React, {useState} from "react";
import {API_LINK} from "../../utils/constants";
import {useDispatch} from "react-redux";
import {progressActions} from "../../actions/progressActions";

import {useHistory} from "react-router-dom";
import TableForm from "../../components/Table";
import TableDetail from "../../components/TableDetalle";
import DataDetail from "../dataDetail";
import {editFormAction} from "../../actions/statusFormAction";
import {clearHaciendaFormAction} from "../../actions/hacienda/haciendaActions";

export default function Hacienda(props) {
    const [haciendas, setHaciendas] = useState([]);
    const [page, setPage] = useState(1);
    const [reload, setReload] = useState(true);

    //Variable para abrir y cerrar el modal para eliminar el registro
    const [openModal, setOpenModal] = useState(false);
    //Variable para enviar datos al modal
    const [dataModal, setDataModal] = useState(null);

    const history = useHistory();
    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));
    const setEditForm = (state) => dispatch(editFormAction(state));

    const url = `${API_LINK}/bansis-app/index.php/haciendas?page=${page}`;
    const url_delete = `${API_LINK}/bansis-app/index.php/haciendas`;

    const editFormLabor = (hacienda) => {
        setEditForm(true);
        history.push(`/hacienda/formulario/${hacienda.id}`);
    };

    const setFormulario = () => {
        //Limpiamos el formulario
        const cleanHacienda = (state) => dispatch(clearHaciendaFormAction(state));
        cleanHacienda(true);
        //Evento para que cuando crea un nuevo empleado el status del form edit cambia a false
        setEditForm(false);
        history.push("/hacienda/formulario");
    };

    const destroyLaborModal = (hacienda) => {
        setOpenModal(true);
        setDataModal({
            title: `Hacienda: ${hacienda.detalle}`,
            content: '¿Esta seguro de eliminar el registo?, de ser afirmativo se eliminara de la base de datos el registro seleccionado.',
            id: hacienda.id
        })
    };

    const onChangePage = (page) => {
        progessbarStatus(true);
        setPage(page);
        setReload(true);
    };

    return (
        <DataDetail
            title="Hacienda"
            setFormulario={setFormulario}
            page={page}
            openModal={openModal} setOpenModal={setOpenModal}
            dataModal={dataModal} setDataModal={setDataModal}
            data={{getData: haciendas, setData: setHaciendas}}
            url={url} url_delete={url_delete}
            reload={reload} setReload={setReload}
        >
            <TableForm
                dataAPI={haciendas}
                onChangePage={onChangePage}
                columns={['#', 'Descripcion', 'Ult. Act.', 'Estado', 'Accion']}
            >
                {haciendas.code !== 400 ?
                    <TableDetail
                        propertys={['detalle', 'updated_at', 'estado']}
                        dataArray={haciendas.dataArray}
                        actionEdit={editFormLabor}
                        showModal={destroyLaborModal}
                    /> :
                    <tr>
                        <td colSpan={7}>No hay datos que mostrar...</td>
                    </tr>
                }
            </TableForm>
        </DataDetail>
    );
}
