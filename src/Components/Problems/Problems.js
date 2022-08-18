import React, { useEffect, useState} from "react";
import { Select, Button, Row, Col, Drawer, Input, Table } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { getSiteData, createProblem } from "../../api/api";
import ProblemCollapse from "../ProblemCollapse/ProblemCollapse";

import './Problems.css'

const { Option } = Select;


function Problems(props) {
  const [existingFiles, setExistingFiles] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [problemTitle, setProblemTitle] = useState("");

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    setSelectedFile(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      const existingData = await getSiteData();
      if (existingData && existingData.statusCode === 200) {
        setExistingFiles(existingData.list);
      } else {
        setExistingFiles([]);
      }
    }

    fetchData();
  }, []);

 // /* columns = [
 //    {
 //
 //    }*/
 //  ]

  const onSelectedFile = (fileId) => {
    setSelectedFile(fileId)
  }

  const handleCreateProblem = () => {
    createProblem(selectedFile, problemTitle);
  }

  const onProblemTitleChange = (e) => {
    setProblemTitle(e.target.value);
  }


      return (
          <div className='problems'>
              <h1 id='problems-h1'>Manage Problems</h1>
              <hr />
              <h2 className='problems-h2'>Create a new problem</h2>
            <div style={{paddingTop: '20px'}}>
              <Row gutter={[0, 16]} justify='space-around'>
                <Col span={24}>
                  <Select
                    placeholder='Select file by id'
                    onChange={onSelectedFile}
                    style={{width: "200px"}}
                  >
                    {existingFiles.map((f, i) => (
                      <Option key={`file-option-${i}`} value={f.id}>{`File id: ${f.id}`}</Option>
                    ))}
                  </Select>
                </Col>
                <Col span={24}>
                  <Input
                    value={problemTitle}
                    placeholder="Title your Problem"
                    style={{marginLeft: "0px", width: "200px"}}
                    onChange={onProblemTitleChange}
                  >
                  </Input>
                </Col>
                <Col span={24}>
                  <Button
                    type="primary"
                    disabled={selectedFile === null}
                    onClick={handleCreateProblem}
                  >
                    <PlusOutlined />
                    Create a new Problem
                  </Button>
                </Col>
              </Row>
              <h2 className='problems-h2'>Existing problems</h2>
              <Drawer
                title='Configure Evolutionary Engine'
                placement='right'
                onClose={onClose}
                visible={visible}
                width={600}
              >
                <ProblemCollapse>

                </ProblemCollapse>
              </Drawer>
          </div>
          </div>
      )

}

export default Problems;
