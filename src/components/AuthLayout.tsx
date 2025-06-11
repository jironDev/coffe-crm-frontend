// src/components/AuthLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

const AuthLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="container py-4">
        <Outlet />
      </div>
    </>
  );
};

export default AuthLayout;
