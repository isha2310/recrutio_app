const formReducer = (state, action) => {

    switch(action.type) {
        case "HANDLE_INPUT":
            return{
                ...state,
                [action.field] : action.value
            }

        case "HANDLE_CHECK":
            return{
                ...state,
                current: action.current
            }
            
        case "RESET_FORM":
            return{ current: false }

        default: 
            return state
    }

}

export default formReducer