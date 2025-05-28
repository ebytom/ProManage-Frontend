import React, { useContext, useEffect, useRef, useState } from "react";
import { Axios } from "../../Config/Axios/Axios";
import { UserContext } from "../../App";
import { Divider, Flex, message, Spin } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import LoaderOverlay from "../../Components/LoaderOverlay/LoaderOverlay";
import CategoryFilter from "../../Components/Filters/CategoryFilter/CategoryFilter";
import Filters from "../../Components/Filters/Filters";
import WarrantyCard from "../../Components/WarrantyCard/WarrantyCard";
import { useWarranty } from '../../Components/WarrantyContext/WarrantyContext';

const Dashboard = () => {
  const [contentLoader, setContentLoader] = useState(true);
  const [loader, setLoader] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredData, setFilteredData] = useState();
  const [isError, setIsError] = useState(false);
  const [metadata, setMetadata] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
  const { setWarranties, warranties } = useWarranty();

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
    const filtered = warranties.filter((item) => {
      const matchesSearch =
        item.itemName.toLowerCase().includes(lowercasedValue) ||
        item.category.toLowerCase().includes(lowercasedValue);

      const matchesCategory = selectedCategories.length
        ? selectedCategories.includes(item.category)
        : true; // If no categories are selected, show all

      return matchesSearch && matchesCategory;
    });

    setFilteredData(filtered); // Set filtered data based on search input and selected categories
  }, [searchValue, selectedCategories, warranties]);

  useEffect(() => {
    setContentLoader(true);
  
    Axios.get(`/api/projects`, {
      headers: {
        authorization: `bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlYnkudGVzdGVyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ3OTIzMjI2LCJleHAiOjE3NDc5NTkyMjZ9.bdq1uTzY06N7Hmxi4kBSpdaRbz_5MNCwQZ52Urf0n2o`,
      },
    })
      .then((res) => {
        setWarranties(res.data);
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
            <WarrantyCard warranty={item} key={index} toastMessage={toastMessage}/>
          ))}
        </div>
      ) : (
        <b className="fs-5" style={{ color: "#d3d3d3" }}>
          No projects added yet—add one and give your brain a little break!
        </b>
      )}
    </>
  );
};

export default Dashboard;
