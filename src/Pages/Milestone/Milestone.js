import { ArrowRightIcon, PlusIcon } from "@primer/octicons-react";
import { Button, message, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import MilestoneComp from "../../Components/Milestone/Milestone";
import WarrantyCard from "../../Components/ProjectCard/ProjectCard";
import { Axios } from "../../Config/Axios/Axios";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../App";

const Milestone = ({ tasks }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loader, setLoader] = useState(true);
  const [milestones, setMilestones] = useState([]);
  const [isError, setIsError] = useState(false);

  const token = localStorage.getItem("token");
  const loc = useLocation();
  const state = loc.state;

  const {user} = useContext(UserContext);


  useEffect(() => {
    setLoader(true);

    Axios.get(`/api/milestones/project/${loc.pathname.split("/")[2]}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setMilestones(res.data || []);

        setLoader(false);
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
        setLoader(false);
      });
  }, []);

  const downloadReport = () => {
    Axios.get(`/api/report/download`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        projectId: loc.pathname.split("/")[2],
        type: "yearly",
      },
      responseType: "blob",
    })
      .then((res) => {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Project_Report_${state?.projectName}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        messageApi.open({
          type: "success",
          content: "Report downloaded successfully!",
        });
      })
      .catch((err) => {
        console.error("Error downloading report:", err);
        messageApi.open({
          type: "error",
          content: "Failed to download report. Please try again later.",
        });
      });
  };

  const emailReport = () => {
  Axios.get(`/api/report/send`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    params: {
      projectId: loc.pathname.split("/")[2],
      type: "yearly",
      email: user?.email,
      // email: "ebytomy7@gmail.com",
    },
  })
    .then((res) => {
      console.log(res); // Logs backend response
      messageApi.open({
        type: "success",
        content: `Report emailed to ${user.email} successfully!`,
      });
    })
    .catch((err) => {
      console.error("Error emailing report:", err);
      messageApi.open({
        type: "error",
        content: "❌ Failed to email report. Please try again later.",
      });
    });
};


  return (
    <div>
      {contextHolder}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <h2 className="text-black" style={{ fontWeight: 700 }}>
            Tasks
          </h2>{" "}
          <ArrowRightIcon size={32} />
          <b className="ms-2" style={{ fontSize: 16 }}>
            {state?.projectName}
          </b>
        </div>
        {milestones.length ? (
          <div className="d-flex align-items-center gap-3">
            <Button style={{ background: "#98c2ff" }} onClick={downloadReport}>
              <b>Download Report</b>
            </Button>
            <Button style={{ background: "#98c2ff" }} onClick={emailReport}>
              <b>Email Report</b>
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>
      {loader ? (
        <div className="w-100 my-5 d-flex align-items-center justify-content-center">
          <b className="me-3" style={{ color: "#000" }}>
            Loading
          </b>
          <Spin size="large" />
        </div>
      ) : milestones.length ? (
        <div>
          {milestones.map((milestone, index) => (
            <MilestoneComp milestone={milestone} index={index} key={index} />
          ))}
        </div>
      ) : (
        <b className="fs-5 ms-4" style={{ color: "#d3d3d3" }}>
          No Milestones added yet!
        </b>
      )}
    </div>
  );
};

export default Milestone;
