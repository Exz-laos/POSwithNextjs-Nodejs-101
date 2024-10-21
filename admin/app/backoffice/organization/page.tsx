"use client"

import config from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaSave } from 'react-icons/fa';
export default function Organization() {
    const [name,setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const[email, setEmail] = useState("");
    const[website,setWebsite]= useState("");
    const[logo,setLogo] = useState("");
    const [promptpay,setPromptPay] = useState("");
    const [taxCode,setTaxCode] = useState("");
    const [fileSelected,setFileSelected] = useState<File | null>(null);
    useEffect(() => {
        fetchData();
    },[]);

    const fetchData = async () => {
      
            const res = await axios.get(config.apiServer + "/api/organization/info");
            setName(res.data.result.name);
            setAddress(res.data.result.address);
            setPhone(res.data.result.phone);
            setEmail(res.data.result.email);
            setWebsite(res.data.result.website);
            setLogo(res.data.result.logo);
            setPromptPay(res.data.result.promptpay);
            setTaxCode(res.data.result.taxCode);
      
    }
    const handleFileChange=(e: any)=> {
        setFileSelected(e.target.files[0]);
    }
    const uploadFile = async () => {
        const formData = new FormData();
        formData.append("file", fileSelected as Blob);

        const response = await axios.post(config.apiServer + "/api/organization/upload", formData);
        return response.data.fileName;
    }

    const handleSave = async () => {
        try{
            const fileName = await uploadFile();
            const payload = {
                name: name,
                address: address,
                phone: phone,
                email: email,
                website: website,
                logo: fileName,
                taxCode: taxCode,
                promptpay: promptpay
            }
            await axios.post(config.apiServer + "/api/organization/create", payload);
            Swal.fire({
                icon: "success",
                title: 'Success',
                text: "Saved success",
                timer: 1000
            })


        }catch(e: any){
            Swal.fire({
                icon: "error",
                title: 'Error',
                text: e.message
            })

        }
    }

 
    

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg shadow-xl p-6 ">
      <div className="border-b border-gray-700 pb-4 mb-6">
        <h5 className="text-xl font-semibold">My Organization</h5>
      </div>

      <div className="space-y-4">
        {[
          { label: "Name", value: name, onChange: setName },
          { label: "Address", value: address, onChange: setAddress },
          { label: "Phone", value: phone, onChange: setPhone },
          { label: "Email", value: email, onChange: setEmail },
          { label: "Website", value: website, onChange: setWebsite },
          { label: "Taxcode", value: taxCode, onChange: setTaxCode },
          { label: "Promptpay", value: promptpay, onChange: setPromptPay },
        ].map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-400 mb-1">{field.label}</label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Logo</label>
          {logo && (
            <img 
              src={`${config.apiServer}/uploads/${logo}`} 
              alt="logo" 
              className="w-24 h-24 object-cover rounded-md mb-2" 
            />
          )}
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
        >
          <FaSave className="mr-2" />
          Save
        </button>
      </div>
    </div>
    );
}