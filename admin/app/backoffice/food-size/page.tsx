"use client"
import { useEffect, useState } from "react";
import MyModal from "../components/MyModal";
import Swal from "sweetalert2";
import axios from "axios";
import config from "@/app/config";
import React from "react";
import '../components/myStyle.css';
export default function Page() {
    const [name,setName]=useState("");
    const[remark,setRemark]=useState("");
    const [id, setId] = useState(0);
    const [foodTypeId, setFoodTypeId] = useState(0);
    const [moneyAdded, setMoneyAdded] = useState(0);
    const [foodTypes, setFoodTypes] = useState([]);
    const [foodSizes, setFoodSizes] = useState([]);

    useEffect(() => {
        fetchData();
        fetchDataFoodTypes();
    },[]);
    
    const fetchData = async () => {
        try{
            const res = await axios.get(config.apiServer + "/api/foodsize/list");
            setFoodSizes(res.data.results);

        }catch(e: any){
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error",
            })
        }
    }

    const fetchDataFoodTypes = async () => {
        try{
            const res = await axios.get(config.apiServer + "/api/foodtype/list");
            setFoodTypes(res.data.results);
            setFoodTypeId(res.data.results[0].id);

        }catch(e:any){
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            })
        }
    }

    const save = async () => {
        try{
            const payload = {
                name: name,
                remark: remark,
                id: id,
                foodTypeId: foodTypeId,
                moneyAdded: moneyAdded
            }
            if(id==0){
              await axios.post(config.apiServer + "/api/foodsize/create", payload);
          }else{
              await axios.put(config.apiServer + "/api/foodsize/update", payload);
              setId(0);
          }
            fetchData();
            document.getElementById("modalFoodSize_btnClose")?.click();

        }catch(e : any){
            Swal.fire({
                title: "error", 
                text: e.message,
                icon: "error",
            })
        }
    };

    const edit = (item: any) => {  
      setFoodTypeId(item.foodTypeId);
      setId(item.id);
      setMoneyAdded(item.moneyAdded);
      setName(item.name);
      setRemark(item.remark);
    }

    const remove = async (item: any) => {
      try{
        const button = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete?",
            icon: "question",
            showCancelButton: true,
            showConfirmButton: true,
        });
        if (button.isConfirmed) {
            await axios.delete(
                config.apiServer + "/api/foodsize/remove/" + item.id);
            fetchData();
        }
    }catch(e:any){
        Swal.fire({
            title: "error",
            text: e.message,
            icon: "error",
        })
    }
    };

    

    const clearForm=()=>{
        setId(0);
        setName("");
        setRemark("");
        setMoneyAdded(0);
    }

    return (
      <>
        <div className="card mt-3">
          <div className="card-header">Food and Drink Size</div>
          <div className="card-body">
            <button
              className="btn btn-primary "
              data-bs-toggle="modal"
              data-bs-target="#modalFoodSize"
              onClick={clearForm}
            >
              <i className="fa fa-plus me-2">Add Item</i>
            </button>

            <table className="table mt-4 table-hover table-bordered">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: "150px" }}>Type</th>
                  <th style={{ width: "150px" }}>Name</th>
                  <th>Remark</th>
                  <th className="text-end" style={{ width: "150px" }}>
                    Add money
                  </th>
                  <th style={{ width: "120px" }} className="text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {foodSizes.map((item: any) => (
                  <tr key={item.id} className="align-middle">
                    {/* <td className="font-weight-bold">{item.FoodType.name}</td> */}
                    <td className="font-weight-bold">
                      {item.FoodType.name || "N/A"}
                    </td>{" "}
                    {/* Display food type name */}
                    <td>{item.name}</td>
                    <td>{item.remark}</td>
                    <td>{item.moneyAdded}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#modalFoodSize"
                        onClick={() => edit(item)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(item)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <MyModal id="modalFoodSize" title="Food and Drink Size">
          <div>Food type</div>
          <select
            className="form-control"
            onChange={(e) => setFoodTypeId(parseInt(e.target.value))}
          >
            {foodTypes.map((item: any) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <div className="mt-3">Name</div>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="mt-3">Money Added </div>
          <input
            className="form-control"
            value={moneyAdded}
            onChange={(e) => setMoneyAdded(parseInt(e.target.value))}
            type="number"
          />

          <div className="mt-3">Remark</div>
          <input
            className="form-control"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />

          <button className="mt-3 btn btn-primary" onClick={save}>
            <i className="fa fa-save me-2"></i>Save
          </button>
        </MyModal>
      </>
    );
}