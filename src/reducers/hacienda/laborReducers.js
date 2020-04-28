const initialProps = {
    labor: {
        id: '',
        descripcion: ''
    }
};

export default function (state = initialProps, action) {
    switch (action.type) {
        case 'ADD_LABOR_FORM':
            return ({
                ...state,
                labor: {
                    id: action.payload.id,
                    descripcion: action.payload.descripcion
                }
            });
        case 'CLEAR_LABOR_FORM':
            return (initialProps);
        default:
            return state;
    }
}