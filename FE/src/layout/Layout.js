import React from 'react';
import TopMenu from './TopMenu';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <TopMenu />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

