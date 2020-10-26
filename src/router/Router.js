import Home from "../views/home";

import Empleado from "../views/hacienda/empleado";
import FormEmpleado from "../views/hacienda/formEmpleado";
import Labor from "../views/hacienda/labor";
import FormLabor from "../views/hacienda/formLabor";
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
import FormEgreso from "../views/bodega/Egreso/Formulario/FormEgreso";
import Egreso from "../views/bodega/Egreso";
import FormularioLote from "../views/hacienda/Lote/Formulario/formLote";
import Lote from "../views/hacienda/Lote";
import FormSeccionLote from "../views/hacienda/LoteSeccion/Formulario/FormSeccionLote";
import FormSeccionLabor from "../views/hacienda/LoteSeccionLabor/Formulario/FormSeccionLabor";
import SeccionLoteLabor from "../views/hacienda/LoteSeccionLabor";
import FormEnfunde from "../views/hacienda/AvanceLabor/Enfunde/Formulario/FormEnfunde";
import EnfundeSemanal from "../views/hacienda/AvanceLabor/Enfunde/EnfundeSemanal";
import {EnfundeLoteDetalle} from "../views/hacienda/AvanceLabor/Enfunde/EnfundeLoteDetalle";
import EnfundeLoteroList from "../views/hacienda/AvanceLabor/Enfunde/EnfundeLoteroList";
import Page404 from "../components/Errors/404 Page";
import FormUsuario from "../views/seguridad/Usuario/FormUsuario";
import FormRecursosUsuario from "../views/seguridad/Recursos/FormRecursosUsuario";
import ReporteEnfunde from "../views/hacienda/Informes/RepEnfunde";
import DashboardEnfunde from "../views/hacienda/Informes/DashboardEnfunde";
import Cosecha from "../views/cosecha/Cosecha";

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
