
import React, { useState, useEffect, Component } from 'react';
// import { Button, FormGroup, FormControl, FormLabel  } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import "./Login.css";
import { Button, Form, Message } from "semantic-ui-react";
import Layout from "./Layout";
import fetchProfileData from "./TokenGet"
import { sha256 } from 'js-sha256';


export default function Login(props) {
    const [isLogin, setIsLogin]= useState(document.cookie.includes('login=true'))
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [tok, setTok] = useState(null);
    const promise = fetchProfileData();


    // console.log(document.cookie.includes('login=true'))

    useEffect(() => {
        fetch('/data/token.json')
            .then(res => res.json())
            .then(x => setTok(x));

        promise.then(data => {
            setUser(data);
        });
    }, []);

    function arrayEquals(a, b) {
        return Array.isArray(a) &&
          Array.isArray(b) &&
          a.length === b.length &&
          a.every((val, index) => val === b[index]);
      }

    function validateForm() {
        // return email.length > 0 && password.length > 0;
        return password.length > 0;

    }
    const setCookie = (key, value, day) => {
        let expires = 13600 * 1000
        let date = new Date( + new Date() + expires)
        document.cookie = `${key}=${value};expires=${date.toUTCString()}`
    }

    function handleSubmit(event) {
        let login = !isLogin
        event.preventDefault();
        setIsLogin(login)
        
        // console.log(password.toLowerCase()])
        // console.log(sha256(password))
            if (sha256(password).localeCompare(tok.tokens)===0) {
                // console.log(tok.tokens[password])
                setCookie('login', true, 1)
                history.push('/13')
            }
            else{
                alert("Token is not right, please contact jzha524@emory.edu for web access")
                setCookie('login', '', -1)
                history.push('/')
            }
        }


        // if(password.toLowerCase() in tok.tokens){
        //     // console.log(tok.tokens[password.toLowerCase()])
        //     if (tok.tokens[password.toLowerCase()].localeCompare(email)===0) {
        //         // console.log(tok.tokens[password])
        //         setCookie('login', true, 1)
        //         history.push('/13')
        //     }
        //     else{
        //         alert("Name and email are not match")
        //         setCookie('login', '', -1)
        //         history.push('/')
        //     }
        // }
        // else{
        //     alert("No such user, please contact the admin")
        //         setCookie('login', '', -1)
        //         history.push('/')
        // }
    // }
        

    if (user === null) {
        return <p>Loading profile...</p>;
    }
    else {

        return (

            <Layout header="Dashboard Log in">
                <Form.Input
                    fluid
                    icon="edit"
                    iconPosition="left"
                    type="password"
                    placeholder="Password"
                    className="auth-input-field"
                    onChange={e => setPassword(e.target.value)}
                />
                {/* <Form.Input
                    fluid
                    icon="envelope"
                    iconPosition="left"
                    placeholder="E-mail address"
                    className="auth-input-field"
                    onChange={e => setEmail(e.target.value)}
                /> */}
                <Button color="teal" fluid size="huge" onClick={handleSubmit} disabled={!validateForm()}>
                    Login
        </Button>
        <p>Contact jzha524@emory.edu for web access</p>
            </Layout>
            
        )
    }
}