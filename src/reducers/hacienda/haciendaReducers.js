const initialProps = {
    hacienda: {
        id: '',
        detalle: ''
    }
};

export default function (state = initialProps, action) {
    switch (action.type) {
        case 'ADD_HACIENDA_FORM':
            return {
                ...state,
                hacienda: {
                    id: action.payload.id,
                    detalle: action.payload.detalle
                }
            };
        case 'CLEAR_HACIENDA_FORM':
            return (initialProps);
        default:
            return state;
    }
}