import React, { useContext, useRef, useState } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Progress } from "antd";
import WarrantyDetailsModal from "../WarrantyDetailsModal/WarrantyDetailsModal";
import { PeopleIcon } from "@primer/octicons-react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

const WarrantyCard = ({ warranty }) => {
  const [loading, setLoading] = useState(false);
  const warrantyDetailsModalRef = useRef();
  const nav = useNavigate()

  const { user } = useContext(UserContext);

  const callWarrantyDetailsModal = () => {
    if (warrantyDetailsModalRef.current) {
      warrantyDetailsModalRef.current.showLoading();
    }
  };

  return (
    <>
      <div
        className="warranty-card p-2 rounded-4 d-flex gap-3 align-items-center"
        style={{
          maxWidth: "100%",
          boxShadow: "#b4b4b4 4px 5px 15px 2px",
          cursor: "pointer",
        }}
        onClick={() => {
          const path = warranty.taskId
            ? `/project/${warranty._id}/task/${warranty.taskId}`
            : `/project/${warranty._id}`;
          nav(path);
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
        <div className="p-2 w-100 h-100 d-flex flex-column justify-content-between">
          <div className="d-flex justify-content-between">
            <div style={{ textAlign: "left" }}>
              <h6 className="fw-bold m-0 p-0">{warranty.itemName}</h6>
              <span className="p-0 b-0 text-secondary" style={{ fontSize: 11 }}>
                Expires on{" "}
                {warranty.expiresOn
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")}
              </span>
            </div>
            {user.userId != warranty.addedBy && (
              <div>
                <PeopleIcon />
              </div>
            )}
          </div>
          <div className="w-100" style={{ textAlign: "left" }}>
            <span style={{ fontSize: 12, fontWeight: "bold" }}>
              {warranty.daysLeft === 0
                ? "Warranty expired"
                : `Expires in ${warranty.daysLeft} days`}
            </span>
            <Progress
              percent={warranty.percentage}
              status={warranty.daysLeft === 0 ? "exception" : "active"}
              format={warranty.daysLeft === 0 ? "" : () => ""}
              strokeColor={warranty.daysLeft === 0 ? "red" : "#00348a"}
            />
          </div>
        </div>
      </div>
      <WarrantyDetailsModal
        ref={warrantyDetailsModalRef}
        warrantyDetails={warranty}
      />
    </>
  );
};

export default WarrantyCard;
