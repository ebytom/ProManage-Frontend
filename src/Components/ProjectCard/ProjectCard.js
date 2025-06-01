import React, { useContext, useRef, useState } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Progress } from "antd";
import ProjectDetailsModal from "../ProjectDetailsModal/ProjectDetailsModal";
import { PeopleIcon } from "@primer/octicons-react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const [loading, setLoading] = useState(false);
  const projectModalRef = useRef();
  const nav = useNavigate();

  const { user } = useContext(UserContext);

  const callProjectModal = () => {
    if (projectModalRef.current) {
      projectModalRef.current.showLoading();
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
            width: "120px",
            height: "120px",
            backgroundColor: "#f0f0f0",
            flexShrink: 0,
          }}
          onClick={callProjectModal}
        >
          <img
            src={`../../assets/img/task.png`}
            alt="product"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div
          className="p-2 w-100 h-100 d-flex flex-column justify-content-between"
          onClick={() => {
            nav(`/project/${project.id}`, {
              state: {
                projectName: project.name,
              },
            });
          }}
        >
          <div className="d-flex justify-content-between">
            <div style={{ textAlign: "left" }}>
              <h6 className="fw-bold m-0 p-0">{project.name}</h6>
              <span className="p-0 b-0 text-secondary" style={{ fontSize: 11 }}>
                Ends on{" "}
                {
                  project.endDate
                  // .split("T")[0]
                  // .split("-")
                  // .reverse()
                  // .join("/")
                }
              </span>
              {user?.role == 1 && (
                <>
                  <br />
                  <span
                    className="p-0 b-0 text-secondary m-0"
                    style={{ fontSize: 11 }}
                  >
                    Created by {project?.createdBy?.email}
                  </span>
                </>
              )}
            </div>
            {user.email !== project.createdBy?.email && (
              <div>
                <PeopleIcon />
              </div>
            )}
          </div>
          <div className="w-100" style={{ textAlign: "left" }}>
            <span style={{ fontSize: 12, fontWeight: "bold" }}>
              {project?.totalTasks == project?.completedTasks &&
              project?.totalTasks > 0
                ? "✔️ Completed"
                : `${
                    project?.totalTasks - project?.completedTasks
                  } tasks pending`}
            </span>
            <Progress
              percent={(project?.completedTasks / project?.totalTasks) * 100}
              status={project.daysLeft === 0 ? "exception" : "active"}
              format={project.daysLeft === 0 ? "" : () => ""}
              strokeColor={project.daysLeft === 0 ? "red" : "#00348a"}
            />
          </div>
        </div>
      </div>
      <ProjectDetailsModal ref={projectModalRef} projectDetails={project} />
    </>
  );
};

export default ProjectCard;
