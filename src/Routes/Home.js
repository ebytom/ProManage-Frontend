import React, { useContext } from "react";
import { Navigate, Route, Routes as Switch } from "react-router-dom";
import { UserContext } from "../App";
import Dashboard from "../Pages/Dashboard/Dashboard";
import NavBar from "../Components/NavBar/NavBar";
import Project from "../Pages/Project/Project";
import Task from "../Pages/Task/Task";
import Calendar from "../Pages/Calendar/Calender";
import AdminPortal from "../Pages/AdminPortal/AdminPortal";
import { useToast } from "../Components/ToastContext/ToastContext";
import { Button } from "antd";

const Home = () => {
  const { user } = useContext(UserContext);
  const toastMessage = useToast();

  const NeedApproval = () => (
    <div
      className="fs-bold w-100 d-flex justify-content-center flex-column justify-content-center align-items-center"
      onClick={() => toastMessage("success", "Request raised successfully!")}
    >
      <h3 style={{ padding: "1rem" }}>Need Approval 🥹</h3>
      <Button>Raise Request</Button>
    </div>
  );

  const showRoutes = () => {
    // For role 5 users who are not managers, show "Need Approval"
    if (user?.role === 5 && !user?.isManager) {
      return <Route path="*" element={<NeedApproval />} />;
    }

    return (
      <>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/*" element={<Project />} />
        {user?.role === 1 && (
          <Route path="/adminPortal" element={<AdminPortal />} />
        )}
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/task/*" element={<Task />} />
        <Route path="/*" element={<Navigate to="/dashboard" replace />} />
      </>
    );
  };

  return (
    <div style={{ height: "100vh", width: "100vw", padding: 16 }}>
      <NavBar />
      <Switch>{showRoutes()}</Switch>
    </div>
  );
};

export default Home;
