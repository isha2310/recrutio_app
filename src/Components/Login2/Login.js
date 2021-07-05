import { useEffect, useState } from "react";
import "./Login.css";
import {
  getCandidateById,
  LoginCandidate,
  SignupCandidate,
} from "../../apiCalls/Candidate";
import { LoginRecruiter, SignupRecruiter } from "../../apiCalls/Recruiter";
import {
  setCandidateDetailsToCart,
  setRecruiterDetailsToCart,
  setUser,
} from "../../store/action/action";
import { useHistory } from "react-router-dom";

const Login = (props) => {
  let history = useHistory();

  if (localStorage.getItem("rec-token")) {
    history.push("/profile");
  }

  useEffect(() => localStorage.setItem("rec", "Candidate"), []);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, SetSignup] = useState(false);
  const [user, setUserN] = useState("Candidate");

  const handleLoginClick = () => {
    if (user === "Candidate") {
      LoginCandidate({ email, password })
        .then((res) => {
          console.log(res);
          if (res.error) {
            return res;
          }
          props.dispatch(setCandidateDetailsToCart(res));
          localStorage.setItem("rec-user", res.candidate.name);
          localStorage.setItem("rec-id", res.candidate._id);
          localStorage.setItem("rec-token", res.token);
          history.push("/profile");
          getCandidateById(res.candidate._id)
            .then((res) => {
              if (res.error) {
                console.log(res.error);
              } else {
                console.log(res);
                props.dispatch(setCandidateDetailsToCart(res));
              }
            })
            .catch((e) => console.log(e));
        })
        .catch((err) => console.log(err));
    } else {
      LoginRecruiter({ email, password })
        .then((res) => {
          console.log(res);
          if (res.error) {
            return res;
          }
          props.dispatch(setRecruiterDetailsToCart(res));
          localStorage.setItem("rec-user", res.recruiter.name);
          localStorage.setItem("rec-id", res.recruiter._id);
          localStorage.setItem("rec-token", res.token);
          history.push("/profile");
        })
        .catch((err) => console.log(err));
    }
  };

  const handleSignupClick = () => {
    if (user === "Candidate") {
      SignupCandidate({ email, password, name: username })
        .then((res) => {
          console.log(res);
          if (res.error) {
            return res;
          }
          props.dispatch(setCandidateDetailsToCart(res));
          localStorage.setItem("rec-user", username);
          localStorage.setItem("rec-id", res.candidate._id);
          localStorage.setItem("rec-token", res.token);
          history.push("/profile");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      SignupRecruiter({ email, password, name: username })
        .then((res) => {
          console.log(res);
          if (res.error) {
            return res;
          }
          props.dispatch(setRecruiterDetailsToCart(res));
          localStorage.setItem("rec-user", username);
          localStorage.setItem("rec-token", res.token);
          history.push("/profile");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleMethod = (e) => {
    e.preventDefault();
    SetSignup(!signup);
  };

  return (
    <div className="LoginPage" >
      <div className={"Div2"}>
        {user === "Candidate" ? (
          <button
            style={{ marginRight: "30px" }}
            className={"NavBtn"}
            onClick={(e) => {
              setUserN("Recruiter");
              localStorage.setItem("rec", "Recruiter");
              props.dispatch(setUser("Recruiter"));
            }}
          >
            Want to hire?
          </button>
        ) : (
          ""
        )}
        {user === "Recruiter" ? (
          <button
            style={{ marginRight: "30px" }}
            className={"NavBtn"}
            onClick={(e) => {
              setUserN("Candidate");
              localStorage.setItem("rec", "Candidate");
              props.dispatch(setUser("Candidate"));
            }}
          >
            Want a Job?
          </button>
        ) : (
          ""
        )}
        <button className={"NavBtn"} onClick={handleMethod}>
          {!signup ? "Sign Up" : "Login"}
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: 'space-around',
          width: '50vw',
          marginTop: "15vh",
        }}
      >
        <div className="Div1" >
          <h1 className={"Tagline"}>WELCOME TO THE PROFESSIONAL COMMUNITY</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!signup) {
                handleLoginClick();
              } else {
                handleSignupClick();
              }
            }}
          >
            <div className={"Box"} id="box">
              {signup ? (
                <input
                  placeholder="USERNAME"
                  className={"Input1"}
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              ) : null}
              <input
                placeholder="EMAIL"
                className={"Input1"}
                required
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                placeholder="PASSWORD"
                className={"Input1"}
                required
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <button className={"LoginBtn"} type="submit">
                {!signup ? "Login" : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;