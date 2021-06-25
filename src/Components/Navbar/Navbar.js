import { useHistory } from "react-router-dom";
import classes from "./Navbar.module.css";

const Navbar = () => {
  let history = useHistory();

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
    </nav>
  );
};

export default Navbar;
