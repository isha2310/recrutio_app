import ProfilePic from "../Assets/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import classes from "./ProfileCard.module.css";
import { setCandidateDetailsToCart } from "../../store/action/action";
import { updateCandidateDetails } from "../../apiCalls/Candidate";
import UploadService from "../../services/file-upload.service";
import { useHistory } from 'react-router-dom'

const ProfileCard = (props) => {
  let arr = {};
  const dispatch = useDispatch();
  const history = useHistory();

  const [name, setName] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [bio, setBio] = useState("");
  const [phnNumber, setphnNumber] = useState("");
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(undefined);
  const [perviewImage, setPreviewImage] = useState(ProfilePic);
  const [image, setImage] = useState(ProfilePic);
  const [candidate, setCandidate] = useState({})
  const [user, setUser] = useState('Candidate')
  const [workDetails, setWorkDetails] = useState('')

  const canDetails = useSelector((state) => state.candidate);

  useEffect(() => {
    if(localStorage.getItem('rec') === 'Candidate' ){
      if( canDetails.candidate ){
        setCandidate(canDetails.candidate)
        setUser('Candidate')
      } 
    }
    if( props.details ) {
      setCandidate(props.details)
      setUser(props.user)
    }
  }, [canDetails, props.details, props.user]);

  useEffect(() =>{
    setName(candidate.name );
    if (candidate.bio) setBio(candidate.bio);
    if (candidate.phnNumber)
      setphnNumber(candidate.phnNumber);
    if (candidate.address) setAddress(candidate.address);
  },[candidate])

  useEffect(() => {
    if(user === 'Recruiter'){
      let wd = ''
      if(candidate.position && candidate.position!=='' ){
        wd = candidate.position + " "
      }
      if(candidate.company && candidate.company!=='' ){
        wd = wd + "At "+ candidate.company
      }
      setWorkDetails(wd)
    }
  },[user, candidate])

  useEffect(() => {
    if (candidate.snap) {
      let im = `data:${candidate.snap};base64,${Buffer.from(
        candidate.snap
      ).toString("base64")}`;
      setImage(im);
      localStorage.setItem('rec-snap', im)
      setPreviewImage(im);
    }
  }, [candidate])

  const handleClose = () => {
    if (localStorage.getItem("rec") === "Candidate") {
      if (name !== "") {
        arr.name = name;
        arr.bio = bio;
        arr.phnNumber = phnNumber;
        arr.address = address;

        updateCandidateDetails({ ...arr })
          .then((res) => {
            if (res.status === 400) {
              console.log(res);
            } else {
              dispatch(setCandidateDetailsToCart({ candidate: { ...arr } }));
              localStorage.setItem("rec-user", name);
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

  const uploadPic = (e) => {
    setFile(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const upload = () => {
    UploadService.upload(file)
      .then((res) => {
        dispatch(setCandidateDetailsToCart({ candidate: { snap: res.snap } }));
      })
      .catch((e) => console.log(e));
  };

  return (
    <React.Fragment>
      <div
        style={{
          width: "100%",
          position: "sticky",
          padding: "10px",
          border: "1px solid #bebebe",
          backgroundColor: "white",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          height: "fit-content",
          textTransform: "capitalize",
          justifyContent: "space-around",
        }}
      >
        <img src={image} alt="..." className={classes.Img} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#5a5959",
            alignSelf: "flex-start",
            paddingTop: "10px",
          }}
        >
          <h3 className={classes.Name}>{candidate.name}</h3>
          <h5
            style={{marginBottom: 0 }}
            className={classes.Bio}
          >
          {
            user === 'Candidate' ? 
            (candidate.bio || (props.details ? '' : "Add something about yourself")) 
            :
            workDetails
          }
          &nbsp;
          </h5>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "flex-start",
            color: "#5a5959",
            paddingTop: "10px",
          }}
          className="d-none d-sm-block"
        >
          <h3 >Contact Details</h3>
          
            <div >
              <div style={{ display: "flex", margin: 0, padding: 0 }}>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ color: "#5a5959", height: "1.5em" }}
                />
                &nbsp;
                <p style={{ textTransform: "lowercase", margin: 0 }}>
                  {candidate.email}
                </p>
              </div>
              {candidate.phnNumber && candidate.phnNumber !== "" ? (
                <div style={{ display: "flex", margin: 0, padding: 0 }}>
                  <FontAwesomeIcon
                    icon={faPhone}
                    style={{ color: "#5a5959", height: "1.5em" }}
                  />
                  &nbsp;
                  <p style={{ margin: 0 }}>{candidate.phnNumber}</p>
                </div>
              ) : (
                ""
              )}
              { candidate.address && candidate.address !== "" ? (
                <div style={{ display: "flex", margin: 0, padding: 0 }}>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    style={{ color: "#5a5959", height: "1.5em" }}
                  />
                  &nbsp;
                  <p style={{ margin: 0 }}>{candidate.address}</p>
                </div>
              ) : (
                ""
              )}
            </div>
        </div>
        { !props.details ? 
          <button
          type="button"
          style={{ border: 0, backgroundColor: "white", alignSelf: "flex-end" }}
          onClick={() => setModalShow(true)}
          >
          <FontAwesomeIcon icon={faEdit} style={{ color: "#5a5959" }} />
        </button>
          : 
          <button
          type="button"
          style={{ border: 0, backgroundColor: "white", alignSelf: "flex-end" }}
          onClick={() => history.push({
            pathname: '/messenger',
            state: {senderId:localStorage.getItem('rec-id') , receiverId: candidate._id , user:canDetails}
          }) }
          >
          <FontAwesomeIcon icon={faEnvelope} style={{ color: "#5a5959", fontSize: '1.2em' }} />
        </button>
        }
        

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
                src={perviewImage}
                style={{ borderRadius: "50%", height: "14vh" }}
                alt="Profile"
              />
            </label>
            <input
              type="file"
              name="uploadPhoto"
              id="uploadPhoto"
              className={classes.uploadPhoto}
              accept="image/*"
              onChange={uploadPic}
            />
            <br />
            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={classes.InputInfo}
            />
            <br />
            {localStorage.getItem("rec") === "Candidate" ? (
              <input
                placeholder="Add something about yourself"
                className={classes.InputInfo}
                onChange={(e) => setBio(e.target.value)}
                value={bio}
              />
            ) : (
              <input
                placeholder="Add where you work"
                className={classes.InputInfo}
              />
            )}
            <br />
            <input
              placeholder="Add your phone number"
              className={classes.InputInfo}
              onChange={(e) => setphnNumber(e.target.value)}
              value={phnNumber}
            />
            <br />
            <input
              placeholder="Add your address"
              className={classes.InputInfo}
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
            <br />
            <Button
              variant="dark"
              onClick={handleClose}
              style={{ padding: ".275rem .75rem" }}
            >
              Save Changes
            </Button>
          </Modal.Header>
        </Modal>
      </div>
      <div className={"d-block d-sm-none "+ classes.Contact} >
        <h5 >Contact Details</h5>
          <div >
            <div style={{ display: "flex", margin: 0, padding: 0 }}>
              <FontAwesomeIcon
                icon={faEnvelope}
                style={{ color: "#5a5959", height: "1.5em" }}
              />
              &nbsp;
              <p style={{ textTransform: "lowercase", margin: 0 }}>
                {candidate.email}
              </p>
            </div>
            {candidate.phnNumber !== "" ? (
              <div style={{ display: "flex", margin: 0, padding: 0 }}>
                <FontAwesomeIcon
                  icon={faPhone}
                  style={{ color: "#5a5959", height: "1.5em" }}
                />
                &nbsp;
                <p style={{ margin: 0 }}>{candidate.phnNumber}</p>
              </div>
            ) : (
              ""
            )}
            {candidate.address !== "" ? (
              <div style={{ display: "flex", margin: 0, padding: 0 }}>
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  style={{ color: "#5a5959", height: "1.5em" }}
                />
                &nbsp;
                <p style={{ margin: 0 }}>{candidate.address}</p>
              </div>
            ) : (
              ""
            )}
          </div>
      </div>
    </React.Fragment>
  );
};

export default ProfileCard;