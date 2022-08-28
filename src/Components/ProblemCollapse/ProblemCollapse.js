import React, { useEffect, useState} from "react";
import { Select, Collapse, Button, Row, Col, Input, Form, Switch } from 'antd';

const { Panel } = Collapse;
const { Option } = Select;

function ProblemCollapse(props) {
  const [populationSize, setPopulationSize] = useState(null);
  const [selectedSelection, setSelection] = useState(null);

  const [timeCondEnabled, setTimeCondEnabled] = useState(null);
  const [fitnessCondEnabled, setFitenssCondEnabled] = useState(null);
  const [generationCondEnabled, setGenerationCondEnabled] = useState(null);

  const [timeBound, setTimeBound] = useState(null);
  const [fitnessBound, setFitnessBound] = useState(null);
  const [generationsBound, setGenerationsBound] = useState(null);

  useEffect(() => {
    setPopulationSize(props.populationSize)

    setTimeCondEnabled(props.stoppingConditionCondiguration.TIME_STOPPING_CONDITION.applied);
    setFitenssCondEnabled(props.stoppingConditionCondiguration.FITNESS_STOPPING_CONDITION.applied);
    setGenerationCondEnabled(props.stoppingConditionCondiguration.GENERATIONS_STOPPING_CONDITION.applied);

    setTimeBound(props.stoppingConditionCondiguration.TIME_STOPPING_CONDITION.bound);
    setFitnessBound(props.stoppingConditionCondiguration.FITNESS_STOPPING_CONDITION.bound);
    setGenerationsBound(props.stoppingConditionCondiguration.GENERATIONS_STOPPING_CONDITION.bound);

  }, [])

  const mutationsMapping = {
    0: 'Flip Bit',
  }

  const crossoverMapping = {
    0: 'Two-Point Crossover',
  }

  const selectionMapping = {
    0: 'Tournament'
  }

  const selectionInputMaping = {
    0:
    (<>
      <Form.Item
        name='selection_parameters'
      >
        <Form.Item
          label='Tournsize'
          name='tournsize'
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label='k'
          name='k'
        >
          <Input></Input>
        </Form.Item>
      </Form.Item>
    </>)
  }

  const getStoppingConditionsForms = () => (
    <>
      <Form
        layout='inline'
        initialValues={{ bound: timeBound / 60, applied: timeCondEnabled }}
        onFinish={setTimeCondition}

      >
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name='bound'
              label='Time bound (minutes)'
            >
              <Input
                style={{ width: "100px" }}
              >
              </Input>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='applied'
              valuePropName='checked'
            >
              <Switch
                checkedChildren={<span>Enabled</span>}
                unCheckedChildren={<span>Disabled</span>}
              >
              </Switch>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              style={{ marginTop: "25px" }}
            >
              <Button
                type='primary'
                htmlType="submit"
              >
                Set
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Form
        layout='inline'
        style={{ marginTop: "40px" }}
        initialValues={{ bound: fitnessBound, applied: fitnessCondEnabled }}
        onFinish={props.setFitnessCond}
      >
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name='bound'
              label='Fitness bound (minimum)'
            >
              <Input
                style={{ width: "100px" }}
              >
              </Input>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='applied'
              valuePropName='checked'
            >
              <Switch
                checkedChildren={<span>Enabled</span>}
                unCheckedChildren={<span>Disabled</span>}
              >
              </Switch>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              style={{ marginTop: "25px" }}
            >
              <Button
                type='primary'
                htmlType="submit"
              >
                Set
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Form
        layout='inline'
        style={{ marginTop: "40px" }}
        initialValues={{ bound: generationsBound, applied: generationCondEnabled }}
        onFinish={setGenerationsCond}
      >
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name='bound'
              label='Generations bound'
            >
              <Input
                style={{ width: "100px" }}
              >
              </Input>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='applied'
              valuePropName='checked'
            >
              <Switch
                checkedChildren={<span>Enabled</span>}
                unCheckedChildren={<span>Disabled</span>}
              >
              </Switch>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              style={{ marginTop: "25px" }}
            >
              <Button
                type='primary'
                htmlType="submit"
              >
                Set
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
    )

  const handlePopulationSizeChange = (value) => {
    setPopulationSize(value);
  }

  const handleSelectionChange = (value) => {
    setSelection(value);
  }

  const handleSetSelectionMethod = (values) => {
    console.log(values)
  }

  const setTimeCondition = (values) => {
    props.setTimeCond(values);
  }

  const setGenerationsCond = (values) => {
    props.setGenerationsCond(values);
  }

  return (
    <div className='collapse-section'>
      <Collapse style={{width: 'inherit'}}>
        <Panel header='Set Population Size'>
          <Form
            layout='inline'
            onFinish={props.onSetPopulationSize}
            initialValues={{ population_size: populationSize }}
          >
            <Row style={{width: '100%'}} justify='space-between'>
              <Col>
                <Form.Item
                  name='population_size'
                  style={{marginRight: "0px"}}
                  rules={[]}
                >
                  <Input
                    style={{width: '200px'}}
                    value={populationSize}
                    onChange={setPopulationSize}
                  >
                  </Input>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                  >
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
              <Form
                onFinish={handleSetSelectionMethod}
              >
                <Form.Item
                  name='selection_id'
                >
                  <Select
                    placeholder='Select'
                    style={{width: '200px', marginBottom: '25px'}}
                    onChange={handleSelectionChange}
                  >
                    {Object.entries(selectionMapping).map(([key, value], i) => (
                      <Option key={`selection-method-${i}`} value={key}>{value}</Option>
                    ))}
                  </Select>
                  {selectedSelection && selectionInputMaping[selectedSelection]}
                  {selectedSelection &&
                    <Form.Item>
                    <Button
                      type='primary'
                      htmlType="submit"
                    >
                      Set
                    </Button>
                  </Form.Item>}
                </Form.Item>
              </Form>
            </Col>
            <Col>

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
          {getStoppingConditionsForms()}
        </Panel>
      </Collapse>
    </div>
    )
}

export default ProblemCollapse;
