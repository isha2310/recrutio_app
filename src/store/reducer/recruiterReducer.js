const initialState = {}

const reducer = ( state = initialState, action ) => {

    switch(action.type){

        case 'SET_RECRUITER_DETAILS':
            return{
                ...state,
                ...action.recruiter
            }

        default: 
            break

    }
    return state
}

export default reducer