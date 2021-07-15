import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import classes from "./PostCard.module.css";
import { Image, Transformation } from 'cloudinary-react';
import Carousel from "react-bootstrap/Carousel";
import { deleteCanPost, getCandidateById } from "../../apiCalls/Candidate";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setCandidateDetailsToCart } from "../../store/action/action";

const PostCard = (props) => {
  let snaps = props.info.snaps;
  let tech = props.info.technologies.join(", ");
  let history = useHistory();
  const [modalShow, setModalShow] = useState(false);
  const [index, setIndex] = useState(0);

  let dispatch = useDispatch()

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const openProfile =() => {
    getCandidateById(props.info.candidateId)
    .then((res) => {
      if(!res.error){
        history.push({
          pathname: '/viewProfile',
          state : { user: 'Candidate' , data: res.candidate, posts: res.posts }
        })
      }
    })
    .catch((e) => console.log(e))    
  }

  const deletePost = () => {
   deleteCanPost(props.info._id)
   .then((res) => {
    if (res.status !== 400 || res.status !== 404){
      dispatch(setCandidateDetailsToCart({posts: {...res.posts}}))
    }
   })
   .catch((e) => console.log(e)) 
  }

  return (
    <div className={classes.Post}>
      <h6 onClick={openProfile} className={classes.Name} >{props.info.candidateName}</h6>
      <div className={classes.Info}>
        <p className={classes.Caption}>{props.info.caption}</p>
        {snaps.length > 0 ? (
          <div>
            {snaps.map((snap, index) => {
              if (index < 1) {
                return (
                  <img
                    key={index}
                    src={snap}
                    alt="..."
                    className={classes.Pic}
                    onClick={(e) => {
                      setModalShow(true)
                      setIndex(index)
                    }}
                  />
                );
              } else {
                return (<p key={index} style={{float: 'right', color: 'blue', cursor: 'pointer', width: 'fit-content' }} onClick={(e) => {
                  setModalShow(true)
                  setIndex(index)
                }} >...more</p>);
              }
            })}
          </div>
        ) : (
          ""
        )}
        {props.info.repolink ? (
          <p>
            <b>Repository Link : </b>
            <a href={props.info.repolink} target="_blank" rel="noreferrer">
              {props.info.repolink}
            </a>
          </p>
        ) : (
          ""
        )}
        {props.info.link ? (
          <p>
            <b>Other Link : </b>
            <a
              href={props.info.link}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.preventDefault()}
            >
              {props.info.link}
            </a>
          </p>
        ) : (
          ""
        )}
        <p>
          <b>Technologies used : </b> {tech}
        </p>
      </div>
      { props.info.candidateId === localStorage.getItem('rec-id') && <button
      type="button"
      style={{
        border: 0,
        backgroundColor: "white",
        float: "right",
      }}
    >
      <FontAwesomeIcon
        icon={faTrash}
        style={{ float: "right" }}
        onClick={deletePost}
      />{" "}
    </button> }
      <Modal
        show={modalShow}
        animation={false}
        onHide={() => setModalShow(false)}
        dialogClassName={classes.ModalS}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body style={{ backgroundColor: "#3f3f3f"}} className={classes.Modalbody} >
          <Carousel activeIndex={index} onSelect={handleSelect} >
            {snaps.map((snap, index) => {
              
              return (
                <Carousel.Item key={index}>
                  <img src={snap} key={index} alt="..." className={classes.CarouselPic} />
                </Carousel.Item>
              );
            })}
          </Carousel>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PostCard;