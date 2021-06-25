import { API } from "./api";

export const LoginCandidate = (candidate) => {
  return fetch(`${API}/candidate/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(candidate),
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};

export const SignupCandidate = (candidate) => {
  return fetch(`${API}/signupCandidate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(candidate),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
};

export const updateCandidateDetails = (details) => {
  let bearer = "Bearer " + localStorage.getItem("rec-token");

  return fetch(`${API}/candidate/updateProfile`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      Authorization: bearer,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
};

export const getCandidateById = (id) => {
  return fetch(`${API}/getCandidateById/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
};

export const getAllPosts = () => {
  return fetch(`${API}/allPosts`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }
  })
  .then((res) => res.json())
  .catch((e) => console.log(e))
}

export const getBlogs = (query) => {
  return fetch(`https://www.googleapis.com/customsearch/v1?key=${process.env.REACT_APP_KEY}&cx=${process.env.REACT_APP_CX}&q=${query}&filter=blogs&num=5`, {
    method: 'GET',
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  })
}