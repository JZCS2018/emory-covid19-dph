// React
import React, { Suspense, useState, useEffect } from 'react'
// Components & Hooks

import 'semantic-ui-css/semantic.min.css'

export default function fetchProfileData() {
    return Promise.all([
      fetchUser(),
    ]).then((user) => {
      return  user ;
    });
  }
  
  function fetchUser() {
    console.log("fetch user...");
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("fetched user");
        resolve(fetch('/data/token.json')
        .then(res => {
            console.log(res)
            res.json()}));
      }, 1000);
    });
  }