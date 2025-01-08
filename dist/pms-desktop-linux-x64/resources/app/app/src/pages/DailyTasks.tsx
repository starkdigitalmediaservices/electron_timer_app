import React, { useState, useEffect, useRef } from 'react';
import {
  getDailyTasks,
  updateTaskProgress,
  logTaskTime,
  startTaskTime,
} from '../pmsApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { formatTime } from '../utils';
import Spinner from 'react-bootstrap/Spinner';

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
  const [isLoading, setIsLoading] = useState(false);
  const intervalsRef = useRef({}); // Store intervals for each task
  const timerRef = React.useRef(null); // Store the timer ID
  const electron = (window as any).electron;
  const ipcRenderer = (window as any).ipcRenderer;
  useEffect(() => {
    fetchDailyTasks();
    clearLocalStorage();
  }, [isLoading]);

  useEffect(() => {
    fetchDailyTasks();
  }, [isLoading]);

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => clearInterval(timerRef.current);
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem('activeTask');
  };

  function persistTaskState(task) {
    localStorage.setItem('activeTask', JSON.stringify(task));
  }

  // function loadPersistedTask() {
  //   const task = JSON.parse(localStorage.getItem('activeTask'));
  //   console.log('loadPersistedTask task: ', task);
  //   if (task) {
  //     setActiveTaskId(task.id);
  //     setElapsedTime(Date.now() - new Date(task.startTime).getTime());
  //     setStartTime(new Date(task.startTime));
  //     console.log('new Date(task.startTime: ', new Date(task.startTime));
  //   }
  // }

  function loadPersistedTask() {
    const task = JSON.parse(localStorage.getItem('activeTask'));
    console.log('loadPersistedTask task: ', task);

    if (task) {
      try {
        // Remove the 'Z' from start_date and append start_time
        const dateWithoutTimezone = task.start_date.replace('Z', '');
        const combinedDateTimeString = `${dateWithoutTimezone.split('T')[0]}T${
          task.start_time
        }:00`;
        console.log('Combined DateTime String: ', combinedDateTimeString);

        // Create a new Date object
        const startDateTime = new Date(combinedDateTimeString);

        if (!isNaN(startDateTime.getTime())) {
          setActiveTaskId(task.id);
          setElapsedTime(Date.now() - startDateTime.getTime());
          setStartTime(startDateTime);
          console.log('Valid startDateTime: ', startDateTime);
        } else {
          console.error(
            'Invalid Date after combining start_date and start_time'
          );
        }
      } catch (error) {
        console.error('Error combining start_date and start_time: ', error);
      }
    }
  }

  useEffect(() => {
    loadPersistedTask();
  }, []);


  useEffect(() => {
    // Clear all existing intervals before setting up new ones
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};

    tasks?.forEach((task) => {
      if (!task.time_entries_details || !task.time_entries_details.start_time) return;

      const apiDate = new Date(task.time_entries_details.start_time);
      const currentDate = new Date();
      const differenceInMillis = Math.max(0, currentDate.getTime() - apiDate.getTime()); // Ensure non-negative

      // Set initial elapsed time for the task
      setElapsedTime((prev) => ({ ...prev, [task.id]: differenceInMillis }));

      // Set up a timer for this task
      intervalsRef.current[task.id] = setInterval(() => {
        setElapsedTime((prev) => {
          const newElapsedTime = (prev[task.id] || differenceInMillis) + 1000;
          return { ...prev, [task.id]: newElapsedTime };
        });
      }, 1000);
    });

    // Cleanup intervals when tasks change or component unmounts
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
      intervalsRef.current = {};
    };
  }, [tasks]);


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

  async function handleProgressUpdate (taskId, progress) {
    const response = await updateTaskProgress(taskId, progress);
    console.log('handleProgressUpdate response: ', response);
    if(response == undefined) {
      alert('You cannot update the progress unless and until you log the time on task');
    }else{
      setTasks((prevTasks) =>
        prevTasks?.map((task) =>
          task.id === taskId ? { ...task, progress } : task
        )
      );
    }
  }

  const handleStartTaskBtn = async (
    taskId,
    startTime,
    description,
    status,
    time_entries_details
  ) => {
    const taskStatus = status;
    // if (taskStatus === 3) {
    //   alert(
    //     'At a time only one task timer can be run. To start a new task, please stop the running timer first.'
    //   );
    //   return;
    // }
    const hasAnyTaskRunning = tasks?.some((task) => {
      const details = task.time_entries_details;
      return details && Object.keys(details).length > 0; // Check if object is not empty
    });
    
    console.log('hasAnyTaskRunning: ', hasAnyTaskRunning);
    
    if (hasAnyTaskRunning) {
      alert(
        'At a time only one task timer can be run. To start a new task, please stop the running timer first.'
      );
      return;
    }
    setIsLoading(true);
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
      // alert(response.data?.message);
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1000); // Increment by 1 second
      }, 1000);
      fetchDailyTasks();
      window.location.reload();
      setIsLoading(false);
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

  const handlePauseTaskBtn = async (
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
    startDate,
    taskTimeEntry,
    elapsedTimes,
    userTaskId
  ) => {
    console.log('handlePauseTaskBtn taskTimeEntry: ', taskTimeEntry);
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

    const response = await logTaskTime(
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
      startDate,
      taskTimeEntry,
      elapsedTimes,
      userTaskId
    );
    console.log('response: ', response?.code);
    if (response?.code === 200) {
      fetchDailyTasks();
      alert('Task updated successfully');
    }

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
      {
        isLoading ? (
          <Spinner animation="border" variant="secondary" />
        )
        :(
         <>
          <ul className="space-y-4">
        {
        tasks?.length === 0 ?
        (
          <h3>
            No Task Found
          </h3>
        )
        :
        (
          <>
          {
            tasks?.map((task) => {
              const elapsedTimes = elapsedTime[task.id] || 0;
    
              return (
                <li key={task.id} className="bg-white shadow-md rounded-lg p-4">
                  <h2 className="text-lg font-semibold">{task.content}</h2>
                  <p className="text-gray-600">{task.description}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    {
                      // activeTaskId === task.id &&
                      // task.time_entries_status == 1 ? (
                      // activeTaskId === task.id ? (
                      task.time_entries_details &&
                      Object.keys(task.time_entries_details).length > 0 ? (
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
                                task.start_date,
                                task?.time_entries_details?.start_time,
                                formatTime(elapsedTimes),
                                task?.time_entries_details?.id
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
                          onClick={() => {
                            handleStartTaskBtn(
                              task.id,
                              task.start_date,
                              task.description,
                              task.time_entries_status,
                              task.time_entries_details
                            );
                            persistTaskState(task);
                          }}
                          className="bg-blue-500 text-black px-4 py-2 rounded"
                        >
                          Start
                        </button>
                      )
                    }
                    <span className="text-gray-600">
                      <p>
                        {task.time_entries_details?.start_time
                          ? formatTime(elapsedTimes)
                          : '00:00:00'}
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
              );
            })
          }
          </>
        )
        }
      </ul>
         </>
        )
      }
     
    </div>
  );
};
