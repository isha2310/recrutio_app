import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'
import Login from './Components/Login/Login';
import Profile from './Components/Profile/Profile';
import Timeline from './Components/Timeline/Timeline';
import ViewProfile from './UI/ViewProfile/ViewProfile';
import Messenger from './Components/Messenger/Messenger';

function App() {
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

export default App;
