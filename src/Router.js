import Home from "./pages/home";

import Empleado from "./pages/hacienda/empleado";
import FormEmpleado from "./pages/hacienda/formEmpleado";
import Labor from "./pages/hacienda/labor";
import FormLabor from "./pages/hacienda/formLabor";
import Hacienda from "./pages/hacienda/hacienda";
import FormHacienda from "./pages/hacienda/formHacienda";

import Bodega from "./pages/bodega/bodega";
import FormBodega from "./pages/bodega/formBodega";
import Grupo from "./pages/bodega/grupo";
import FormGrupo from "./pages/bodega/formGrupo";

//import Error404 from "./components/Error/404/404";
import FormMaterial from "./pages/bodega/formMaterial";
import Material from "./pages/bodega/material";
import Maps from "./pages/hacienda/Mapa/maps";
import FormEgreso from "./pages/bodega/Egreso/Formulario/formEgreso";
import Egreso from "./pages/bodega/Egreso";
import FormularioLote from "./pages/hacienda/Lote/Formulario/formLote";
import Lote from "./pages/hacienda/Lote";
import FormSeccionLote from "./pages/hacienda/LoteSeccion/Formulario/FormSeccionLote";
import FormSeccionLabor from "./pages/hacienda/LoteSeccionLabor/Formulario/FormSeccionLabor";
import SeccionLoteLabor from "./pages/hacienda/LoteSeccionLabor";
import FormEnfunde from "./pages/hacienda/AvanceLabor/Enfunde/Formulario/FormEnfunde";
import EnfundeSemanal from "./pages/hacienda/AvanceLabor/Enfunde/EnfundeSemanal";
import {EnfundeLoteDetalle} from "./pages/hacienda/AvanceLabor/Enfunde/EnfundeLoteDetalle";
import EnfundeLoteroList from "./pages/hacienda/AvanceLabor/Enfunde/EnfundeLoteroList";
import Page404 from "./components/Error/404 Page";
import FormUsuario from "./pages/seguridad/Usuario/FormUsuario";
import FormRecursosUsuario from "./pages/seguridad/Recursos/FormRecursosUsuario";
import ReporteEnfunde from "./pages/hacienda/Informes/RepEnfunde";
import Recepcion from "./pages/cosecha/Recepcion";
import DashboardEnfunde from "./pages/hacienda/Informes/DashboardEnfunde";

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
        component: Recepcion
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
