import Home from "../views/home";

import Empleado from "../views/hacienda_empleados/empleado";
import FormEmpleado from "../views/hacienda_empleados/formEmpleado";
import Labor from "../views/hacienda_labor/labor";
import FormLabor from "../views/hacienda_labor/formLabor";
import Hacienda from "../views/hacienda/hacienda";
import FormHacienda from "../views/hacienda/formHacienda";

import Bodega from "../views/bodega/bodega";
import FormBodega from "../views/bodega/formBodega";
import Grupo from "../views/bodega/grupo";
import FormGrupo from "../views/bodega/formGrupo";

//import Error404 from "./components/Errors/404/404";
import FormMaterial from "../views/bodega/formMaterial";
import Material from "../views/bodega/material";
import Maps from "../views/hacienda/Mapa/maps";
import FormEgreso from "../views/bodega_egreso/Formulario/FormEgreso";
import Egreso from "../views/bodega_egreso";
import FormularioLote from "../views/hacienda_lote/Formulario/formLote";
import Lote from "../views/hacienda_lote";
import FormSeccionLote from "../views/hacienda_lote_seccion/Formulario/FormSeccionLote";
import FormSeccionLabor from "../views/hacienda_seccion_labor/Formulario/FormSeccionLabor";
import SeccionLoteLabor from "../views/hacienda_seccion_labor";
import FormEnfunde from "../views/hacienda_labor_avances/enfunde/Formulario/FormEnfunde";
import EnfundeSemanal from "../views/hacienda_labor_avances/enfunde/EnfundeSemanal";
import {EnfundeLoteDetalle} from "../views/hacienda_labor_avances/enfunde/EnfundeLoteDetalle";
import EnfundeLoteroList from "../views/hacienda_labor_avances/enfunde/EnfundeLoteroList";
import Page404 from "../components/Errors/404 Page";
import FormUsuario from "../views/system_seguridad/Usuario/FormUsuario";
import FormRecursosUsuario from "../views/system_seguridad/Recursos/FormRecursosUsuario";
import ReporteEnfunde from "../views/hacienda_labor_avances/enfunde/Informe/RepEnfunde";
import DashboardEnfunde from "../views/hacienda_labor_avances/enfunde/Informe/DashboardEnfunde";
import Cosecha from "../views/cosecha/Cosecha";
import ReporteManosRecusadas from "../views/cosecha/Informe/ReporteManosRecusadas";

export const routes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/hacienda/empleado/:idmodulo",
        component: Empleado,
    },
    {
        path: "/hacienda/empleado/:idmodulo/formulario/:id?",
        component: FormEmpleado,
    },
    {
        path: "/hacienda/labor/:idmodulo",
        component: Labor,
    },
    {
        path: "/hacienda/labor/:idmodulo/formulario/:id?",
        component: FormLabor,
    },
    {
        path: "/hacienda/:idmodulo",
        component: Hacienda
    },
    {
        path: "/hacienda/:idmodulo/formulario/:id?",
        component: FormHacienda,
    },
    {
        path: "/hacienda/mapa/:idmodulo",
        component: Maps
    },
    {
        path: "/hacienda/lote/:idmodulo",
        component: Lote
    },
    {
        path: "/hacienda/lote/:idmodulo/formulario/:id?",
        component: FormularioLote
    },
    {
        path: "/hacienda/lote/:idmodulo/seccion/formulario/:id?",
        component: FormSeccionLote
    },
    {
        path: "/hacienda/lote/seccion/labor/:idmodulo",
        component: SeccionLoteLabor
    },
    {
        path: "/hacienda/lote/seccion/labor/:idmodulo/formulario/:id?",
        component: FormSeccionLabor
    },
    {
        path: "/hacienda/avances/labor/enfunde/:idmodulo",
        component: EnfundeSemanal
    },
    {
        path: "/hacienda/avances/labor/enfunde/:idmodulo/semana/detalle/:id",
        component: EnfundeLoteDetalle
    },
    {
        path: "/hacienda/avances/labor/enfunde/:idmodulo/empleado",
        component: EnfundeLoteroList
    },
    {
        path: "/hacienda/avances/labor/enfunde/:idmodulo/empleado/formulario",
        component: FormEnfunde
    },
    {
        path: "/hacienda/reporte/labor/enfunde/:idmodulo",
        component: ReporteEnfunde
    },
    {
        path: "/hacienda/reporte/labor/enfunde/:idmodulo/dashboard-enfunde",
        component: DashboardEnfunde
    },
    {
        path: "/bodega/:idmodulo",
        component: Bodega
    },
    {
        path: "/bodega/:idmodulo/formulario/:id?",
        component: FormBodega
    },
    {
        path: "/bodega/grupo/:idmodulo",
        component: Grupo
    },
    {
        path: "/bodega/grupo/:idmodulo/formulario/:id?",
        component: FormGrupo
    },
    {
        path: "/bodega/material/:idmodulo",
        component: Material
    },
    {
        path: "/bodega/material/:idmodulo/formulario",
        component: FormMaterial
    },
    {
        path: "/bodega/egreso-material/:idmodulo",
        component: Egreso
    },
    {
        path: "/bodega/egreso-material/:idmodulo/formulario/:id?",
        component: FormEgreso
    },
    {
        path: "/cosecha/recepcion/racimos-lote/:idmodulo",
        component: Cosecha
    },
    {
        path: "/cosecha/reporte/manos-cosecha/:idmodulo",
        component: ReporteManosRecusadas
    },
    {
        path: "/seguridad/usuario/:idmodulo",
        component: FormUsuario
    },
    {
        path: "/seguridad/usuario/modulo-acceso/:idmodulo",
        component: FormRecursosUsuario
    },
    {
        path: "*",
        component: Page404
    }
];
