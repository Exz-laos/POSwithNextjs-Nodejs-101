"use client";

import axios from "axios";
import { useState } from "react";
import config from "../config";
import Swal from "sweetalert2";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const signin = async () => {
    try{
        const payload = {
            username: username,
            password: password,
        };
        const res = await axios.post(
            config.apiServer + "/api/user/signin",
            payload
        );

        if (res.data.token !== undefined) {
            localStorage.setItem(config.token, res.data.token);
        }else {
            Swal.fire({
                title: "check username",
                text: "username is wrong",
                icon: "error",

            });
        }
    }catch(e: any){
        Swal.fire({
            title: "error",
            text : e.message,
            icon : "error"
        });

    }
  };
  return (
    <div className="login-box">
      <div className="card card-outline card-primary">
        <div className="card-header text-center">
          <a href="../../index2.html" className="h1">
            <b>Admin</b> Exz.com
          </a>
        </div>
        <div className="card-body">
          <p className="login-box-msg">Sign in to start your session</p>

          <div>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-envelope"></span>
                </div>
              </div>
            </div>
            <div className="input-group mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-8">
                <div className="icheck-primary">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember Me</label>
                </div>
              </div>

              <div className="col-4">
                <button type="submit" className="btn btn-primary btn-block"
                onClick={signin}>
                  Sign In
                </button>
              </div>
            </div>
          </div>


          <p className="mb-1">
            <a href="forgot-password.html">I forgot my password</a>
          </p>
          <p className="mb-0">
            <a href="register.html" className="text-center">
              Register a new membership
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
