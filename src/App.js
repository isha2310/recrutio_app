import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'
import Login from './Components/Login/Login';
import Profile from './Components/Profile/Profile';
import Timeline from './Components/Timeline/Timeline';

function App() {
  return (
    <BrowserRouter>
      <Route path="/profile" exact component={Profile} />
      <Route path="/timeline" exact component={Timeline} />
      <Route path="/" exact component={Login} />
    </BrowserRouter>
  );
}

export default App;
