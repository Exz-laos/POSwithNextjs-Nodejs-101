'use client'
import { useEffect, useState } from "react";
import config from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";

export default function FoodListPage() {
    const [foods, setFoods] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (page: number = 1) => {
        try {
            const payload = {
                page: page,
                itemsPerPage: itemsPerPage
            };
            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem(config.token)
            };

            const res = await axios.post(config.apiServer + "/api/food/paginate", payload, { headers });
            setFoods(res.data.results);
            setTotalPage(res.data.totalPage);
            setTotalItems(res.data.totalItems);

        } catch (e: any) {
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
                background: '#1f2937',
                color: '#ffffff'
            });
        }
    };

    const changePage = (page: number) => {
        if (page > 0 && page <= totalPage) {
            setCurrentPage(page);
            fetchData(page);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
                    <h2 className="text-2xl font-bold text-gray-200">Food List</h2>
                </div>
                
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Food Name</th>
                                    <th scope="col" className="px-6 py-3 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {foods.map((item: any) => (
                                    <tr 
                                        key={item.id} 
                                        className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-200">{item.name}</td>
                                        <td className="px-6 py-4 text-right text-gray-300">{item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-6 text-gray-400">
                        <div>
                            Total Items: {totalItems} | Total Pages: {totalPage}
                        </div>
                    </div>

                    <div className="flex justify-center space-x-2 mt-6">
                        {/* First Page Button */}
                        <button
                            onClick={() => changePage(1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded 
                                       hover:bg-gray-600 disabled:opacity-50 
                                       transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            First
                        </button>

                        {/* Previous Page Button */}
                        <button
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded 
                                       hover:bg-gray-600 disabled:opacity-50 
                                       transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Prev
                        </button>

                        {/* Page Number Buttons */}
                        {Array.from({ length: totalPage }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => changePage(index + 1)}
                                className={`px-4 py-2 rounded transition-colors ${
                                    currentPage === index + 1
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        {/* Next Page Button */}
                        <button
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage === totalPage}
                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded 
                                       hover:bg-gray-600 disabled:opacity-50 
                                       transition-colors flex items-center"
                        >
                            Next
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* Last Page Button */}
                        <button
                            onClick={() => changePage(totalPage)}
                            disabled={currentPage === totalPage}
                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded 
                                       hover:bg-gray-600 disabled:opacity-50 
                                       transition-colors flex items-center"
                        >
                            Last
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L7.414 10l3.293-3.293a1 1 0 111.414 1.414L10.414 10l3.293 3.293a1 1 0 01-1.414 1.414zm-6 0a1 1 0 010-1.414L4.414 10l3.293-3.293a1 1 0 111.414 1.414L6.414 10l3.293 3.293a1 1 0 01-1.414 1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}