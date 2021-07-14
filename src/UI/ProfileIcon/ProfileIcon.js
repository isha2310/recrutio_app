import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getCandidateById } from "../../apiCalls/Candidate";
import Pic from "../../Components/Assets/profile.png";

const ProfileIcon = (props) => {
  const [dp, setDp] = useState(Pic);
  const [hover, setHover] = useState(false)
  const [appliedStyle, setAppliedStyle] = useState({})

  let history = useHistory()

  useEffect(() => {
    if (props.info.snap) {
      let im = `data:${props.info.snap};base64,${Buffer.from(
        props.info.snap
      ).toString("base64")}`;
      setDp(im);
    }
  }, [props.info.snap]);

  useEffect(() => {
      if(hover){
          setAppliedStyle({textDecoration: 'underline', cursor: 'pointer'})
      } else {
        setAppliedStyle({textDecoration: 'none'})
      }
  }, [hover])

  const toggleHover = () => {
      setHover(!hover)
  }

  const openProfile = () => {
      getCandidateById(props.info._id)
      .then((res) => {
        if(!res.error){
          console.log(res)
          history.push({
            pathname: '/viewProfile',
            state : { user: 'Candidate' , data: res.candidate, posts: res.posts }
          })
        }
      })
      .catch((e) => console.log(e)) 
  }

  return (
    <div style={{ width: '80%', border: '1px solid #bebebe', borderRadius: '10px', padding: '10px 20px', margin: 'auto', marginBottom: '20px' }} >
      <div style={{ display: "flex" }}>
        <img
          src={dp}
          alt="..."
          style={{ height: "10vh", borderRadius: "50%" }}
        />{" "}
        &nbsp;
        <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center' }} >
          <h5 style={appliedStyle} onMouseEnter={toggleHover} onMouseLeave={toggleHover} onClick={openProfile} >{props.info.name}</h5>
          {props.info.bio && <p>{props.info.bio}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileIcon;
