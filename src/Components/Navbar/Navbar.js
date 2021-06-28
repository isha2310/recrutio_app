import { useHistory } from "react-router-dom";
import classes from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCog } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  let history = useHistory();

  const searchResult = (e) => {
    console.log(e.target.value)
  }

  return (
    <nav className={"navbar " + classes.Navbar}>
      <a
        href="/"
        className={"navbar-brand " + classes.Logo}
        onClick={(e) => {
          e.preventDefault();
          history.push("/timeline");
        }}
      >
        Recrutio
      </a>
      <div className={classes.Searchbar}>
        <div className={classes.Search} >
          <FontAwesomeIcon
            icon={faSearch}
            style={{
              fontSize: "1.5em",
              padding: "1.2px",
              color: 'gray'
            }}
          />
          <input placeholder="Search for the users with skills ex: Python " className={classes.SearchInput} />
        </div>
      </div>
      <FontAwesomeIcon icon={faCog} style={{color: 'white', fontSize: "1.5em"}} className={classes.Settings} />
    </nav>
  );
};

export default Navbar;
