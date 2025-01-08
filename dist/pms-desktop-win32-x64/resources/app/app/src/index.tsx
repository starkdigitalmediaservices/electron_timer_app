// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// // import App from './App.tsx';
// import {BrowserRouter, Routes, Route} from 'react-router-dom';
// import reportWebVitals from './reportWebVitals.ts';
// import { Layout } from './components/Layout.tsx';
// import { DailyTasks } from './pages/DailyTasks.tsx';
// import { Projects } from './pages/Projects.tsx';
// import { Activity } from './pages/Activity.tsx';

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     {/* <App /> */}
//     <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<Layout />}>
      
//       <Route path="DailyTasks" element={<DailyTasks />} />
//       <Route path="Projects" element={<Projects />} />
//       <Route path="Activity" element={<Activity />} />

//       </Route>
//     </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import reportWebVitals from './reportWebVitals.ts';
import { Layout } from './components/Layout.tsx';
import { DailyTasks } from './pages/DailyTasks.tsx';
import { Projects } from './pages/Projects.tsx';
import { Activity } from './pages/Activity.tsx';
import { Login } from './pages/Login.tsx';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" />;
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="DailyTasks" element={<DailyTasks />} />
          <Route path="Projects" element={<Projects />} />
          <Route path="Activity" element={<Activity />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

