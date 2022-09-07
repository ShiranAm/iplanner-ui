import React, {useEffect, useState} from "react";
import _ from "lodash";
import { Menu, Dropdown, Space, Button } from "antd";
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import $ from 'jquery';
import { WeeklyCalendar } from 'antd-weekly-calendar';


function SolutionWeeklyCalendar(props) {

    const [selectedProductionLine, setSelectedProductionLine] = useState(0);
    const [formattedSolution, setFormattedSolution] = useState([]);

    const fixBadCalendarStyles = () => {
        $('div[style*="top: 16800%"]').css('top', '0%');
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

    const formatSolution = async () => {
        var solution = _.cloneDeep(props.solution);
        solution = await convertToCalendarEvents(solution);
        setFormattedSolution(solution);
    }

    useEffect(() => {
        formatSolution();
        fixBadCalendarStyles();
    }, [])


    return(
        <>
            <Space wrap style={{paddingBottom: "20px"}}>
                <Dropdown overlay={productionLinesDropDownMenu} onChange={fixBadCalendarStyles}>
                    <Button style={{width: "300px"}}>
                        <Space>
                            Production Lines
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
                <span>Production Line: {selectedProductionLine}</span>
            </Space>
            <WeeklyCalendar
                id="weeklyCalendar"
                events={formattedSolution[selectedProductionLine]}
                onEventClick={props.handleEditEventClick}
                onSelectDate={fixBadCalendarStyles}
                weekends={true}
            />
        </>
    );
}

export default SolutionWeeklyCalendar;