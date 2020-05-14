import React from "react";
import {useHistory} from "react-router-dom";

const FormularioBase = (props) => {
    const {icon, title, children, ...events} = props;
    const history = useHistory();

    return (
        <div className="container-fluid mt-3 mb-5">
            <div className="card">
                <div className="card-header">
                    <i className={icon}/> {title}
                </div>
                <div className="card-body">
                    {children}
                </div>
                <div className="card-footer">
                    <div className="row">
                        <div className="btn-group col-md-4">
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => events.nuevo()}
                            >
                                <i className="fas fa-sticky-note"/> Nuevo
                            </button>
                            <button
                                className="btn btn-success"
                                type="button"
                                onClick={() => events.guardar()}
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
