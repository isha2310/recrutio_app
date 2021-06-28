import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import classes from '../../Components/Profile/Profile.module.css'
import ProfileCard from "../../Components/ProfileCard/ProfileCard";

const ViewProfile = (props) => {

    const location = useLocation();
    const [user, setUser] = useState('')
    const [details, setDetails] = useState({})

    useEffect(() => {
        if(location.state) {
            setUser(location.state.user)
            setDetails(location.state.data)
        }
    }, [location])

    return(
        <div style={{ backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
            <Navbar />
            <div  className={classes.MainDiv} >
                <ProfileCard details={details} user={user} />
            </div>
        </div>
    )
}

export default ViewProfile