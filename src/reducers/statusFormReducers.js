const initialProps = {
    status: false
};

export default function (state = initialProps, action) {
    switch (action.type) {
        case 'EDIT_FORM':
            return ({
                ...state,
                status: action.payload
            });
        default:
            return state
    }
}