import Navbar from "../Navbar/Navbar";
import ProfileCard from "../ProfileCard/ProfileCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import classes from "./Profile.module.css";
import { useEffect, useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  getCandidateById,
  updateCandidateDetails,
} from "../../apiCalls/Candidate";
import {
  setCandidateDetailsToCart,
  setRecruiterDetailsToCart,
} from "../../store/action/action";
import DetailCard from "../../UI/DetailCard/DetailCard";
import FormCard from "../../UI/FormCard/FormCard";
import Badge from "react-bootstrap/Badge";
import { skillArray } from "../../DataAsset/skillArray";

const Profile = (props) => {
  //const user = useSelector(state => state.user)
  const dispatch2 = useDispatch();

  const [field, setField] = useState(0);
  const [resp, setResp] = useState({});
  const [skill, setSkill] = useState("");

  useEffect(() => {
    let user = localStorage.getItem("rec");
    if (user === "Candidate") {
      const id = localStorage.getItem("rec-id");
      getCandidateById(id)
        .then((res) => {
          if (res.error) {
            console.log(res.error);
          } else {
            console.log(res);
            setResp(res);
            // dispatch2(setCandidateDetailsToCart(res))
          }
        })
        .catch((e) => console.log(e));
    } else {
      //setDetails(recDetails)
    }
    //console.log(details)
  }, []);

  useEffect(() => {
    console.log(resp);
    let user = localStorage.getItem("rec");
    if (user === "Candidate") {
      dispatch2(setCandidateDetailsToCart(resp));
    }
  }, [resp, dispatch2]);

  const handleSkill = (e) => {
    e.preventDefault();
    console.log(skill);
    let skills = props.candidate.candidate.skills;
    if (skill !== "") {
      skills.push(skill);
      updateCandidateDetails({ skills })
        .then((res) => {
          if (res.code !== 400) {
            props.dispatch(
              setCandidateDetailsToCart({ candidate: { skills } })
            );
            setSkill("");
            e.target.reset();
          }
          console.log(res);
        })
        .catch((e) => console.log(e));
    }
  };

  const handleSkillDelete = (skil) => {
    let skills = props.candidate.candidate.skills;
    skills = skills.filter((val) => val !== skil);
    updateCandidateDetails({ skills })
      .then((res) => {
        if (res.code !== 400) {
          props.dispatch(setCandidateDetailsToCart({ candidate: { skills } }));
        }
        console.log(res);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
      <Navbar />
      <div  className={classes.MainDiv} >
        <ProfileCard />
        <div className={classes.ProfileDiv}>
          <div className={classes.Field}>
            <div>
              <div className={classes.FieldHead}>
                <h3>Experience</h3>
                <FontAwesomeIcon
                  icon={faPlus}
                  className={classes.FaIcon}
                  onClick={(e) => {
                    field === 1 ? setField(0) : setField(1);
                  }}
                />
              </div>
              {props.candidate.candidate.experience
                ? props.candidate.candidate.experience
                    .sort((a, b) => new Date(b.from) - new Date(a.from))
                    .map((details, index) => (
                      <DetailCard
                        details={details}
                        key={index}
                        type="experience"
                      />
                    ))
                : ""}
            </div>
            {field === 1 ? (
              <FormCard
                changeField={() => setField(0)}
                field={1}
                type="experience"
              />
            ) : null}
          </div>
          <div className={classes.Field}>
            <div>
              <div className={classes.FieldHead}>
                <h3>Education</h3>
                <FontAwesomeIcon
                  icon={faPlus}
                  className={classes.FaIcon}
                  onClick={(e) => {
                    field === 2 ? setField(0) : setField(2);
                  }}
                />
              </div>
              {props.candidate.candidate.education
                ? props.candidate.candidate.education
                    .sort((a, b) => new Date(b.from) - new Date(a.from))
                    .map((details, index) => (
                      <DetailCard
                        details={details}
                        key={index}
                        type="education"
                      />
                    ))
                : ""}
            </div>
            {field === 2 ? (
              <FormCard
                changeField={() => setField(0)}
                field={2}
                type="education"
              />
            ) : null}
          </div>
          <div className={classes.Field}>
            <div>
              <div className={classes.FieldHead}>
                <h3>Skills</h3>
              </div>
              {props.candidate.candidate.skills
                ? props.candidate.candidate.skills.map((skil, index) => {
                    return (
                      <button key={index} className={classes.Btn}>
                        {skil} &nbsp;
                        <Badge
                          variant="light"
                          style={{ backgroundColor: "#d7d5ff" }}
                          onClick={() => handleSkillDelete(skil)}
                        >
                          X
                        </Badge>
                      </button>
                    );
                  })
                : ""}
              <form onSubmit={handleSkill} method="get">
                <input
                  list="skills"
                  name="skills"
                  onChange={(e) => setSkill(e.target.value)}
                  className={classes.InputField}
                  placeholder="Ex: JavaScript"
                />
                <datalist id="skills">
                  {skillArray.map((val, index) => (
                    <option value={val} key={index} />
                  ))}
                </datalist>
                <button variant="dark" className={classes.Button}>
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    candidate: state.candidate,
    recruiter: state.recruiter,
  };
};

export default connect(mapStateToProps)(Profile);
