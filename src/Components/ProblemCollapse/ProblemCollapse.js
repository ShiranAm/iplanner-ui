import React, { useEffect, useState} from "react";
import { Select, Collapse, Button, Row, Col, Input, Form } from 'antd';

const { Panel } = Collapse;
const { Option } = Select;

function ProblemCollapse(props) {
  const mutationsMapping = {
    0: 'Flip Bit',
  }

  const crossoverMapping = {
    0: 'Two-Point Crossover',
  }

  const selectionMapping = {
    0: 'Tournament'
  }

  return (
    <div className='collapse-section'>
      <Collapse style={{width: 'inherit'}}>
        <Panel header='Set Population Size'>
          <Form
            layout='inline'
          >
            <Row style={{width: '100%'}} justify='space-between'>
              <Col>
                <Form.Item
                  style={{marginRight: "0px"}}
                  rules={[]}
                >
                  <Input
                    style={{width: '200px'}}
                  >
                  </Input>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Set
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
        <Panel header="Set Selction Method">
          <Row justify='space-between'>
            <Col>
              <Select
                placeholder='Select'
                style={{width: '200px'}}
              >
                {Object.entries(selectionMapping).map(([key, value], i) => (
                  <Option key={`selection-method-${i}`} value={key}>{value}</Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Button
                type='primary'
              >
                Set
              </Button>
            </Col>
          </Row>
        </Panel>
        <Panel header='Set Crossover Method'>
          <Row justify='space-between'>
            <Col>
              <Select
                placeholder='Select'
                style={{width: '200px'}}
              >
                {Object.entries(crossoverMapping).map(([key, value], i) => (
                  <Option key={`crossover-method-${i}`} value={key}>{value}</Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Button
                type='primary'
              >
                Set
              </Button>
            </Col>
          </Row>
        </Panel>
        <Panel header='Set Mutation'>
          <Row justify='space-between'>
            <Col>
              <Select
                placeholder='Select'
                style={{width: '200px'}}
              >
                {Object.entries(mutationsMapping).map(([key, value], i) => (
                  <Option key={`mutation-method-${i}`} value={key}>{value}</Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Button
                type='primary'
              >
                Set
              </Button>
            </Col>
          </Row>
        </Panel>
        <Panel header='Set Stopping Conditions'>
          <Form>
            <Form.Item>

            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </div>
    )
}

export default ProblemCollapse;
