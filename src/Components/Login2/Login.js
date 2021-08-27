import { useEffect, useState } from "react";
import "./Login.css";
import {
  getCandidateById,
  LoginCandidate,
  SignupCandidate,
} from "../../apiCalls/Candidate";
import {
  LoginRecruiter,
  SignupRecruiter,
  getRecruiterById,
} from "../../apiCalls/Recruiter";
import {
  setCandidateDetailsToCart,
  setRecruiterDetailsToCart,
  setUser,
} from "../../store/action/action";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import Alert from "react-bootstrap/Alert";
import Dropdown from "react-bootstrap/Dropdown";

const Login = (props) => {
  let history = useHistory();
  let dispatch = props.dispatch;

  if (localStorage.getItem("rec-token")) {
    if (localStorage.getItem("rec") === "Candidate") {
      history.push("/profile");
      getCandidateById(localStorage.getItem("rec-id"))
        .then((res) => {
          if (res.error) {
            console.log(res.error);
          } else {
            dispatch(setCandidateDetailsToCart(res));
          }
        })
        .catch((e) => console.log(e));
    } else {
      history.push("/timeline_r");
      getRecruiterById(localStorage.getItem("rec-id"))
        .then((res) => {
          if (res.error) {
            console.log(res.error);
          } else {
            dispatch(setRecruiterDetailsToCart(res));
          }
        })
        .catch((e) => console.log(e));
    }
  }

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUserN] = useState("");
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("Login");
  const [section, setSection] = useState("Home");

  useEffect(() => {
    if (!localStorage.getItem("rec")) {
      localStorage.setItem("rec", "Candidate");
      setUserN("Candidate");
    } else {
      setUserN(localStorage.getItem("rec"));
    }
  }, []);

  useEffect(() => {
    if (user !== "") {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  const handleLoginClick = () => {
    setStatus('Logging In ...')
    if (user === "Candidate") {
      LoginCandidate({ email, password })
        .then((res) => {
          if (res.error) {
            setStatus('Login')
            setShow(true);
            setMsg(res.error);
            setTimeout(() => {
              setShow(false);
            }, 5000);
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
                props.dispatch(setCandidateDetailsToCart(res));
              }
            })
            .catch((e) => console.log(e));
        })
        .catch((err) => console.log(err));
    } else {
      LoginRecruiter({ email, password })
        .then((res) => {
          if (res.error) {
            setStatus('Login')
            setShow(true);
            setMsg(res.error);
            setTimeout(() => {
              setShow(false);
            }, 5000);
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
    setStatus('Signing Up...')
    if (user === "Candidate") {
      console.log(JSON.stringify({ email, password, name: username }));
      SignupCandidate({ email, password, name: username })
        .then((res) => {
          console.log(res);
          if (res.errors) {
            setStatus('Sign Up')
            setShow(true);
            setMsg(res.errors);
            setTimeout(() => {
              setShow(false);
            }, 5000);
          } else {
            props.dispatch(setCandidateDetailsToCart(res));
            localStorage.setItem("rec-user", username);
            localStorage.setItem("rec-id", res.candidate._id);
            localStorage.setItem("rec-token", res.token);
            history.push("/profile");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      SignupRecruiter({ email, password, name: username })
        .then((res) => {
          if (res.errors) {
            setStatus('Sign Up')
            setShow(true);
            setMsg(res.errors);
            setTimeout(() => {
              setShow(false);
            }, 5000);
            return res;
          }
          props.dispatch(setRecruiterDetailsToCart(res));
          localStorage.setItem("rec-user", username);
          localStorage.setItem("rec-token", res.token);
          localStorage.setItem("rec-id", res.recruiter._id);
          history.push("/timeline_r");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="LoginPage">
      <div className="Div2">
        <button
          className="NavBtn"
          style={{ marginRight: "30px", color: "white" }}
          onClick={(e) => setSection("Home")}
        >
          Home
        </button>
        <Dropdown >
          <Dropdown.Toggle
            variant="dark"
            id="dropdown-basic2"
            style={{
              backgroundColor: "transparent",
              outline: "none",
              border: "none",
              fontSize: "19.2px",
            }}
          >
            Login/Sign Up As
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={(e) => {
                setSection("Login");
                localStorage.setItem("rec", "Candidate");
                setUserN("Candidate");
              }}
            >
              Candidate
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => {
                setSection("Login");
                localStorage.setItem("rec", "Recruiter");
                setUserN("Recruiter");
              }}
            >
              Recruiter
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="Div1">
        {" "}
        {section === "Home" ? (
          <>
            
            <span className="Company">Recrutio</span>
            <h1 className={"Tagline"}>WELCOME TO THE PROFESSIONAL COMMUNITY</h1>
            <h2 className="Intro">
              A social media platform for professionals.
              <br />
            </h2>
            <p className="Intro">
              Job seekers can post their work and apply for the jobs on the
              platform. <br />
              The recruiters can make the job posts and hire the suitable
              employee for their company.
            </p>
          </>
        ) : (
          <>
            <form
              className={"Box"}
              id="box"
              onSubmit={(e) => {
                e.preventDefault();
                if (section === "Login") {
                  handleLoginClick();
                } else {
                  handleSignupClick();
                }
              }}
            >
              {section === "Signup" ? (
                <input
                  placeholder="USERNAME"
                  className={"Input1"}
                  required
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setShow(false);
                  }}
                />
              ) : null}
              <input
                placeholder="EMAIL"
                className={"Input1"}
                required
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setShow(false);
                }}
              />
              <input
                placeholder="PASSWORD"
                className={"Input1"}
                required
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setShow(false);
                }}
              />
              <button className={"LoginBtn"} type="submit" disabled = {!(status === 'Login' || status === 'Sign Up')} >
                {status}
              </button>
              {section === "Login" ? (
                <p style={{color: 'white'}} >
                  New User?{" "}
                  <button
                    onClick={(e) => {
                      setStatus('Sign Up')
                      setSection('Signup')} }
                    style={{
                      backgroundColor: "transparent",
                      outline: "none",
                      border: "none",
                      fontWeight: 'bold',
                      color: 'white'
                    }}
                  >
                    Sign Up as {user}
                  </button>
                </p>
              ) : (
                <p style={{color: 'white'}} >
                  Already have an account?{" "}
                  <button
                    onClick={(e) => {
                      setStatus('Login')
                      setSection('Login') }}
                    style={{
                      backgroundColor: "transparent",
                      outline: "none",
                      border: "none",
                      fontWeight: 'bold',
                      color: 'white'
                    }}
                  >
                    Login as {user}
                  </button>
                </p>
              )}
              <Alert
                variant="dark"
                onClose={() => setShow(false)}
                dismissible
                show={show}
                style={{ borderRadius: "10px" }}
                transition={false}
              >
                {msg}
              </Alert>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default connect()(Login);