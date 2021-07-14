import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import classes from "../../Components/Profile/Profile.module.css";
import ProfileCard from "../../Components/ProfileCard/ProfileCard";
import DetailCard from "../DetailCard/DetailCard";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import PostCard from "../PostCard/PostCard";
import JobPostCard from "../JobPostCard/JobPostCard";

const ViewProfile = (props) => {
  const location = useLocation();
  const [user, setUser] = useState("");
  const [details, setDetails] = useState({});
  const [posts, setPosts] = useState([])

  useEffect(() => {
    if (location.state) {
      setUser(location.state.user);
      setDetails(location.state.data);
      setPosts(location.state.posts)
    }
  }, [location]);

  return (
    <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
      <Navbar />
      <div className={classes.MainDiv}>
        <ProfileCard details={details} user={user} />
        { user === 'Candidate' ?
          <div className={classes.ProfileDiv}>
          <Tabs defaultActiveKey="about" id="uncontrolled-tab-example">
            <Tab eventKey="about" title="About">
              <>
                <div className={classes.Field}>
                  <div>
                    <div className={classes.FieldHead}>
                      <h3>Experience</h3>
                    </div>
                    {details.experience
                      ? details.experience
                          .sort((a, b) => new Date(b.from) - new Date(a.from))
                          .map((details, index) => (
                            <DetailCard
                              details={details}
                              key={index}
                              type="experience"
                              edit={false}
                            />
                          ))
                      : ""}
                  </div>
                </div>
                <div className={classes.Field}>
                  <div>
                    <div className={classes.FieldHead}>
                      <h3>Education</h3>
                    </div>
                    {details.education
                      ? details.education
                          .sort((a, b) => new Date(b.from) - new Date(a.from))
                          .map((details, index) => (
                            <DetailCard
                              details={details}
                              key={index}
                              type="education"
                              edit={false}
                            />
                          ))
                      : ""}
                  </div>
                </div>
                <div className={classes.Field}>
                  <div>
                    <div className={classes.FieldHead}>
                      <h3>Skills</h3>
                    </div>
                    {details.skills
                      ? details.skills.map((skil, index) => {
                          return (
                            <button key={index} className={classes.Btn}>
                              {skil} &nbsp;
                            </button>
                          );
                        })
                      : ""}
                  </div>
                </div>
              </>
            </Tab>
            <Tab
                eventKey="posts"
                title="Posts"
              >
              {posts.length > 0 ? (
                <div style={{marginTop: '20px'}} >
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
        </div>:
        <div className={classes.ProfileDiv}>
          {
            posts.length > 0 ?
              <div>
                {
                  posts
                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                  .map((post, index) => {
                  return (
                    <JobPostCard
                      key={index}
                      post={post}
                    />
                  );
                })
                }
              </div>
              :
              <h2 style={{color: '#bebebe'}} >Posts Appear here</h2>
          }
        </div>
      }
      </div>
    </div>
  );
};

export default ViewProfile;
