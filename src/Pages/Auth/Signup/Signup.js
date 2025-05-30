import React, { useContext, useEffect, useState } from "react";
import { Axios } from "../../../Config/Axios/Axios";
import { UserContext } from "../../../App";
import { MailFilled, PhoneFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import LoginLoaderOverlay from "../../../Components/LoginLoaderOverlay/LoginLoaderOverlay";
import { Button, Input, Select, message } from "antd";
const { Option } = Select;

const Signup = ({ setauthenticated }) => {
  const [err, seterr] = useState("");
  const [loader, setLoader] = useState(true);

  const [name, setName] = useState("");
  const [role, setRole] = useState("USER"); // default User
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(UserContext);
  const nav = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      setLoader(true);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await Axios.post(
            "/api/v1/app/auth/whoami",
            {},
            {
              headers: {
                authorization: `bearer ${token}`,
              },
            }
          );
          setUser(response.data.user);
          nav("/dashboard"); // redirect if already logged in
        }
      } catch (err) {
        console.log(err);
        seterr("Session Expired! login again...");
        localStorage.removeItem("token");
      } finally {
        setLoader(false);
      }
    };

    checkSession();
  }, [setUser, nav]);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      message.error("Please fill all required fields.");
      return;
    }

    setLoader(true);
    try {
      const response = await Axios.post("/api/auth/register", {
        name,
        role,
        email,
        password,
      });

      const { user, token: newToken } = response.data;
      setUser(user);
      localStorage.setItem("token", newToken);
      message.success("Signup successful!");
      nav("/dashboard"); // navigate to dashboard after signup
    } catch (error) {
      console.error("Signup Failed:", error);
      message.error(error.response?.data?.message || "Signup failed.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <section
        className="bg-primary py-3 py-md-5 py-xl-8"
        style={{ height: "100vh", width: "100vw" }}
      >
        <div className="container mt-5">
          <div className="row gy-4 align-items-center">
            <div className="col-12 col-md-6 col-xl-7">
              <div className="d-flex justify-content-center text-bg-primary">
                <div className="col-12 col-xl-9">
                  <h1>
                    <b>Promanage</b>
                  </h1>
                  <hr className="border-primary-subtle mb-4" />
                  <p className="lead mb-5">
                    <strong>
                      A streamlined project management tool designed to help
                      teams plan, track, and collaborate efficiently. Manage
                      tasks, timelines, and resources all in one place to ensure
                      on-time project delivery and improved team productivity.
                    </strong>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-5">
              <div className="card border-0 rounded-4">
                <div className="card-body p-3 p-md-4 p-xl-5">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-4">
                        <h3>Sign up</h3>
                      </div>
                    </div>
                  </div>
                  <div className="w-100 d-flex">
                    <div className="flex-grow-1">
                      <div className="mb-3">
                        <span>Name</span>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <span>Role</span>
                        <Select
                          className="w-100"
                          value={role}
                          onChange={(value) => setRole(value)}
                        >
                          <Option value="USER">User</Option>
                          <Option value="MANAGER">Manager</Option>
                        </Select>
                      </div>
                      <div className="mb-3">
                        <span>Email</span>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <span>Password</span>
                        <Input.Password
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <Button
                        type="primary"
                        className="w-100 mb-3"
                        onClick={handleSubmit}
                      >
                        Submit
                      </Button>
                      <span>
                        Already a user?{" "}
                        <a href="/login">
                          <b className="text-primary">Login</b>
                        </a>
                      </span>
                    </div>
                  </div>
                  <hr className="border-primary-subtle mb-4" />
                  <div className="row">
                    <div className="col-12">
                      <p className="mt-4 mb-4">Contact us</p>
                      <div className="d-flex gap-2 gap-sm-3 justify-content-centerX">
                        <a
                          href="mailto:dev.codhub@gmail.com"
                          className="btn btn-outline-danger bsb-btn-circle bsb-btn-circle-2xl"
                        >
                          <MailFilled />
                        </a>
                        <a
                          href="#!"
                          className="btn btn-outline-danger bsb-btn-circle bsb-btn-circle-2xl"
                        >
                          <PhoneFilled />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <LoginLoaderOverlay isVisible={loader} />
    </>
  );
};

export default Signup;
