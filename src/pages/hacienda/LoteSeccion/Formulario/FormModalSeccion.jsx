import React from "react";
import ModalForm from "../../../../components/ModalForm";

import {Checkbox, FormControlLabel, TextField} from "@material-ui/core";
import {LocationOn, LocationOff} from '@material-ui/icons';

import SelectArray from "../../../../components/SelectArray";
import moment from "moment";
import 'moment/locale/es';

const tipo_variedad_data = ['NORMAL', 'MERISTEMA'];
const variedad_data = ['CEPA', 'WILLIAM', 'CEP/WILLI', 'GRAN ENANO', 'CEP/G.EN'];
const tipo_suelo_data = ['1', '1/2', '2', '2/3', '3'];

const FormModalSeccion = ({show, setShow, data, setData, cancelar, guardar}) => {

    const saveData = () => {
        if (!data.tipoVariedad.trim()) {
            alert("Seleccione un tipo de variedad");
            return;
        }

        if (!data.variedad.trim()) {
            alert("Seleccione una variedad");
            return;
        }

        if (!data.tipoSuelo.trim()) {
            alert("Seleccione un tipo de suelo");
            return;
        }

        setData({
            ...data,
            fechaSiembra: moment(data.fechaSiembra).format('YYYY-MM-DD'),
        });

        guardar();
        //clearData();
        setShow(false);
    };

    const hideModal = () => {
        setShow(false);
        cancelar();
    };


    return (
        <ModalForm
            show={show}
            icon="fas fa-map-pin"
            title="Detalles del lote"
            backdrop="static"
            size="xl"
            centered={false}
            scrollable={true}
            save={saveData}
            cancel={hideModal}
        >
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4">
                        <TextField
                            id="date"
                            name="fecha"
                            label="Fecha de Siembra"
                            type="date"
                            defaultValue={data.fechaSiembra}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            onChange={(e) => setData({...data, fechaSiembra: e.target.value})}
                        />
                    </div>
                    <div className="col-md-4">
                        <SelectArray
                            name="tipoVariedad"
                            defaultValue={data.tipoVariedad}
                            titulo="Tipo de variedad"
                            descripcion="tipo de variedad"
                            datos={tipo_variedad_data}
                            value={data}
                            setValue={setData}
                        />
                    </div>
                    <div className="col-md-4">
                        <SelectArray
                            name="variedad"
                            defaultValue={data.variedad}
                            titulo="Variedad"
                            descripcion="variedad"
                            datos={variedad_data}
                            value={data}
                            setValue={setData}
                        />
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-4">
                        <SelectArray
                            name="tipoSuelo"
                            defaultValue={data.tipoSuelo}
                            titulo="Tipo de suelo"
                            descripcion="tipo de suelo"
                            datos={tipo_suelo_data}
                            value={data}
                            setValue={setData}
                        />
                    </div>
                    {data.hasOwnProperty('idDistribucion') &&
                    <div className="col-2">
                        <FormControlLabel
                            control={<Checkbox
                                icon={<LocationOff/>}
                                checkedIcon={<LocationOn/>}
                                name="checkedH"
                                onChange={(e) => setData({...data, activo: e.target.checked})}
                                checked={data.activo}/>}
                            label="Activo"
                        />
                    </div>
                    }
                </div>
            </div>
        </ModalForm>
    );
};

export default FormModalSeccion;
