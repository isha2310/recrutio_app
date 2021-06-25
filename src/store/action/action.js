export const setCandidateDetailsToCart = (candidate) => {
    return { type: 'SET_CANDIDATE_DETAILS', candidate }
}

export const setRecruiterDetailsToCart = (recruiter) => {
    return { type: 'SET_RECRUITER_DETAILS', recruiter }
}

export const setUser = (user) => {
    return { type: 'SET_USER', user }
}