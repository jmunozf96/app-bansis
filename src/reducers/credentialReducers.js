const initialProps = {
    credential: {
        sub: 0,
        nick: '',
        correo: '',
        nombres: '',
        apellidos: '',
        idhacienda: ''
    }
};

export default function (state = initialProps, action) {
    switch (action.type) {
        case 'AUTH_CREDENTIALS_USER':
            return ({
                ...state,
                credential: action.payload
            });
        case 'AUTH_CREDENTIALS_CLEAN':
            return ({
                credential: {
                    sub: 0,
                    nick: '',
                    correo: '',
                    nombres: '',
                    apellidos: '',
                    idhacienda: ''
                }
            });
        default:
            return state;
    }
}