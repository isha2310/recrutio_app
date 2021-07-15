import { useEffect, useState } from "react";
import { allJobPosts } from "../../apiCalls/Recruiter";
import JobPostCard from "../../UI/JobPostCard/JobPostCard";
import MyNavbar from "../Navbar/Navbar";

const AppliedJobs = (props) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    allJobPosts().then((res) => {
      if (res.length > 0) {
        res = res.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        let arr = [...res];
        let id = localStorage.getItem("rec-id");
        let check = arr.filter((a) => a.candidateIds.includes(id));
        setJobs(check);
      }
    });
  });

  return (
    <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
      <MyNavbar />
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #bebebe",
          borderRadius: "10px",
          width: "80%",
          margin: "auto",
          marginTop: "20px",
          minHeight: "50vh",
          padding: '20px'
        }}
      >
        {jobs.length > 0 ? (
          <div style={{width: '80%', margin:'auto' }} >
            {jobs.map((job, index) => (
              <JobPostCard key={index} user="Candidate" post={job} />
            ))}
          </div>
        ) : (
          <h3 style={{ color: "#bebebe", margin: "auto" }}>
            You haven't applied for any job!
          </h3>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
