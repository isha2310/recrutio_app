import { API } from "./api";

export const LoginCandidate = (candidate) => {
  return fetch(`${API}/candidate/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
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
      "Access-Control-Allow-Origin": "*"
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
      "Access-Control-Allow-Origin": "*"
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
  return fetch(`https://www.googleapis.com/customsearch/v1/siterestrict?key=${process.env.REACT_APP_KEY}&cx=${process.env.REACT_APP_CX}&q=${encodeURIComponent(query)}&filter=blogs&num=5`, {
    method: 'GET'
  })
  .then((res) => res.json())
  .catch((e) => console.log(e))
}

export const getAllCandidate = () => {
  return fetch(`${API}/allCandidates`, {
    method: "GET"
  })
  .then((res) => res.json())
  .catch((e) => console.log(e))
}

export const logoutCandidate = () => {
  let token = localStorage.getItem("rec-token")
  let body = {token}
  let bearer = "Bearer " + token;
  return fetch(`${API}/candidate/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: bearer,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  })
  .then((res) => res)
  .catch((e) => console.log(e))
}

export const deleteCanPost = (id) => {
  let bearer = "Bearer " + localStorage.getItem("rec-token");

  return fetch(`${API}/candidate/post/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: bearer,
      "Content-Type": "application/json"
    }
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
};

export const applyForJob = (postId) => {
  let bearer = "Bearer " + localStorage.getItem("rec-token");

  return fetch(`${API}/applyJob/${postId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      Authorization: bearer,
      "Content-Type": "application/json"
    }
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
};