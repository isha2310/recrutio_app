const initialState = {
    candidate: {}
}

const reducer = ( state = initialState, action ) => {

    switch(action.type){

        case 'SET_CANDIDATE_DETAILS':
            if(state.candidate){
                let candidate = {
                    ...state.candidate,
                    ...action.candidate.candidate
                }
                return{
                    ...state,
                    ...action.candidate,
                    candidate
                }
            }
            return{
                ...state,
                ...action.candidate
            }

        case 'RESET_CANDIDATE_DETAILS':
            return initialState

        default: 
            break

    }
    return state
}

export default reducer