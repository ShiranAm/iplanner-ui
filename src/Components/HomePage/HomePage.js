import React from "react";
import { Row, Col, Steps } from "antd";
import { UploadOutlined, SettingFilled, SyncOutlined, MonitorOutlined } from "@ant-design/icons";

const { Step } = Steps;

function HomePage(props){

  return(
    <>
      <div style={{display: "flex", justifyContent: "center"}}>
        <h1 style={{marginTop: "80px", fontSize: "100"}}><b>Welcome to</b></h1>
        <img src="iplanner-logo.jpeg" width="200" style={{marginTop: "10px"}}/>
      </div>
      <div style={{display: "flex", justifyContent: "center", marginTop: "40px"}}>
        <h2>iPlaner is a web platform that enables industrial manufacurers automate their production scheduling, </h2>
      </div>
      <div style={{display: "flex", justifyContent: "center"}}>
        <h2>with 4 simple steps:</h2>
      </div>
      <Row justify='center' style={{marginTop: '80px'}}>
        <Col>
          <Steps
            direction="vertical"
          >
            <Step
              status='finish'
              description="Upload a json file containing your site data"
              title='Upload Raw-data file'
              icon={<UploadOutlined />}>

            </Step>
            <Step
              status='finish'
              description="Create a 'problem' and select the algorithm parameters"
              title='Configure the EA engine'
              icon={<SettingFilled />}>

            </Step>
            <Step
              status='finish'
              description='Run the algorithm and adjust it as it runs'
              title='Run the engine'
              icon={<SyncOutlined spin />}>
            </Step>
            <Step
              status='finish'
              description='Measure and analyze the solution with relevant KPIs and refine it to meet your requirements'
              title='Refine and analyze the solution'
              icon={<MonitorOutlined />}>
            </Step>
          </Steps>
        </Col>
      </Row>
    </>
  )
}

export default HomePage;
