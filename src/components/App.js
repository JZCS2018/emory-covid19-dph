// React
import React from 'react'
// Components & Hooks
import StateMap from "./StateMap";
import CountyReport from "./CountyReport";
// import AboutUs from "./AboutUs";
import 'semantic-ui-css/semantic.min.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import PrivateRoute from "./privateRoute"

import Login from './login';



App.propTypes = {};
export default function App() {



      return (

        <Router>
          <Switch>
          <PrivateRoute path='/:stateFips/:countyFips' component = {CountyReport}/>
          <PrivateRoute path='/:stateFips' component = {StateMap}/>
          <Route exact path='/'>
              <Login />
            </Route>
    
          </Switch>
        </Router>
      );

}

