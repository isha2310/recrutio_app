import Navbar from "../Navbar/Navbar";
import classes from "./Timeline.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { skillArray } from "../../DataAsset/skillArray";
import CandidatePost from "../../services/candidatepost.service";
import { useDispatch, useSelector } from "react-redux";
import { setCandidateDetailsToCart } from "../../store/action/action";
import { getAllPosts, getBlogs } from "../../apiCalls/Candidate";
import PostCard from "../../UI/PostCard/PostCard";
import BlogsCard from "../../UI/BlogsCard/BlogsCard";

const user = localStorage.getItem("rec");

const Timeline = (props) => {
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [caption, setCaption] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [link, setLink] = useState("");
  const [repolink, setRepolink] = useState("");
  const [technologies, setTechnologies] = useState([]);
  const [tech, setTech] = useState("");
  const [allPost, setAllPost] = useState([]);
  const [relevantPost, setRelevantPost] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const dispatch = useDispatch();

  const canDetails = useSelector((state) => state.candidate);

  useEffect(() => {
    console.log("hey", user);
    let query = "";
    if (user === "Candidate") {
      if (canDetails.candidate.skills) {
        if (canDetails.candidate.skills.length > 0) {
          let n = Math.floor(
            Math.random() * (canDetails.candidate.skills.length - 0)
          );
          query = canDetails.candidate.skills[n];
          console.log(query, n);
        }
      } else {
        setTimeout(function () {
          query = "trending";
        }, 1000);
      }
      if (query !== "") {
        getBlogs(query)
          .then((res) => {
            console.log(res.items);
            setBlogs(res.items);
          })
          .catch((e) => {
            setBlogs([]);
          });
      }
    }
  }, [canDetails.candidate.skills]);

  useEffect(() => {
    setTechnologies([]);
    setImages([]);
    setPreviewImages([]);
  }, [modalShow]);

  useEffect(() => {
    getAllPosts()
      .then((res) => {
        if (res.status !== 401) {
          setAllPost(res);
        }
      })
      .catch((e) => console.log(e));
  }, [canDetails.posts]);

  useEffect(() => {
    let arr1 = [...allPost];
    let arr2 = canDetails.candidate.skills;
    if (arr2) {
      if (arr2.length > 0) {
        let arr3 = [];
        for (let i = 0; i < arr1.length; i++) {
          let ele = arr1[i];
          if (arr2.some((skill) => ele.technologies.includes(skill))) {
            arr3.push(ele);
          }
          setRelevantPost(arr3);
        }
      }
    } else {
      setRelevantPost(arr1);
    }
  }, [allPost, canDetails.candidate]);

  const uploadPic = (e) => {
    let im = [...images];
    if (e.target.files[0]) {
      im.push(e.target.files[0]);
      setImages(im);
      setPreviewImages(im);
    }
  };

  const handleModalClose = () => {
    setModalShow(false);
    setImages([]);
    setPreviewImages([]);
  };

  const handlePost = (e) => {
    e.preventDefault();
    let posts = [];
    console.log(canDetails.posts);

    if (canDetails.posts) posts = [...canDetails.posts];

    let data = {
      caption,
      technologies,
    };
    if (link !== "") data.link = link;
    if (repolink !== "") data.repolink = repolink;
    if (images !== []) data.snaps = images;

    CandidatePost.upload(data)
      .then((res) => {
        setModalShow(false);
        console.log(res);
        if (res.status !== 400) {
          posts.push(res);
          dispatch(setCandidateDetailsToCart({ posts: posts }));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", margin: "auto" }}>
        <div className={classes.PostsArea + " " + classes.Post}>
          <div className={classes.Post + " " + classes.AllPosts}>
            <textarea
              className={classes.Post}
              placeholder="Want to share something? "
              onClick={(e) => setModalShow(true)}
              style={{ width: "100%" }}
            />
            {relevantPost.length > 0 ? (
              <div>
                {relevantPost
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((post, index) => (
                    <PostCard info={post} key={index} />
                  ))}
              </div>
            ) : (
              ""
            )}
          </div>
          <div
            className={
              "d-none d-md-block d-lg-block " +
              classes.BlogArea +
              " " +
              classes.Post
            }
          >
            {blogs !== [] && (
              <>
                <p style={{ fontSize: "1.2em", color: "#007bff" }}>
                  <FontAwesomeIcon icon={faChartLine} /> Trending
                </p>
                {blogs.map((blog, index) => (
                  <BlogsCard link={blog.link} title={blog.title} key={index} />
                ))}
              </>
            )}
          </div>
        </div>
        <Modal
          show={modalShow}
          animation={false}
          onHide={handleModalClose}
          scrollable={true}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div className={classes.Post}>
              <form>
                <textarea
                  className={classes.Textarea}
                  placeholder="Want to Share something"
                  onChange={(e) => {
                    setCaption(e.target.value);
                  }}
                  required
                />
                <br />
                <label htmlFor="PostPic">
                  <div className={classes.PostFile}>
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{
                        color: "#bebebe",
                        border: "3px solid #bebebe",
                        borderRadius: "50%",
                        fontSize: "1.2rem",
                      }}
                    />
                    <br />
                    Choose File
                  </div>
                </label>
                {previewImages.length > 0 ? (
                  <div>
                    {previewImages.map((image, index) => (
                      <img
                        src={URL.createObjectURL(image)}
                        key={index}
                        alt="..."
                        className={classes.Pics}
                      />
                    ))}
                  </div>
                ) : (
                  ""
                )}
                <input
                  type="file"
                  name="PostPic"
                  id="PostPic"
                  accept="image/*"
                  className={classes.PostPic}
                  onChange={uploadPic}
                />
                <br />
                <label htmlFor="repolink">Repository link (if any) :</label>
                <br />
                <input
                  className={classes.PostInput}
                  name="repolink"
                  placeholder="Ex: Your GitHub repository link"
                  onChange={(e) => setRepolink(e.target.value)}
                />
                <br />
                <label htmlFor="link">Any other link (if any) :</label>
                <br />
                <input
                  className={classes.PostInput}
                  name="link"
                  placeholder="Ex: Any live link"
                  onChange={(e) => setLink(e.ta)}
                />
                <br />
                <label>
                  Technologies Used:{" "}
                  {technologies.length > 0 ? (
                    <div style={{ display: "flex" }}>
                      {technologies.map((tech, index) => (
                        <p
                          className={classes.Tech}
                          key={index}
                          onClick={(e) => {
                            let i = technologies.indexOf(tech);
                            let arr = [...technologies];
                            arr.splice(i, 1);
                            setTechnologies(arr);
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
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button onClick={handlePost} className={classes.PostBtn}>
              Post
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Timeline;
