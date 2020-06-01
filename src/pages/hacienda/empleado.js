import React, {useState} from "react";
import {API_LINK} from "../../utils/constants";
import {useDispatch} from "react-redux";
import {progressActions} from "../../actions/progressActions";
import {empleadoCleanAction} from "../../actions/hacienda/empleadoActions";

import {useHistory} from "react-router-dom";
import TableForm from "../../components/Table";
import TableDetail from "../../components/TableDetalle";
import DataDetail from "../dataDetail";
import {editFormAction} from "../../actions/statusFormAction";

export default function Empleado() {
    const [empleados, setEmpleados] = useState([]);
    const [page, setPage] = useState(1);
    const [reload, setReload] = useState(true);

    const [openModal, setOpenModal] = useState(false);
    const [dataModal, setDataModal] = useState(null);

    const history = useHistory();
    const dispatch = useDispatch();
    const progessbarStatus = (state) => dispatch(progressActions(state));
    const setEditForm = (state) => dispatch(editFormAction(state));

    const url = `${API_LINK}/bansis-app/index.php/empleados?page=${page}`;
    const url_delete = `${API_LINK}/bansis-app/index.php/empleados`;

    const editFormEmpleado = (empleado) => {
        setEditForm(true);
        history.push(`/hacienda/empleado/formulario/${empleado.id}`);
    };

    const setFormulario = () => {
        //Limpiamos el formulario
        const cleanEmpleado = (state) => dispatch(empleadoCleanAction(state));
        cleanEmpleado(true);
        //Evento para que cuando crea un nuevo empleado el status del form edit cambia a false
        setEditForm(false);
        history.push("/hacienda/empleado/formulario");
    };

    const destroyEmpleadoModal = (empleado) => {
        setOpenModal(true);
        setDataModal({
            title: `CI ${empleado.cedula} - ${empleado.nombres}`,
            content: '¿Esta seguro de eliminar el registo?, de ser afirmativo se eliminara el registro del empleado seleccionado.',
            id: empleado.id
        })
    };

    const onChangePage = (page) => {
        progessbarStatus(true);
        setPage(page);
        setReload(true);
    };

    return (
        <DataDetail
            title="Empleado"
            setFormulario={setFormulario}
            page={page}
            setPage={setPage}
            openModal={openModal} setOpenModal={setOpenModal}
            dataModal={dataModal} setDataModal={setDataModal}
            data={{getData: empleados, setData: setEmpleados}}
            url={url} url_delete={url_delete}
            reload={reload} setReload={setReload}
        >
            <TableForm
                dataAPI={empleados}
                onChangePage={onChangePage}
                columns={['#', 'Hacienda', 'Cedula', 'Nombres', 'Labor', 'Ult. Act.', 'Estado', 'Accion']}
            >
                {empleados.code !== 400 ?
                    <TableDetail
                        propertys={[['hacienda', 'detalle'], 'cedula', 'nombres', ['labor', 'descripcion'], 'updated_at', 'estado']}
                        dataArray={empleados.dataArray}
                        actionEdit={editFormEmpleado}
                        showModal={destroyEmpleadoModal}
                    /> :
                    <tr>
                        <td colSpan={7}>No hay datos que mostrar...</td>
                    </tr>
                }
            </TableForm>
        </DataDetail>
    );
}
