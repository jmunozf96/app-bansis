import React, {useState} from "react";
import {API_LINK} from "../../utils/constants";
import {useDispatch} from "react-redux";
import {progressActions} from "../../actions/progressActions";
import {laborCleanAction} from "../../actions/hacienda/laborActions";

import {useHistory} from "react-router-dom";
import TableForm from "../../components/Table";
import TableDetail from "../../components/TableDetalle";
import DataDetail from "../dataDetail";
import {editFormAction} from "../../actions/statusFormAction";

export default function Labor(props) {
    const [labores, setlabores] = useState([]);
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

    const url = `${API_LINK}/bansis-app/index.php/labores?page=${page}`;
    const url_delete = `${API_LINK}/bansis-app/index.php/labores`;

    const editFormLabor = (labor) => {
        setEditForm(true);
        history.push(`${history.location.pathname}/formulario/${labor.id}`);
    };

    const setFormulario = () => {
        //Limpiamos el formulario
        const cleanLabor = (state) => dispatch(laborCleanAction(state));
        cleanLabor(true);
        //Evento para que cuando crea un nuevo empleado el status del form edit cambia a false
        setEditForm(false);
        history.push(`${history.location.pathname}/formulario`);
    };

    const destroyLaborModal = (labor) => {
        setOpenModal(true);
        setDataModal({
            title: `Labor: ${labor.descripcion}`,
            content: '¿Esta seguro de eliminar el registo?, de ser afirmativo se eliminara de la base de datos el registro seleccionado.',
            id: labor.id
        })
    };

    const onChangePage = (page) => {
        progessbarStatus(true);
        setPage(page);
        setReload(true);
    };

    return (
        <DataDetail
            title="Labor"
            setFormulario={setFormulario}
            page={page} setPage={setPage}
            openModal={openModal} setOpenModal={setOpenModal}
            dataModal={dataModal} setDataModal={setDataModal}
            data={{getData: labores, setData: setlabores}}
            url={url} url_delete={url_delete}
            reload={reload} setReload={setReload}
        >
            <TableForm
                dataAPI={labores}
                onChangePage={onChangePage}
                columns={['#', 'Descripcion', 'Ult. Act.', 'Estado', 'Accion']}
            >
                {labores.code !== 400 ?
                    <TableDetail
                        propertys={['descripcion', 'updated_at', 'estado']}
                        dataArray={labores.dataArray}
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
