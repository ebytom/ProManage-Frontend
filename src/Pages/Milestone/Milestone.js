import { ArrowRightIcon, PlusIcon } from "@primer/octicons-react";
import { Button, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import MilestoneComp from "../../Components/Milestone/Milestone";
import WarrantyCard from "../../Components/ProjectCard/ProjectCard";
import { Axios } from "../../Config/Axios/Axios";
import { useLocation } from "react-router-dom";

const Milestone = ({ tasks }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loader, setLoader] = useState(true);
  const [milestones, setMilestones] = useState([]);
  const [isError, setIsError] = useState(false);

  const token = localStorage.getItem("token");
  const loc = useLocation();
  const state = loc.state;

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
            <Button style={{ background: "#98c2ff" }}>
              <b>Download Report</b>
            </Button>
            <Button style={{ background: "#98c2ff" }}>
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
          No Tasks added yet!
        </b>
      )}
    </div>
  );
};

export default Milestone;
