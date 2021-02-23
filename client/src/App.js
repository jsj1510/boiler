import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Auth from './hoc/auth';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoUploadPage from './components/views/VideoUplodePage/VideoUploadPage'

function App() {
  return (
    <Router>
      <div>   
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/" component={Auth(Landing, null)} />
          <Route exact path="/login" component={Auth(Login, false)} />
          <Route exact path="/register" component={Auth(Register, false)} />
          <Route exact path="/video/upload" component={Auth(VideoUploadPage, true)} />
        </Switch>
      </div>
    </Router>
  );
}


export default App;