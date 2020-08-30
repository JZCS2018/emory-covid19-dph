// React
import React, { Suspense, useState, useEffect } from 'react'
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
import sha256 from 'crypto-js/sha256';
import queryString from 'query-string';
import fetchProfileData from "./TokenGet"
import { values } from 'lodash';


const promise = fetchProfileData();
const parsed = queryString.parse(window.location.search);

// function geturl(props){
//   const values = queryString.parse(props.location.search)
//   console.log(values)
//   return values.token
// }
const hashDigest = sha256(parsed.token);
console.log(parsed.token);

// console.log(geturl)
// const hashDigest = sha256(geturl);




const Page = (props) =>
  <div>
    <h1>No token</h1>
  </div>


function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

App.propTypes = {};
export default function App() {

  const [user, setUser] = useState(null);
  const [tok, setTok] = useState(null);
  
 

  useEffect(() => {
    fetch('/data/token.json')
      .then(res => res.json())
      .then(x => setTok(x));

    promise.then(data => {
      setUser(data);
    });
  }, []);
  if (user === null) {
    return <p>Loading profile...</p>;
  }
  else {
    console.log(arrayEquals(tok.tokens,hashDigest.words))
    if(arrayEquals(tok.tokens,hashDigest.words)){
      return (
        <Router>
          <Switch>
            <Route path='/:stateFips/:countyFips'>
              <CountyReport />
            </Route>
            <Route path='/:stateFips'>
              <StateMap />
            </Route>
            <Route path='/'>
              <StateMap />
            </Route>
            <Route path="*">
              <Redirect to='/' />
            </Route>
          </Switch>
        </Router>
      );}
      else{
        return (
          <Router>
            <Route component={Page}/>
          </Router>
        )
      }

    
   
  }

}

