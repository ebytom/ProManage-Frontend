import React, { useState } from "react";
import Filters from "../../Components/Filters/Filters";
import { Button, message, Spin } from "antd";
import WarrantyCard from "../../Components/WarrantyCard/WarrantyCard";
import { PlusIcon } from "@primer/octicons-react";
import Milestone from "../../Components/Milestone/Milestone";

const Project = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [contentLoader, setContentLoader] = useState(false);
  const [tasks, setTasks] = useState([
    {
      _id: "6735dd0b3daac747ae47451b",
      itemName: "TV",
      category: "Electronics",
      warrantyProvider: "LG",
      purchasedOn: "2024-11-01T00:00:00.000+00:00",
      expiresOn: "2024-12-06T00:00:00.000+00:00",
      createdAt: "2024-11-14T11:20:40.362+00:00",
      description: "LG TV",
      addedBy: "109192869135249328078",
      invoiceURL:
        "https://warranty-wallet.s3.eu-north-1.amazonaws.com/1731583240362-Data…",
      sharedWith: Array(null),
    },
    {
      _id: "6735dd0b3daac747ae47451b",
      itemName: "TV",
      category: "Electronics",
      warrantyProvider: "LG",
      purchasedOn: "2024-11-01T00:00:00.000+00:00",
      expiresOn: "2024-12-06T00:00:00.000+00:00",
      createdAt: "2024-11-14T11:20:40.362+00:00",
      description: "LG TV",
      addedBy: "109192869135249328078",
      invoiceURL:
        "https://warranty-wallet.s3.eu-north-1.amazonaws.com/1731583240362-Data…",
      sharedWith: Array(null),
    },
    {
      _id: "6735dd0b3daac747ae47451b",
      itemName: "TV",
      category: "Electronics",
      warrantyProvider: "LG",
      purchasedOn: "2024-11-01T00:00:00.000+00:00",
      expiresOn: "2024-12-06T00:00:00.000+00:00",
      createdAt: "2024-11-14T11:20:40.362+00:00",
      description: "LG TV",
      addedBy: "109192869135249328078",
      invoiceURL:
        "https://warranty-wallet.s3.eu-north-1.amazonaws.com/1731583240362-Data…",
      sharedWith: Array(null),
    },
  ]);

  const toastMessage = (type, mssg) => {
    messageApi.open({
      type: type,
      content: mssg,
    });
  };

  return (
    <div className="w-100">
      {contextHolder}
      <Filters
        setSearchValue={setSearchValue}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      {/* <LoaderOverlay isVisible={contentLoader} /> */}
      {contentLoader ? (
        <div className="w-100 my-5 d-flex align-items-center justify-content-center">
          <b className="me-3" style={{ color: "#000" }}>
            Loading
          </b>
          <Spin size="large" />
        </div>
      ) : (
        <div className="w-100 px-3">
          <Milestone tasks={tasks} />
        </div>
      )}
    </div>
  );
};

export default Project;
