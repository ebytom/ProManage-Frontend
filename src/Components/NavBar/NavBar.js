import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Divider, Space } from "antd";
import { MenuFoldOutlined } from "@ant-design/icons";
import {
  CalendarIcon,
  PersonAddIcon,
  PersonIcon,
  TasklistIcon,
} from "@primer/octicons-react";
import ProfileDrawer from "../ProfileDrawer/ProfileDrawer";
import NotificationDrawer from "../NotificationDrawer/NotificationDrawer";
import { useLocation, useNavigate } from "react-router-dom";
import { Axios } from "../../Config/Axios/Axios";
import { UserContext } from "../../App";

const NavBar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [summary, setSummary] = useState({});

  const loc = useLocation();

  const nav = useNavigate();

  const showNavDrawer = () => {
    setNavOpen(true);
  };

  const { user } = useContext(UserContext);

  const token = localStorage.getItem("token");

  const showProfileDrawer = () => {
    setProfileOpen(true);
  };

  useEffect(() => {
    Axios.get(`/api/users/${user?.id}/summary`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setSummary(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user summary:", err);
      });
  }, []);

  return (
    <>
      <div className="mb-4 bg-primary rounded-4 shadow-sm">
        <Space className="p-3 pb-0 w-100 rounded-3 d-flex justify-content-between align-items-center">
          <div>
            <TasklistIcon size={34} fill={"white"} />
            <b
              className="fw-800 fs-2 ms-2"
              style={{ color: "#fff" }}
              onClick={() => nav("/dashboard")}
            >
              Promanage
            </b>
          </div>
          <div className="d-flex align-items-center gap-4">
            {user?.role === 1 && (
              <Button
                type="dark"
                className="p-2"
                style={{
                  border: "1px solid #fff",
                  borderRadius: "160px",
                  height: "40px",
                  width: "40px",
                }}
                onClick={() => nav("/adminPortal")}
              >
                <PersonAddIcon
                  style={{ color: "#fff", fontSize: 18 }}
                  size={16}
                />
              </Button>
            )}
            <Button
              type="dark"
              className="p-2"
              style={{
                border: "1px solid #fff",
                borderRadius: "160px",
                height: "40px",
                width: "40px",
              }}
              onClick={() => nav("/calendar")}
            >
              <CalendarIcon style={{ color: "#fff", fontSize: 18 }} />
            </Button>
            <Button
              type="dark"
              className="p-2"
              style={{
                border: "1px solid #fff",
                borderRadius: "160px",
                height: "40px",
                width: "40px",
              }}
              onClick={showNavDrawer}
            >
              <MenuFoldOutlined style={{ color: "#fff", fontSize: 18 }} />
            </Button>
            <Button
              type="dark"
              className="p-2"
              style={{
                border: "1px solid #fff",
                borderRadius: "160px",
                height: "40px",
                width: "40px",
              }}
              onClick={showProfileDrawer}
            >
              <PersonIcon fill={"#fff"} size={24} />
            </Button>
          </div>
        </Space>

        <NotificationDrawer navOpen={navOpen} setNavOpen={setNavOpen} />
        <ProfileDrawer
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
        />
        <Divider
          style={{
            borderColor: "#ddd",
          }}
        ></Divider>
      </div>
      {loc.pathname === "/" ||
        (loc.pathname === "/dashboard" && !(user?.role === 5 && !user?.isManager) && (
          <div className="d-flex gap-4 mb-5 px-3" style={{ color: "#002f72" }}>
            <div className="bg-primary-subtle d-flex flex-column p-3 rounded-4 shadow-sm w-100">
              <b style={{ fontSize: "16px" }}>Total Projects</b>
              <hr className="m-0" style={{ color: "#fff" }} />
              <b style={{ fontSize: 55 }}>{summary?.totalProjects}</b>
            </div>
            <div className="bg-primary-subtle d-flex flex-column p-3 rounded-4 shadow-sm w-100">
              <b>Total Milestones</b>
              <hr className="m-0" style={{ color: "#fff" }} />
              <b style={{ fontSize: 55 }}>{summary?.totalMilestones}</b>
            </div>
            <div className="bg-primary-subtle d-flex flex-column p-3 rounded-4 shadow-sm w-100">
              <b>Total Tasks</b>
              <hr className="m-0" style={{ color: "#fff" }} />
              <b style={{ fontSize: 55 }}>{summary?.totalTasks}</b>
            </div>
            <div className="bg-primary-subtle d-flex flex-column p-3 rounded-4 shadow-sm w-100">
              <b>Total Tasks Completed</b>
              <hr className="m-0" style={{ color: "#fff" }} />
              <b style={{ fontSize: 55 }}>{summary?.completedTasks}</b>
            </div>
          </div>
        ))}
    </>
  );
};

export default NavBar;
