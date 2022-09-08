import React, {useEffect, useState} from "react";
import { getSavedSolutions, getSolutionById, editSolution, deleteSolution } from "../../api/api";
import {getSolutionForecastData, getRawMaterialsUsageData, getProdLineUtilData} from "../Solutions/SolutionAnalyticsHelpers";
import { Table, Modal, Button, Select, Form, DatePicker, Tag } from "antd";
import { BarChartOutlined, DeleteOutlined } from '@ant-design/icons';
import _ from "lodash";
import SolutionWeeklyCalendar from "../WeeklyCalendar/WeeklyCalendar";
import SolutionAnalytics from "../Solutions/SolutionAnalytics";
import moment from 'moment';
import './Solutions.css'
const { Option } = Select;
const { RangePicker } = DatePicker;



function Solutions(props) {

    const [savedSolutions, setSolutions] = useState([]);

    const [solutionAnalyticsComponentTitle, setSolutionAnalyticsComponentTitle] = useState("");
    const [solutionAnalyticsComponentSolution, setSolutionAnalyticsComponentSolution] = useState(false);
    const [solutionAnalyticsModalVisible, setSolutionAnalyticsModalVisible] = useState(false);
    const [forecastData, setAnalyticsForecastData] = useState(false);
    const [rawMaterialsUsageData, setAnalyticsRawMaterialsUsageData] = useState(false);
    const [prodLineUtilData, setAnalyticsProdLineUtilData] = useState(false);
    const [loadingAnalyticsData, setLoadingAnalyticsData] = useState(true);

    const [editEventCurrentProduct, setEditEventCurrentProduct] = useState("");
    const [editEventCurrentDateTime, setEditEventCurrentDateTime] = useState(["", ""]);
    const [editEventDefaultDateTime, setEditEventDefaultDateTime] = useState(["", ""]);
    const [editEventModalVisible, setEditEventModalVisible] = useState(false);
    const [currentSelectedEvent, setCurrentSelectedEvent] = useState({"productionLine": 0, "key": 0})
    const [currentFocusedSolution, setCurrentFocusedSolution] = useState(false);

    const dateTimeFormat = 'DD-MM-YYYY HH:mm';


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

    const savedSolutionsTableCols = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: "200px"
        },
        {
            title: 'Problem Id',
            dataIndex: 'problem_id',
            key: 'problem_id',
            width: "200px"
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: "40%"
        },
        {
            title: 'Fitness Score',
            dataIndex: 'fitness',
            key: 'fitness',
            width: "30%",
            render: (data) => (<Tag color='geekblue'>{data.toFixed(2)}</Tag>)
        },
        {
            title: 'Analytics',
            key: 'analytics',
            width: "20%",
            render: (data) => (<Button onClick={() => handleShowSolutionAnalytics(data.id)}><BarChartOutlined /></Button>)

        },
        {
            title: '',
            key: 'delete',
            width: "20%",
            render: (data) => (<Button onClick={() => handleDeleteSolution(data.id)}><DeleteOutlined /></Button>)
        }
    ]

    const handleDeleteSolution = async (solutionId) => {
        const result = await deleteSolution(solutionId);
        if (result.statusCode === 200) {
            fetchSavedSolutions();
        }

    }

    const handleShowSolutionAnalytics = async (solutionId) => {
        console.log("solution id: " + solutionId);
        const solution = await getSolutionById(solutionId);

        if (solution.statusCode === 200) {
            setSolutionAnalyticsComponentTitle("Solution #" + solutionId + " Analytics");
            // set props.solution of SolutionAnalyticsComponent (useState)
            setSolutionAnalyticsComponentSolution(solution)
            // these things need to be in SolutionAnalyticsComponent
            setAnalyticsForecastData(getSolutionForecastData(solution));
            setAnalyticsRawMaterialsUsageData(getRawMaterialsUsageData(solution));
            setAnalyticsProdLineUtilData(getProdLineUtilData(solution));
            setSolutionAnalyticsModalVisible(true);
            setLoadingAnalyticsData(false);
        }
    }

    const handleSolutionAnalyticsModalCancel = () => {
        setSolutionAnalyticsModalVisible(false)
        setLoadingAnalyticsData(true);
    };

    const fetchSavedSolutions = async () => {
        const solutions = await getSavedSolutions();
        if (solutions && solutions.statusCode === 200) {
            // await Promise.all(solutions.list.map( async (solution) => {
            //     solution.solution = await convertToCalendarEvents(solution.solution)
            // }));
            setSolutions(solutions.list);
        } else {
            setSolutions([]);
        }
    }

    useEffect(() => {
        fetchSavedSolutions();
    }, []);

    const handleEditEventClick = (event) => {
        console.log('selected production line: ' + event.productionLine + ', key: ' + event.key)

        setCurrentSelectedEvent({"productionLine": event.productionLine, "key": event.key});

        let productId = event.title.split(' ')[0].replace('#', '')
        setEditEventCurrentProduct(Products[productId]);

        let startTime = moment(new Date(event.startTime).toISOString(), dateTimeFormat)
        let endTime = moment(new Date(event.endTime).toISOString(), dateTimeFormat)
        let startTimeIsrael = startTime.add(3, 'hours')
        let endTimeIsrael = endTime.add(3, 'hours')

        setEditEventDefaultDateTime([startTimeIsrael, endTimeIsrael]);
        setEditEventModalVisible(true);
    };

    const onEditEventModalOk = () => {
        setEditEventModalVisible(false);
    };

    const onEditEventModalCancel = () => {
        setEditEventModalVisible(false);
    };

    const onEditEventProductChange = (e) => {
        setEditEventCurrentProduct(Products[e]);
    }

    const onEditEventProductSearch = (e) => {
        console.log(e);
    }

    const onEditEventRangePickerChange = (value, dateString) => {
        console.log('Old Time: ', value);
        console.log('New Time: ', dateString);
        setEditEventCurrentDateTime([moment(dateString[0], dateTimeFormat), moment(dateString[1], dateTimeFormat)]);
    };

    const onEditEventRangePickerOk = (value) => {
        console.log('onEditEventRangePickerOk: ', value);
        // setEditEventCurrentDateTime([moment(value[0], dateTimeFormat), moment(value[1], dateTimeFormat)]);
    };

    const onEditEventFormFinish = async (values) => {
        let solutionId = currentFocusedSolution
        let productionLine = currentSelectedEvent.productionLine
        let key = currentSelectedEvent.key

        let newProduct = values.product
        let newStartTime = values.pick_time[0].format('YYYY-MM-DD HH:mm')
        let newEndTime = values.pick_time[1].format('YYYY-MM-DD HH:mm')
        let newDateTime = [newStartTime, newEndTime]

        const result = await editSolution(solutionId, productionLine, key, parseInt(newProduct), newDateTime);
        if (result.statusCode === 200) {
            console.log("successfully updated solution " + solutionId);
            console.log(result);
            fetchSavedSolutions();
        }
        setEditEventModalVisible(false);
    };

    const onEditEventFormFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Modal
                visible={editEventModalVisible}
                onOk={onEditEventModalOk}
                onCancel={onEditEventModalCancel}
                destroyOnClose
            >
                <Form
                    style={{marginRight: '50px', marginTop: '20px'}}
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{}}
                    onFinish={onEditEventFormFinish}
                    onFinishFailed={onEditEventFormFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Product"
                        name="product"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
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
                    </Form.Item>
                    <Form.Item
                        label="Pick a new time"
                        name="pick_time"
                        rules={[{
                            required: true,
                            },
                        ]}
                    >
                        <RangePicker
                            showTime={{
                                format: 'HH:mm',
                            }}
                            format={dateTimeFormat}
                            onChange={onEditEventRangePickerChange}
                            onOk={onEditEventRangePickerOk}
                            value={editEventCurrentDateTime}
                            // defaultValue={editEventDefaultDateTime} for some reason default value is passed to form!!
                        />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <SolutionAnalytics
                visible={solutionAnalyticsModalVisible}
                handleSolutionAnalyticsModalCancel={handleSolutionAnalyticsModalCancel}
                title={solutionAnalyticsComponentTitle}
                solution={solutionAnalyticsComponentSolution}
                loadingAnalyticsData={loadingAnalyticsData}
                prodLineUtilData={prodLineUtilData}
                rawMaterialsUsageData={rawMaterialsUsageData}
                forecastData={forecastData}
            >
            </SolutionAnalytics>
            <div className='solutions'>
                <h1 id='saved-solutions-h1'>Saved Solutions</h1>
                <hr />
                <div className='tableContainer'>
                    <div style={{width: "1000px", textAlign: '-webkit-center', marginTop: '20px'}}>
                        <Table
                            rowKey={"id"}
                            columns={savedSolutionsTableCols}
                            dataSource={_.cloneDeep(savedSolutions)}
                            expandable={{
                                expandedRowRender: (solution) => {
                                    setCurrentFocusedSolution(solution.id)
                                    return(
                                        <div>
                                            <SolutionWeeklyCalendar
                                                solution={solution.solution}
                                                handleEditEventClick={handleEditEventClick}
                                            />
                                        </div>
                                    )
                                },
                            }}
                        >
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Solutions;
