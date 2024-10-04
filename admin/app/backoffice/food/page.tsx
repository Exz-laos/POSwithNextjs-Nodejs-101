"use client";
import config from "@/app/config";
import axios from "axios";
import MyModal from "../components/MyModal";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import React from "react";
import "../components/myStyle.css";

export default function Page() {
  const [foodTypeId, setFoodTypeId] = useState(0);
  const [foodTypes, setFoodTypes] = useState([]);
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const [id, setId] = useState(0);
  const [img, setImg] = useState("");
  const [price, setPrice] = useState(0);
  const [myFile, setMyFile] = useState<File | null>(null);
  const [foodType, setFoodType] = useState("food");

  useEffect(() => {
    fetchDataFoodTypes();
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const res = await axios.get(config.apiServer + "/api/food/list");
      setFoods(res.data.results);
    } catch (e: any) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };
  const fetchDataFoodTypes = async () => {
    try {
      const res = await axios.get(config.apiServer + "/api/foodtype/list");
      if (res.data.results.length > 0) {
        setFoodTypes(res.data.results);
        setFoodTypeId(res.data.results[0].id);
      }
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const handleSelectedFile = (e: any) => {
    if (e.target.files.length > 0) {
      setMyFile(e.target.files[0]);
    }
  };

  const handleSave = async (): Promise<void> => {
    try {
      const img = await handleUpload();
      const payload = {
        foodTypeId: foodTypeId,
        name: name,
        remark: remark,
        price: price,
        img: img,
        id: id,
        foodType: foodType,
      };

      if (id == 0) {
        const res = await axios.post(
          config.apiServer + "/api/food/create",
          payload
        );
        Swal.fire({
          title: "success",
          text: res.data.message,
          icon: "success",
          timer: 1000,
        });
      } else {
        const res = await axios.put(
          config.apiServer + "/api/food/update",
          payload
        );
        setId(0);
        Swal.fire({
          title: "success",
          text: res.data.message,
          icon: "success",
          timer: 1000,
        });
      }

      fetchData();
      document.getElementById("modalFood_btnClose")?.click();
    } catch (e: any) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const handleUpload = async (): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append("myFile", myFile as Blob);
      const res = await axios.post(
        config.apiServer + "/api/food/upload",
        formData
      );
      return res.data.fileName;
    } catch (e: any) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const handleEdit = (item: any) => {
    setFoodTypeId(item.foodTypeId);
    setName(item.name);
    setRemark(item.remark);
    setPrice(item.price);
    setImg(item.img);
    setId(item.id);
    setFoodType(item.foodType);
  };
  const handleRemove = async (id: number) => {
    try {
      const button = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete?",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        await axios.delete(config.apiServer + "/api/food/remove/" + id);
        fetchData();
      }
    } catch (e: any) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const getFoodTypeName = (foodType: string): string => {
    if (foodType == "food") {
      return "food";
    } else {
      return "drink";
    }
  };

  const handleClearForm = () => {
    setFoodTypeId(0);
    setId(0);
    setName("");
    setRemark("");
    setPrice(0);
    setFoodType("food");
  };

  return (
    <>
      <div className="card mt-3">
        <div className="card-header">Food</div>
        <div className="card-body">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalFood"
            onClick={handleClearForm}
          >
            <i className="fa fa-plus me-2">Add Item</i>
          </button>
          <table className="table mt-4 table-hover table-bordered">
      <thead className="thead-light">
        <tr>
          <th style={{ width: "150px" }}>Image</th>
          <th style={{ width: "200px" }}>Type</th>
          <th style={{ width: "200px" }}>Food/Drink</th>
          <th style={{ width: "200px" }}>Name</th>
          <th>Remark</th>
          <th style={{ width: "120px" }} className="text-center">
            Price
          </th>
          <th style={{ width: "120px" }} className="text-center">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {foods.map((item: any) => (
          <tr key={item.id} className="align-middle">
            <td>
              <img
                src={config.apiServer + "/uploads/" + item.img}
                alt={item.name}
                width="150"
              />
            </td>
            <td className="font-weight-bold">{item.FoodType.name || "N/A"}</td>
            <td>{getFoodTypeName(item.foodType)}</td>
            <td>{item.name}</td>
            <td>{item.remark}</td>
            <td className="text-end">{item.price}</td>
            <td className="text-center">
              <button
                className="btn btn-sm btn-outline-primary me-2"
                data-bs-toggle="modal"
                data-bs-target="#modalFood"
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




        </div>
      </div>

      <MyModal id="modalFood" title="Food">
        <div>group food</div>

        <select
          className="form-control"
          value={foodTypeId}
          onChange={(e) => {
            setFoodTypeId(parseInt(e.target.value));
          }}
        >
          <option value="">What kind of meal?</option> {/* Default option */}
          {foodTypes.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <div className="mt-3">Image</div>
        <input
          type="file"
          className="form-control"
          onChange={(e) => handleSelectedFile(e)}
        />

        <div className="mt-3">Name</div>
        <input
          className="form-control"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <div className="mt-3">remark </div>
        <input
          className="form-control"
          value={remark}
          onChange={(e) => {
            setRemark(e.target.value);
          }}
        />

        <div className="mt-3">price </div>
        <input
          className="form-control"
          value={price}
          onChange={(e) => setPrice(parseInt(e.target.value))}
          type="number"
        />
        <div className="mt-3">type </div>
        <div className="mt-1">
          <input
            type="radio"
            name="foodType"
            value="food"
            checked={foodType === "food"}
            onChange={(e) => setFoodType(e.target.value)}
          />
          food
          <input
            type="radio"
            className="ms-3"
            name="foodType"
            value="drink"
            checked={foodType === "drink"}
            onChange={(e) => setFoodType(e.target.value)}
          />
          drink
        </div>

        <button className="mt-3 btn btn-primary" onClick={handleSave}>
          <i className="fa fa-check me-2"></i>Save
        </button>
      </MyModal>
    </>
  );
}
