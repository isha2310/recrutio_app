import { API } from "./api";

export const LoginRecruiter = (recruiter) => {
  return fetch(`${API}/recruiter/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recruiter),
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};

export const SignupRecruiter = (recruiter) => {
  return fetch(`${API}/signupRecruiter`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recruiter),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
};

export const updateRecruiterDetails = (details) => {
  let bearer = "Bearer " + localStorage.getItem("rec-token");

  return fetch(`${API}/recruiter/updateProfile`, {
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

export const getRecruiterById = (id) => {
  return fetch(`${API}/recruiter/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((res) => res.json())
    .catch((e) => console.log('errr'));
};

export const jobPost = (details) => {
  let bearer = "Bearer " + localStorage.getItem("rec-token");

  return fetch(`${API}/recruiter/jobPost`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: bearer,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  })
    .then((res) => res.json())
    .catch((e) => e.status);
};

export const deleteJobPost = (id) => {
  let bearer = "Bearer " + localStorage.getItem("rec-token");

  return fetch(`${API}/recruiter/jobPost/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: bearer,
      "Content-Type": "application/json",
    }
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
};


export const logoutRecruiter = () => {
  let token = localStorage.getItem("rec-token")
  let body = {token}
  let bearer = "Bearer " + token;
  return fetch(`${API}/recruiter/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: bearer,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
  .then((res) => res)
  .catch((e) => console.log(e))
}

export const allJobPosts = () => {
  return fetch(`${API}/allJobPosts`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
  .then((res) => res.json())
  .catch((e) => console.log(e))
}