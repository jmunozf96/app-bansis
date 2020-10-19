import {combineReducers} from "redux";
import authReducer from "./authReducers";
import progressNavReducers from "./progressNavReducers";
import credentialReducers from "./credentialReducers";
import empleadoReducers from "./hacienda/empleadoReducers";
import statusFormReducers from "./statusFormReducers";
import laborReducers from "./hacienda/laborReducers";
import haciendaReducers from "./hacienda/haciendaReducers";
import bodegaReducers from "./bodega/bodegaReducers";
import grupoReducers from "./bodega/grupoReducers";
import recursosReducers from "./recursosReducers";
import cosechaReducers from "./cosecha/cosechaReducers";
import egresoBodegaDucks from "./bodega/egresoBodegaDucks";
import loginDucks from "./seguridad/loginDucks";

export default combineReducers({
    login: loginDucks,
    auth: authReducer,
    progressbar: progressNavReducers,
    credential: credentialReducers,
    recursos: recursosReducers,
    empleado: empleadoReducers,
    dataLabor: laborReducers,
    dataHacienda: haciendaReducers,
    dataBodega: bodegaReducers,
    dataGrupo: grupoReducers,
    statusForm: statusFormReducers,
    cosecha: cosechaReducers,
    egresoBodega: egresoBodegaDucks
});
