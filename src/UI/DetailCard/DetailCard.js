import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faTrash,
  faPencilAlt,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import FormCard from "../FormCard/FormCard";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from "react-redux";
import {
  setCandidateDetailsToCart,
  setRecruiterDetailsToCart,
} from "../../store/action/action";
import { updateCandidateDetails } from "../../apiCalls/Candidate";
import classes from './DetailCard.module.css'

const DetailCard = (props) => {
  const canDetails = useSelector((state) => state.candidate);
  const dispatch = useDispatch();

  const [data, setData] = useState(props.details);
  const [current, setCurrent] = useState(false);
  const [to, setTo] = useState();
  const [fromd, setFromd] = useState();
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    setData(props.details);
  }, [props.details]);

  useEffect(() => {
    let date = new Date(data.from);
    date = dateFormat(date);
    setFromd(date);

    if (data.current) {
      setCurrent(true);
    } else if (data.to) {
      setCurrent(false);
      date = new Date(data.to);
      date = dateFormat(date);
      setTo(date);
    }
  }, [data]);

  const dateFormat = (date) => {
    let strArray = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let m = strArray[date.getMonth()];
    let y = date.getFullYear();
    return "" + m + ", " + y;
  };

  const handleDelete = () => {
    if (localStorage.getItem("rec") === "Candidate") {
      let dataC = [];
      if (props.type === "experience") {
        dataC = canDetails.candidate.experience;
        dataC = dataC.filter((ele) => ele._id !== props.details._id);
      } else {
        dataC = canDetails.candidate.education;
        console.log(dataC);
        dataC = dataC.filter((ele) => ele._id !== props.details._id);
        console.log(dataC);
      }
      updateCandidateDetails({ [props.type]: dataC })
        .then((res) => {
          if (res.code === 400) {
            console.log(res);
          } else {
            console.log(res);
            dispatch(
              setCandidateDetailsToCart({ candidate: { [props.type]: dataC } })
            );
          }
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <div
      className={classes.CardDiv}
    >
      <FontAwesomeIcon
        icon={props.type === "experience" ? faUserTie : faGraduationCap}
        size="3x"
      />
      <div style={{ marginLeft: "20px" }}>
        <h6>{props.details.company || props.details.school}</h6>
        {props.details.title || props.details.degree}
        {props.details.location ? `, ${props.details.location}` : " "}
        {props.details.fieldofstudy ? `, ${props.details.fieldofstudy}` : " "}
        <br />
        {fromd} {current ? " - Present" : to ? ` - ${to}` : ""}
      </div>
      <FontAwesomeIcon
        icon={faPencilAlt}
        style={{ right: "40px", position: "absolute" }}
        onClick={() => setModalShow(true)}
      />
      <FontAwesomeIcon
        icon={faTrash}
        style={{ right: "20px", position: "absolute" }}
        onClick={handleDelete}
      />

      <Modal
        show={modalShow}
        animation={false}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          style={{
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <FormCard
            style={{ width: "100%" }}
            onSave={() => setModalShow(false)}
            details={data}
            type={props.type}
          />
        </Modal.Header>
      </Modal>
    </div>
  );
};

export default DetailCard;
