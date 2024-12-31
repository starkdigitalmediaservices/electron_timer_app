// Function to handle the API call for Daily Task
async function fetchDailyTaskData() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer GEw9vgFGZZdUDHCCeau9gVWMHwdhHj");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://portalsapi.starkdigital.in/api/v1/tasks/?sort_by=id&sort_direction=descending&page=1&limit=10&tw_emp_id=203",
      requestOptions
    );
    const data = await response.json();
    console.log("fetchDailyTaskData :", data); // Log the response from the API

    // Call function to display tasks
    displayTasks(data.data); // Pass the 'data' array to displayTasks function
  } catch (error) {
    console.error("Error calling the API:", error);
    document.getElementById("message").textContent = "Error fetching data";
  }
}

async function fetchProjectsData() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer GEw9vgFGZZdUDHCCeau9gVWMHwdhHj");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://portalsapi.starkdigital.in/api/v1/projects/?sort_by=name&sort_direction=ascending&page=1&limit=10&status=active",
      requestOptions
    );
    const data = await response.json();
    console.log("fetchProjectsData :", data); // Log the response from the API

    // Call function to display tasks
    displayProjects(data.data);  // Pass the 'data' array to displayTasks function
  } catch (error) {
    console.error("Error calling the API:", error);
    document.getElementById("message").textContent = "Error fetching data";
  }
}

// Function to display tasks
function displayTasks(tasks) {
    // Clear previous content
    const taskListContainer = document.getElementById("task-list");
    taskListContainer.innerHTML = "";
  
    if (tasks.length === 0) {
      taskListContainer.innerHTML = "<p>No tasks available</p>";
      return;
    }
  
    // Loop through each task and create HTML elements
    tasks.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.className = "task-item";
  
      const taskName = document.createElement("h3");
      taskName.textContent = `Task: ${task.project_name} - ${task.type_name}`;
  
      const taskDetails = document.createElement("p");
      taskDetails.innerHTML = `
          <strong>Responsible:</strong> ${task.responsible}<br>
          <strong>Start Time:</strong> ${task.start_time}<br>
          <strong>End Time:</strong> ${task.end_time}<br>
          <strong>Estimation:</strong> ${task.estimation}<br>
          <strong>Status:</strong> ${task.status}<br>
          <strong>Task Description:</strong> ${task.content}
        `;
  
      // Create Timer Display
      const timerDisplay = document.createElement("p");
      timerDisplay.id = `timer-${task.id}`;
      timerDisplay.textContent = "Timer: 00:00:00";
  
      // Timer Buttons
      const startButton = document.createElement("button");
      startButton.textContent = "Start Timer";
      startButton.addEventListener("click", () => startTimer(task.id));
  
      const pauseButton = document.createElement("button");
      pauseButton.textContent = "Pause Timer";
      pauseButton.addEventListener("click", () => pauseTimer(task.id));
  
      const stopButton = document.createElement("button");
      stopButton.textContent = "Stop Timer";
      stopButton.addEventListener("click", () => stopTimer(task.id));
  
      // Append buttons and timer display
      taskElement.appendChild(taskName);
      taskElement.appendChild(taskDetails);
      taskElement.appendChild(timerDisplay);
      taskElement.appendChild(startButton);
      taskElement.appendChild(pauseButton);
      taskElement.appendChild(stopButton);
  
      taskListContainer.appendChild(taskElement);
    });
  }
  
  // Timer State
//   const timers = {};
  
//   // Function to Start Timer
//   function startTimer(taskId) {
//     if (!timers[taskId]) {
//       timers[taskId] = { interval: null, elapsedTime: 0 };
//     }
  
//     if (!timers[taskId].interval) {
//       timers[taskId].interval = setInterval(() => {
//         timers[taskId].elapsedTime++;
//         updateTimerDisplay(taskId);
//       }, 1000);
//     }
//   }
  
//   // Function to Pause Timer
//   function pauseTimer(taskId) {
//     if (timers[taskId] && timers[taskId].interval) {
//       clearInterval(timers[taskId].interval);
//       timers[taskId].interval = null;
//     }
//   }
  
//   // Function to Stop Timer
//   function stopTimer(taskId) {
//     if (timers[taskId]) {
//       clearInterval(timers[taskId].interval);
//       timers[taskId].interval = null;
//       timers[taskId].elapsedTime = 0;
//       updateTimerDisplay(taskId); // Reset timer display
//     }
//   }
  
//   // Function to Update Timer Display
//   function updateTimerDisplay(taskId) {
//     const timerDisplay = document.getElementById(`timer-${taskId}`);
//     if (timerDisplay) {
//       const seconds = timers[taskId].elapsedTime % 60;
//       const minutes = Math.floor(timers[taskId].elapsedTime / 60) % 60;
//       const hours = Math.floor(timers[taskId].elapsedTime / 3600);
//       timerDisplay.textContent = `Timer: ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
//     }
//   }

// Timer State
const timers = {};
let runningTimerTaskId = null; // Keep track of the currently running timer

// Function to Start Timer
function startTimer(taskId) {
  if (runningTimerTaskId !== null && runningTimerTaskId !== taskId) {
    // Show popup if another timer is already running
    alert("Only one timer should be running at a time. Stop the current timer first.");
    return;
  }

  if (!timers[taskId]) {
    timers[taskId] = { interval: null, elapsedTime: 0 };
  }

  if (!timers[taskId].interval) {
    runningTimerTaskId = taskId; // Mark this task as the running timer
    timers[taskId].interval = setInterval(() => {
      timers[taskId].elapsedTime++;
      updateTimerDisplay(taskId);
    }, 1000);
  }
}

// Function to Pause Timer
function pauseTimer(taskId) {
  if (timers[taskId] && timers[taskId].interval) {
    clearInterval(timers[taskId].interval);
    timers[taskId].interval = null;
    runningTimerTaskId = null; // No timer is running now
  }
}

// Function to Stop Timer
function stopTimer(taskId) {
  if (timers[taskId]) {
    clearInterval(timers[taskId].interval);
    timers[taskId].interval = null;
    timers[taskId].elapsedTime = 0;
    updateTimerDisplay(taskId); // Reset timer display
    if (runningTimerTaskId === taskId) {
      runningTimerTaskId = null; // Clear the running timer ID
    }
  }
}

// Function to Update Timer Display
function updateTimerDisplay(taskId) {
  const timerDisplay = document.getElementById(`timer-${taskId}`);
  if (timerDisplay) {
    const seconds = timers[taskId].elapsedTime % 60;
    const minutes = Math.floor(timers[taskId].elapsedTime / 60) % 60;
    const hours = Math.floor(timers[taskId].elapsedTime / 3600);
    timerDisplay.textContent = `Timer: ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
}

// Function to display projects
function displayProjects(projects) {
    // Clear previous content
    const taskListContainer = document.getElementById("task-list");
    taskListContainer.innerHTML = "";
  
    if (projects.length === 0) {
      taskListContainer.innerHTML = "<p>No projects available</p>";
      return;
    }
  
    // Loop through each project and create HTML elements
    projects.forEach((project) => {
      const projectElement = document.createElement("div");
      projectElement.className = "project-item";
  
      const projectName = document.createElement("h3");
      projectName.textContent = `Project Name: ${project.name}`;
  
      const projectStatus = document.createElement("p");
      projectStatus.innerHTML = `<strong>Status:</strong> ${project.status}`;
  
      projectElement.appendChild(projectName);
      projectElement.appendChild(projectStatus);
  
      taskListContainer.appendChild(projectElement);
    });
  }
  

// Function to create the Home UI with buttons
function createHomeUI() {
  console.log("Creating Home UI...");

  // Create container for buttons
  const container = document.createElement("div");
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-around";

  // Create buttons
  const dailyTaskButton = document.createElement("button");
  dailyTaskButton.textContent = "Daily Task";
  dailyTaskButton.addEventListener("click", fetchDailyTaskData); // Call fetchDailyTaskData on click

  const projectsButton = document.createElement("button");
  projectsButton.textContent = "Projects";
  projectsButton.addEventListener("click", fetchProjectsData); // Call fetchProjectsData on click

  const activityButton = document.createElement("button");
  activityButton.textContent = "Activity";

//   const statusButton = document.createElement("button");
//   statusButton.textContent = "Status";

  // Append buttons to container
  buttonContainer.appendChild(dailyTaskButton);
  buttonContainer.appendChild(projectsButton);
  buttonContainer.appendChild(activityButton);

  // Append button container to the main container
  container.appendChild(buttonContainer);

  // Create container for task list
  const taskListContainer = document.createElement("div");
  taskListContainer.id = "task-list"; // The container to hold the task list

  // Append task list container to the main container
  container.appendChild(taskListContainer);

  // Append the main container to the body
  document.body.appendChild(container);

  console.log("Home UI created successfully.");
}

// Call the function to create the UI
createHomeUI();
