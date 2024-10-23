"use client";

import config from "@/app/config";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
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
  const [amountAdded, setAmountAdded] = useState(0);
  const [saleTempId, setSaleTempId] = useState(0);
  const [payType,setPayType] = useState('cash');
  const [inputMoney, setInputMoney]= useState(0);
  const [billUrl,setBillUrl]=useState('');

  useEffect(() => {
    getFoods();
    fetchDataSaleTemp();
  }, []);

  const openModalEdit = (item: any) => {
    console.log(item);
    generateSaleTempDetail(item.id);
    setSaleTempId(item.id);
  };

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

      const results = res.data.results;
      let sum = 0;

      results.forEach((item: any) => {
        sum += sumMoneyAdded(item.SaleTempDetails);
      });

      setAmountAdded(sum);
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

  const fetchDataSaleTempInfo = async (saleTempId: number) => {
    try {
      const res = await axios.get(
        config.apiServer + "/api/saletemp/info/" + saleTempId
      );
      setSaleTempDetails(res.data.results.SaleTempDetails);
      setTastes(res.data.results.Food?.FoodType?.Tastes || []);
      setSizes(res.data.results.Food?.FoodType?.FoodSizes || []);
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const sumMoneyAdded = (saleTempDetails: any) => {
    let sum = 0;

    for (let i = 0; i < saleTempDetails.length; i++) {
      const item = saleTempDetails[i];
      sum += item.FoodSize?.moneyAdded || 0;
    }
    return sum;
  };
  const generateSaleTempDetail = async (saleTempId: number) => {
    try {
      const payload = {
        saleTempId: saleTempId,
      };
      await axios.post(
        config.apiServer + "/api/saletemp/generateSaleTempDetail",
        payload
      );
      await fetchDataSaleTemp();
      fetchDataSaleTempInfo(saleTempId);
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };
  const selectTaste = async (
    tasteId: number,
    saleTempDetailId: number,
    saleTempId: number
  ) => {
    try {
      const payload = {
        saleTempDetailId: saleTempDetailId,
        tasteId: tasteId,
      };
      await axios.put(config.apiServer + "/api/saletemp/selectTaste", payload);
      fetchDataSaleTempInfo(saleTempId);
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const unSelectTaste = async (
    saleTempDetailId: number,
    saleTempId: number
  ) => {
    try {
      const payload = {
        saleTempDetailId: saleTempDetailId,
      };

      await axios.put(
        config.apiServer + "/api/saletemp/unselectTaste",
        payload
      );
      fetchDataSaleTempInfo(saleTempId);
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };
  const selectSize = async (
    sizeId: number,
    saleTempDetailId: number,
    saleTempId: number
  ) => {
    try {
      const payload = {
        saleTempDetailId: saleTempDetailId,
        sizeId: sizeId,
      };
      await axios.put(config.apiServer + "/api/saletemp/selectSize", payload);
      await fetchDataSaleTempInfo(saleTempId);
      await fetchDataSaleTemp();
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };
  const unSelectSize = async (saleTempDetailId: number, saleTempId: number) => {
    try {
      const payload = {
        saleTempDetailId: saleTempDetailId,
      };
      await axios.put(config.apiServer + "/api/saletemp/unselectSize", payload);
      fetchDataSaleTempInfo(saleTempId);
      await fetchDataSaleTempInfo(saleTempId);
      await fetchDataSaleTemp();
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const createSaleTempDetail = async () => {
    try {
      const payload = {
        saleTempId: saleTempId,
      };
      await axios.post(
        config.apiServer + "/api/saletemp/createSaleTempDetail",
        payload
      );
      await fetchDataSaleTemp();
      fetchDataSaleTempInfo(saleTempId);
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const removeSaleTempDetail = async (saleTempDetailId: number) => {
    try {
      const payload = {
        saleTempDetailId: saleTempDetailId,
      };
      await axios.delete(
        config.apiServer + "/api/saletemp/removeSaleTempDetail",
        { data: payload }
      );
      await fetchDataSaleTemp();
      fetchDataSaleTempInfo(saleTempId);
    } catch (e: any) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };
  const ButtonClass = (isActive: boolean) => `
  ${isActive ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300"}
  hover:bg-gray-600 font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500
`;
const change = useMemo(() => {
  if (inputMoney > (amount+amountAdded)) {
    return inputMoney - (amount+amountAdded);
  }
  return 0;
}, [inputMoney, (amount+amountAdded)]);

const printBillBeforePay = async()=>{
  try{
    const payload = {
      tableNo: table,
      userId: Number(localStorage.getItem("next_user_id")),
    }
    const res = await axios.post(config.apiServer+ '/api/saletemp/printBillBeforePay',payload);
    setTimeout(()=>{
      setBillUrl(res.data.fileName);
      const button = document.getElementById("btnPrint") as HTMLButtonElement;
      button.click();
    })


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
            {amount>0
            ? <button
         
            onClick={() => printBillBeforePay()}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-700
              text-white rounded-lg transition duration-200"
          >
            <i className="fa fa-money-bill mr-2"></i>Bill sale
          </button>
          :<></>
            
            }
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {foods.map((food: any) => (
    <div key={food.id} className="group cursor-pointer">
      <div
        className="bg-gradient-to-b from-black via-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-transform transform hover:scale-105 duration-300"
        onClick={() => sale(food.id)}
      >
        <div className="relative">
          <img
            src={config.apiServer + "/uploads/" + food.img}
            className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-300"
            alt={food.name}
          />
          {/* Dark overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
          {/* Subtle glowing effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500 rounded-xl transition duration-300"></div>
        </div>
        <div className="p-4">
          {/* Title with soft glowing effect */}
          <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-yellow-400 transition duration-300">
            {food.name}
          </h3>
          {/* Price with stronger accent */}
          <p className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition duration-300">
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
                  <p className="text-3xl font-bold text-yellow-400">
                    {(amount + amountAdded).toLocaleString("th-TH")}
                  </p>
                </div>

                {amount > 0 ? (
                  <button 
                  data-bs-toggle='modal'
                  data-bs-target="#modalSale"
                  className="bg-green-500 hover:bg-green-600 
                  text-white font-bold py-3 px-4 rounded-lg w-full text-lg mb-2">
               <i className="fa fa-check me-2"></i>
               End of sale
                  </button>
                ) : (
                  <></>
                )}

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
                          <button
                            disabled={item.SaleTempDetails.length > 0}
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
                          <button
                            disabled={item.SaleTempDetails.length > 0}
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
                        <button
                          className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600
                         text-white rounded-lg transition duration-200"
                          data-bs-toggle="modal"
                          data-bs-target="#modalEdit"
                          onClick={() => openModalEdit(item)}
                        >
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

      <MyModal
        id="modalEdit"
        title="Edit list"
        modalSize="modal-lg"
        modalColor="bg-dark"
      >
        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <button
              onClick={() => createSaleTempDetail()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Add item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 w-16"></th>
                  <th scope="col" className="px-6 py-3">
                    Menu Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-center w-80">
                    Flavor
                  </th>
                  <th scope="col" className="px-6 py-3 text-center w-80">
                    Size
                  </th>
                </tr>
              </thead>
              <tbody>
                {saleTempDetails.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-700 hover:bg-gray-800 transition duration-300 ease-in-out"
                  >
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => removeSaleTempDetail(item.id)}
                        className="text-red-500 hover:text-white border border-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-2.5 py-2 text-center transition duration-300 ease-in-out"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {item.Food.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {tastes.map((taste: any) =>
                        item.tastedId === taste.id ? (
                          <button
                            onClick={() =>
                              unSelectTaste(item.id, item.saleTempId)
                            }
                            className="bg-orange-500 text-white hover:bg-orange-700 font-medium rounded-lg text-sm px-3 py-1.5 mr-1 mb-1 transition duration-300 ease-in-out"
                            key={taste.id}
                          >
                            {taste.name}
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              selectTaste(taste.id, item.id, item.saleTempId)
                            }
                            className="text-orange-500 hover:text-white border border-orange-500 hover:bg-orange-600 font-medium rounded-lg text-sm px-3 py-1.5 mr-1 mb-1 transition duration-300 ease-in-out"
                            key={taste.id}
                          >
                            {taste.name}
                          </button>
                        )
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {sizes.map((size: any) =>
                        size.moneyAdded > 0 ? (
                          item.foodSizeId === size.id ? (
                            <button
                              onClick={() =>
                                unSelectSize(item.id, item.saleTempId)
                              }
                              className="bg-green-600 text-white hover:bg-green-700 font-medium rounded-lg text-sm px-3 py-1.5 mr-1 mb-1 transition duration-300 ease-in-out"
                              key={size.id}
                            >
                              +{size.moneyAdded} {size.name}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                selectSize(size.id, item.id, item.saleTempId)
                              }
                              className="text-green-500 hover:text-white border border-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-3 py-1.5 mr-1 mb-1 transition duration-300 ease-in-out"
                              key={size.id}
                            >
                              +{size.moneyAdded} {size.name}
                            </button>
                          )
                        ) : null
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </MyModal>

      <MyModal   
        id="modalSale"
        title="End of Sale"
        modalSize="modal-lg"
        modalColor="bg-dark">
         <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <button 
          className={ButtonClass(payType === 'cash')}
          onClick={() => setPayType('cash')}
        >
          Cash
        </button>
        <button 
          className={ButtonClass(payType === 'transfer')}
          onClick={() => setPayType('transfer')}
        >
          E-money
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Total Amount</label>
        <input 
          className="w-full bg-gray-800 text-3xl font-bold text-yellow-400 text-right py-3 px-4 rounded-md"
          value={(amount + amountAdded).toLocaleString('th-TH')}
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Get money</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[50, 100, 500, 1000].map((value) => (
            <button 
              key={value}
              className={ButtonClass(inputMoney === value)}
              onClick={() => setInputMoney(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <input 
          className="w-full bg-gray-800 text-green-600 text-right text-lg py-2 px-4 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="0.00"
          value={inputMoney || ''}
          onChange={(e) => setInputMoney(Number(e.target.value))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Change</label>
        <input 
  className="w-full bg-gray-800 text-red-600 text-right text-xl py-3 px-4 rounded-md"
  value={change.toLocaleString('th-TH')}
  
/>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setInputMoney(amount + amountAdded)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
        >
          No change
        </button>
        <button 
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
        >
          End sale
        </button>
      </div>
    </div>

      
      </MyModal>

      <button id="btnPrint" style={{display: 'none'}} data-bs-toggle="modal" data-bs-target="#modalPrint"></button>
      <MyModal id="modalPrint" title="Bill printing"  modalColor="bg-dark">
        {billUrl && 
           <iframe src={config.apiServer + '/' + billUrl} style={{width: '100%', height: '600px'}}></iframe>}

      </MyModal>
    </div>
  );
}
