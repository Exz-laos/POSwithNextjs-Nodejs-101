"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import  config  from "@/app/config";
import Swal from "sweetalert2";
import Link from "next/link";
export default function Sidebar() {
    const [name,setName]= useState("");
    const router = useRouter();

    useEffect(()=>{
        const name = localStorage.getItem('next_name')
        setName(name?? "")
    },[])

    const signOut = async ()=> {
        try {
            const button = await Swal.fire({
                title: 'Are you sure?',
                text: "DO you want to logOut",
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true,
            })
            if (button.isConfirmed) {
                localStorage.removeItem(config.token);
                localStorage.removeItem("next_name");
                localStorage.removeItem("next_user_id");
                router.push("/signin");
            }
        }
        catch (e: any) {
              Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
              });
            }
    };

    return (
        <>
                <aside className="main-sidebar sidebar-dark-primary elevation-4">
            <a href="index3.html" className="brand-link">
             <i className="fas fa-store-alt me-2"></i>
              <span className="brand-text font-weight-light">POS FOOD STORE</span>
            </a>
            <div className="sidebar">
              <div className="user-panel mt-3 pb-3 mb-3 d-flex">
             
                <div className="info">
                  
                  <a href="#" className="d-block">
                      <i className="fas fa-user me-2"></i>{name}
                  </a>
                  <button className="btn btn-danger btn-sm" onClick={signOut}>
                    <i className="fas fa-sign-out-alt"></i> Sign out
                  </button>
                </div>
              </div>
              <nav className="mt-2">
                <ul
                  className="nav nav-pills nav-sidebar flex-column"
                  data-widget="treeview"
                  role="menu"
                  data-accordion="false"
                >
                  <li className="nav-header">Menu</li>
                  <li className="nav-item">
                    <Link href="/backoffice/food-type" className="nav-link">
                      <i className="nav-icon fas fa-th"></i>
                      <p>
                        Food types
                      </p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/backoffice/food-size" className="nav-link">
                      <i className="nav-icon fas fa-list"></i>
                      <p>
                        Food size
                      </p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/backoffice/food-taste" className="nav-link">
                      <i className="nav-icon fas fa-file-alt"></i>
                      <p>
                        Food taste
                      </p>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

        </>
    );
}