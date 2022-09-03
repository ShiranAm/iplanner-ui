import React from "react";
import {Row, Col} from "antd";

function HomePage(props){
  return(
    <>
      <div style={{display: "flex", justifyContent: "center"}}>
        <h1 style={{marginTop: "30px"}}>Welcome to</h1>
        <img src="iplanner-logo.jpeg" width="100" style={{marginTop: "10px"}}/>
      </div>
      <Row>
        <Col>
          <h2>iPlaner is a web platform that enables industrial manufacurers automate their production schedulting.</h2>
        </Col>
      </Row>
    </>
  )
}

export default HomePage;
