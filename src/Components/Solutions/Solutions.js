import React, {useEffect, useState} from "react";
import { getSolutionByProblemId, getProblemById, getSiteData, getSavedSolutions, getSolutionById } from "../../api/api";
import { Table, Modal, Menu, Dropdown, Space, Button, Select } from "antd";
import { BarChartOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
// import {isNull} from "lodash";
// import './SiteData.css'
import { WeeklyCalendar } from 'antd-weekly-calendar';
const { Option } = Select;


function Solutions(props) {

    const [calendarEvents, setCalendarEvents] = useState([]);
    const [savedSolutions, setSolutions] = useState([]);
    const [isEditEventModalVisible, setIsEditEventModalVisible] = useState(false);
    const [selectedProductionLine, setSelectedProductionLine] = useState(0);
    const [solutionAnalyticsModalVisible, setSolutionAnalyticsModalVisible] = useState(false);
    const [solutionAnalyticsModalTitle, setSolutionAnalyticsModalTitle] = useState(false);
    const [solutionForecastData, setSolutionForecastData] = useState([]);
    const [prodLineUtilData, setProdLineUtilData] = useState([]);
    const [rawMaterialsUsageData, setRawMaterialsUsageData] = useState([]);
    const [editEventCurrentProduct, setEditEventCurrentProduct] = useState("");

    // TODO: get products mapping dynamically
    const Products = {
        "Bissli 100g": "0",
        "Bissli 150g": "1",
        "Bamba 50g": "2",
        "Apropo 50g": "3",
        "0": "Bissli 100g",
        "1": "Bissli 150g",
        "2": "Bamba 50g",
        "3": "Apropo 50g"
    };

    const handleProductionLineDropDownClick = (e) => {
        setSelectedProductionLine(e.key)
    };

    const productionLinesDropDownMenu = (
        <Menu
            onClick={handleProductionLineDropDownClick}
            // TODO: need to make this list dynamic and not hard-coded.
            items={[
                {
                    label: 'Production Line #0',
                    key: '0',
                    icon: <UserOutlined />,
                },
                {
                    label: 'Production Line #1',
                    key: '1',
                    icon: <UserOutlined />,
                },
                {
                    label: 'Production Line #2',
                    key: '2',
                    icon: <UserOutlined />,
                },
            ]}
        />
    );

    const savedSolutionsTableCols = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: "30%"
        },
        {
            title: 'Problem Id',
            dataIndex: 'problem_id',
            key: 'problem_id',
            width: "30%"
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: "100%"
        },
        {
            title: 'Fitness Score',
            dataIndex: 'fitness',
            key: 'fitness',
            width: "100%"
        },
        {
            title: 'Analytics',
            key: 'analytics',
            width: "20%",
            render: (data) => (<Button onClick={() => handleShowSolutionAnalytics(data.id)}><BarChartOutlined /></Button>)

        }
    ]

    const analyticsTableColumns = [
        {
            title: 'Key',
            dataIndex: 'key',
            key: 'key',
            width: "10%"
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            width: "10%"
        },
    ]

    const handleSolutionAnalyticsModalCancel = () => {
        setSolutionAnalyticsModalVisible(false)
    };

    const fillSolutionForecastData = (solution) => {
        let forecastsList = [];
        for (let [productId, forecastAchieved] of Object.entries(solution.forecast_achieved)) {
            forecastsList.push({'key': "Product #" + productId, 'value': forecastAchieved + " %"})
        }
        setSolutionForecastData(forecastsList)
    }

    const fillRawMaterialsUsageData = (solution) => {
        let rawMaterialsList = [];
        for (let [materialId, usage] of Object.entries(solution.raw_materials_usage)) {
            rawMaterialsList.push({'key': "Material #" + materialId, 'value': usage + " %"})
        }
        setRawMaterialsUsageData(rawMaterialsList)
    }

    const fillProdLineUtilData = (solution) => {
        let prodLinesUtilList = [];
        for (let [prodLineId, utilPercentage] of Object.entries(solution.product_line_utilization)) {
            prodLinesUtilList.push({'key': "Production Line #" + prodLineId, 'value': utilPercentage + " %"})
        }
        setProdLineUtilData(prodLinesUtilList)
    }

    const handleShowSolutionAnalytics = async (solutionId) => {
        console.log("solution id: " + solutionId);
        const solution = await getSolutionById(solutionId);
        setSolutionAnalyticsModalTitle("Solution #" + solutionId + " Analytics");
        if (solution.statusCode === 200) {
            fillSolutionForecastData(solution);
            fillRawMaterialsUsageData(solution);
            fillProdLineUtilData(solution);
            setSolutionAnalyticsModalVisible(true);
        }
    }

    const fetchBestSolution = async (problemId) => {
        const sitesData = await getSiteData();
        if (!sitesData || sitesData.statusCode !== 200) {
            console.log("sites data not found")
            return {}
        }

        const problem = await getProblemById(problemId);
        if (!problem || problem.statusCode !== 200) {
            console.log("problem not found")
            return {}
        }

        const solution = await getSolutionByProblemId(problemId);
        return await convertToCalendarEvents(solution);
    }

    const convertToCalendarEvents = async (solution) => {
        const calendarEvents = {}

        Object.entries(solution.data).forEach(([lineId, eventsPerLine]) => {
                const newEvents = eventsPerLine.map((item) => {
                    let startTime = new Date(item['start_time'].replace(' ', 'T'))
                    let endTime = new Date(item['end_time'].replace(' ', 'T'))
                    let title = '#' + item['product_id'] + ' - ' + item['product_name']
                    let newEvent = { startTime: startTime, endTime: endTime, title: title }
                    return newEvent
                })

                calendarEvents[lineId] = newEvents
            }
        )

        return calendarEvents
    }

    useEffect(() => {
        const fetchSavedSolutions = async () => {
            const solutions = await getSavedSolutions();
            if (solutions && solutions.statusCode === 200) {
                await Promise.all(solutions.list.map( async (solution) => {
                    solution.solution = await convertToCalendarEvents(solution.solution)
                }));
                setSolutions(solutions.list);
            } else {
                setSolutions([]);
            }
        }

        fetchSavedSolutions();
    }, []);

    const handleOkEventModal = () => {
        // need to save the new data
        setIsEditEventModalVisible(false);
    }

    const handleCancelEventModal = () => {
        setIsEditEventModalVisible(false);
    }

    const handleEditEventClick = (event) => {
        setIsEditEventModalVisible(true);
        let productId = event.title.split(' ')[0].replace('#', '')
        setEditEventCurrentProduct(Products[productId]);  // TODO: this is not working, why??
    };

    const onEditEventProductChange = (e) => {
        setEditEventCurrentProduct(Products[e]);
    }

    const onEditEventProductSearch = (e) => {
        console.log(e);
    }

    // TODO: need to change edit event modal to form!
    return (
        <>
            <Modal
                title="Edit Event"
                visible={isEditEventModalVisible}
                onOk={handleOkEventModal}
                onCancel={handleCancelEventModal}
            >
                <p>
                    <Select
                        showSearch
                        placeholder={editEventCurrentProduct}
                        optionFilterProp="children"
                        onChange={onEditEventProductChange}
                        onSearch={onEditEventProductSearch}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    >
                        <Option value="0">{Products["0"]}</Option>
                        <Option value="1">{Products["1"]}</Option>
                        <Option value="2">{Products["2"]}</Option>
                        <Option value="3">{Products["3"]}</Option>
                    </Select>
                </p>
            </Modal>
            <Modal
                visible={solutionAnalyticsModalVisible}
                title={solutionAnalyticsModalTitle}
                onCancel={handleSolutionAnalyticsModalCancel}
                footer={[
                    <Button key="back" onClick={handleSolutionAnalyticsModalCancel}>
                        Return
                    </Button>
                ]}
            >
                <p>
                    <h4><b>Forecast Achieved</b></h4>
                    <br></br>
                    <Table
                        columns={analyticsTableColumns}
                        dataSource={solutionForecastData}
                        size="small"
                        bordered={false}
                        showHeader={false}
                    />
                </p>
                <p>
                    <h4><b>Production Line Utilization</b></h4>
                    <br></br>
                    <Table
                        columns={analyticsTableColumns}
                        dataSource={prodLineUtilData}
                        size="small"
                        bordered={false}
                        showHeader={false}
                    />
                </p>
                <p>
                    <h4><b>Raw Materials Usage</b></h4>
                    <br></br>
                    <Table
                        columns={analyticsTableColumns}
                        dataSource={rawMaterialsUsageData}
                        size="small"
                        bordered={false}
                        showHeader={false}
                    />
                </p>
            </Modal>
            <div className='solutions'>
                <h1 id='saved-solutions-h1'>Saved Solutions</h1>
                <hr />
                <div className='tableContainer'>
                    <div style={{width: "700px", textAlign: '-webkit-center'}}>
                        <Table
                            rowKey={"id"}
                            columns={savedSolutionsTableCols}
                            dataSource={savedSolutions}
                            expandable={{
                                expandedRowRender: (solution) => (
                                    <div>
                                        <Space wrap>
                                            <Dropdown overlay={productionLinesDropDownMenu}>
                                                <Button>
                                                    <Space>
                                                        Production Lines
                                                        <DownOutlined />
                                                    </Space>
                                                </Button>
                                            </Dropdown>
                                        </Space>
                                        <WeeklyCalendar
                                            events={solution.solution[selectedProductionLine]}
                                            onEventClick={handleEditEventClick}
                                            onSelectDate={(date) => console.log(date)}
                                            weekends={true}
                                        />
                                    </div>
                                ),
                            }}
                        >
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );

    // return (
    //     <>
    //         <WeeklyCalendar
    //             events={calendarEvents}
    //             onEventClick={(event) => console.log(event)}
    //             onSelectDate={(date) => console.log(date)}
    //             weekends={true}
    //         />
    //     </>
    // );
}

export default Solutions;
// function SiteData(props) {
//     const [isUploading, setIsUploading] = useState(false);
//     const [existingFiles, setExistingFiles] = useState([]);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [fileTitle, setFileTitle] = useState("");
//
//     const columns = [
//         {
//             title: 'Id',
//             dataIndex: 'id',
//             key: 'id',
//             width: "30%"
//         },
//         {
//             title: 'Title',
//             dataIndex: 'title',
//             key: 'title',
//             width: "100%"
//         },
//         {
//             title: 'Action',
//             key: 'action',
//             width: "20%",
//             render: (data) => (<Button onClick={() => handleDeleteFile(data.id)}><DeleteFilled /></Button>)
//
//         }
//     ]
//
//     useEffect(() => {
//         const fetchData = async () => {
//             const existingData = await getSiteData();
//             if (existingData && existingData.statusCode === 200) {
//                 setExistingFiles(existingData.list);
//             } else {
//                 setExistingFiles([]);
//             }
//         }
//
//         fetchData();
//     }, []);
//
//     const onFileSelected = (event) => {
//         setSelectedFile(event.target.files[0]);
//     }
//
//     const onFileTitleChange = (e) => {
//         setFileTitle(e.target.value);
//     }
//
//     const handleDeleteFile = async (fileId) => {
//         const response = await deleteFile(fileId);
//         if (response && response.statusCode === 200) {
//             setExistingFiles(response.list);
//         }
//     }
//
//     const onFileUpload = () => {
//         // Create an object of formData
//         if (selectedFile != null) {
//             const formData = new FormData();
//             formData.append('file', selectedFile, selectedFile.name);
//             formData.append('title', fileTitle);
//             setIsUploading(true);
//             uploadFile(formData).then(async (response) => {
//                 if (response && response.status === 200) {
//                     setIsUploading(false);
//                     const existingData = await getSiteData();
//                     if (existingData && existingData.statusCode === 200) {
//                         setExistingFiles(existingData.list);
//                     }
//                 }
//             });
//         }
//     }
//
//     return (
//         <div className='site-data'>
//             <h1 id='site-data-h1'>Manage Site Data files</h1>
//             <hr />
//             <h2 className='site-sata-h2'>Upload Site Data json file</h2>
//             <div className='upload-section'>
//                 <Row gutter={[16, 16]} justify='center'>
//                     <Col>
//                         <label style={{paddingLeft: "80px"}} htmlFor='select-file-btn'>Select a file: </label>
//                         <input type="file" id='select-file-btn' onChange={onFileSelected}/>
//                     </Col>
//                     <Col span={24}>
//                         <Input
//                             value={fileTitle}
//                             onChange={onFileTitleChange}
//                             placeholder='Title your file'
//                             style={{width: "200px", marginLeft: "10px", marginRight: "10px"}}
//                         >
//
//                         </Input>
//                         <Button loading={isUploading}
//                                 className='uploadBtn'
//                                 onClick={onFileUpload}
//                                 type="primary"
//                                 disabled={isNull(selectedFile)}
//                         >
//                             Upload file
//                         </Button>
//                     </Col>
//                 </Row>
//             </div>
//             <div className='tableContainer'>
//                 <h2 className='site-sata-h2'>Existing files</h2>
//                 <div style={{width: "700px", textAlign: '-webkit-center'}}>
//                     <Table
//                         columns={columns}
//                         dataSource={existingFiles}
//                     >
//                     </Table>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default SiteData;
