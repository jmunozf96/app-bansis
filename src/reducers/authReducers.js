const initialProps = {
    _token: ''
};

export default function (state = initialProps, action) {
    switch (action.type) {
        case 'AUTHENTICATION_USER':
            return ({
                ...state,
                _token: action.payload
            });
        case 'LOGOUT_USER':
            return({
                ...state,
                _token: ''
            });
        default:
            return state;
    }
}