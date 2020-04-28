import React from "react";
import error from "../../../assets/img/error/error-img.png"
import "./404.scss";

export default function Error404() {
    return (
        <div className="error">
            <div className="wrap">
                <div className="content">
                    <img src={error} title="error" alt="Imagen error"/>
                    <p><span><label>O</label>hh.....</span> Solicito una pagina que no existe</p>
                </div>
            </div>
        </div>
    );
}