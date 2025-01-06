import React from 'react';

import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <>
      <ul>
        <li>
          <a href="/DailyTasks">Daily Tasks</a>
        </li>
        <li>
          <a href="/Projects">Projects Tasks</a>
        </li>
        <li>
          <a href="/Activity">Activity Tasks</a>
        </li>
      </ul>
      <Outlet />
    </>
  );
};
