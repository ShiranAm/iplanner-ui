import React, {useEffect, useState} from "react";
import { getSolutionByProblemId, getProblemById, getSiteData, getSavedSolutions } from "../../api/api";
import { Table } from "antd";
import { CalendarOutlined } from '@ant-design/icons';
// import {isNull} from "lodash";
// import './SiteData.css'
import { WeeklyCalendar } from 'antd-weekly-calendar';


function Solutions(props) {

    const [calendarEvents, setCalendarEvents] = useState(false);
    const [savedSolutions, setSolutions] = useState(false);

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
        // {
        //     title: '',
        //     key: 'action',
        //     width: "20%",
        //     render: (data) => (<Button onClick={() => handleShowSolution(data.id)}><CalendarOutlined /></Button>)
        //
        // }
    ]

    // const handleShowSolution = async (solutionId) => {
    //
    //     console.log("solution id: " + solutionId)
    // }

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

    return (
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
                                // <p
                                //     style={{
                                //         margin: 0,
                                //     }}
                                // >
                                // </p>
                                <WeeklyCalendar
                                    events={solution.solution[0]}
                                    onEventClick={(event) => console.log(event)}
                                    onSelectDate={(date) => console.log(date)}
                                    weekends={true}
                                />
                            ),
                            rowExpandable: (record) => record.title !== 'Not Expandable',
                        }}
                    >
                    </Table>
                </div>
            </div>
        </div>
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
