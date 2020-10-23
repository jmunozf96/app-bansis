import React from "react";
import {useDispatch, useSelector} from "react-redux";
import CosechaModalCintas from "./CosechaModalCintas";
import {prepareData} from "../../reducers/cosecha/cosechaDucks";
import CosechaRecobro from "./CosechaRecobro";

export default function CosechaBalanza() {
    const dispatch = useDispatch();

    const prepare = useSelector(state => state.cosecha.prepareData);
    const build = useSelector(state => state.cosecha.build);

    return (
        <React.Fragment>
            <div className="container-fluid mb-3" style={{marginTop: "4rem"}}>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="m-0">
                                    <i className="fas fa-chart-bar"/> Saldo de Recobro
                                </h5>
                            </div>
                            {!build ?
                                <div className="card-body text-center m-5">
                                    <i className="fas fa-wifi fa-10x" style={{color: "#ababab"}}/>
                                </div> : <CosechaRecobro/>
                            }
                            {prepare && <CosechaModalCintas show={prepare}/>}
                            <div className="card-footer">
                                <button className="btn btn-success btn-block btn-lg"
                                        onClick={() => dispatch(prepareData(true))}>
                                    <i className="fas fa-plug"/> CONECTARSE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
