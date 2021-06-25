import ProfilePic from "./profile.png";
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

const ProfileCard = (props) => {
  let arr = {};
  const dispatch = useDispatch();

  const [name, setName] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [bio, setBio] = useState("");
  const [phnNumber, setphnNumber] = useState("");
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(undefined);
  const [perviewImage, setPreviewImage] = useState(undefined);
  const [image, setImage] = useState(ProfilePic);

  const canDetails = useSelector((state) => state.candidate);

  useEffect(() => {
    setName(localStorage.getItem("rec-user"));
    if (canDetails.candidate.bio) setBio(canDetails.candidate.bio);
    if (canDetails.candidate.phnNumber)
      setphnNumber(canDetails.candidate.phnNumber);
    if (canDetails.candidate.address) setAddress(canDetails.candidate.address);
    if (canDetails.candidate.snap) {
      let im = `data:${canDetails.candidate.snap};base64,${Buffer.from(
        canDetails.candidate.snap
      ).toString("base64")}`;
      setImage(im);
      setPreviewImage(im);
    }
  }, [canDetails]);

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
        console.log(res);
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
          <h3 className={classes.Name}>{localStorage.getItem("rec-user")}</h3>
          <h5
            style={{ textAlign: "center", marginBottom: 0 }}
            className={classes.Bio}
          >
            {canDetails.candidate.bio || "Add something about yourself"} &nbsp;
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
          {localStorage.getItem("rec") === "Candidate" ? (
            <div >
              <div style={{ display: "flex", margin: 0, padding: 0 }}>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ color: "#5a5959", height: "1.5em" }}
                />
                &nbsp;
                <p style={{ textTransform: "lowercase", margin: 0 }}>
                  {canDetails.candidate.email}
                </p>
              </div>
              {canDetails.candidate.phnNumber !== "" ? (
                <div style={{ display: "flex", margin: 0, padding: 0 }}>
                  <FontAwesomeIcon
                    icon={faPhone}
                    style={{ color: "#5a5959", height: "1.5em" }}
                  />
                  &nbsp;
                  <p style={{ margin: 0 }}>{canDetails.candidate.phnNumber}</p>
                </div>
              ) : (
                ""
              )}
              {canDetails.candidate.address !== "" ? (
                <div style={{ display: "flex", margin: 0, padding: 0 }}>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    style={{ color: "#5a5959", height: "1.5em" }}
                  />
                  &nbsp;
                  <p style={{ margin: 0 }}>{canDetails.candidate.address}</p>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <button
          type="button"
          style={{ border: 0, backgroundColor: "white", alignSelf: "flex-end" }}
          onClick={() => setModalShow(true)}
        >
          <FontAwesomeIcon icon={faEdit} style={{ color: "#5a5959" }} />
        </button>

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
        {localStorage.getItem("rec") === "Candidate" ? (
          <div >
            <div style={{ display: "flex", margin: 0, padding: 0 }}>
              <FontAwesomeIcon
                icon={faEnvelope}
                style={{ color: "#5a5959", height: "1.5em" }}
              />
              &nbsp;
              <p style={{ textTransform: "lowercase", margin: 0 }}>
                {canDetails.candidate.email}
              </p>
            </div>
            {canDetails.candidate.phnNumber !== "" ? (
              <div style={{ display: "flex", margin: 0, padding: 0 }}>
                <FontAwesomeIcon
                  icon={faPhone}
                  style={{ color: "#5a5959", height: "1.5em" }}
                />
                &nbsp;
                <p style={{ margin: 0 }}>{canDetails.candidate.phnNumber}</p>
              </div>
            ) : (
              ""
            )}
            {canDetails.candidate.address !== "" ? (
              <div style={{ display: "flex", margin: 0, padding: 0 }}>
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  style={{ color: "#5a5959", height: "1.5em" }}
                />
                &nbsp;
                <p style={{ margin: 0 }}>{canDetails.candidate.address}</p>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </React.Fragment>
  );
};

export default ProfileCard;
