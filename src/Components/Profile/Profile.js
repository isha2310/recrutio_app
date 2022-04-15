import ProfileCard from "../ProfileCard/ProfileCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import classes from "./Profile.module.css";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateCandidateDetails } from "../../apiCalls/Candidate";
import { setCandidateDetailsToCart } from "../../store/action/action";
import DetailCard from "../../UI/DetailCard/DetailCard";
import FormCard from "../../UI/FormCard/FormCard";
import Badge from "react-bootstrap/Badge";
import { skillArray } from "../Assets/skillArray";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import PostCard from "../../UI/PostCard/PostCard";
import MyNavbar from "../Navbar/Navbar";
import { useHistory } from "react-router-dom";

const Profile = (props) => {
  const [field, setField] = useState(0);
  const [skill, setSkill] = useState([]);
  const [view, setView] = useState("Profile");
  const [posts, setPosts] = useState([]);
  let user = localStorage.getItem("rec");
  let history = useHistory();

  useEffect(() => {
    let user = localStorage.getItem("rec");
    if (user === "Candidate") {
      if (
        props.candidate.candidate.snap &&
        props.candidate.candidate.snap.length !== 0
      ) {
        let im = `data:${props.candidate.candidate.snap};base64,${Buffer.from(
          props.candidate.candidate.snap
        ).toString("base64")}`;
        localStorage.setItem("rec-snap", im);
      }
      if (props.candidate.posts && props.candidate.posts.length !== 0) {
        setPosts([...props.candidate.posts]);
      }
    } else {
      history.push("/timeline_r");
    }
  }, [props.candidate.posts, props.candidate.candidate.snap, history]);

  const handleSkill = (e) => {
    e.preventDefault();
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
      })
      .catch((e) => console.log(e));
  };

  return (
    <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
      <MyNavbar />
      <div className={classes.MainDiv}>
        <ProfileCard />
        <div className={classes.ProfileDiv}>
          {user === "Candidate" && (
            <Tabs defaultActiveKey="about" id="uncontrolled-tab-example">
              <Tab
                eventKey="about"
                title="About"
                onClick={(e) => setView("Profile")}
              >
                <>
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
                        ? props.candidate.candidate.skills.map(
                            (skil, index) => {
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
                            }
                          )
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
                </>
              </Tab>
              <Tab
                eventKey="posts"
                title="Posts"
                onClick={(e) => setView("Posts")}
              >
                {posts.length > 0 ? (
                  <div style={{ marginTop: "20px" }}>
                    {posts
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((post, index) => (
                        <PostCard info={post} key={index} />
                      ))}
                  </div>
                ) : (
                  ""
                )}
              </Tab>
            </Tabs>
          )}

          {user === "Recruiter" &&
            view === "Posts" &&
            (posts.length > 0 ? (
              <div>
                {posts
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((post, index) => (
                    <PostCard info={post} key={index} />
                  ))}
              </div>
            ) : (
              ""
            ))}
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
