const initialProps = null;

export default function (state = initialProps, action) {
    switch (action.type) {
        case 'LOAD_RECURSOS':
            return action.payload;
        case 'CLEAN_RECURSOS':
            return null;
        default:
            return state;
    }
}
