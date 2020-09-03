import React, { Component } from "react";
import { Form, Header } from "semantic-ui-react";
import "./auth.css";
// import logo from "../../data/logo.png";

  export default function Layout(props){
    return (
        <div className="auth-main">
          <div className="auth-content">
            <div className="auth-card">
            <img size='mini' src='https://dph.georgia.gov/themes/custom/ga_forest/orchard/assets/images/icons/logo/ga-logo--gold.svg' alt="Logo" className="auth-logo"/>
              <Header as="h2" color="black" textAlign="center">
                {props.header}
              </Header>
              <Form.Group size="large" className="auth-form" autoComplete="off">
                {props.children}
              </Form.Group>
            </div>
          </div>
        </div>
      );

  }