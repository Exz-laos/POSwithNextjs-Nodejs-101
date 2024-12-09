"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import config from "@/app/config";
import Swal from "sweetalert2";
import Link from "next/link";
import { FaUser, FaSignOutAlt, FaRulerCombined , FaStoreAlt,FaCashRegister,FaCalendarDay  } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { GiHotMeal,GiForkKnifeSpoon  } from "react-icons/gi";
import { TbReportAnalytics } from "react-icons/tb";
import { BsCalendar2MonthFill } from "react-icons/bs";
import { RiDashboard2Line } from "react-icons/ri";
import { HiMiniUsers } from "react-icons/hi2";
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
<aside className="main-sidebar sidebar-dark-primary elevation-4 bg-gradient-to-b from-gray-900 via-gray-800 to-black">
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
      <button
        onClick={signOut}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
      >
        <FaSignOutAlt className="mr-2" />
        Sign Out
      </button>
    </div>
  </div>

  {/* Navigation Menu */}
  <nav className="mt-2">
    <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
      <li className="nav-item">
        <Link href="/backoffice/dashboard" className="nav-link text-white d-flex align-items-center">
          <RiDashboard2Line     className="nav-icon me-2" />
          <p>Dashboard</p>
        </Link>
      </li>
      <li className="nav-item">
        <Link href="/backoffice/sale" className="nav-link text-white d-flex align-items-center">
          <FaCashRegister className="nav-icon me-2" />  {/* Changed to represent "Sale" */}
          <p>Sale</p>
        </Link>
      </li>
      <li className="nav-item">
        <Link href="/backoffice/food-type" className="nav-link text-white d-flex align-items-center">
          <GiHotMeal className="nav-icon me-2" />  {/* Changed to represent "Food Types" */}
          <p>Food types</p>
        </Link>
      </li>
      <li className="nav-item">
        <Link href="/backoffice/food-size" className="nav-link text-white d-flex align-items-center">
          <FaRulerCombined className="nav-icon me-2" />  {/* Changed to represent "Food Size" */}
          <p>Food size</p>
        </Link>
      </li>
      <li className="nav-item">
        <Link href="/backoffice/food-taste" className="nav-link text-white d-flex align-items-center">
          <GiForkKnifeSpoon className="nav-icon me-2" />  {/* Changed to represent "Food Taste" */}
          <p>Food taste</p>
        </Link>
      </li>
      <li className="nav-item">
        <Link href="/backoffice/food" className="nav-link text-white d-flex align-items-center">
          <IoFastFoodOutline className="nav-icon me-2" />
          <p>Food</p>
        </Link>
      </li>

      <li className="nav-item">
        <Link href="/backoffice/organization" className="nav-link text-white d-flex align-items-center">
          <FaStoreAlt className="nav-icon me-2" />
          <p>My Store</p>
        </Link>
      </li>

      <li className="nav-item">
        <Link href="/backoffice/report-bill-sale" className="nav-link text-white d-flex align-items-center">
          <TbReportAnalytics  className="nav-icon me-2" />
          <p>My Report</p>
        </Link>
      </li>

      <li className="nav-item">
        <Link href="/backoffice/report-sum-sale-per-day" className="nav-link text-white d-flex align-items-center">
          <FaCalendarDay   className="nav-icon me-2" />
          <p>Sales/day</p>
        </Link>
      </li>

      <li className="nav-item">
        <Link href="/backoffice/report-sum-sale-per-month" className="nav-link text-white d-flex align-items-center">
          <BsCalendar2MonthFill    className="nav-icon me-2" />
          <p>Sales/month</p>
        </Link>
      </li>

      <li className="nav-item">
        <Link href="/backoffice/user" className="nav-link text-white d-flex align-items-center">
          <HiMiniUsers     className="nav-icon me-2" />
          <p>Staff User</p>
        </Link>
      </li>

      

    </ul>
  </nav>
</aside>

  
  );
}

