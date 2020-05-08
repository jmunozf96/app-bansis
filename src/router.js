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
import Maps from "./pages/hacienda/maps";
import FormEgreso from "./pages/bodega/formEgreso";
import Egreso from "./pages/bodega/egreso";

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
        path: "/bodega/egreso-material/formulario",
        component: FormEgreso
    },
    {
        path: "*",
        component: Error404
    }

];
