import React, { useState, useEffect, useRef } from 'react';
import {
  getDailyTasks,
  updateTaskProgress,
  logTaskTime,
  startTaskTime,
} from '../pmsApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { formatTime } from '../utils';

export const DailyTasks: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [isTimeStart, setIsTimeStart] = useState('');
  const [taskStatus, setTaskStatus] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in milliseconds
  const [startTime, setStartTime] = useState(null); // Start time as Date
  const [convertStartTime, setConvertStartTime] = useState(null);
  const [pauseTime, setPauseTime] = useState(null); // Pause time as Date
  const [totalMinutes, setTotalMinutes] = useState(0); // Total time in minutes
  const [userId, setUserId] = useState(null);
  const timerRef = React.useRef(null); // Store the timer ID
  const electron = (window as any).electron;
  const ipcRenderer = (window as any).ipcRenderer;
  useEffect(() => {
    fetchDailyTasks();
  }, []);

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => clearInterval(timerRef.current);
  }, []);

  async function fetchDailyTasks() {
    const dailyTasks = await getDailyTasks();
    console.log('dailyTasks: ', dailyTasks.data);
    setTasks(dailyTasks.data);
  }

  function handleStartTask(taskId) {
    if (activeTaskId) {
      handlePauseTask(activeTaskId);
    }
    setActiveTaskId(taskId);
    setTasks((prevTasks) =>
      prevTasks?.map((task) =>
        task.id === taskId
          ? { ...task, status: 'active', startTime: Date.now() }
          : task
      )
    );
  }

  function handlePauseTask(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status === 'active') {
      const elapsedTime = Date.now() - task.startTime;
      logTaskTime(taskId, elapsedTime);
      setTasks((prevTasks) =>
        prevTasks?.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: 'paused',
                totalTime: (t.totalTime || 0) + elapsedTime,
              }
            : t
        )
      );
    }
    setActiveTaskId(null);
  }

  function handleResumeTask(taskId) {
    handleStartTask(taskId);
  }

  function handleProgressUpdate(taskId, progress) {
    updateTaskProgress(taskId, progress);
    setTasks((prevTasks) =>
      prevTasks?.map((task) =>
        task.id === taskId ? { ...task, progress } : task
      )
    );
  }

  const handleStartTaskBtn = async (taskId, startTime, description, status) => {
    if (activeTaskId) {
      alert(
        'At a time only one task timer can be run. To start a new task, please stop the running timer first.'
      );
      return;
    }
    const now = new Date();
    setStartTime(now); // Save the start time
    const formattedEndDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}`;

    console.log(formattedEndDate);
    setConvertStartTime(formattedEndDate);
    setActiveTaskId(taskId); // Start the task
    setIsPaused(false);
    // Call your API or logic to start the task here, e.g., handleStartTask(taskId)
    setElapsedTime(0);
    // startTaskTime(taskId, formattedEndDate,  startTime, description);
    const response = await startTaskTime(
      taskId,
      formattedEndDate,
      startTime,
      description
    );
    console.log('handleStartTaskBtn: ', response.data);
    setUserId(response.data?.data?.id);

    if (response.data?.code === 201) {
      alert(response.data?.message);
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1000); // Increment by 1 second
      }, 1000);
    }
  };

  // Pause Timer
  // const handlePauseTaskBtn = () => {
  //   setIsPaused(true);
  //   clearInterval(timerRef.current);
  // };

  // // Resume Timer
  // const handleResumeTaskBtn = () => {
  //   setIsPaused(false);

  //   timerRef.current = setInterval(() => {
  //     setElapsedTime((prevTime) => prevTime + 1000);
  //   }, 1000);
  // };

  const handlePauseTaskBtn = (
    taskId,
    time,
    projectId,
    start_date,
    due_date,
    task_progress,
    estimated_time,
    priority,
    name,
    tw_id,
    startDate
  ) => {
    const now = new Date();
    setPauseTime(now); // Save the pause time
    const formattedEndDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}`;

    console.log(formattedEndDate);
    clearInterval(timerRef.current);
    setIsPaused(true);

    // Calculate total time elapsed in minutes
    console.log('elapsedTime:', elapsedTime); // Log the elapsedTime
    const hours = Math.floor(elapsedTime / (60 * 60 * 1000));
    const minutes = Math.floor((elapsedTime % (60 * 60 * 1000)) / (60 * 1000));
    const diffInMinutes = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`; // Convert ms to hours and minutes
    console.log('diffInMinutes: ', diffInMinutes);
    setTotalMinutes(diffInMinutes);

    logTaskTime(
      taskId,
      time,
      projectId,
      convertStartTime,
      formattedEndDate,
      task_progress,
      diffInMinutes,
      priority,
      diffInMinutes,
      name,
      tw_id,
      userId,
      startDate
    );

    console.log(
      'start time and pasue time :',
      startTime,
      pauseTime,
      'diff in minutes:',
      diffInMinutes
    );
  };

  // Resume Timer
  const handleResumeTaskBtn = () => {
    setIsPaused(false);

    timerRef.current = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1000);
    }, 1000);
  };

  return (
    // <div>
    //     <h1>Daily Tasks</h1>
    // </div>
    <div className="daily-tasks-screen">
      <h1 className="text-2xl font-bold mb-4">Today's Tasks</h1>
      {/* <p>The home directory is @ {electron.on()}</p> */}
      <ul className="space-y-4">
        {tasks?.map((task) => (
          <li key={task.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold">{task.content}</h2>
            <p className="text-gray-600">{task.description}</p>
            <div className="mt-2 flex items-center space-x-2">
              { 
              // activeTaskId === task.id && 
              // task.time_entries_status == 1 ? (
                activeTaskId === task.id ? (
                <>
                  {/* {isPaused ? (
                <button
                  onClick={() => {
                    setIsPaused(false);
                    // handleResumeTask(task.id);
                    handleResumeTaskBtn();
                  }}
                  className="bg-green-500 text-black px-4 py-2 rounded"
                >
                  Resume
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsPaused(true);
                    // handlePauseTask(task.id, task.totalTime, task.project_id);
                    handlePauseTaskBtn(task.id, task.totalTime, task.project_id, startTime, pauseTime, task.progress, 'diffInMinutes', 'priority', task.content, task.tw_id);
                  }}
                  className="bg-yellow-500 text-black px-4 py-2 rounded"
                >
                  Pause
                </button>
              )} */}

                  <button
                    onClick={() => {
                      setActiveTaskId(null); // Stop the task
                      setIsPaused(false);
                      handlePauseTaskBtn(
                        task.id,
                        task.totalTime,
                        task.project_id,
                        startTime,
                        pauseTime,
                        task.progress,
                        'diffInMinutes',
                        'priority',
                        task.content,
                        task.tw_id,
                        task.start_date
                      );
                      // handleStopTask(task.id);
                    }}
                    className="bg-red-500 text-black px-4 py-2 rounded"
                  >
                    Stop
                  </button>
                </>
              ) : (
                <button
                  // onClick={() => {
                  //   setActiveTaskId(task.id); // Start the task
                  //   setIsPaused(false);
                  //   // handleStartTask(task.id);
                  // }}
                  onClick={() =>
                    handleStartTaskBtn(
                      task.id,
                      task.start_date,
                      task.description,
                      task.time_entries_status
                    )
                  }
                  className="bg-blue-500 text-black px-4 py-2 rounded"
                >
                  Start
                </button>
              )}
              <span className="text-gray-600">
                {/* Task time: {formatTime(task.totalTime || 0)} */}
                <p>
                  Elapsed Time:{' '}
                  {activeTaskId === task.id
                    ? formatTime(elapsedTime)
                    : formatTime(task.totalTime || 0)}
                </p>
              </span>
            </div>
            <div className="mt-2">
              <label
                htmlFor={`progress-${task.id}`}
                className="block text-sm font-medium text-gray-700"
              >
                Progress
              </label>
              <input
                type="range"
                id={`progress-${task.id}`}
                value={task.progress || 0}
                onChange={(e) =>
                  handleProgressUpdate(task.id, parseInt(e.target.value))
                }
                className="mt-1 block w-full"
                min="0"
                max="100"
              />
              <span className="text-sm text-gray-600">
                {task.progress || 0}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
