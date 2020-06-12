const initialProps = {
    credential: {
        sub: '',
        nick: '',
        nombres: '',
        apellidos: '',
        idhacienda: ''
    }
};

export default function (state = initialProps, action) {
    switch (action.type) {
        case 'AUTH_CREDENTIALS_USER':
            return {credential: action.payload};
        case 'AUTH_CREDENTIALS_CLEAN':
            return ({
                credential: {
                    sub: '',
                    nick: '',
                    nombres: '',
                    apellidos: '',
                    idhacienda: ''
                }
            });
        default:
            return state;
    }
}
