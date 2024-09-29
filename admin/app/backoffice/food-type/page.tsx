'use client';
import { useEffect, useState } from "react";
import MyModal from "../components/MyModal";
import Swal from "sweetalert2";
import axios from "axios";
import config from "@/app/config";
export default function Page() {
    const [id, setId] = useState(0);
    const [name,setName]=useState("");
    const [remark,setRemark]=useState("");
    const [foodTypes, setFoodTypes] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);
    const edit = (item: any) => {
        setId(item.id);
        setName(item.name);
        setRemark(item.remark);
    }
    const handleSave = async () => {
        try{
            const payload = {
                name: name,
                remark: remark,
                id: id,
            };

            if(id==0){
                await axios.post(config.apiServer + "/api/foodtype/create", payload);
            }else{
                await axios.put(config.apiServer + "/api/foodtype/update", payload);
                setId(0);
            }
            fetchData();
            document.getElementById("modalFoodType_btnClose")?.click();
        }catch(e: any){
                Swal.fire({
                    title: "Error",
                    text: e.message,
                    icon: "error",
                })
            
     };
    }

    const fetchData = async () => {
        try{
            const rows = await axios.get(config.apiServer + "/api/foodtype/list");
            setFoodTypes(rows.data.results);
        }catch(e:any){
            Swal.fire({  
              title: "Error",
              text: e.message,
              icon: "error",
            })
        }
    };

    const handleRemove = async (item: any)=> {
        try{
            const button = await Swal.fire({
                title: "Are you sure?",
                text: "Do you want to delete this menu?",
                icon: "question",
                showCancelButton: true,
                showConfirmButton: true,
            });
            if (button.isConfirmed) {
                await axios.delete(
                    config.apiServer + "/api/foodtype/remove/" + item.id);
                fetchData();
            }
        }catch(e:any){
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error",
            })
        }
    }

    const clearForm=()=>{
        setId(0);
        setName("");
        setRemark("");
    }
    return (
      <div className="card mt-3">
        <div className="card-header">Types of food and drink</div>
        <div className="card-body">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalFoodType"
            onClick={clearForm}
          >
            <i className="fa fa-plus me-2"></i>Add menu
          </button>

          <table className="table mt-4 table-hover table-bordered table-striped">
            <thead className="thead-light">
              <tr>
                <th style={{ width: "200px" }}>Name</th>
                <th>Remark</th>
                <th style={{ width: "120px" }} className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {foodTypes.map((item: any) => (
                <tr key={item.id} className="align-middle">
                  <td className="font-weight-bold">{item.name}</td>
                  <td>{item.remark}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-primary me-2"
                    data-bs-toggle="modal" 
                    data-bs-target="#modalFoodType" 
                    onClick={() => edit(item)}>

                      <i className="fa fa-edit"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item)}>
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <style jsx>{`
            .table {
              background-color: #fff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .table-hover tbody tr:hover {
              background-color: #f7f9fb;
            }

            .thead-light {
              background-color: #f1f3f5;
              text-transform: uppercase;
              letter-spacing: 0.1em;
            }
            th,
            td {
              vertical-align: middle;
            }
            .btn-outline-primary {
              border-color: #007bff;
              color: #007bff;
              transition: background-color 0.2s, color 0.2s;
            }
            .btn-outline-primary:hover {
              background-color: #007bff;
              color: #fff;
            }

            .btn-outline-danger {
              border-color: #dc3545;
              color: #dc3545;
              transition: background-color 0.2s, color 0.2s;
            }

            .btn-outline-danger:hover {
              background-color: #dc3545;
              color: #fff;
            }
          `}</style>
        </div>
        <MyModal id="modalFoodType" title="Types of food and drink">
          <div>name</div>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="mt-3">remark</div>
          <input
            className="form-control"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />

          <div>
            <button className="btn btn-primary" onClick={handleSave}>
              <i className="fa fa-check me-2"></i>Save
            </button>
          </div>
        </MyModal>
      </div>
    );
    }