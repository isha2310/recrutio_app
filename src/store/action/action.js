export const setCandidateDetailsToCart = (candidate) => {
    return { type: 'SET_CANDIDATE_DETAILS', candidate }
}

export const resetCandidateDetailsToCart = () => {
    return { type: 'RESET_CANDIDATE_DETAILS'}
}
 
export const setRecruiterDetailsToCart = (recruiter) => {
    return { type: 'SET_RECRUITER_DETAILS', recruiter }
}

export const resetRecruiterDetailsToCart = () => {
    return { type: 'RESET_RECRUITER_DETAILS' }
}

export const setUser = (user) => {
    return { type: 'SET_USER', user }
}