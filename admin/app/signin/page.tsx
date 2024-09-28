"use client";

import axios from "axios";
import { useState } from "react";
import config from "../config";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
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
            localStorage.setItem("next_name", res.data.name);
            localStorage.setItem("next_user_id", res.data.id);

            router.push("/backoffice");
        }else {
            Swal.fire({
                title: "check username",
                text: "username is wrong",
                icon: "error",

            });
        }
    }
    catch(e: any){
      if(e.response.status == 401){
        Swal.fire({
          title: "Check username and password",
          text : "username or password is wrong",
          icon : "error"
      });
        
      }else{
        Swal.fire({
          title: "error",
          text : e.message,
          icon : "error"
      });
      }
    }
    
  };
  return (
    // <div className="login-box">
    //   <div className="card card-outline card-primary">
    //     <div className="card-header text-center">
    //       <a href="../../index2.html" className="h1">
    //         <b>Admin</b> Exz.com
    //       </a>
    //     </div>
    //     <div className="card-body">
    //       <p className="login-box-msg">Sign in to start your session</p>

    //       <div>
    //         <div className="input-group mb-3">
    //           <input
    //             type="email"
    //             className="form-control"
    //             placeholder="Email"
    //             onChange={(e) => setUsername(e.target.value)}
    //           />
    //           <div className="input-group-append">
    //             <div className="input-group-text">
    //               <span className="fas fa-envelope"></span>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="input-group mb-3">
    //           <input
    //             type="password"
    //             className="form-control"
    //             placeholder="Password"
    //             onChange={(e) => setPassword(e.target.value)}
    //           />
    //           <div className="input-group-append">
    //             <div className="input-group-text">
    //               <span className="fas fa-lock"></span>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="row">
    //           <div className="col-8">
    //             <div className="icheck-primary">
    //               <input type="checkbox" id="remember" />
    //               <label htmlFor="remember">Remember Me</label>
    //             </div>
    //           </div>

    //           <div className="col-4">
    //             <button type="submit" className="btn btn-primary btn-block"
    //             onClick={signin}>
    //               Sign In
    //             </button>
    //           </div>
    //         </div>
    //       </div>


    //       <p className="mb-1">
    //         <a href="forgot-password.html">I forgot my password</a>
    //       </p>
    //       <p className="mb-0">
    //         <a href="register.html" className="text-center">
    //           Register a new membership
    //         </a>
    //       </p>
    //     </div>
    //   </div>
    // </div>

    <div className="login-box" style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
  <div className="card card-outline card-primary shadow-lg" style={{ borderRadius: '15px' }}>
    <div className="card-header text-center" style={{ backgroundColor: '#007bff', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
      <a href="../../index2.html" className="h1" style={{ color: 'white', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
        <b>Admin</b> Exz.com
      </a>
    </div>
    <div className="card-body" style={{ padding: '30px' }}>
      <p className="login-box-msg" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Sign in to start your session</p>

      <div>
        <div className="input-group mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            style={{ borderRadius: '10px', border: '1px solid #ced4da', padding: '10px' }}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="input-group-append">
            <div className="input-group-text" style={{ borderRadius: '0 10px 10px 0', backgroundColor: '#e9ecef' }}>
              <span className="fas fa-envelope"></span>
            </div>
          </div>
        </div>
        <div className="input-group mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            style={{ borderRadius: '10px', border: '1px solid #ced4da', padding: '10px' }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="input-group-append">
            <div className="input-group-text" style={{ borderRadius: '0 10px 10px 0', backgroundColor: '#e9ecef' }}>
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
              style={{
                backgroundColor: '#007bff', 
                borderRadius: '10px', 
                border: 'none',
                padding: '10px'
              }}
              onClick={signin}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <p className="mb-1" style={{ marginTop: '15px' }}>
        <a href="forgot-password.html" style={{ color: '#007bff', textDecoration: 'none' }}>I forgot my password</a>
      </p>
      <p className="mb-0">
        <a href="register.html" className="text-center" style={{ color: '#007bff', textDecoration: 'none' }}>
          Register a new membership
        </a>
      </p>
    </div>
  </div>
</div>

  );
}
