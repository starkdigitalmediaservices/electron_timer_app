// import React from 'react';

// import { Outlet } from 'react-router-dom';

// export const Layout: React.FC = () => {
//   return (
//     <>
//       <ul>
//         <li>
//           <a href="/DailyTasks">Daily Tasks</a>
//         </li>
//         <li>
//           <a href="/Projects">Projects Tasks</a>
//         </li>
//         <li>
//           <a href="/Activity">Activity Tasks</a>
//         </li>
//       </ul>
//       <Outlet />
//     </>
//   );
// };


// components/Layout.tsx
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the login status from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    // Redirect to the login page
    navigate('/');
  };

  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/DailyTasks">Daily Tasks</Link>
            </li>
            <li>
              <Link to="/Projects">Projects</Link>
            </li>
            <li>
              <Link to="/Activity">Activity</Link>
            </li>
          </ul>
        </nav>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
