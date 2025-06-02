import React, { useEffect, useState } from "react";
import { Table, Button, Card, Typography, message, Input, Space } from "antd";
import axios from "axios";
import { Axios } from "../../Config/Axios/Axios";

const { Title, Text } = Typography;
const { Search } = Input;

export default function AdminPortal() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await Axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      

      // Filter out ADMINs
      const filteredUsers = res.data.filter((user) => user.role !== "ADMIN");

      setUsers(filteredUsers);
    } catch (err) {
      message.error("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId) => {
    try {
      await Axios.put(
        `/api/users/${userId}/set-manager`,
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, approved: true } : user
        )
      );
      message.success("User approved successfully");
    } catch (err) {
      message.error("Failed to approve user");
      console.error(err);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => role || "User",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        if (record.approved || record.manager === true) {
          return <Text type="success">Approved</Text>;
        } else if (record.role === "MANAGER") {
          return (
            <Button type="primary" onClick={() => approveUser(record.id)}>
              Approve
            </Button>
          );
        } else {
          return <Text type="secondary">Approval Not Required</Text>;
        }
      },
    },
  ];

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  return (
    <div
      className="rounded"
      style={{
        padding: "2rem",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Card style={{ marginBottom: "2rem" }}>
        <Title
          level={2}
          style={{ textAlign: "center", color: "#1890ff", fontWeight: 800 }}
        >
          Admin Dashboard
        </Title>
      </Card>

      <Card style={{ marginBottom: "1rem" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Search
            placeholder="Search by name"
            allowClear
            enterButton
            onSearch={(value) => setSearchTerm(value)}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Space>
      </Card>

      <Card>
        <Table
          dataSource={filteredUsers.map((user) => ({ ...user, key: user.id }))}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 15 }}
        />
      </Card>
    </div>
  );
}
