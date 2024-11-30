'use client'

import { useState, useEffect} from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import config from '@/app/config'
import dayjs from 'dayjs'
import MyModal from "../components/MyModal";


export default function Page() {
    const [billSales, setBillSales] = useState([]);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [sumAmount, setSumAmount] = useState(0);
    const [billSaleDetails, setBillSaleDetails] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try{
            const payload = {
                fromDate: new Date(fromDate),
                toDate: new Date(toDate)

            }
            const res = await axios.post(config.apiServer + "/api/billsale/list", payload);
            setBillSales(res.data.results);

            //find sum amount
            const sum = handleSumAmount(res.data.results);
            setSumAmount(sum);
        }catch(e:any){
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            })
        }
    }
    const handleSumAmount = (rows: any) => {
        let sum = 0;

        rows.forEach((row: any) => {
            sum += row.amount;
        });
        return sum;
    }

    const handleCancelBill = async (id: string) => {
        try{
            const button = await Swal.fire({
                icon: 'warning',
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            })

            if (button.isConfirmed) {
                await axios.delete(config.apiServer + "/api/billsale/remove/" + id);
                fetchData();
            }

        }catch(e:any){
            Swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
            })
        }
    }

    return (
        <>
           <div className='card mt-3'>
              <div className='card-header'>Report Of Sale </div>
              <div className='card-body'>
                <div className='row'>
                    <div className='col-md-2'>
                        <div>from date</div>
                        <input 
                        type="date" 
                        className='form-control' 
                        value={dayjs(fromDate).format("YYYY-MM-DD")} 
                        onChange={(e) => setFromDate(new Date(e.target.value))}
                        />

                    </div>
                    <div className='col-md-2'>
                        <div>Until date</div>
                        <input 
                        type="date" 
                        className='form-control' 
                        value={dayjs(toDate).format("YYYY-MM-DD")} 
                        onChange={(e) => setToDate(new Date(e.target.value))}
                        />
                    </div>

                    <div className='col-md-2'>
                        <div>&nbsp;</div>
                        <button className='btn btn-primary' onClick={fetchData} >
                            <i className='fa fa-search me-2'></i> 
                              Show report list
                        </button>
                    </div>
                </div>
                <table className='table table-bordered mt-3'>
                    <thead>
                        <tr>
                            <th style={{ width : '100px'}} className='text-center'>Cancel bill</th>
                            <th style={{ width : '150px'}} className='text-center'>Date</th>
                            <th style={{ width : '50px'}} className='text-center'>Bill No</th>
                            <th style={{ width : '100px'}}>Staff</th>
                            <th style={{ width : '100px'}} className='text-end'>Table</th>
                            <th style={{ width : '100px'}} className='text-end'>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billSales.length > 0 && billSales.map((billSale: any, index: number) => (
                          
                            <tr key={index}>
                                <td className='text-center'>
                                    <button className='btn btn-danger me-2' onClick={() => handleCancelBill(billSale.id)}>
                                        <i className='fa fa-trash me-2'>Cancel</i>
                                    </button>

                                    <button className='btn btn-info' 
                                     onClick={() => setBillSaleDetails(billSale.BillSaleDetails)}
                                     data-bs-toggle="modal"
                                     data-bs-target="#modalBillSaleDetail">
                                        <i className='fa fa-info me-2'> Info</i>
                                    </button>
                                </td>
                                <td>{dayjs(billSale.createdDate).format("YYYY-MM-DD HH:mm")}</td>
                                <td>{billSale.id}</td>
                                <td>{billSale.User.name}</td>
                                <td className='text-end'>{billSale.tableNo}</td>
                                <td className='text-end'>{billSale.amount.toLocaleString('th-TH')}</td>
                            </tr>
                            
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={5} className='text-end'>Total</td>
                            <td style={{ width : '200px'}} className='text-end '>{sumAmount.toLocaleString('th-TH')}</td>
                        </tr>
                    </tfoot>
                </table>
              </div>
           </div>



           <MyModal id="modalBillSaleDetail" title="รายละเอียดบิล">
                <table className='table table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>List</th>
                            <th className='text-end'>Price</th>
                            <th>Taste</th>
                            <th>Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billSaleDetails.length > 0 && billSaleDetails.map((billSaleDetail: any, index: number) => (
                            <tr key={index}>
                                <td>{billSaleDetail.Food.name}</td>
                                <td className='text-end'>{(billSaleDetail.price + billSaleDetail.moneyAdded).toLocaleString('th-TH')}</td>
                                <td>{billSaleDetail.Taste?.name}</td>
                                <td>
                                    {billSaleDetail.foodSizeId &&
                                        billSaleDetail.FoodSize?.name + ' +' + billSaleDetail.moneyAdded
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </MyModal>
        </>
    )
    
}