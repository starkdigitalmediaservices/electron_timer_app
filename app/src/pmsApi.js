import axios from 'axios';
import { data } from 'react-router-dom';
// const fetch = require('electron-fetch').default;
// import config from './config';
// console.log('config.API_BASE_URL: ', config);
const BASE_URL = 'https://stage-portalsapi.starkdigital.in/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer gBujppYVDDkUBbUSTdfu78QZEmLJEk',
  },
});



// export async function getTasks() {
//   // try {
//   //   // const response = await api.get('/tasks');
//   //   const response = await api.get('/v1/tasks/?sort_by=id&sort_direction=descending&page=1&limit=10&tw_emp_id=203');
//   //   return response.data;
//   // } catch (error) {
//   //   console.error('Error fetching tasks =>:', error);
//   //   return [];
//   // }
//   try {
//     const response = await api.get('/v1/tasks/?sort_by=id&sort_direction=descending&page=1&limit=10&tw_emp_id=203'); // Replace with your actual endpoint
//     return response.data; // Adjust based on the API response structure
//   } catch (error) {
//     console.error('Error fetching tasks ===>>> :', error);
//     throw error; // Ensure errors are propagated
//   }

// }

export async function getTasks() {
  let url = `${BASE_URL}/v1/tasks/?sort_by=id&sort_direction=descending&page=1&limit=10&tw_emp_id=203`;
  console.log('url: ', url);
  try {
    const response = await api.get(`${BASE_URL}/v1/tasks/?sort_by=id&sort_direction=descending&page=1&limit=10&tw_emp_id=203`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer gBujppYVDDkUBbUSTdfu78QZEmLJEk'
      },
      withCredentials: true,  // Add this line if required
    });
    console.log('response: ', response);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks ===>>> :', error);
    throw error;
  }
}


export async function logTime(taskId, totalSeconds) {
  try {
    const response = await api.post(`/tasks/${taskId}/time`, {
      seconds: totalSeconds,
      description: 'Time logged via desktop app',
    });
    return response.data;
  } catch (error) {
    console.error('Error logging time:', error);
  }
}

export async function getDirectMessages(userId) {
  try {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching direct messages:', error);
    return [];
  }
}

export async function sendDirectMessage(receiverId, content) {
  try {
    const response = await api.post('/messages', {
      receiverId,
      content,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending direct message:', error);
  }
}

export async function getDailyTimeLog(date) {
  try {
    const response = await api.get(`/time-logs/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching daily time log:', error);
    return {};
  }
}

export async function updateDailyTimeLog(date, taskId, time) {
  try {
    const response = await api.post(`/time-logs/${date}`, { taskId, time });
    return response.data;
  } catch (error) {
    console.error('Error updating daily time log:', error);
  }
}

export async function getDailyTasks() {
  try {
    // const response = await api.get('/tasks/daily');
    const response = await api.get('/v1/tasks/?sort_by=id&sort_direction=descending&page=1&limit=10&tw_emp_id=203');
    console.log('response: ', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching daily tasks:', error);
    return [];
  }
}

export async function getAllProjects() {
  try {
    // const response = await api.get('/tasks/daily');
    const response = await api.get('/v1/project-dropdown-list/?sort_by=name&status=active&type=all');
    console.log('response: ', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching all projects:', error);
    return [];
  }
}

export async function updateTaskProgress(taskId, progress) {
  const taskPayload = [{id: taskId, progress: progress}]
  try {
    const response = await api.put(`/v1/progress-tasks/`, { "data":taskPayload });
    return response.data;
  } catch (error) {
    console.error('Error updating task progress:', error);
  }
}

export async function logTaskTime(taskId, time, projectId, start_date, due_date, task_progress, estimated_time, priority, diffsMinutes, name, tw_id, userid, startDate) {
  console.log('estimated_time: ', estimated_time);
  const is_completed = 2;
  const isOverDue = false;
  const [hours, minutes] = estimated_time.split(':').map(Number);

  // Calculate the total minutes
  const totalMinutes = hours * 60 + minutes;
  
  console.log('Total Minutes:', totalMinutes);

  const formatDate = (startDate) => {
    const date = new Date(startDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const formattedDate = formatDate('2025-01-06T04:51:56.316000Z');
  console.log(formattedDate);
  const task_data = 
    {
      "task": taskId,
      "user": 12,
      "date": formattedDate,
      "start_time": start_date,
      "end_time": due_date,
      "duration_minutes": totalMinutes,
      "description": "Completed the initial setup for the project.",
      "status": 2
    }

  console.log('pausedTimePayload: ', task_data);
  try {
    // const response = await api.post(`/v1/progress-tasks/`, { "data": pausedTimePayload });
    const response = await api.put(`https://stage-portalsapi.starkdigital.in/api/v1/task-time-entries/${userid}/`, task_data );
    console.log('logTaskTime response: ', response);
    return response.data;
  } catch (error) {
    console.error('Error logging task time:', error);
  }
}


export async function startTaskTime(taskId, time, start_date, description) {
  console.log('taskId, time, start_date, description: ', taskId, time, start_date, description);
  const is_completed = 2;
  const isOverDue = false;
  const formatDate = (start_date) => {
    const date = new Date(start_date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const formattedDate = formatDate('2025-01-06T04:51:56.316000Z');
  console.log(formattedDate);
  const task_data = 
    {
      "task": taskId,
      "user": 12,
      "date": formattedDate,
      "start_time": time,
      "end_time": time,
      "duration_minutes": 0,
      "description": description,
      "status": 1
    }

  console.log('pausedTimePayload: ', task_data);
  try {
    // const response = await api.post(`/v1/progress-tasks/`, { "data": pausedTimePayload });
    const response = await api.post(`https://stage-portalsapi.starkdigital.in/api/v1/task-time-entries/`, task_data);
    console.log('startTaskTime response: ', response);
    return response;
  } catch (error) {
    console.error('Error logging task time:', error);
  }
}


