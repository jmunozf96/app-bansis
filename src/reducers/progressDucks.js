const dataInicial = {
    loading: false,
    progress: 0
};


const LOADING_PROGESS = 'LOADING_PROGESS';
const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';

export default function reducers(state = dataInicial, action) {
    switch (action.type) {
        case LOADING_PROGESS:
            return {...state, loading: action.payload};
        case UPLOAD_PROGRESS:
            return {...state, progress: action.payload};
        default:
            return state;
    }
}

export const loadingProgressBar = (status) => (dispatch) => {
    dispatch({
        type: LOADING_PROGESS,
        payload: status
    });
};

export const uploadProgressBar = (status) => (dispatch) => {
    dispatch({
        type: UPLOAD_PROGRESS,
        payload: status
    });
};
