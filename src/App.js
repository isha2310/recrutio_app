import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'
//import Login from './Components/Login/Login';
import Profile from './Components/Profile/Profile';
import Timeline from './Components/Timeline/Timeline';
import ViewProfile from './UI/ViewProfile/ViewProfile';
import Messenger from './Components/Messenger/Messenger';
import { useEffect, useState } from 'react';
import { getCandidateById } from './apiCalls/Candidate';
import { connect, useDispatch } from 'react-redux';
import { setCandidateDetailsToCart } from './store/action/action';
import Login from './Components/Login2/Login'

const App = () => {

  const dispatch = useDispatch()

  const [resp, setResp] = useState({})

  useEffect(() => {
    let user = localStorage.getItem('rec')
    let id = localStorage.getItem('rec-id')
    if( id && user === 'Candidate' ){
      getCandidateById(id)
      .then((res) => {
        if (res.error) {
          console.log(res.error);
        } else {
          console.log(res);
          setResp(res);
        }
      })
      .catch((e) => console.log(e))
    }
  },[])

  useEffect(() => {
    let user = localStorage.getItem("rec");
    if(resp !=={}){
      if (user === "Candidate") {
        dispatch(setCandidateDetailsToCart(resp));
      }
    }
  }, [resp, dispatch])

  return (
    <BrowserRouter>
      <Route path="/profile" exact component={Profile} />
      <Route path="/timeline" exact component={Timeline} />
      <Route path="/viewProfile" exact component={ViewProfile} />
      <Route path="/messenger" exact component={Messenger} />
      <Route path="/" exact component={Login} />
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    candidate: state.candidate,
    recruiter: state.recruiter,
  };
}

export default connect
(mapStateToProps)(App);
