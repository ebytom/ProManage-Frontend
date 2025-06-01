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

const { Option } = Select;

const ProjectDetailsModal = forwardRef(({ projectDetails }, ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contentLoader, setContentLoader] = useState(false);
  const [project, setProject] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isError, setIsError] = useState(false);
  const [assignee, setAssignee] = useState("")
  const [deleteBtn, setDeleteBtn] = useState(false);
  const [form] = Form.useForm();
  const [deleteForm] = Form.useForm();

  const { user } = useContext(UserContext);
  const { setProjects, projects } = useProject();
  const toastMessage = useToast();
  const token = localStorage.getItem("token");

  const priority = [
    { id: "high", name: "High Priority" },
    { id: "medium", name: "Medium Priority" },
    { id: "Low", name: "Low priority" },
  ];

  useEffect(() => {
    setLoading(true);
    if (projectDetails) {
      Axios.get(`/api/v1/app/project/getProjectById/${projectDetails?._id}`, {
        params: {
          id: projectDetails?.id,
        },
      })
        .then((res) => {
          setProject(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setProject({});
          setIsError(true);
          setLoading(false);
        });
    }
    setLoading(false);
  }, []);

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

  const handleDeleteForm = (e) => {
    setDeleteBtn(false);
    const { name, value } = e.target;

    form.setFieldsValue({
      [name]: value.toUpperCase(),
    });

    if (value === projectDetails?.name) {
      setDeleteBtn(true);
    }
  };

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
      console.log(projectDetails);

      if (projectDetails && Object.keys(projectDetails)?.length > 0) {
        // Update existing project
        await Axios.put(
          `/api/projects/${projectDetails?.id}`,
          {
            name: formData.get("name"),
            description: formData.get("description"),
            priority: formData.get("priority"),
            startDate: formData.get("startDate").split("T")[0],
            endDate: formData.get("endDate").split("T")[0],
            assignees: [],
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => {
          setProject(res.data.projects); // Update context state
          toastMessage("success", "Project updated successfully!");
        });
      } else {
        // Add new project
        console.log("Adding new project with formData:", formData.get("name"));

        await Axios.post(
          "/api/projects",
          {
            name: formData.get("name"),
            description: formData.get("description"),
            priority: formData.get("priority"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            assignees: [],
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

  const deleteProject = () => {
    if (deleteProject) {
      Axios.delete(`/api/v1/app/project/deleteProjectById/${project._id}`, {
        headers: {
          authorization: `bearer ${token}`,
        },
      })
        .then(() => {
          setShowDeleteConfirm(false);
          setOpen(false);
          window.location.reload();
        })
        .catch((err) => {
          console.error("Failed to delete project:", err);
        });
    }
  };

  const handleOk = () => {
    setShowDeleteConfirm(true);
  };

  const shareAccess = async () => {
    setLoading(true);
    const formData = new FormData();
    const emailValue = formData.get("asignees");

    console.log("Sharing access with email:", assignee);

    if (projectDetails && assignee) {
      try {
        const response = await Axios.patch(
          `/api/projects/${projectDetails.id}/add-assignee`,
          {}, // PATCH body is empty here
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
            params: {
              email: assignee,
            },
          }
        );

        console.log(response);
        toastMessage("success", response.data.message);
      } catch (err) {
        console.error("Failed to share access:", err);
        toastMessage(
          "warning",
          err.response?.data?.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      toastMessage("warning", "Please enter an email address to share access.");
    }
  };

  const revokeAccess = async (userDetails) => {
    setLoading(true);
    try {
      const response = await Axios.patch(
          `/api/projects/${projectDetails.id}/remove-assignee`,
          {}, // PATCH body is empty here
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
            params: {
              email: userDetails.email,
            },
          }
        );
      setProject(response.data.project); // Update project data with response
      toastMessage("success", response.data.message);
    } catch (err) {
      console.error("Failed to revoke access:", err);
      toastMessage("warning", err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoaderOverlay isVisible={contentLoader} />
      <Modal
        title="Project Details"
        footer={
          !isDisabled() &&
          (project && Object.keys(project)?.length > 0
            ? [
                <ConfirmModal
                  title="Confirm Action"
                  content="Are you sure you want to delete?"
                  onOk={handleOk}
                  onCancel={() => {}}
                >
                  <Button type="primary" danger>
                    Delete
                  </Button>
                </ConfirmModal>,
                <Button type="primary" onClick={submitDetails}>
                  Update
                </Button>,
              ]
            : [
                <Button type="primary" onClick={submitDetails}>
                  Submit
                </Button>,
              ])
        }
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
            label="Project Name"
            name="name"
            initialValue={projectDetails ? projectDetails.name : ""}
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
            initialValue={projectDetails ? projectDetails.description : ""}
            rules={[
              {
                required: true,
                message: "Please enter the description",
              },
            ]}
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
            initialValue={projectDetails ? projectDetails.priority : ""}
            rules={[
              {
                required: true,
                message: "Please select a priority",
              },
            ]}
          >
            <Select placeholder={"Select Priority"} disabled={isDisabled()}>
              {priority?.map((option) => (
                <Option key={option.id} value={option.name}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="startDate"
            initialValue={
              projectDetails && projectDetails.endDate
                ? moment(projectDetails.endDate)
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
              projectDetails && projectDetails.endDate
                ? moment(projectDetails.endDate)
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

          {projectDetails && projectDetails.invoiceURL ? (
            <Form.Item label="Invoice" name="invoiceURL">
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={() => window.open(projectDetails.invoiceURL, "_blank")}
              >
                Preview
              </Button>
            </Form.Item>
          ) : (
            <Form.Item
              label="Upload Docs"
              name="invoiceURL"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              initialValue={
                projectDetails &&
                projectDetails.invoiceURL &&
                projectDetails.invoiceURL?.length > 0
                  ? [projectDetails.invoiceURL]
                  : []
              }
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                disabled={isDisabled()}
                showUploadList={{ showRemoveIcon: true }}
                // accept="image/*"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          )}

          {projectDetails && user?.role !== 10 && (
            <>
              <hr style={{ color: "#919191" }} />
              <Form.Item label="Assignees" name="assignees">
                <div className="d-flex gap-2">
                  <Input
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                  />
                  <Button type="primary" onClick={shareAccess}>
                    <ShareIcon size={16} />
                  </Button>
                </div>
                {projectDetails?.assignees?.length > 0 && (
                  <div
                    style={{ border: "1px solid #eee" }}
                    className="p-2 mt-2 rounded d-grid gap-2"
                  >
                    {projectDetails &&
                      projectDetails?.assignees?.map((user, index) => {
                        return (
                          <div
                            key={index}
                            className="rounded px-1 d-flex gap-2"
                            style={{
                              background: "#ddeafe",
                              width: "fit-content",
                            }}
                          >
                            <span style={{ fontSize: 14 }}>{user?.email}</span>
                            <ConfirmModal
                              title="Remove Access"
                              content="Are you sure you want remove access for  this user?"
                              onOk={() => revokeAccess(user)}
                              onCancel={() => {}}
                            >
                              <CloseCircleFilled style={{ fontSize: 16 }} />
                            </ConfirmModal>
                          </div>
                        );
                      })}
                  </div>
                )}
              </Form.Item>
            </>
          )}
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
          <Button
            key="delete"
            type="primary"
            danger
            onClick={deleteProject}
            disabled={!deleteBtn}
          >
            Delete
          </Button>,
        ]}
      >
        <p>
          To confirm, type "<b>{projectDetails?.name}</b>" in the box below.
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
            <Input name="deleteText" onChange={handleDeleteForm} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default ProjectDetailsModal;
