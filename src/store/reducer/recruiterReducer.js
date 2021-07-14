const initialState = {}

const reducer = ( state = initialState, action ) => {

    switch(action.type){

        case 'SET_RECRUITER_DETAILS':
            return{
                ...state,
                ...action.recruiter
            }
        
        case 'RESET_RECRUITER_DETAILS':
            return initialState

        default: 
            break

    }
    return state
}

export default reducer