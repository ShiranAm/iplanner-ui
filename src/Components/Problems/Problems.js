import React, { useEffect, useState} from "react";
import { Select, Button, Row, Col, Drawer, Input, Table, Badge, Tag } from 'antd';
import { PlusOutlined, CaretRightOutlined, PauseOutlined, SettingFilled, DeleteFilled } from "@ant-design/icons";
import { RiStopMiniFill } from "react-icons/ri";
import { getSiteData,
  createProblem,
  getAllProblems,
  deleteProblem,
  playProblem,
  stopProblem,
  pauseProblem,
  resumeProblem } from "../../api/api";
import ProblemCollapse from "../ProblemCollapse/ProblemCollapse";

import './Problems.css'

const { Option } = Select;


function Problems(props) {
  const [existingFiles, setExistingFiles] = useState([]);
  const [existingProblems, setExistingProblems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [problemTitle, setProblemTitle] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    setSelectedFile(null);
  };

  const fetchSiteData = async () => {
    const existingData = await getSiteData();
    if (existingData && existingData.statusCode === 200) {
      setExistingFiles(existingData.list);
    } else {
      setExistingFiles([]);
    }
  }

  const fetchProblems = async () => {
    const problems = await getAllProblems();
    if (problems && problems.statusCode === 200) {
      setExistingProblems(problems.list);
    } else {
      setExistingProblems([]);
    }
  }

  useEffect(() => {
    fetchSiteData();
    fetchProblems();
  }, []);

  const selectionMapping = {
    0: 'Tournament'
  }

  const crossoverMapping = {
    0: 'Two Point'
  }

  const MutationMapping = {
    0: 'Flip Bit'
  }

 const columns = [{
     title: 'Id',
     dataIndex: 'id',
     key: 'id',
     width: "80"
   }, {
     title: 'Title',
     dataIndex: 'title',
     key: 'title',
     width: '100'
   }, {
    title: 'Engine Configurations',
     children: [{
      title: 'Population size',
       key: 'population',
       width: '80',
       render: (data) => (<span>{data.engine.population_size}</span>)
     }, {
      title: 'Selection Method',
       key: 'selection',
       width: '80',
       render: (data) => (<span>{selectionMapping[data.engine.selection_method.method_id]}</span>)
     }, {
        title: 'Crossover Method',
       key: 'crossover',
       width: '80',
       render: (data) => (<span>{crossoverMapping[data.engine.crossover_method.method_id]}</span>)
     }, {
       title: 'Mutation',
       key: 'mutation',
       width: '80',
       render: (data) => (<span>{MutationMapping[data.engine.mutations[0].mutation_id]}</span>)
     }, {
      title: 'Stopping Conditions',
       children: [
         {
           title: 'Min. Fitness',
           key: 'fitness',
           width: '80',
           render: (data) => (
             <>
               <Badge
                 status={data.engine.stopping_conditions_configuration.FITNESS_STOPPING_CONDITION.applied?
                   "success" : "error"}
               >
               </Badge>
               <span>
             {data.engine.stopping_conditions_configuration.FITNESS_STOPPING_CONDITION.bound}
               </span>
             </>
           )
         }, {
          title: 'Time',
           key: 'time',
           width: '80',
           render: (data) => (
             <>
               <Badge
                 status={data.engine.stopping_conditions_configuration.TIME_STOPPING_CONDITION.applied?
                   "success" : "error"}
               >
               </Badge>
               <span>
             {data.engine.stopping_conditions_configuration.TIME_STOPPING_CONDITION.bound}
               </span>
             </>
           )
         }, {
        title: 'Generations',
           key: 'generation',
           width: '80',
           render: (data) => (
             <>
               <Badge
                 status={data.engine.stopping_conditions_configuration.GENERATIONS_STOPPING_CONDITION.applied?
                   "success" : "error"}
               >
               </Badge>
               <span>
             {data.engine.stopping_conditions_configuration.GENERATIONS_STOPPING_CONDITION.bound}
               </span>
             </>
           )
         }]
     }, {
      title: 'Status',
       dataIndex: 'status',
       key: 'status',
       render: status => (getStatusTag(status))
     }]
   },{
    title: 'Actions',
   key: 'actions',
   width: '200',
   render: (row) => (
     <div className='actionContainer' style={{dispaly: 'flex', justifyContent: 'space-between'}}>
       {(row.status === 'idle' || row.status === 'paused') ? (<Button
         className='actionButton'
         onClick={row.status === 'idle'? () => handlePlayProblem(row.id) : () => handleResumeProblem(row.id)}
       >
         <CaretRightOutlined />
       </Button>) : (
         <Button
           className='actionButton'
           onClick={() => handlePauseProblem(row.id)}
         >
           <PauseOutlined />
         </Button>)}
       <Button
         className='actionButton'
         onClick={() => handleStopProblem(row.id)}
       >
        <RiStopMiniFill/>
       </Button>
       <Button
         className='actionButton'
         onClick={() => handleEditProblem(row.id)}
       >
         <SettingFilled />
       </Button>
       <Button
         className='actionButton'
         onClick={() => handleDeleteProblem(row.id)}
         disabled={row.status === 'running'}
       >
         <DeleteFilled />
       </Button>
     </div>
   )
 }];

  const handlePlayProblem = async (problemId) => {
    const response = await playProblem(problemId);
      if (response && response.statusCode === 200) {
        fetchProblems();
      }
  }

  const handleResumeProblem = async (problemId) => {
    const response = await resumeProblem(problemId);
    if (response && response.statusCode === 200) {
      fetchProblems();
    }
  }

  const handlePauseProblem = async (problemId) => {
    const response = await pauseProblem(problemId);
    if (response && response.statusCode === 200) {
      fetchProblems();
    }
  }

  const handleStopProblem = async (problemId) => {
    const response = await stopProblem(problemId);
    if (response && response.statusCode === 200) {
      fetchProblems();
    }
  }

  const handleDeleteProblem = async (problemId) => {
    const response = await deleteProblem(problemId);
    if (response && response.statusCode === 200) {
      fetchProblems();
    }
  }

  const handleEditProblem = (problem) => {
    setSelectedProblem(problem);
    showDrawer();
  }

  const getStatusTag = (label) => {
    switch (label) {
      case 'idle':
        return <Tag color="gold">Idle</Tag>;
      case 'running':
        return <Tag color="green">Running</Tag>;
      case 'paused':
        return <Tag color="magenta">Paused</Tag>
      default:
        return <Tag color="red">Error</Tag>
    }
  }

  const onSelectedFile = (fileId) => {
    setSelectedFile(fileId)
  }

  const handleCreateProblem = async () => {
    await createProblem(selectedFile, problemTitle);
    fetchProblems();
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
              <Row gutter={[18, 48]} justify='space-around'>
                <Col span={8}></Col>
                <Col span={3}>
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
                <Col span={3}>
                  <Input
                    value={problemTitle}
                    placeholder="Title your Problem"
                    style={{marginLeft: "0px", width: "200px"}}
                    onChange={onProblemTitleChange}
                  >
                  </Input>
                </Col>
                <Col span={3}>
                  <Button
                    type="primary"
                    disabled={selectedFile === null}
                    onClick={handleCreateProblem}
                  >
                    <PlusOutlined />
                    Create a new Problem
                  </Button>
                </Col>
                <Col span={7}></Col>
              </Row>
              <Row gutter={[0, 16]} justify='center'>
                <Col span={24}>
                  <h2 style={{paddingTop: '60px'}}>Existing problems</h2>
                </Col>
                <Col span={24}>
                  <Table
                    columns={columns}
                    dataSource={existingProblems}
                    style={{paddingLeft: '80px', paddingRight: '80px'}}
                  >
                  </Table>
                </Col>
              </Row>
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
