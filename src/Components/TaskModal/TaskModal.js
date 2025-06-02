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
import Task from "../../Pages/Task/Task";

const { Option } = Select;

const TaskModal = forwardRef(({ milestone, taskDetails }, ref) => {
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

  const status = [
    { id: "1", name: "Open" },
    { id: "2", name: "In Progress" },
    { id: "3", name: "Completed" },
  ];

  //   useEffect(() => {
  //     setLoading(true);
  //     if (projectDetails) {
  //       Axios.get(`/api/v1/app/project/getProjectById/${projectDetails?._id}`, {
  //         params: {
  //           id: projectDetails?._id,
  //         },
  //       })
  //         .then((res) => {
  //           setProject(res.data);
  //           setLoading(false);
  //         })
  //         .catch((err) => {
  //           setProject({});
  //           setIsError(true);
  //           setLoading(false);
  //         });
  //     }
  //     setLoading(false);
  //   }, []);

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

      if (taskDetails && Object.keys(taskDetails)?.length > 0) {
        
        await Axios.put(
          `/api/tasks/${taskDetails?.id}`,
          {
            title: formData.get("title"),
            description: formData.get("description"),
            priority: formData.get("priority"),
            startDate: moment(formData.get("startDate")).format("YYYY-MM-DD").split("T")[0],
            status: formData.get("status"),
            endDate: moment(formData.get("startDate")).format("YYYY-MM-DD").split("T")[0],
            project: {
              id: loc.pathname.split("/")[2],
            },
            milestone: {
              id: milestone?.id,
            },
            assignees: [],
            parentTask: null,
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
          "/api/tasks",
          {
            title: formData.get("title"),
            description: formData.get("description"),
            priority: formData.get("priority"),
            startDate: formData.get("startDate"),
            status: formData.get("status"),
            endDate: formData.get("endDate"),
            project: {
              id: loc.pathname.split("/")[2],
            },
            milestone: {
              id: milestone?.id,
            },
            assignees: [],
            parentTask: null,
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
    // <div key={taskDetails?.id}>
    <>
      <LoaderOverlay isVisible={contentLoader} />
      <Modal
        title="Task"
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
            label="Status"
            name="status"
            initialValue={taskDetails ? taskDetails.status : ""}
            rules={[
              {
                required: true,
                message: "Please select a status",
              },
            ]}
          >
            <Select placeholder={"Select Status"} disabled={isDisabled()}>
              {status?.map((option) => (
                <Option key={option?.id} value={option?.id}>
                  {option?.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Task Title"
            name="title"
            initialValue={taskDetails ? taskDetails.title : ""}
            rules={[
              {
                required: true,
                message: "Please enter the title",
              },
            ]}
          >
            <Input
              // disabled={project ? true : false}
              disabled={isDisabled()}
              name="title"
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            initialValue={taskDetails ? taskDetails.description : ""}
          >
            <TextArea
              // disabled={project ? true : false}
              disabled={isDisabled()}
              name="description"
            />
          </Form.Item>
          <Form.Item
            label="Priority"
            name="priority"
            initialValue={taskDetails ? taskDetails.priority : ""}
            rules={[
              {
                required: true,
                message: "Please select a priority",
              },
            ]}
          >
            <Select placeholder={"Select Priority"} disabled={isDisabled()}>
              {priority?.map((option) => (
                <Option key={option?.id} value={option.id}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Comments"
            name="comments"
            initialValue={taskDetails ? taskDetails.comments : ""}
          >
            <TextArea
              // disabled={project ? true : false}
              disabled={isDisabled()}
              name="comments"
            />
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="startDate"
            initialValue={
              taskDetails && taskDetails.endDate
                ? moment(taskDetails.endDate)
                : null
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
              taskDetails && taskDetails.endDate
                ? moment(taskDetails.endDate)
                : null
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
          </Button>,
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
            <Input
              name="deleteText"
              // onChange={handleDeleteForm}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
    // </div>
  );
});

export default TaskModal;
