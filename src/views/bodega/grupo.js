import React, {useState} from "react";
import {API_LINK} from "../../constants/helpers";
import {useDispatch} from "react-redux";
import {progressActions} from "../../actions/progressActions";

import {useHistory} from "react-router-dom";
import TableForm from "../../components/Tools/Table";
import TableDetail from "../../components/Tools/TableDetalle";
import DataDetail from "../dataDetail";
import {editFormAction} from "../../actions/statusFormAction";
import {clearGrupoFormAction} from "../../actions/bodega/grupoActions";

export default function Grupo(props) {
    const [grupos, setGrupos] = useState([]);
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

    const url = `${API_LINK}/bansis-app/index.php/bodega-grupos?page=${page}`;
    const url_delete = `${API_LINK}/bansis-app/index.php/bodega-grupos`;

    const editFormGrupo = (bodega) => {
        setEditForm(true);
        history.push(`${history.location.pathname}/formulario/${bodega.id}`);
    };

    const setFormulario = () => {
        //Limpiamos el formulario
        const cleanGrupo = (state) => dispatch(clearGrupoFormAction(state));
        cleanGrupo(true);
        //Evento para que cuando crea un nuevo empleado el status del form edit cambia a false
        setEditForm(false);
        history.push(`${history.location.pathname}/formulario`);
    };

    const destroyLaborModal = (grupo) => {
        setOpenModal(true);
        setDataModal({
            title: `Grupo: ${grupo.descripcion}`,
            content: '¿Esta seguro de eliminar el registo?, de ser afirmativo se eliminara de la base de datos el registro seleccionado.',
            id: grupo.id
        })
    };

    const onChangePage = (page) => {
        progessbarStatus(true);
        setPage(page);
    };

    return (
        <DataDetail
            title="Grupo"
            setFormulario={setFormulario}
            page={page}
            openModal={openModal} setOpenModal={setOpenModal}
            dataModal={dataModal} setDataModal={setDataModal}
            data={{getData: grupos, setData: setGrupos}}
            url={url} url_delete={url_delete}
            reload={reload} setReload={setReload}
        >
            <TableForm
                dataAPI={grupos}
                onChangePage={onChangePage}
                columns={['#', 'Descripcion', 'Ult. Act.', 'Estado', 'Accion']}
            >
                {grupos.code !== 400 ?
                    <TableDetail
                        propertys={['descripcion', 'updated_at', 'estado']}
                        dataArray={grupos.dataArray}
                        actionEdit={editFormGrupo}
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
