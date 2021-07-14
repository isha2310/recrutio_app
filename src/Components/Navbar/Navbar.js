import { useHistory } from "react-router-dom";
import classes from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCog, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { getAllCandidate, logoutCandidate } from "../../apiCalls/Candidate";
import { useDispatch } from "react-redux";
import { resetCandidateDetailsToCart } from "../../store/action/action";
import { useState } from "react";

const Navbar = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  let user = localStorage.getItem("rec");

  const searchResult = (e) => {
    if (e.keyCode === 13) {
     let query = e.target.value
      getAllCandidate()
        .then((res) => {
          let arr2 = []
          let arr = res.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          for(let i=0; i<arr.length; i++){
            let candidate = arr[i]
            if(candidate.skills.length > 0 ){
              let check = candidate.skills.filter((skill) => skill.toLowerCase().replace(/ /g, "").includes(query.toLowerCase()) )
              if(check.length > 0) arr2.push(candidate)
            }
            if(candidate.bio && candidate.bio !== ''){
              if(candidate.bio.toLowerCase().replace(/ /g, "").includes(query.toLowerCase())){
                arr2.push(candidate)
              }
            }
          }
          console.log(arr2)
          history.push({
            pathname: '/search',
            state : { candidates: arr2, query: query }
          })
        })
        .catch((e) => console.log(e));
    }
  };

  const handleNav = (num) => {
    if (num === 1) {
      history.push("/profile");
    } else if(num===2){
      history.push("/search")
    } else if (num === 3) {
      logoutCandidate()
        .then((res) => {
          if (res.status === 200) {
            localStorage.clear();
            history.push("/");
            dispatch(resetCandidateDetailsToCart());
          }
          console.log(res);
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <nav className={"navbar " + classes.Navbar}>
      <a
        href="/"
        className={"navbar-brand " + classes.Logo}
        onClick={(e) => {
          e.preventDefault();
          if (user === "Candidate") {
            history.push("/timeline");
          } else {
            history.push("/timeline_r");
          }
        }}
      >
        Recrutio
      </a>
      <div className={"d-none d-md-block d-lg-block " + classes.Searchbar}>
        <div className={classes.Search}>
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
            className={classes.SearchInput}
          />
        </div>
      </div>
      <FontAwesomeIcon
        icon={faEnvelope}
        style={{ color: "white", fontSize: "1.5em" }}
        className={classes.Settings}
        onClick={() => {
          history.push("./messenger");
        }}
      />
      <Dropdown className={classes.Dropdown1}>
        <Dropdown.Toggle
          style={{ backgroundColor: "transparent", border: "none" }}
          id="dropdown-basic"
        >
          <FontAwesomeIcon
            icon={faCog}
            style={{ color: "white", fontSize: "1.5em" }}
            className={classes.Settings}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {user === "Candidate" && (
            <Dropdown.Item
              onClick={(e) => {
                e.preventDefault();
                handleNav(1);
              }}
            >
              Your Profile
            </Dropdown.Item>
          )}
          <Dropdown.Item className="d-none d-sm-block d-md-none"
            onClick={(e) => {
              e.preventDefault();
              handleNav(2);
            }}
          >
            Search
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(e) => {
              e.preventDefault();
              handleNav(3);
            }}
          >
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </nav>
  );
};

export default Navbar;
