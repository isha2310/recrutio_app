import formReducer from "./formReducer";
import { useEffect, useReducer, useState } from "react";
import Button from "react-bootstrap/Button";
import classes from "./FormCard.Module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setCandidateDetailsToCart,
  setRecruiterDetailsToCart,
} from "../../store/action/action";
import { updateCandidateDetails } from "../../apiCalls/Candidate";

const initialState = {
  current: false,
};

const FormCard = (props) => {
  const canDetails = useSelector((state) => state.candidate);
  const dispatch2 = useDispatch();

  let propDetails = props.details;

  const [details, setDetails] = useState({});
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [current, setCurrent] = useState(false);

  useEffect(() => {
    if (propDetails) {
      setDetails({ ...propDetails });
      if (propDetails.current) {
        setCurrent(true);
      }
    }
    console.log(propDetails);
  }, [propDetails]);

  const handleTextChange = (e) => {
    dispatch({
      type: "HANDLE_INPUT",
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setCurrent(false);
    console.log(formState);
    let data = [];
    if (props.type === "experience") {
      data = canDetails.candidate.experience;
      // if(!props.field){
      //     data = data.filter((ele) => ele._id !== props.details._id)
      //     data.push({...propDetails, ...formState})
      // } else{
      //     data.push(formState)
      // }
    } else {
      data = canDetails.candidate.education;
    }
    if (!props.field) {
      data = data.filter((ele) => ele._id !== props.details._id);
      data.push({ ...propDetails, ...formState });
    } else {
      data.push(formState);
    }

    if (
      Object.keys(formState).length > 1 ||
      formState.current !== details.current
    ) {
      updateCandidateDetails({ [props.type]: data })
        .then((res) => {
          if (res.code === 400) {
            console.log(res);
          } else {
            console.log(res);
            props.type === "experience"
              ? dispatch2(
                  setCandidateDetailsToCart({
                    candidate: { [props.type]: res.experience },
                  })
                )
              : dispatch2(
                  setCandidateDetailsToCart({
                    candidate: { [props.type]: res.education },
                  })
                );
            if (props.field) {
              props.changeField();
            } else {
              props.onSave();
            }
          }
        })
        .catch((e) => console.log(e));
    }

    dispatch({ type: "RESET_FORM" });
    e.target.reset();
  };

  return (
    <div className={classes.Field + " " + classes.FieldInfo}>
      {props.type === "experience" ? (
        <form onSubmit={handleSave}>
          <label htmlFor="title">Title &nbsp;* </label>
          <br />
          <input
            placeholder="Ex: Developer"
            name="title"
            className={classes.Input}
            onChange={handleTextChange}
            required
            value={formState.title || details.title || ""}
          />
          <br />
          <label htmlFor="company">Company &nbsp;* </label>
          <br />
          <input
            placeholder="Ex: Microsoft"
            name="company"
            className={classes.Input}
            onChange={handleTextChange}
            required
            value={formState.company || details.company || ""}
          />
          <br />
          <label htmlFor="location">Location </label>
          <br />
          <input
            placeholder="Ex: Pune, India"
            name="location"
            className={classes.Input}
            onChange={handleTextChange}
            value={formState.location || details.location || ""}
          />
          <br />
          <input
            type="checkbox"
            name="current"
            checked={current}
            onChange={(e) => {
              setCurrent(!current);
              console.log(e.target.checked);
              dispatch({ type: "HANDLE_CHECK", current: e.target.checked });
            }}
          />
          <label htmlFor="current">
            &nbsp;I am currently working in this role{" "}
          </label>
          <br />
          <label htmlFor="from">Start Date &nbsp;* </label>
          <br />
          <input
            type="date"
            name="from"
            onChange={handleTextChange}
            className={classes.Input}
            required
            value={
              formState.from ||
              (details.from
                ? details.from.substring(0, details.from.indexOf("T"))
                : "")
            }
          />
          <br />
          <label htmlFor="to">End Date </label>
          <br />
          {current ? (
            <input
              placeholder="Present"
              name="to"
              readOnly
              className={classes.Input}
              value=""
            />
          ) : (
            <input
              type="date"
              name="to"
              onChange={handleTextChange}
              className={classes.Input}
              required={!current}
              value={
                formState.to ||
                (details.to
                  ? details.to.substring(0, details.to.indexOf("T"))
                  : "")
              }
            />
          )}
          <br />
          <label htmlFor="description">Description</label>
          <br />
          <textarea
            name="description"
            className={classes.Input}
            onChange={handleTextChange}
            value={formState.description || details.description || ""}
          />
          <Button variant="dark" type="submit">
            Save
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSave}>
          <label htmlFor="school">School &nbsp;* </label>
          <br />
          <input
            placeholder="Ex: IIT"
            name="school"
            className={classes.Input}
            onChange={handleTextChange}
            required
            value={formState.school || details.school || ""}
          />
          <br />
          <label htmlFor="degree">Degree &nbsp;* </label>
          <br />
          <input
            placeholder="Ex: Bachelor of Technology"
            name="degree"
            className={classes.Input}
            onChange={handleTextChange}
            required
            value={formState.degree || details.degree || ""}
          />
          <br />
          <label htmlFor="fieldofstudy">Field of Study </label>
          <br />
          <input
            placeholder="Ex: Computer Science"
            name="fieldofstudy"
            className={classes.Input}
            onChange={handleTextChange}
            required
            value={formState.fieldofstudy || details.fieldofstudy || ""}
          />
          <br />
          <input
            type="checkbox"
            name="current"
            checked={current}
            onChange={(e) => {
              setCurrent(!current);
              console.log(e.target.checked);
              dispatch({ type: "HANDLE_CHECK", current: e.target.checked });
            }}
          />
          <label htmlFor="current">&nbsp;I am currently pursuing this </label>
          <br />
          <label htmlFor="from">Start Date &nbsp;* </label>
          <br />
          <input
            type="date"
            name="from"
            onChange={handleTextChange}
            className={classes.Input}
            required
            value={
              formState.from ||
              (details.from
                ? details.from.substring(0, details.from.indexOf("T"))
                : "")
            }
          />
          <br />
          <label htmlFor="to">End Date </label>
          <br />
          {current ? (
            <input
              placeholder="Present"
              name="to"
              readOnly
              className={classes.Input}
              value=""
            />
          ) : (
            <input
              type="date"
              name="to"
              onChange={handleTextChange}
              className={classes.Input}
              required={!current}
              value={
                formState.to ||
                (details.to
                  ? details.to.substring(0, details.to.indexOf("T"))
                  : "")
              }
            />
          )}
          <br />
          <Button variant="dark" type="submit">
            Save
          </Button>
        </form>
      )}
    </div>
  );
};

export default FormCard;
