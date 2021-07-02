import { useEffect, useState } from "react";
import Asset4 from "./Asset4.png";
import Navbar from "../Navbar/Navbar";
import { connect } from "react-redux";
import LoginPic from "./Interview-Free-PNG-Image.png";
import "./Login.css";
import { getCandidateById, LoginCandidate, SignupCandidate } from "../../apiCalls/Candidate";
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
          .catch((e) => console.log(e))
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
    <div style={{ height: "100vh" }} className={"Section"}>
      <div className={"wave wave1"}></div>
      <div className={"wave wave2"}></div>
      <div className={"wave wave3"}></div>
      <div className={"wave wave4"}></div>
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
          margin: "auto",
          display: "flex",
          justifyContent: "space-around",
          marginTop: "15vh",
        }}
      >
        <div>
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
        <img src={LoginPic} alt="Login" className={"Pic"} />
      </div>
    </div>
  );
};

export default connect()(Login);

// {
//     return(
//         <div style={{height: '100vh', margin: 0, width: 0}} className={""} >
//             <div className={"LoginPage"} >
//                 <img src={LoginPic} alt="Login" className={"Pic"} />
// <div style={{margin: 'auto'}} className={"Div2"} >
//     <h1 className={"Tagline"} >WELCOME TO THE PROFESSIONAL COMMUNITY</h1>
//     <form onSubmit={(e) => {
//         e.preventDefault()
//         if (!signup){
//             handleLoginClick()
//         } else{
//             handleSignupClick()
//         }
//     }} >
//         <div className={"Box"} >
//             <div style={{marginBottom: '10px'}} >
//                 <button className={"ProfileBtn " + jobSeeker}
//                     onClick ={ (e) => {
//                         e.preventDefault()
//                         setJobSeeker('Selected')
//                         localStorage.setItem('rec', 'Candidate')
//                         props.dispatch(setUser('Candidate'))
//                         setRecruiter('')
//                     }} >Job Seeker</button> /
//                 <button className={"ProfileBtn "+recruiter}
//                     onClick ={ (e) => {
//                         e.preventDefault()
//                         setJobSeeker('')
//                         localStorage.setItem('rec', 'Recruiter')
//                         props.dispatch(setUser('Recruiter'))
//                         setRecruiter('Selected')
//                     }} >Recruiter</button>
//             </div>
//             { signup ?
//                 <input placeholder="USERNAME" className={"Input1"} required
//                     onChange={(e) => setUsername(e.target.value)}
//                 />:
//                 null
//             }
//             <input placeholder="EMAIL" className={"Input1"} required type="email"
//                 onChange={(e) => {
//                     setEmail(e.target.value)
//                 }}
//             />
//             <input placeholder="PASSWORD" className={"Input1"} required type="password"
//                 onChange={(e) => {
//                     setPassword(e.target.value)
//                 }}
//             />
//             <button className={"LoginBtn"} type="submit" >{
//                 !signup ? 'Login' : 'Sign Up'
//             }</button>
//             { !signup ?
//                 <p>New User? <button className={"ProfileBtn"} onClick={handleMethod} >Sign Up</button></p>
//                 :
//                 <p>Already a user? <button className={"ProfileBtn"} onClick={handleMethod} >Login</button></p>
//             }
//         </div>
//     </form>
// </div>
//             </div>
//         </div>
//     )
// }
