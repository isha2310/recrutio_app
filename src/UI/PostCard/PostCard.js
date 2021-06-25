import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import classes from "./PostCard.module.css";
import { Image, Transformation } from 'cloudinary-react';
import Carousel from "react-bootstrap/Carousel";

const PostCard = (props) => {
  let snaps = props.info.snaps;
  let tech = props.info.technologies.join(", ");

  const [modalShow, setModalShow] = useState(false);
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <div className={classes.Post}>
      <h6>{props.info.candidateName}</h6>
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
              } else if (index === 1) {
                return (
                  <img
                    key={index}
                    src={snap}
                    alt="..."
                    className={classes.Pic + " "+ classes.Dark }
                    onClick={(e) => {
                      setModalShow(true)
                      setIndex(index)
                    }}
                  />
                );
              } else {
                return (<p>...more</p>);
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
      <Modal
        show={modalShow}
        animation={false}
        onHide={() => setModalShow(false)}
        dialogClassName={classes.ModalS}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body style={{ backgroundColor: "#3f3f3f"}}>
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


// <div key={index} style={{position: 'relative'}}><img src={im} className={classes.Pic} style={{ filter: 'brightness(10%)'}} alt="..." /><div style={{position: 'absolute', top: '50%', left: '50%', color: 'grey'}}>+{snaps.length-1}</div></div>
//                 );

// let im = `data:${snap};base64,${Buffer.from(snap).toString(
//   "base64"
// )}`;