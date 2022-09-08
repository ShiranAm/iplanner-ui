import React, {useEffect, useState} from "react";
import { Table, Modal, Button, Spin } from "antd";


function SolutionAnalytics(props) {
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

    return(
        <>
            <Modal
                visible={props.visible}
                title={props.title}
                onCancel={props.handleSolutionAnalyticsModalCancel}
                footer={[
                    <Button key="back" onClick={props.handleSolutionAnalyticsModalCancel}>
                        Return
                    </Button>
                ]}
            >
                {props.loadingAnalyticsData ? <Spin /> :
                    <>
                        <div>
                            <h4><b>Forecast Achieved</b></h4>
                            <br></br>
                            <Table
                                columns={analyticsTableColumns}
                                dataSource={props.forecastData}
                                size="small"
                                bordered={false}
                                showHeader={false}
                            />
                        </div>
                        <div>
                            <h4><b>Production Line Utilization</b></h4>
                            <br></br>
                            <Table
                                columns={analyticsTableColumns}
                                dataSource={props.prodLineUtilData}
                                size="small"
                                bordered={false}
                                showHeader={false}
                            />
                        </div>
                        <div>
                            <h4><b>Raw Materials Usage</b></h4>
                            <br></br>
                            <Table
                            columns={analyticsTableColumns}
                            dataSource={props.rawMaterialsUsageData}
                            size="small"
                            bordered={false}
                            showHeader={false}
                            />
                        </div>
                    </>}
            </Modal>
        </>
    );
}

export default SolutionAnalytics;