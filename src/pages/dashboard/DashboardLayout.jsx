import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import BottomNav from "../../components/dashboard/BottomNav";
import NotificationBridge from "../../components/dashboard/NotificationBridge";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <NotificationBridge />

      {/* Sidebar for desktop/tablet */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* Bottom navigation for mobile */}
      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
