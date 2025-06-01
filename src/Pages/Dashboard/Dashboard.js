import React, { useContext, useEffect, useRef, useState } from "react";
import { Axios } from "../../Config/Axios/Axios";
import { UserContext } from "../../App";
import { message, Spin } from "antd";
import Filters from "../../Components/Filters/Filters";
import ProjectCard from "../../Components/ProjectCard/ProjectCard";
import { useProject } from "../../Components/ProjectContext/ProjectContext";

const Dashboard = () => {
  const [contentLoader, setContentLoader] = useState(true);
  const [loader, setLoader] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredData, setFilteredData] = useState();
  const [isError, setIsError] = useState(false);
  const [metadata, setMetadata] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
  const { setProjects, projects } = useProject();

  const { user } = useContext(UserContext);

  const toastMessage = (type, mssg) => {
    messageApi.open({
      type: type,
      content: mssg,
    });
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    const lowercasedValue = searchValue.toLowerCase().trim();
    const filtered = projects.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(lowercasedValue) ||
        item.priority?.toLowerCase().includes(lowercasedValue);

      const matchesCategory = selectedCategories.length
        ? selectedCategories.includes(item.priority)
        : true; // If no categories are selected, show all

      return matchesSearch && matchesCategory;
    });

    setFilteredData(filtered); // Set filtered data based on search input and selected categories
  }, [searchValue, selectedCategories, projects]);

  useEffect(() => {
    setContentLoader(true);

    const apiUrl =
      user?.role == 1 ? "/api/projects" : "/api/projects/my-projects";

    Axios.get(apiUrl, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res);

        setProjects(res.data);
        setContentLoader(false);
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
        setContentLoader(false);
      });

    // Optional cleanup function if you want to cancel the Axios request on unmount
    // For that, you'd need to use Axios CancelToken or AbortController.

    return () => {};
  }, []);

  return (
    <>
      {contextHolder}
      <Filters
        setSearchValue={setSearchValue}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <h2 className="text-black mb-3 ps-2" style={{ fontWeight: 700 }}>
        Projects
      </h2>
      {/* <LoaderOverlay isVisible={contentLoader} /> */}
      {contentLoader ? (
        <div className="w-100 my-5 d-flex align-items-center justify-content-center">
          <b className="me-3" style={{ color: "#000" }}>
            Loading
          </b>
          <Spin size="large" />
        </div>
      ) : filteredData.length ? (
        <div className="warranty-card-list">
          {filteredData.map((item, index) => (
            <ProjectCard
              project={item}
              key={index}
              toastMessage={toastMessage}
            />
          ))}
        </div>
      ) : (
        <b className="fs-5 ms-4" style={{ color: "#d3d3d3" }}>
          No projects added yet—add one and give your brain a little break!
        </b>
      )}
    </>
  );
};

export default Dashboard;
