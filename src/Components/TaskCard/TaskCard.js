import React, { useContext, useRef, useState } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Progress, Steps } from "antd";
import ProjectDetailsModal from "../ProjectDetailsModal/ProjectDetailsModal";
import { PeopleIcon, SparkleFillIcon, TasklistIcon } from "@primer/octicons-react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import TaskModal from "../TaskModal/TaskModal";

const TaskCard = ({ task }) => {
  const [loading, setLoading] = useState(false);
  const taskModalRef = useRef();
  const nav = useNavigate();

  const { user } = useContext(UserContext);

  const callProjectModal = () => {
    if (taskModalRef.current) {
      taskModalRef.current.showLoading();
    }
  };
  

  return (
    <>
      <div
        className="warranty-card p-2 rounded-4 d-flex gap-3 align-items-center"
        style={{
          maxWidth: "100%",
          boxShadow: "rgb(180, 180, 180) 2px 2px 10px 0px",
          cursor: "pointer",
        }}
      >
        <div
          className="bg-white rounded-4 p-4 d-flex align-items-center justify-content-center"
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#f0f0f0",
            flexShrink: 0,
          }}
          
        >
          {/* <img
            src={`../../assets/img/task.png`}
            alt="product"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          /> */}
          <TasklistIcon size={42} />
        </div>
        <div
          className="p-2 w-100 h-100 d-flex flex-column justify-content-between"
          onClick={callProjectModal}
        //   onClick={() => {
        //     nav(`/project/${task.id}`, {
        //       state: {
        //         projectName: task.name,
        //       },
        //     });
        //   }}
        >
          <div className="d-flex justify-content-between">
            <div style={{ textAlign: "left" }}>
              <h6 className="fw-bold m-0 p-0">{task.title}</h6>
              <span className="p-0 b-0 text-secondary" style={{ fontSize: 11 }}>
                Due on{" "}
                {
                  task?.endDate?.split("T")[0]
                  // .split("T")[0]
                  // .split("-")
                  // .reverse()
                  // .join("/")
                }
              </span>
            </div>
            {task?.priority === "high" && (
              <div>
                <SparkleFillIcon  />
              </div>
            )}
          </div>
          <div className="w-100" style={{ textAlign: "left" }}>
            {/* <span style={{ fontSize: 12, fontWeight: "bold" }}>
              {task.daysLeft === 0
                ? "Warranty expired"
                : `${task?.totalTasks - task?.completedTasks} tasks pending`}
            </span> */}
            {/* <Progress
              percent={(task?.completedTasks / task?.totalTasks) * 100}
              status={task.daysLeft === 0 ? "exception" : "active"}
              format={task.daysLeft === 0 ? "" : () => ""}
              strokeColor={task.daysLeft === 0 ? "red" : "#00348a"}
            /> */}
            <Steps
              current={task?.status}
              className="mt-1 d-flex justify-content-between align-items-center"
              size="small"
              items={[
                {
                  title: <p style={{ fontSize: "10px", margin: 0 }}>Open</p>,
                },
                {
                  title: <p style={{ fontSize: "10px", margin: 0  }}>In progress</p>,
                },
                {
                  title: <p style={{ fontSize: "10px", margin: 0  }}>Completed</p>,
                },
              ]}
            />
          </div>
        </div>
      </div>
      <TaskModal ref={taskModalRef} taskDetails={task} />
    </>
  );
};

export default TaskCard;
