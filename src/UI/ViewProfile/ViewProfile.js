import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import classes from "../../Components/Profile/Profile.module.css";
import ProfileCard from "../../Components/ProfileCard/ProfileCard";
import DetailCard from "../DetailCard/DetailCard";

const ViewProfile = (props) => {
  const location = useLocation();
  const [user, setUser] = useState("");
  const [details, setDetails] = useState({});

  useEffect(() => {
    if (location.state) {
      setUser(location.state.user);
      setDetails(location.state.data);
    }
  }, [location]);

  return (
    <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
      <Navbar />
      <div className={classes.MainDiv}>
        <ProfileCard details={details} user={user} />

        <div className={classes.ProfileDiv}>
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
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
