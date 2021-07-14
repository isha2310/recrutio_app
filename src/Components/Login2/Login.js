import { useEffect, useState } from "react";
import "./Login.css";
import {
  getCandidateById,
  LoginCandidate,
  SignupCandidate
} from "../../apiCalls/Candidate";
import { LoginRecruiter, SignupRecruiter,getRecruiterById } from "../../apiCalls/Recruiter";
import {
  setCandidateDetailsToCart,
  setRecruiterDetailsToCart,
  setUser,
} from "../../store/action/action";
import { useHistory } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import Alert from "react-bootstrap/Alert";

const Login = (props) => {
  let history = useHistory();
  let dispatch = props.dispatch

  if (localStorage.getItem("rec-token")) {
    if(localStorage.getItem("rec") === 'Candidate'){
      history.push("/profile");
      getCandidateById(localStorage.getItem("rec-id"))
      .then((res) => {
        if (res.error) {
          console.log(res.error);
        } else {
          dispatch(setCandidateDetailsToCart(res));
        }
      })
      .catch((e) => console.log(e))
    } else {
      history.push('/timeline_r')
      getRecruiterById(localStorage.getItem("rec-id"))
        .then((res) => {
          if (res.error) {
            console.log(res.error);
          } else {
            console.log(res)
            dispatch(setRecruiterDetailsToCart(res))
          }
        })
        .catch((e) => console.log(e))
    }
  }

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, SetSignup] = useState(false);
  const [user, setUserN] = useState('');
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if(!localStorage.getItem('rec')){
      localStorage.setItem("rec", "Candidate")
      setUserN('Candidate')
    } else {
      setUserN(localStorage.getItem('rec'))
    }
  }, []);

  useEffect(() => {
    if(user !== ''){
      dispatch(setUser(user))
    }
  },[user, dispatch])

  const handleLoginClick = () => {
    if (user === "Candidate") {
      LoginCandidate({ email, password })
        .then((res) => {
          console.log(res);
          if (res.error) {
            setShow(true);
            setMsg(res.error);
            setTimeout(() => {
              setShow(false)
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
            setShow(true);
            setMsg(res.error);
            setTimeout(() => {
              setShow(false)
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
    if (user === "Candidate") {
      SignupCandidate({ email, password, name: username })
        .then((res) => {
          console.log(res);
          if (res.error) {
            setShow(true);
            setMsg(res.error);
            setTimeout(() => {
              setShow(false)
            }, 5000);
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
            setShow(true);
            setMsg(res.error);
            setTimeout(() => {
              setShow(false)
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

  const handleMethod = (e) => {
    e.preventDefault();
    SetSignup(!signup);
  };

  return (
    <div className="LoginPage">
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
      <div className="Div1">
        <div>
          <h1 className={"Tagline"}>WELCOME TO THE PROFESSIONAL COMMUNITY</h1>

          <form
            className={"Box"}
            id="box"
            onSubmit={(e) => {
              e.preventDefault();
              if (!signup) {
                handleLoginClick();
              } else {
                handleSignupClick();
              }
            }}
          >
            {signup ? (
              <input
                placeholder="USERNAME"
                className={"Input1"}
                required
                onChange={(e) => {
                  setUsername(e.target.value)
                  setShow(false)
                }}
                autoFocus
              />
            ) : null}
            <input
              placeholder="EMAIL"
              className={"Input1"}
              required
              type="email"
              autoFocus
              onChange={(e) => {
                setEmail(e.target.value);
                setShow(false)
              }}
            />
            <input
              placeholder="PASSWORD"
              className={"Input1"}
              required
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
                setShow(false)
              }}
            />
            <button className={"LoginBtn"} type="submit">
              {!signup ? "Login" : "Sign Up"}
            </button>
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
        </div>
      </div>
    </div>
  );
};
export default connect()(Login);
