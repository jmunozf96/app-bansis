import React from "react";
import "./Page404.scss";
import {useHistory} from "react-router-dom";

export default function Page404({mensaje = "Solicito una pagina que no existe"}) {
    const history = useHistory();
    return (
        <div id="notfound">
            <div className="notfound">
                <div className="notfound-404">
                    <h1>4<span/>4</h1>
                </div>
                <h2>Oops! Pagina no se ha encontrado</h2>
                <p>{mensaje}</p>
                <button className="btn btn-success" onClick={() => history.push("/")}>
                    <i className="fas fa-home"/> Regresar
                </button>
            </div>
        </div>
    );
}