import React, { useContext, useEffect, useState } from "react";
import { Axios } from "../../../Config/Axios/Axios";
import { UserContext } from "../../../App";
import { MailFilled, PhoneFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import LoginLoaderOverlay from "../../../Components/LoginLoaderOverlay/LoginLoaderOverlay";
import { Button, Input, message } from "antd";

const Login = () => {
  const [err, seterr] = useState("");
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(UserContext);
  const nav = useNavigate();

  useEffect(() => {
  const checkSession = async () => {
    setLoader(true);
    try {
      const token = localStorage.getItem("token");
      const userDetails = JSON.parse(localStorage.getItem("user"));

      if (token) {
        // const response = await Axios.get("/api/auth/verifyToken", {
        //   headers: {
        //     Authorization: `Bearer ${token}`, 
        //   },
        // });
        setUser(userDetails);
        // nav("/dashboard"); // Uncomment to redirect after validation
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      seterr("Session expired! Please login again.");
      localStorage.removeItem("token");
    } finally {
      setLoader(false);
    }
  };

    checkSession();
  }, [setUser, nav]);

  const handleLogin = async () => {
    if (!email || !password) {
      message.warning("Please enter both email and password");
      return;
    }

    setLoader(true);
    try {
      const response = await Axios.post("/api/auth/login", {
        email,
        password,
      });

      const { token } = response.data;
      setUser(response.data.user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // localStorage.setItem("user", response.data.user);
      // setauthenticated(true);
      nav("/dashboard");
    } catch (error) {
      console.error("Login Failed:", error);
      seterr("Login Failed. Please try again.");
      message.error("Login Failed. Please check your credentials.");
    } finally {
      setLoader(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLogin();
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
                  <h1><b>Promanage</b></h1>
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
                        <h3>Sign in</h3>
                      </div>
                    </div>
                  </div>
                  <div className="w-100 d-flex">
                    <div className="flex-grow-1">
                      <div className="mb-3">
                        <span>Email</span>
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                      <div className="mb-4">
                        <span>Password</span>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                      <Button
                        type="primary"
                        className="w-100 mb-3"
                        onClick={handleLogin}
                      >
                        Submit
                      </Button>
                      {err && <p className="text-danger text-center">{err}</p>}
                      <span>
                        Not registered yet?{" "}
                        <a href="/signup">
                          <b className="text-primary">Signup</b>
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

export default Login;
