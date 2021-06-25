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
