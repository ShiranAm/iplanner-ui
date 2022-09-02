import React, {useEffect, useState} from "react";
import { getSolutionByProblemId, getProblemById, getSiteData, getSavedSolutions, getSolutionById, editSolution } from "../../api/api";
import { Table, Modal, Menu, Dropdown, Space, Button, Select, Form, DatePicker } from "antd";
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { BarChartOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import $ from 'jquery';
import { WeeklyCalendar } from 'antd-weekly-calendar';
import moment from 'moment';
import './Solutions.css'
const { Option } = Select;
const { RangePicker } = DatePicker;



function Solutions(props) {

    const [calendarEvents, setCalendarEvents] = useState([]);
    const [savedSolutions, setSolutions] = useState([]);
    const [selectedProductionLine, setSelectedProductionLine] = useState(0);
    const [solutionAnalyticsModalVisible, setSolutionAnalyticsModalVisible] = useState(false);
    const [solutionAnalyticsModalTitle, setSolutionAnalyticsModalTitle] = useState(false);
    const [solutionForecastData, setSolutionForecastData] = useState([]);
    const [prodLineUtilData, setProdLineUtilData] = useState([]);
    const [rawMaterialsUsageData, setRawMaterialsUsageData] = useState([]);
    const [editEventCurrentProduct, setEditEventCurrentProduct] = useState("");
    const [editEventCurrentDateTime, setEditEventCurrentDateTime] = useState(["", ""]);
    const [editEventDefaultDateTime, setEditEventDefaultDateTime] = useState(["", ""]);
    const [editEventModalVisible, setEditEventModalVisible] = useState(false);
    const [currentSelectedEvent, setCurrentSelectedEvent] = useState({"productionLine": 0, "key": 0})
    const [currentFocusedSolution, setCurrentFocusedSolution] = useState(false);
    // let currentSelectedEvent = {"productionLine": 0, "key": 0};


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
                const newEvents = eventsPerLine.map((item, index) => {
                    let startTime = new Date(item['start_time'].replace(' ', 'T'))
                    let endTime = new Date(item['end_time'].replace(' ', 'T'))
                    let title = '#' + item['product_id'] + ' - ' + item['product_name']
                    let newEvent = { productionLine: item.production_line, key: item.key, startTime: startTime,
                        endTime: endTime, title: title }
                    return newEvent
                })

                calendarEvents[lineId] = newEvents
            }
        )

        return calendarEvents
    }

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

    const fixBadCalendarStyles = () => {
        $('div[style*="top: 16800%"]').css('top', '0%');
    };

    useEffect(() => {
        fetchSavedSolutions();
        fixBadCalendarStyles();
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
                    <div style={{width: "1300px", textAlign: '-webkit-center', marginTop: '20px'}}>
                        <Table
                            rowKey={"id"}
                            columns={savedSolutionsTableCols}
                            dataSource={savedSolutions}
                            expandable={{
                                expandedRowRender: (solution) => {
                                    setCurrentFocusedSolution(solution.id)
                                    return(
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
                                                id="weeklyCalendar"
                                                events={solution.solution[selectedProductionLine]}
                                                onEventClick={handleEditEventClick}
                                                onSelectDate={fixBadCalendarStyles}
                                                weekends={true}
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