"use client";

import config from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import MyModal from "../components/MyModal";

export default function Page() {
  const [table, setTable] = useState(1);
  const [foods, setFoods] = useState([]);
  const [saleTemps, setSaleTemps] = useState([]);
  const [tastes, setTastes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [amount, setAmount] = useState(0);
  const [saleTempDetails, setSaleTempDetails] = useState([]);

  useEffect(() => {
    getFoods();
    fetchDataSaleTemp();
  }, []);

  const sumAmount = (saleTemps: any) => {
    let total = 0;
    console.log(saleTemps.lenght);
    saleTemps.forEach((item: any) => {
      total += item.Food.price * item.qty;
    });
    setAmount(total);
  };

  const getFoods = async () => {
    try {
      const res = await axios.get(config.apiServer + "/api/food/list");
      setFoods(res.data.results);
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.message,
      });
    }
  };
  const filterFoods = async (foodType: string) => {
    try {
      const res = await axios.get(
        config.apiServer + "/api/food/filter/" + foodType
      );
      setFoods(res.data.results);
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };
  const sale = async (foodId: number) => {
    try {
      const payload = {
        tableNo: table,
        userId: Number(localStorage.getItem("next_user_id")),
        foodId: foodId,
      };
      await axios.post(config.apiServer + "/api/saletemp/create", payload);
      fetchDataSaleTemp();
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };
  const fetchDataSaleTemp = async () => {
    try {
      const res = await axios.get(config.apiServer + "/api/saletemp/list");
      setSaleTemps(res.data.results);
      sumAmount(res.data.results);
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const removeSaleTemp = async (id: number) => {
    try {
      const button = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (button.isConfirmed) {
        await axios.delete(config.apiServer + "/api/saletemp/remove/" + id);
        fetchDataSaleTemp();
      }
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const removeAllSaleTemp = async () => {
    try {
      const button = await Swal.fire({
        title: "Do you want to delete all?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (button.isConfirmed) {
        const payload = {
          tableNo: table,
          userId: Number(localStorage.getItem("next_user_id")),
        };
        await axios.delete(config.apiServer + "/api/saletemp/removeAll", {
          data: payload,
        });
        fetchDataSaleTemp();
      }
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const updateQty = async (id: number, qty: number) => {
    try {
      const payload = {
        qty: qty,
        id: id,
      };
      await axios.put(config.apiServer + "/api/saleTemp/updateQty", payload);
      fetchDataSaleTemp();
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const openModalEdit = (item: any) =>{
    console.log(item);
    generateSaleTempDetail(item.id);
    fetchDataSaleTempInfo(item.id);
   
  }

  const fetchDataSaleTempInfo = async (saleTempId: number) => {
    try{
      const res = await axios.get(config.apiServer + "/api/saletemp/info/" + saleTempId);
      setSaleTempDetails(res.data.results.SaleTempDetails)
      setTastes(res.data.results.Food?.FoodType?.Tastes || []);
      setSizes(res.data.results.Food?.FoodType?.FoodSizes || []);
    }catch(e: any){
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      })
    }
  }
  const generateSaleTempDetail = async (saleTempId: number) => {
    try{
      const payload = {
        saleTempId: saleTempId
      }
      await axios.post(config.apiServer + "/api/saletemp/generateSaleTempDetail", payload);
      await fetchDataSaleTemp();
      fetchDataSaleTempInfo(saleTempId);
    }catch(e: any){
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      })
    }

  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="fa fa-table"></i>
              </span>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-gray-200"
                value={table}
                onChange={(e) => setTable(Number(e.target.value))}
                placeholder="Table Number"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition duration-200"
              onClick={() => filterFoods("food")}
            >
              <i className="fa fa-hamburger mr-2"></i>Food
            </button>
            <button
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200"
              onClick={() => filterFoods("drink")}
            >
              <i className="fa fa-coffee mr-2"></i>Drinks
            </button>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200"
              onClick={() => filterFoods("all")}
            >
              <i className="fa fa-list mr-2"></i>All
            </button>
            <button
              disabled={saleTemps.length === 0}
              onClick={() => removeAllSaleTemp()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700
                text-white rounded-lg transition duration-200"
            >
              <i className="fa fa-trash mr-2"></i>Clear
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {foods.map((food: any) => (
                <div key={food.id} className="group cursor-pointer">
                  <div
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
                    onClick={() => sale(food.id)}
                  >
                    <div className="relative">
                      <img
                        src={config.apiServer + "/uploads/" + food.img}
                        className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-300"
                        alt={food.name}
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition duration-300"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">
                        {food.name}
                      </h3>
                      <p className="text-2xl font-bold text-yellow-400">
                        ${food.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/4 space-y-6">
            <div className="w-full">
              <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-4 mb-4">
                  <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-white">
                    {amount.toLocaleString("th-TH")}
                  </p>
                </div>
                {saleTemps.map((item: any) => (
                  <div key={item.id} className="space-y-4 mb-4">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-200 font-medium">
                          {item.Food.name}
                        </span>
                        <span className="text-gray-400">{item.Food.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">
                          {item.Food.price} x {item.qty}
                        </span>
                        <span className="text-yellow-400 font-semibold">
                          {item.Food.price * item.qty}
                        </span>
                      </div>
                      {/* Quantity control section */}
                      <div className="mt-1">
                        <div className="input-group">
                          <button disabled={item.SaleTempDetails.length > 0 }
                            className="input-group-text btn btn-primary"
                            onClick={() => updateQty(item.id, item.qty - 1)}
                          >
                            <i className="fa fa-minus"></i>
                          </button>
                          <input
                            type="text"
                            className="form-control text-center fw-bold"
                            value={item.qty}
                            disabled
                          />
                          <button disabled={item.SaleTempDetails.length > 0 }
                            className="input-group-text btn btn-primary"
                            onClick={() => updateQty(item.id, item.qty + 1)}
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => removeSaleTemp(item.id)}
                          className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600
                               text-white rounded-lg transition duration-200"
                        >
                          <i className="fa fa-times mr-2">Cancel</i>
                        </button>
                        <button className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600
                         text-white rounded-lg transition duration-200"
                         data-bs-toggle="modal"
                         data-bs-target="#modalEdit" 
                         onClick={() => openModalEdit(item)}>
                          <i className="fa fa-cog mr-2"></i>Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <MyModal id="modalEdit" title="แก้ไขรายการ" modalSize="modal-xl">
        <div>
          <button className="btn btn-primary">
            <i className="fa fa-plus me-2"></i>
            Add item
          </button>
        </div>
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th style={{ width: "60px" }}></th>
              <th>menu name</th>
              <th style={{ width: "200px" }}>flavor</th>
              <th style={{ width: "200px" }}>size</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </MyModal>
    </div>
  );
}
