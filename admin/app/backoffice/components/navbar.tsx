'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import config from "@/app/config";
import React from "react";

export default function Navbar() {
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("next_name");
    setName(storedName ?? "User");
  }, []);

  const signOut = async () => {
    try {
      const button = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to log out?",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        localStorage.removeItem(config.token);
        localStorage.removeItem("next_name");
        localStorage.removeItem("next_user_id");
        router.push("/signin");
      }
    } catch (e: any) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-user"></i> {name}
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <button className="dropdown-item" onClick={signOut}>
                  <i className="fas fa-sign-out-alt"></i> Sign out
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );
}
