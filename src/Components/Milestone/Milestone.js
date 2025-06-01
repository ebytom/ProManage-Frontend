import { PlusIcon } from "@primer/octicons-react";
import { Button, Steps } from "antd";
import React, { useEffect, useRef, useState } from "react";
import WarrantyCard from "../../Components/ProjectCard/ProjectCard";
import { Axios } from "../../Config/Axios/Axios";
import { useLocation } from "react-router-dom";
import MilestoneModal from "../MilestoneModal/MilestoneModal";
import TaskModal from "../TaskModal/TaskModal";
import TaskCard from "../TaskCard/TaskCard";

const Milestone = ({ milestone, index }) => {
  const [loader, setLoader] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [isError, setIsError] = useState(false);
  const [taskCount, setTaskCount] = useState({ total: 0, completed: 0 });

  const token = localStorage.getItem("token");
  const taskModalRef = useRef();
  const [status, setStatus] = useState(0);
  const loc = useLocation();

  useEffect(() => {
    setLoader(true);

    Axios.get(`/api/tasks/milestone/${milestone?.id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {

        setTasks(res.data.tasks || []);
        setTaskCount({
          total: res.data.totalTasks || 0,
          completed: res.data.completedTasks || 0,
        });

        if (
          res.data.totalTasks === res.data.completedTasks &&
          res.data.totalTasks > 0
        ) {
          setStatus(3);
        } else if (res.data?.completedTasks > 0) {
          setStatus(2);
        }else if( res.data?.totalTasks > 0) {
            setStatus(1);
        }

        setLoader(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoader(false);
      });
  }, []);

  const callTaskModal = () => {
    if (taskModalRef.current) {
      taskModalRef.current.showLoading();
    }
  };

  return (
    <div className="w-100 mb-4" key={index}>
      <div
        className="px-3 d-flex justify-content-between align-items-center"
        style={{
          background: "#0562ff7d",
          borderTopRightRadius: "12px",
          borderTopLeftRadius: "12px",
        }}
      >
        <b style={{ width: "125px" }}>{milestone?.name || "Milestone"}</b>
        <Steps
          current={status}
          className="px-5 mt-3 me-5 d-flex justify-content-between align-items-center"
          size="small"
          items={[
            {
              title: <p style={{ fontSize: "12px" }}>Open</p>,
            },
            {
              title: <p style={{ fontSize: "12px" }}>In progress</p>,
            },
            {
              title: <p style={{ fontSize: "12px" }}>Completed</p>,
            },
          ]}
        />
        <Button
          className="d-flex align-items-center my-3"
          style={{ background: "#00348a", height: "48px" }}
          onClick={callTaskModal}
        >
          <PlusIcon fill="white" />
          <span className="text-white">Add Task</span>
        </Button>
      </div>
      <div
        className="p-4 w-100"
        style={{
          background: "#75a8ff29",
          borderBottomRightRadius: "12px",
          borderBottomLeftRadius: "12px",
        }}
      >
        {tasks?.length === 0 ? (
          <b className="fs-5 ms-4" style={{ color: "#cddbf1" }}>
            No Tasks added yet!
          </b>
        ) : (
          <div className="warranty-card-list">
            {tasks?.map((task, idx) => (
              <TaskCard
                task={task}
                key={idx}
                //   toastMessage={toastMessage}
              />
            ))}
          </div>
        )}
      </div>
      <TaskModal milestone={milestone} ref={taskModalRef} />
    </div>
  );
};

export default Milestone;
