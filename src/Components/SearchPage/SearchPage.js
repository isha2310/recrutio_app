import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProfileIcon from "../../UI/ProfileIcon/ProfileIcon";
import Navbar from "../Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCog, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { getAllCandidate } from "../../apiCalls/Candidate";

const SearchPage = (props) => {
  const location = useLocation();
  const [candidates, setCandidates] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (location.state) {
      setCandidates(location.state.candidates);
      setKeyword(location.state.query);
    }
  }, [location.state]);

  const searchResult = (e) => {
    if (e.keyCode === 13) {
      let query = e.target.value;
      getAllCandidate()
        .then((res) => {
          let arr2 = [];
          let arr = res.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
          for (let i = 0; i < arr.length; i++) {
            let candidate = arr[i];
            if (candidate.skills.length > 0) {
              let check = candidate.skills.filter((skill) =>
                skill
                  .toLowerCase()
                  .replace(/ /g, "")
                  .includes(query.toLowerCase())
              );
              if (check.length > 0) arr2.push(candidate);
            }
            if (candidate.bio && candidate.bio !== "") {
              if (
                candidate.bio
                  .toLowerCase()
                  .replace(/ /g, "")
                  .includes(query.toLowerCase())
              ) {
                arr2.push(candidate);
              }
            }
          }
          console.log(arr2);
          setCandidates(arr2);
          setKeyword(query);
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{
          margin: "auto",
          width: "80vw",
          backgroundColor: "white",
          marginTop: "20px",
          padding: "20px 10px",
          border: "1px solid #bebebe",
          borderRadius: "10px",
          minHeight: '50vh'
        }}
      >
        <div style={{marginBottom: "30px" }}>
          <div
            style={{
              width: "70%",
              margin: 'auto',
              backgroundColor: "white",
              padding: "1px 5px",
              border: "1px solid #bebebe",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              marginBottom: "5px"
            }}
          >
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                fontSize: "1.5em",
                padding: "1.2px",
                color: "gray",
              }}
            />
            <input
              onKeyDown={searchResult}
              placeholder="Search for the users with skills ex: Python "
              style={{
                outline: "none",
                border: "none",
                marginLeft: "10px",
                width: "80%",
                marginBottom: "3px",
                borderBottom: "2px solid gray",
              }}
            />
          </div>
          {location.state && location.state.query && (
            <p>Search Results for <b>{location.state.query}</b></p>
          )}
        </div>
        {candidates.length > 0 ?
          candidates.map((candidate, index) => (
            <ProfileIcon info={candidate} key={index} />
          )): (!location.state ? (
            <h3 style={{color: '#bebebe',margin : 'auto', textAlign: 'center', marginTop: '100px'}} >Search using skills or tools and technologies </h3>)
            : (!location.state.query && <h3 style={{color: '#bebebe',margin : 'auto', textAlign: 'center', marginTop: '100px'}} >No result found</h3> )
          )
            
        }
      </div>
    </div>
  );
};

export default SearchPage;
