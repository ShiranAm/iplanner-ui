import React, { useEffect, useState} from "react";
import { Progress } from 'antd';
import { getProgress } from "../../api/api";

function ProgressBars(props) {
  const [timeProgress, setTimeProgress] = useState(0);
  const [fitnessProgress, setFitnessProgress] = useState(0);
  const [generationsProgress, setGenerationsProgress] = useState(0);
  const [timeApplied, setTimeApplied] = useState(false);
  const [fitnessApplied, setFitnessApplied] = useState(false);
  const [generationsAplied, setGenerationsApplied] = useState(false);

  useEffect(() => {
    const interval = setInterval(fetchProgress, 1000);
    return () => clearInterval(interval);
  }, [])

  const fetchProgress = async () => {
    const result = await getProgress(props.problemId)
    if (result && result.statusCode === 200) {
      setTimeProgress(result.TIME_STOPPING_CONDITION.progress);
      setFitnessProgress(result.FITNESS_STOPPING_CONDITION.progress);
      setGenerationsProgress(result.GENERATIONS_STOPPING_CONDITION.progress);

      setTimeApplied(result.TIME_STOPPING_CONDITION.applied);
      setFitnessApplied(result.FITNESS_STOPPING_CONDITION.applied);
      setGenerationsApplied(result.GENERATIONS_STOPPING_CONDITION.applied);

      if (result.FITNESS_STOPPING_CONDITION.progress == 100.0 || result.TIME_STOPPING_CONDITION.progress == 100.0 ||
      result.GENERATIONS_STOPPING_CONDITION.progress == 100.0) {
        props.onFinish();
      }
    }
  }

  return(
    <>
      <div>
        <span>Time: </span>
        <Progress percent={timeProgress} status={timeApplied? 'active' : 'exception'}/>
      </div>
      <div>
        <span>Fitness: </span>
        <Progress percent={fitnessProgress} status={fitnessApplied? 'active' : 'exception'}/>
      </div>
      <div>
        <span>Generations: </span>
        <Progress percent={generationsProgress} status={generationsAplied? 'active': 'exception'}/>
      </div>
    </>
  )
}

export default ProgressBars;
