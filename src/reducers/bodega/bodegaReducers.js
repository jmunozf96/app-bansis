const initialProps = {
    bodega: {
        id: '',
        idhacienda: '',
        nombre: '',
        descripcion: ''
    }
};

export default function (state = initialProps, action) {
    switch (action.type) {
        case 'ADD_BODEGA_FORM':
            return ({
                ...state,
                bodega: {
                    id: action.payload.id,
                    idhacienda: action.payload.idhacienda,
                    nombre: action.payload.nombre,
                    descripcion: action.payload.descripcion
                }
            });
        case 'CLEAR_BODEGA_FORM':
            return (initialProps);
        default:
            return state;
    }
}