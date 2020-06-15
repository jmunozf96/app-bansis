import React from "react";
import {useHistory} from "react-router-dom";

const FormularioBase = (props) => {
    const {icon, title, children, ...events} = props;
    const history = useHistory();

    return (
        <div className="container-fluid mb-3" style={{marginTop: "4rem"}}>
            <div className="card">
                <div className="card-header">
                    <i className={icon}/> {title}
                </div>
                <div className="card-body">
                    {children}
                </div>
                <div className="card-footer">
                    <div className="row">
                        <div className="btn-group">
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => events.nuevo()}
                                disabled={events.disabledElements.btnNuevo}
                            >
                                <i className="fas fa-sticky-note"/> Nuevo
                            </button>
                            <button
                                className="btn btn-success"
                                type="button"
                                onClick={() => events.guardar()}
                                disabled={events.disabledElements.btnSave}
                            >
                                <i className="fas fa-save"/> Guardar
                            </button>
                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => history.push(events.volver)}
                            >
                                <i className="fas fa-share-square"/> Regresar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default FormularioBase;
