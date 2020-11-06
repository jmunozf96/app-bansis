import {combineReducers} from "redux";
import progressNavReducers from "./progressNavReducers";
import empleadoReducers from "./hacienda/empleadoReducers";
import statusFormReducers from "./statusFormReducers";
import laborReducers from "./hacienda/laborReducers";
import haciendaReducers from "./hacienda/haciendaReducers";
import bodegaReducers from "./bodega/bodegaReducers";
import grupoReducers from "./bodega/grupoReducers";
import egresoBodegaDucks from "./bodega/egresoBodegaDucks";
import loginDucks from "./seguridad/loginDucks";
import accessModuleDucks from "./seguridad/accessModuleDucks";
import cosechaDucks from "./cosecha/cosechaDucks";
import cosechaChartDucks from "./cosecha/cosechaChartDucks";
import progressDucks from "./progressDucks";
import manosRecusadasDucks from "./cosecha/manosRecusadasDucks";

export default combineReducers({
    login: loginDucks,
    accesoModulo: accessModuleDucks,
    progressLoading: progressDucks,
    progressbar: progressNavReducers, //Eliminar
    empleado: empleadoReducers,
    dataLabor: laborReducers,
    dataHacienda: haciendaReducers,
    dataBodega: bodegaReducers,
    dataGrupo: grupoReducers,
    statusForm: statusFormReducers,
    egresoBodega: egresoBodegaDucks,
    cosecha: cosechaDucks,
    cosechaChart: cosechaChartDucks,
    manosRecusadas: manosRecusadasDucks
});
