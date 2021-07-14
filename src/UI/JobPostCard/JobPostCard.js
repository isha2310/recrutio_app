import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteJobPost, getRecruiterById } from "../../apiCalls/Recruiter";
import { useDispatch } from "react-redux";
import {
  setCandidateDetailsToCart,
  setRecruiterDetailsToCart,
} from "../../store/action/action";
import { useEffect, useState } from "react";
import { applyForJob, getAllCandidate } from "../../apiCalls/Candidate";
import { useHistory } from "react-router-dom";

const JobPostCard = (props) => {
  let tech = props.post.skillsRequired.join(", ");
  let dispatch = useDispatch();
  let history = useHistory()
  const [status, setStatus] = useState("Apply");

  useEffect(() => {
    if (props.user === "Candidate") {
      if (props.post.candidateIds.includes(localStorage.getItem("rec-id"))) {
        setStatus("Applied");
      } else {
        setStatus("Apply");
      }
    }
  }, [props.user, props.post.candidateIds]);

  const jobApply = () => {
    if (status === "Apply") {
      applyForJob(props.post._id).then((res) => {
        console.log(res)
        if (res.status !== 400 || res.status !== 404) {
          dispatch(setCandidateDetailsToCart({ candidate: { ...res } }));
        }
      });
    }
  };

  const deletePost = (e) => {
    let id = props.post._id;
    deleteJobPost(id)
      .then((res) => {
        console.log(res);
        if (res.status !== 400) {
          dispatch(
            setRecruiterDetailsToCart({ jobPosts: { ...res.jobPosts } })
          );
        }
      })
      .catch((e) => console.log(e));
  };

  const openProfile = () => {
    getRecruiterById(props.post.recruiterId)
      .then((res) => {
        if (res.error) {
          console.log(res.error);
        } else {
            console.log(res)
            history.push({
              pathname: '/viewProfile',
              state : { user: 'Recruiter' , data: res.recruiter, posts: res.jobPosts }
            })
        }
      })
      .catch((e) => console.log(e));
  };

  const handleCandidates = () => {

    getAllCandidate()
    .then((res) => {
      let arr1 = props.post.candidateIds
      let arr2 = []
      let arr = res
      for(let i =0; i<arr.length; i++){
        let result = arr1.filter((a) => a === arr[i]._id )
        if(result.length > 0) arr2.push(result)
      }
      history.push({
        pathname: '/search',
        state : { candidates: arr2 }
      })
    })
    .catch((e) => console.log(e))
  }

  return (
    <div
      style={{
        border: "1px solid #bebebe",
        padding: "1em 1.7em",
        marginBottom: "20px",
        borderRadius: "10px",
      }}
    >
      <h5 onClick={openProfile}>{props.post.recruiterName}</h5>
      <p>
        <b>Company: </b>
        {props.post.company}
      </p>
      <p>
        <b>Profile: </b>
        {props.post.role}
      </p>
      <p>
        <b>Job Description: </b>
        {props.post.jobDescription}
      </p>
      <p>
        <b>Skills Required: </b>
        {tech}
      </p>
      <p>
        <b>Salary: </b>
        {props.post.salary}
      </p>
      {localStorage.getItem('rec-id') === props.post.recruiterId &&
        <button style={{outline: 'none', border: 'none', backgroundColor: 'white', fontWeight: 'bold', padding: '0', color: '#212529'}} onClick={handleCandidates} >View candidates who applied</button>
      }
      {props.user === "Recruiter" || (localStorage.getItem('rec-id') === props.post.recruiterId ) ? (
        <button
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
        </button>
      ) : ( props.user !== "Recruiter" ?
        <button type="button"
        style={{
          border: '1px solid blue',
          backgroundColor: "white",
          float: "right",
        }} onClick={jobApply} >{status}</button> : ""
      )}
    </div>
  );
};

export default JobPostCard;
