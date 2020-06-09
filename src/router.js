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

import Error404 from "./components/Error/404/404";
import FormMaterial from "./pages/bodega/formMaterial";
import Material from "./pages/bodega/material";
import Maps from "./pages/hacienda/Mapa/maps";
import FormEgreso from "./pages/bodega/Egreso/Formulario/formEgreso";
import Egreso from "./pages/bodega/Egreso";
import FormularioLote from "./pages/hacienda/Lote/Formulario/formLote";
import Lote from "./pages/hacienda/Lote";
import FormSeccionLote from "./pages/hacienda/LoteSeccion/Formulario/FormSeccionLote";
import SeccionLote from "./pages/hacienda/LoteSeccion";
import FormSeccionLabor from "./pages/hacienda/LoteSeccionLabor/Formulario/FormSeccionLabor";
import SeccionLoteLabor from "./pages/hacienda/LoteSeccionLabor";
import FormEnfunde from "./pages/hacienda/AvanceLabor/Enfunde/Formulario/FormEnfunde";
import EnfundeSemanal from "./pages/hacienda/AvanceLabor/Enfunde/EnfundeSemanal";
import {EnfundeLoteDetalle} from "./pages/hacienda/AvanceLabor/Enfunde/EnfundeLoteDetalle";
import EnfundeLoteroList from "./pages/hacienda/AvanceLabor/Enfunde/EnfundeLoteroList";

export const routes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/hacienda/empleado",
        component: Empleado,
    },
    {
        path: "/hacienda/empleado/formulario/:id?",
        component: FormEmpleado
    },
    {
        path: "/hacienda/labor",
        component: Labor
    },
    {
        path: "/hacienda/labor/formulario/:id?",
        component: FormLabor
    },
    {
        path: "/hacienda",
        component: Hacienda
    },
    {
        path: "/hacienda/formulario/:id?",
        component: FormHacienda
    },
    {
        path: "/hacienda/mapa",
        component: Maps
    },
    {
        path: "/hacienda/lote",
        component: Lote
    },
    {
        path: "/hacienda/lote/formulario/:id?",
        component: FormularioLote
    },
    {
        path: "/hacienda/lote/seccion",
        component: SeccionLote
    },
    {
        path: "/hacienda/lote/seccion/formulario/:id?",
        component: FormSeccionLote
    },
    {
        path: "/hacienda/lote/seccion/labor",
        component: SeccionLoteLabor
    },
    {
        path: "/hacienda/lote/seccion/labor/formulario/:id?",
        component: FormSeccionLabor
    },
    {
        path: "/hacienda/avances/labor/enfunde",
        component: EnfundeSemanal
    },
    {
        path: "/hacienda/avances/labor/enfunde/semana/detalle/:id",
        component: EnfundeLoteDetalle
    },
    {
        path: "/hacienda/avances/labor/enfunde/empleado",
        component: EnfundeLoteroList
    },
    {
        path: "/hacienda/avances/labor/enfunde/empleado/formulario",
        component: FormEnfunde
    },
    {
        path: "/bodega",
        component: Bodega
    },
    {
        path: "/bodega/formulario/:id?",
        component: FormBodega
    },
    {
        path: "/bodega/grupo",
        component: Grupo
    },
    {
        path: "/bodega/grupo/formulario/:id?",
        component: FormGrupo
    },
    {
        path: "/bodega/material",
        component: Material
    },
    {
        path: "/bodega/material/formulario",
        component: FormMaterial
    },
    {
        path: "/bodega/egreso-material",
        component: Egreso
    },
    {
        path: "/bodega/egreso-material/formulario/:id?",
        component: FormEgreso
    },
    {
        path: "*",
        component: Error404
    }
];
