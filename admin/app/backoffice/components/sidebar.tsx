"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import config from "@/app/config";
import Swal from "sweetalert2";
import Link from "next/link";
import { FaUser, FaSignOutAlt, FaTh, FaList, FaFileAlt, FaStoreAlt, } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
export default function Sidebar() {
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("next_name");
    setName(storedName ?? "");
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
    <aside className="main-sidebar sidebar-dark-primary elevation-4 bg-dark">
      {/* Brand Section */}
      <a href="#" className="brand-link d-flex align-items-center p-3 bg-primary">
        <FaStoreAlt className="me-2 fs-4 text-white" />
        <span className="brand-text font-weight-light text-white">POS FOOD STORE</span>
      </a>

      {/* User Panel */}
      <div className="user-panel d-flex align-items-center mt-3 mb-3 px-3">
        <FaUser className="fs-3 me-2 text-white" />
        <div className="info">
          <a href="#" className="d-block text-white">{name}</a>
          <button className="btn btn-sm btn-danger mt-2" onClick={signOut}>
            <FaSignOutAlt className="me-1" /> Sign out
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-2">
      <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
        <li className="nav-item">
          <Link href="/backoffice/food-type" className="nav-link text-white d-flex align-items-center">
            <FaTh className="nav-icon me-2" />
            <p>Food types</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/backoffice/food-size" className="nav-link text-white d-flex align-items-center">
            <FaList className="nav-icon me-2" />
            <p>Food size</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/backoffice/food-taste" className="nav-link text-white d-flex align-items-center">
            <FaFileAlt className="nav-icon me-2" />
            <p>Food taste</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/backoffice/food" className="nav-link text-white d-flex align-items-center">
            <IoFastFoodOutline className="nav-icon me-2" />
            <p>Food</p>
          </Link>
        </li>
      </ul>
    </nav>

     
    </aside>
  );
}
