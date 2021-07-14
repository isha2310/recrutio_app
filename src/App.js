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
import { setCandidateDetailsToCart, setRecruiterDetailsToCart } from './store/action/action';
import Login from './Components/Login2/Login'
import { getRecruiterById } from './apiCalls/Recruiter';
import TimelineR from './Components/TimelineRecruiter/TimelineR';
import SearchPage from './Components/SearchPage/SearchPage';

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
          dispatch(setCandidateDetailsToCart(res));
          setResp(res);
        }
      })
      .catch((e) => console.log(e))
    } else {
      if( id && user === 'Recruiter' ){
        getRecruiterById(id)
        .then((res) => {
          if (res.error) {
            console.log(res.error);
          } else {
            console.log(res)
            setResp(res);
            dispatch(setRecruiterDetailsToCart(res))
          }
        })
        .catch((e) => console.log(e))
      }
    }
  },[dispatch])

  // useEffect(() => {
  //   let user = localStorage.getItem("rec");
  //   if(Object.keys(resp).length !== 0){
  //     console.log(Object.keys(resp).length === 0)
  //     if (user === "Candidate") {
  //       console.log(resp)
  //       dispatch(setCandidateDetailsToCart(resp));
  //     } else if (user === 'Recruiter') {
  //       console.log(resp)
  //       dispatch(setRecruiterDetailsToCart(resp))
  //     }
  //   }
  // }, [resp, dispatch])

  return (
    <BrowserRouter>
      <Route path="/profile" exact component={Profile} />
      <Route path="/timeline" exact component={Timeline} />
      <Route path="/viewProfile" exact component={ViewProfile} />
      <Route path="/messenger" exact component={Messenger} />
      <Route path="/timeline_r" exact component={TimelineR} />
      <Route path="/search" exact component={SearchPage} />
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
