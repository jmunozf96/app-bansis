const initialProps = {
    empleado: {
        id: '',
        cedula: '',
        idhacienda: '',
        nombre1: '',
        nombre2: '',
        apellido1: '',
        apellido2: '',
        nombres: '',
        idlabor: ''
    }
};

export default function (state = initialProps, action) {
    switch (action.type) {
        case 'ADD_EMPLEADO_FORM':
            return ({
                ...state,
                empleado: {
                    id: action.payload.id,
                    idhacienda: action.payload.idhacienda,
                    cedula: action.payload.cedula,
                    nombre1: action.payload.nombre1,
                    nombre2: action.payload.nombre2,
                    apellido1: action.payload.apellido1,
                    apellido2: action.payload.apellido2,
                    nombres: action.payload.nombres,
                    idlabor: action.payload.idlabor
                }
            });
        case 'CLEAR_EMPLEADO_FORM':
            return (initialProps);
        default:
            return (state)
    }
}