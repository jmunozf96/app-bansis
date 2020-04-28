const initialProps = {
    grupo: {
        id: '',
        descripcion: ''
    }
};

export default function (state = initialProps, action) {
    switch (action.type) {
        case 'ADD_GRUPO_FORM':
            return ({
                ...state,
                grupo: {
                    id: action.payload.id,
                    descripcion: action.payload.descripcion
                }
            });
        case 'CLEAR_GRUPO_FORM':
            return (initialProps);
        default:
            return state
    }
}