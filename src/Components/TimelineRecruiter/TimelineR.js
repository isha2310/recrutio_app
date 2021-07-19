import MyNavbar from "../Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEnvelope,
  faMapMarkerAlt,
  faPhoneAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { skillArray } from "../Assets/skillArray";
import { useDispatch, useSelector } from "react-redux";
import { setRecruiterDetailsToCart } from "../../store/action/action";
import { getAllPosts } from "../../apiCalls/Candidate";
import PostCard from "../../UI/PostCard/PostCard";
import classes from "../Timeline/Timeline.module.css";
import Pic from "../Assets/profile.png";
import "./TimelineR.css";
import { jobPost, updateRecruiterDetails } from "../../apiCalls/Recruiter";
import UploadService from "../../services/file-upload.service";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Alert from 'react-bootstrap/Alert'
import JobPostCard from "../../UI/JobPostCard/JobPostCard";
import { useHistory } from "react-router-dom";

const TimelineR = (props) => {
  let recDetails = useSelector((state) => state.recruiter);
  const dispatch = useDispatch();
  let history = useHistory()

  const [file, setFile] = useState(undefined);
  const [modalShow, setModalShow] = useState(false);
  const [workDetails, setWorkDetails] = useState("");
  const [details, setDetails] = useState({});
  const [allPost, setAllPost] = useState([]);
  const [image, setImage] = useState(Pic);
  const [previewImage, setPreviewImage] = useState(Pic);
  const [modalShow2, setModalShow2] = useState(false);
  const [modalShow3, setModalShow3] = useState(false)
  const [technologies, setTechnologies] = useState([]);
  const [tech, setTech] = useState("");
  const [arr2, setArr2] = useState({});
  const [arr, setArr] = useState({
    name: "",
    address: "",
    phnNumber: "",
    position: "",
    company: "",
    email: "",
  });

  useEffect(() => {
    if (localStorage.getItem("rec") !== "Recruiter"){
      history.push('/timeline')
    }
  })

  useEffect(() => {
    if (recDetails.recruiter) {
      setDetails({ ...recDetails.recruiter });
    }
  }, [recDetails.recruiter]);

  useEffect(() => {
    if (recDetails.recruiter) {
      let a = { ...arr };
      if (recDetails.recruiter.name && recDetails.recruiter.name !== "")
        a = { ...a, name: recDetails.recruiter.name };
      if (recDetails.recruiter.email && recDetails.recruiter.email !== "")
        a = { ...a, email: recDetails.recruiter.email };
      if (recDetails.recruiter.address && recDetails.recruiter.address !== "")
        a = { ...a, address: recDetails.recruiter.address };
      if (
        recDetails.recruiter.phnNumber &&
        recDetails.recruiter.phnNumber !== ""
      )
        a = { ...a, phnNumber: recDetails.recruiter.phnNumber };
      if (recDetails.recruiter.company && recDetails.recruiter.company !== "")
        a = { ...a, company: recDetails.recruiter.company };
      if (recDetails.recruiter.position && recDetails.recruiter.position !== "")
        a = { ...a, position: recDetails.recruiter.position };
      if (recDetails.recruiter.snap && recDetails.recruiter.snap.length !== 0) {
        let im = `data:${recDetails.recruiter.snap};base64,${Buffer.from(
          recDetails.recruiter.snap
        ).toString("base64")}`;
        localStorage.setItem("rec-snap", im);
        setImage(im);
        setPreviewImage(im);
      } else {
        setImage(Pic);
        setPreviewImage(Pic);
      }

      setArr({ ...a });
    }
  }, [recDetails]);

  useEffect(() => {
    if (details) {
      let str = "";
      if (details.position && details.position !== "") {
        str = details.position;
      }
      if (details.company && details.company !== "") {
        str = str + " At " + details.company;
      }
      setWorkDetails(str);
    }
  }, [details]);

  useEffect(() => {
    getAllPosts()
      .then((res) => {
        if (res.status !== 401) {
          setAllPost(res);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  const uploadPic = (e) => {
    setFile(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const upload = () => {
    UploadService.upload(file)
      .then((res) => {
        dispatch(setRecruiterDetailsToCart({ recruiter: { ...res } }));
      })
      .catch((e) => console.log(e));
  };

  const handleClose = () => {
    if (localStorage.getItem("rec") === "Recruiter") {
      if (arr.name !== "") {
        updateRecruiterDetails({ ...arr })
          .then((res) => {
            if (res.status === 400) {
              console.log(res);
            } else {
              setDetails(arr);
              dispatch(setRecruiterDetailsToCart({ recruiter: { ...res } }));
              localStorage.setItem("rec-user", res.name);
            }
          })
          .catch((e) => console.log(e));
        if (file) {
          console.log(file);
          upload();
        }
      }
    }

    setModalShow(false);
  };

  const handlePostSave = (e) => {
    e.preventDefault();
    console.log(arr2);
    jobPost(arr2)
      .then((res) => {
        if (res.errors || res.status === 400) {
          if (res._message === "RecruiterPost validation failed" || res.status === 400) {
            setModalShow3(true)
            setTimeout(() => {
              setModalShow3(false)
            }, 3000)
          }
        } else {
          if (res.status !== 400) {
            setModalShow2(false);
            if (recDetails.jobPosts && recDetails.jobPosts.length > 0) {
              dispatch(
                setRecruiterDetailsToCart({
                  jobPosts: [res, ...recDetails.jobPosts],
                })
              );
            } else {
              dispatch(
                setRecruiterDetailsToCart({
                  jobPosts: [res],
                })
              );
            }
          }
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
      <MyNavbar />
      <div style={{ display: "flex", margin: "auto" }}>
        <div className={classes.PostsArea + " " + classes.Post}>
          <div className={classes.Post + " Profile"}>
            <img src={image} alt="..." className="Dp" />
            <div style={{ marginTop: "25px" }}>
              <h3>{localStorage.getItem("rec-user")}</h3>
              <div>
                {workDetails !== "" ? (
                  <div style={{ display: "flex", margin: 0, padding: 0 }}>
                    {workDetails}
                  </div>
                ) : (
                  <div style={{ display: "flex", margin: 0, padding: 0 }}>
                    Add where you work
                  </div>
                )}
                <div style={{ display: "flex", margin: 0, padding: 0 }}>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    style={{ color: "#5a5959", height: "1.5em" }}
                  />
                  &nbsp;
                  <p style={{ textTransform: "lowercase", margin: 0 }}>
                    {details.email}
                  </p>
                </div>
                {details.address && details.address !== "" ? (
                  <div style={{ display: "flex", margin: 0, padding: 0 }}>
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      style={{ color: "#5a5959", height: "1.5em" }}
                    />
                    &nbsp;
                    <p style={{ margin: 0 }}>{details.address}</p>
                  </div>
                ) : (
                  ""
                )}
                {details.phnNumber && details.phnnumber !== "" ? (
                  <div style={{ display: "flex", margin: 0, padding: 0 }}>
                    <FontAwesomeIcon
                      icon={faPhoneAlt}
                      style={{ color: "#5a5959", height: "1.5em" }}
                    />
                    &nbsp;
                    <p style={{ margin: 0 }}>{details.phnNumber}</p>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <>
              <button
                type="button"
                style={{
                  border: 0,
                  backgroundColor: "white",
                  float: "right",
                }}
                onClick={() => setModalShow(true)}
              >
                <FontAwesomeIcon icon={faEdit} style={{ color: "#5a5959" }} />
              </button>
            </>
          </div>
          <div className={classes.Post + " " + classes.AllPosts}>
            <Tabs defaultActiveKey="timeline" id="uncontrolled-tab-example">
              <Tab eventKey="timeline" title="Timeline">
                {allPost.length > 0 ? (
                  <div style={{ marginTop: "10px" }}>
                    {allPost
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((post, index) => (
                        <PostCard info={post} key={index} />
                      ))}
                  </div>
                ) : (
                  ""
                )}
              </Tab>
              <Tab eventKey="your_post" title="Your Posts">
                <div style={{ marginTop: "10px" }}>
                  <textarea
                    className={classes.Post}
                    placeholder="Want to add a job post? "
                    onClick={(e) => setModalShow2(true)}
                    style={{ width: "100%" }}
                  />
                  {recDetails.jobPosts && recDetails.jobPosts.length > 0 ? (
                    <div>
                      {recDetails.jobPosts
                        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                        .map((post, index) => {
                        return (
                          <JobPostCard
                            key={index}
                            post={post}
                            user="Recruiter"
                          />
                        );
                      })}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      <Modal
        show={modalShow}
        animation={false}
        onHide={() => setModalShow(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label htmlFor="uploadPhoto">
            <img
              src={previewImage}
              style={{ borderRadius: "50%", height: "14vh" }}
              alt="Profile"
            />
          </label>
          <input
            type="file"
            name="uploadPhoto"
            id="uploadPhoto"
            className="uploadPhoto"
            accept="image/*"
            onChange={uploadPic}
          />
          <br />
          <input
            placeholder="Your Name"
            value={arr.name}
            onChange={(e) => setArr({ ...arr, name: e.target.value })}
            className="InputInfo"
          />
          <br />
          <input
            placeholder="Title"
            className="InputInfo"
            onChange={(e) => setArr({ ...arr, position: e.target.value })}
            value={arr.position}
          />{" "}
          <br />
          <input
            placeholder="Where do you work?"
            className="InputInfo"
            onChange={(e) => setArr({ ...arr, company: e.target.value })}
            value={arr.company}
          />
          <br />
          <input
            placeholder="Add your phone number"
            className="InputInfo"
            onChange={(e) => setArr({ ...arr, phnNumber: e.target.value })}
            value={arr.phnNumber}
          />
          <br />
          <input
            placeholder="Add your address"
            className="InputInfo"
            onChange={(e) => setArr({ ...arr, address: e.target.value })}
            value={arr.address}
          />
          <br />
          <button onClick={handleClose} style={{ padding: ".275rem .75rem" }}>
            Save Changes
          </button>
        </Modal.Header>
      </Modal>
      <Modal
        show={modalShow2}
        animation={false}
        onHide={() => {
          setTechnologies([]);
          setModalShow2(false);
        }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className={classes.Post}>
            <form>
              <label htmlFor="company">Company :&nbsp;*</label>
              <br />
              <input
                required
                type="text"
                className={classes.PostInput}
                name="company"
                placeholder="Ex: Microsoft"
                onChange={(e) => setArr2({ ...arr2, company: e.target.value })}
              />
              <br />
              <label htmlFor="role">Role :&nbsp;*</label>
              <br />
              <input
                required
                type="text"
                className={classes.PostInput}
                name="role"
                placeholder="Ex: Software Developer"
                onChange={(e) => setArr2({ ...arr2, role: e.target.value })}
              />
              <br />
              <label htmlFor="jd">Job Description :&nbsp;*</label>
              <br />
              <textarea
                required
                type="text"
                className={classes.Textarea}
                name="jd"
                placeholder="Day to day responsibilties, etc."
                onChange={(e) =>
                  setArr2({ ...arr2, jobDescription: e.target.value })
                }
              />
              <br />
              <label htmlFor="salary">Salary :&nbsp;*</label>
              <br />
              <input
                required
                type="number"
                className={classes.PostInput}
                name="salary"
                placeholder="Ex: ₹5,00,000 LPA"
                onChange={(e) => setArr2({ ...arr2, salary: e.target.value })}
              />
              <br />
              <label>
                Skills Required:&nbsp;*
                {technologies.length > 0 ? (
                  <div style={{ display: "flex" }}>
                    {technologies.map((tech, index) => (
                      <p
                        className={classes.Tech}
                        key={index}
                        onClick={(e) => {
                          let i = technologies.indexOf(tech);
                          let a = [...technologies];
                          a.splice(i, 1);
                          setTechnologies(a);
                          setArr2({ ...arr2, skillsRequired: a });
                        }}
                      >
                        {tech}
                      </p>
                    ))}
                    (click to remove)
                  </div>
                ) : (
                  ""
                )}{" "}
              </label>
              <br />
            </form>
            <form
              method="get"
              onSubmit={(e) => {
                e.preventDefault();
                let arr = [...technologies];
                arr.push(tech);
                setTechnologies(arr);
                setTech("");
                setArr2({ ...arr2, skillsRequired: arr });
                e.target.reset();
              }}
            >
              <input
                required
                className={classes.PostInput}
                list="skills"
                name="skills"
                placeholder="Ex: JavaScript"
                onChange={(e) => setTech(e.target.value)}
              />
              <datalist
                id="skills"
                required
                onChange={(e) => {
                  e.preventDefault();
                  let arr = [...technologies];
                  arr.push(tech);
                  setTechnologies(arr);
                  setTech("");
                  e.target.reset();
                }}
              >
                {skillArray.map((val, index) => (
                  <option value={val} key={index} />
                ))}
              </datalist>
              <button className={classes.PostBtn}>Add</button>
            </form>
            <button className={classes.PostBtn} onClick={handlePostSave}>
              Post
            </button>
            <Alert variant="dark" style={{marginTop: '10px'}} onClose={() => setModalShow3(false)} transition={false} show={modalShow3} dismissible><p>Please fill all the required fields!</p></Alert>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TimelineR;