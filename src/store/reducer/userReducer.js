const initialState = 'Candidate'

const reducer = ( state = initialState, action ) => {

    switch (action.type) {

        case 'SET_USER':
            return action.user

        default:
            break
    }
    return state
}

export default reducer