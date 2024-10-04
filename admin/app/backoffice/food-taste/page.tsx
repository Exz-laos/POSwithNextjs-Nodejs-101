'use client'
import { useEffect, useState } from "react";
import MyModal from "../components/MyModal";
import Swal from "sweetalert2";
import axios from "axios";
import config from "@/app/config";
import React from "react";
export default function Page() {
    const [foodTypeId,setFoodTypeId]=useState(0);
    const [foodTypes, setFoodTypes] = useState([]);
    const [tastes, setTastes] = useState([]);
    const [name,setName]=useState("");
    const [remark,setRemark]=useState("");
    const [id, setId] = useState(0);

    useEffect(()=>{
        fetchDataFoodTypes();
        fetchData();
    },[])

    const fetchDataFoodTypes = async () => {
        try{
            const res = await axios.get(config.apiServer + "/api/foodtype/list");
            if (res.data.results.length > 0) {
                setFoodTypes(res.data.results);
                setFoodTypeId(res.data.results[0].id);
            }
       
        }catch(e:any){
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            })
        }
    }

    const fetchData = async () => {
        try{
            const res =await axios.get(config.apiServer + "/api/taste/list");
            setTastes(res.data.results);

        }catch(e:any){
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            })
        }
    }

    const handleSave = async () => {
        try{
            const payload ={
                foodTypeId: foodTypeId,
                name: name,
                remark: remark,
                id: id
                
            }

            if(id==0){
                await axios.post(config.apiServer + "/api/taste/create", payload);
            }else{
                await axios.put(config.apiServer + "/api/taste/update", payload);
                setId(0);
            }
            

            fetchData();
            document.getElementById("modalTaste_btnClose")?.click();
        }catch(e: any){
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            })
        }
    }

    const handleRemove = async (id: number) => {
        try{
            const button = await Swal.fire({
                title: "Are you sure?",
                text: "Do you want to delete?",
                icon: "question",
                showCancelButton: true,
                showConfirmButton: true,
            })

            if(button.isConfirmed){
                await axios.delete(config.apiServer + "/api/taste/remove/" + id);
                fetchData();
            }

        }catch(e: any){
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            })
        }
    }

    const handleEdit = (item: any) =>{
        setFoodTypeId(item.foodTypeId);
        setName(item.name);
        setRemark(item.remark);
        setId(item.id);
    }


    const handleClearForm = () =>{
        
        setName("");
        setRemark("");
    }

    return (
        <>
           <div className="card mt-3">
            <div className="card-header">Food Tastes </div>
              <div className="card-body">
                <button className="btn btn-primary"
                data-bs-toggle="modal" 
                data-bs-target="#modalTaste"
                onClick={handleClearForm}>
                    <i className="fa fa-plus me-2">Add Item</i>
                </button>
                <table className="table mt-4 table-hover table-bordered">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: "150px" }}>Type</th>
                  <th style={{ width: "150px" }}>Flavor</th>
                  <th>Remark</th>
                  <th style={{ width: "120px" }} className="text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tastes.map((item: any) => (
                  <tr key={item.id} className="align-middle">
                    {/* <td className="font-weight-bold">{item.FoodType.name}</td> */}
                    <td className="font-weight-bold">
                      {item.FoodType.name || "N/A"}
                    </td>{" "}
                    {/* Display food type name */}
                    <td>{item.name}</td>
                    <td>{item.remark}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#modalTaste"
                        onClick={() => handleEdit(item)}
    
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemove(item.id)}
                    
                      >
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
           </div>
           <MyModal id="modalTaste" title="Food Taste">
          <div>Food Type</div>

          <select className="form-control" value={foodTypeId}
          onChange={(e)=>{setFoodTypeId(parseInt(e.target.value))}}>

              {foodTypes.map((item: any)=> 
                    <option key={item.id} value={item.id} > 
                        {item.name}
                    </option>
          )}
          </select>

          <div className="mt-3">Flavor</div>
          <input
            className="form-control" value={name} onChange={(e)=>{setName(e.target.value)}}
          />
          <div className="mt-3">remark </div>
          <input
            className="form-control" value={remark} onChange={(e)=>{setRemark(e.target.value)}}
            type="number"
          />
          <button className="mt-3 btn btn-primary" onClick={handleSave} >
            <i className="fa fa-check me-2"></i>Save
          </button>
        </MyModal>
        </>
    );
}