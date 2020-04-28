const initialProps = {
    loading: false
};

export default function (state = initialProps, action) {
    switch (action.type) {
        case 'ACTIVE_PROGRESSBAR':
            return ({
                ...state,
                loading: action.payload
            });
        default:
            return state;
    }
}