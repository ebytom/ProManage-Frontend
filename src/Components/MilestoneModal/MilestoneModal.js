import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Upload } from "antd";
import { CloseCircleFilled, PlusOutlined } from "@ant-design/icons";
import { Axios } from "../../Config/Axios/Axios";
import LoaderOverlay from "../LoaderOverlay/LoaderOverlay";
import { UserContext } from "../../App";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { useToast } from "../ToastContext/ToastContext";
import moment from "moment";
import { ShareIcon } from "@primer/octicons-react";
import { useProject } from "../ProjectContext/ProjectContext";
import TextArea from "antd/es/input/TextArea";
import Milestone from "../../Pages/Milestone/Milestone";
import { useLocation } from "react-router-dom";

const { Option } = Select;

const MilestoneModal = forwardRef(({},ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contentLoader, setContentLoader] = useState(false);
  const [project, setProject] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isError, setIsError] = useState(false);
  const [deleteBtn, setDeleteBtn] = useState(false);
  const [form] = Form.useForm();
  const [deleteForm] = Form.useForm();

  const { user } = useContext(UserContext);
  const { setProjects, projects } = useProject();
  const toastMessage = useToast();
  const token = localStorage.getItem("token");

  const loc = useLocation();

  const priority = [
    { id: "high", name: "High Priority" },
    { id: "medium", name: "Medium Priority" },
    { id: "low", name: "Low priority" },
  ];

  const showLoading = () => {
    setOpen(true);
    // setLoading(true);
  };

  useImperativeHandle(ref, () => ({
    showLoading,
  }));

  const isDisabled = () => {
    return (
      project &&
      Object.keys(project)?.length > 0 &&
      project.addedBy !== user.userId
    );
  };

  const handleDateChange = (e, dateType) => {
    const dateValue = e.target.value;

    // Convert date string to timestamp
    const timestamp = new Date(dateValue).valueOf();

    form.setFieldsValue({ [dateType]: dateValue });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

//   const handleDeleteForm = (e) => {
    // setDeleteBtn(false);
    // const { name, value } = e.target;

    // form.setFieldsValue({
    //   [name]: value.toUpperCase(),
    // });

    // if (value === projectDetails?.name) {
    //   setDeleteBtn(true);
    // }
//   };

  const submitDetails = async () => {
    try {
      const values = await form.validateFields(); // Validate and get form values
      setContentLoader(true);
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (
          key === "invoiceURL" &&
          values.invoiceURL?.[0]?.originFileObj &&
          Object.keys(project)?.length === 0
        ) {
          formData.append("invoiceFile", values.invoiceURL[0].originFileObj);
        } else if (key !== "invoiceURL") {
          formData.append(key, values[key]);
        }
      });
      // formData.append("addedBy", user.userId);

      if (Object.keys(project)?.length > 0) {
        // Update existing project
        await Axios.put(
          `/api/projects`,
          {
            ...formData,
            // assignees: []
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
              // "Content-Type": "multipart/form-data",
            },
          }
        ).then((res) => {
          setProject(res.data.projects); // Update context state
          toastMessage("success", "Project updated successfully!");
        });
      } else {

        await Axios.post(
          "/api/milestones",
          {
            name: formData.get("name"),
            description: formData.get("description"),
            // priority: formData.get("priority"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            project: {
                id : loc.pathname?.split("/")[2]
            }
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
              // "Content-Type": "multipart/form-data",
            },
          }
        ).then((res) => {
          setProject(res.data.projects); // Update context state with new projects
          toastMessage("success", "Project added successfully!");
        });
      }

      setContentLoader(false);
      setOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Form submission failed:", error);
      toastMessage("warning", "Something went wrong!");
      setContentLoader(false);
    }
  };

  const handleOk = () => {
    setShowDeleteConfirm(true);
  };

  const shareAccess = async () => {
    setLoading(true);

    const email = form.getFieldValue("shareWith");

    if (project && email) {
      try {
        const response = await Axios.post(
          `/api/v1/app/project/shareAccess/${project._id}`,
          { email },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setProject(response.data.project);

        toastMessage("success", "Access shared successfully!");
      } catch (err) {
        console.error("Failed to share access:", err);
        toastMessage("warning", err.response.data.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      toastMessage("warning", "Please enter an email address to share access.");
    }
  };

  return (
    <>
      <LoaderOverlay isVisible={contentLoader} />
      <Modal
        title="Milestone"
        footer={[
                <Button type="primary" onClick={submitDetails}>
                  Submit
                </Button>,
        ]}
        open={open}
        onCancel={() => {
          setOpen(false);
          setIsError(false);
        }}
        loading={loading}
      >
        <Form
          form={form}
          name="form"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
          style={{ maxWidth: 600, marginTop: 50 }}
        >
          <Form.Item
            label="Milestone Name"
            name="name"
            initialValue={project ? project.name : ""}
            rules={[
              {
                required: true,
                message: "Please enter the name",
              },
            ]}
          >
            <Input
              // disabled={project ? true : false}
              disabled={isDisabled()}
              name="name"
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            initialValue={project ? project.description : ""}
          >
            <TextArea
              // disabled={project ? true : false}
              disabled={isDisabled()}
              name="description"
            />
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="startDate"
            initialValue={
              project && project.endDate ? moment(project.endDate) : null
            }
            rules={[
              {
                required: true,
                message: "Please select a start date",
              },
            ]}
          >
            {/* <input
              type="date"
              max={moment().format("YYYY-MM-DD")}
              style={{
                padding: "10px",
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "7px",
              }}
              disabled={isDisabled()}
              onChange={(e) => handleDateChange(e, "startDate")}
            /> */}
            <DatePicker
              style={{ width: "100%" }}
              disabled={isDisabled()}
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
            rules={[
              {
                required: true,
                message: "Please select a end date",
              },
            ]}
            initialValue={
              project && project.endDate ? moment(project.endDate) : null
            }
          >
            <DatePicker
              style={{ width: "100%" }}
              disabled={isDisabled()}
              format="YYYY-MM-DD"
            />
            {/* <input
              type="date"
              style={{
                padding: "10px",
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "7px",
              }}
              disabled={isDisabled()}
              onChange={(e) => handleDateChange(e, "endDate")}
            /> */}
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Delete Project"
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
        ]}
      >
        <p>
          To confirm, type "<b>{project?.name}</b>" in the box below.
        </p>
        <Form
          form={deleteForm}
          name="deleteForm"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
        >
          <Form.Item name="deleteText">
            <Input name="deleteText" 
            // onChange={handleDeleteForm} 
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default MilestoneModal;
