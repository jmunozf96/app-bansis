import React from "react";
import {useHistory} from "react-router-dom";
import error from "../../../assets/img/error/error-img.png"
import "./404.scss";

export default function Error404({mensaje = "Solicito una pagina que no existe"}) {
    const history = useHistory();
    return (
        <div className="error">
            <div className="wrap">
                <div className="content">
                    <img src={error} title="error" alt="Imagen error"/>
                    <p><span><label>O</label>hh.....</span> {mensaje}</p>
                    <button className="btn btn-success" onClick={() => history.push("/")}>
                        <i className="fas fa-home"/> Regresar
                    </button>
                </div>
            </div>
        </div>
    );
}