import React, {useState} from "react";
import {API_LINK} from "../../utils/constants";
import {useDispatch} from "react-redux";
import {progressActions} from "../../actions/progressActions";

import {useHistory} from "react-router-dom";
import TableForm from "../../components/Table";
import TableDetail from "../../components/TableDetalle";
import DataDetail from "../dataDetail";
import {editFormAction} from "../../actions/statusFormAction";
import {clearBodegaFormAction} from "../../actions/bodega/bodegaActions";

export default function Bodega(props) {
    const [bodegas, setBodegas] = useState([]);
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

    const url = `${API_LINK}/bansis-app/index.php/bodegas?page=${page}`;
    const url_delete = `${API_LINK}/bansis-app/index.php/bodegas`;

    const editFormBodega = (bodega) => {
        setEditForm(true);
        history.push(`${history.location.pathname}/formulario/${bodega.id}`);
    };

    const setFormulario = () => {
        //Limpiamos el formulario
        const cleanBodega = (state) => dispatch(clearBodegaFormAction(state));
        cleanBodega(true);
        //Evento para que cuando crea un nuevo empleado el status del form edit cambia a false
        setEditForm(false);
        history.push(`${history.location.pathname}/formulario`);
    };

    const destroyLaborModal = (bodega) => {
        setOpenModal(true);
        setDataModal({
            title: `Bodega: ${bodega.nombre}`,
            content: '¿Esta seguro de eliminar el registo?, de ser afirmativo se eliminara de la base de datos el registro seleccionado.',
            id: bodega.id
        })
    };

    const onChangePage = (page) => {
        progessbarStatus(true);
        setPage(page);
    };

    return (
        <DataDetail
            title="Bodega"
            setFormulario={setFormulario}
            page={page}
            openModal={openModal} setOpenModal={setOpenModal}
            dataModal={dataModal} setDataModal={setDataModal}
            data={{getData: bodegas, setData: setBodegas}}
            url={url} url_delete={url_delete}
            reload={reload} setReload={setReload}
        >
            <TableForm
                dataAPI={bodegas}
                onChangePage={onChangePage}
                columns={['#', 'Hacienda', 'Nombre', 'Descripcion', 'Ult. Act.', 'Estado', 'Accion']}
            >
                {bodegas.code !== 400 ?
                    <TableDetail
                        propertys={[['hacienda', 'detalle'], 'nombre', 'descripcion', 'updated_at', 'estado']}
                        dataArray={bodegas.dataArray}
                        actionEdit={editFormBodega}
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
